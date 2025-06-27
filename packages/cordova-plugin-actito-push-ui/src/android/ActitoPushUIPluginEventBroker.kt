package com.actito.push.ui.cordova

import android.os.Handler
import android.os.Looper
import org.apache.cordova.CordovaPreferences
import com.actito.Actito
import com.actito.models.ActitoApplication

internal object ActitoPushUIPluginEventBroker : Actito.Listener {

    private val eventQueue = mutableListOf<Event>()
    private var consumer: Consumer? = null
    private var canEmitEvents = false

    fun dispatchEvent(name: String, payload: Any?) {
        val event = Event(name, payload)

        val consumer = consumer
        if (consumer != null && canEmitEvents) {
            consumer.onEvent(event)
            return
        }

        eventQueue.add(event)
    }

    fun setup(preferences: CordovaPreferences, consumer: Consumer) {
        val holdEventsUntilReady = preferences.getBoolean("com.actito.cordova.hold_events_until_ready", false)

        this.consumer = consumer
        canEmitEvents = !holdEventsUntilReady || Actito.isReady

        if (!canEmitEvents) {
            Actito.addListener(this)
            return
        }

        processQueue()
    }

    private fun processQueue() {
        val consumer = consumer ?: run {
            logger.debug("Cannot process event queue without a consumer.")
            return
        }

        if (eventQueue.isEmpty()) return

        logger.debug("Processing event queue with ${eventQueue.size} items.")
        eventQueue.forEach { consumer.onEvent(it) }
        eventQueue.clear()
    }

    override fun onReady(application: ActitoApplication) {
        // Run the listener removal on the next loop to prevent modifying the collection
        // while iterating on it, causing an exception.
        Handler(Looper.getMainLooper()).post {
            Actito.removeListener(this)
        }

        canEmitEvents = true
        processQueue()
    }


    data class Event(
        val name: String,
        val payload: Any?,
    )

    interface Consumer {
        fun onEvent(event: Event)
    }
}
