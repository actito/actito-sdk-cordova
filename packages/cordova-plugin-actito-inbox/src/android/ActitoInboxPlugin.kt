package com.actito.inbox.cordova

import android.os.Handler
import android.os.Looper
import androidx.lifecycle.Observer
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.inbox.ktx.inbox
import com.actito.inbox.models.ActitoInboxItem
import com.actito.models.ActitoNotification
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONObject
import java.util.SortedSet

class ActitoInboxPlugin : CordovaPlugin() {

    private val itemsObserver = Observer<SortedSet<ActitoInboxItem>> { items ->
        if (items == null) return@Observer

        try {
            val json = JSONArray()
            items.forEach { json.put(it.toJson()) }

            ActitoInboxPluginEventBroker.dispatchEvent("inbox_updated", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the inbox_updated event.", e)
        }
    }

    private val badgeObserver = Observer<Int> { badge ->
        if (badge == null) return@Observer

        ActitoInboxPluginEventBroker.dispatchEvent("badge_updated", badge)
    }

    override fun pluginInitialize() {
        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        onMainThread {
            Actito.inbox().observableItems.observeForever(itemsObserver)
            Actito.inbox().observableBadge.observeForever(badgeObserver)
        }
    }

    override fun onDestroy() {
        onMainThread {
            Actito.inbox().observableItems.removeObserver(itemsObserver)
            Actito.inbox().observableBadge.removeObserver(badgeObserver)
        }
    }

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "getItems" -> getItems(args, callback)
            "getBadge" -> getBadge(args, callback)
            "refresh" -> refresh(args, callback)
            "open" -> open(args, callback)
            "markAsRead" -> markAsRead(args, callback)
            "markAllAsRead" -> markAllAsRead(args, callback)
            "remove" -> remove(args, callback)
            "clear" -> clear(args, callback)

            // Event broker
            "registerListener" -> registerListener(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito Inbox

    private fun getItems(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        try {
            val json = JSONArray()
            Actito.inbox().items.forEach { json.put(it.toJson()) }

            callback.success(json)
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    private fun getBadge(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        callback.success(Actito.inbox().badge)
    }

    private fun refresh(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.inbox().refresh(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun open(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val item: ActitoInboxItem = try {
            ActitoInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.inbox().open(item, object : ActitoCallback<ActitoNotification> {
            override fun onSuccess(result: ActitoNotification) {
                try {
                    callback.success(result.toJson())
                } catch (e: Exception) {
                    callback.error(e.message)
                }
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun markAsRead(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val item: ActitoInboxItem = try {
            ActitoInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.inbox().markAsRead(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun markAllAsRead(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.inbox().markAllAsRead(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun remove(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val item: ActitoInboxItem = try {
            ActitoInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.inbox().remove(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun clear(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.inbox().clear(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    // endregion

    private fun registerListener(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        ActitoInboxPluginEventBroker.setup(preferences, object : ActitoInboxPluginEventBroker.Consumer {
            override fun onEvent(event: ActitoInboxPluginEventBroker.Event) {
                val payload = JSONObject()
                payload.put("name", event.name)
                when (event.payload) {
                    null -> {} // Skip encoding null payloads.
                    is Boolean -> payload.put("data", event.payload)
                    is Int -> payload.put("data", event.payload)
                    is Float -> payload.put("data", event.payload)
                    is Double -> payload.put("data", event.payload)
                    is String -> payload.put("data", event.payload)
                    is JSONObject -> payload.put("data", event.payload)
                    is JSONArray -> payload.put("data", event.payload)
                    else -> throw IllegalArgumentException("Unsupported event payload of type '${event.payload::class.java.simpleName}'.")
                }

                val result = PluginResult(PluginResult.Status.OK, payload)
                result.keepCallback = true

                callback.sendPluginResult(result)
            }
        })
    }
}

private fun onMainThread(action: () -> Unit) = Handler(Looper.getMainLooper()).post(action)

private fun CallbackContext.void() {
    sendPluginResult(PluginResult(PluginResult.Status.OK, null as String?))
}
