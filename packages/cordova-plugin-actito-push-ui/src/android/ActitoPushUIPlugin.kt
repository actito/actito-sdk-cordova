package com.actito.push.ui.cordova

import android.net.Uri
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONObject
import com.actito.Actito
import com.actito.models.ActitoNotification
import com.actito.push.ui.ActitoPushUI
import com.actito.push.ui.ktx.pushUI

class ActitoPushUIPlugin : CordovaPlugin(), ActitoPushUI.NotificationLifecycleListener {

    override fun pluginInitialize() {
        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        Actito.pushUI().addLifecycleListener(this)
    }

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "presentNotification" -> presentNotification(args, callback)
            "presentAction" -> presentAction(args, callback)

            // Event broker
            "registerListener" -> registerListener(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito Push UI

    private fun presentNotification(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val notification: ActitoNotification = try {
            ActitoNotification.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        val activity = cordova.activity ?: run {
            callback.error("Cannot present a notification without an activity.")
            return
        }

        Actito.pushUI().presentNotification(activity, notification)
        callback.void()
    }

    private fun presentAction(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val notification: ActitoNotification
        val action: ActitoNotification.Action

        try {
            notification = ActitoNotification.fromJson(args.getJSONObject(0))
            action = ActitoNotification.Action.fromJson(args.getJSONObject(1))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        val activity = cordova.activity ?: run {
            callback.error("Cannot present a notification without an activity.")
            return
        }

        Actito.pushUI().presentAction(activity, notification, action)
        callback.void()
    }

    // endregion

    // region ActitoPushUI.NotificationLifecycleListener

    override fun onNotificationWillPresent(notification: ActitoNotification) {
        try {
            ActitoPushUIPluginEventBroker.dispatchEvent("notification_will_present", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_will_present event.", e)
        }
    }

    override fun onNotificationPresented(notification: ActitoNotification) {
        try {
            ActitoPushUIPluginEventBroker.dispatchEvent("notification_presented", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_presented event.", e)
        }
    }

    override fun onNotificationFinishedPresenting(notification: ActitoNotification) {
        try {
            ActitoPushUIPluginEventBroker.dispatchEvent("notification_finished_presenting", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_finished_presenting event.", e)
        }
    }

    override fun onNotificationFailedToPresent(notification: ActitoNotification) {
        try {
            ActitoPushUIPluginEventBroker.dispatchEvent("notification_failed_to_present", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_failed_to_present event.", e)
        }
    }

    override fun onNotificationUrlClicked(notification: ActitoNotification, uri: Uri) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("url", uri.toString())

            ActitoPushUIPluginEventBroker.dispatchEvent("notification_url_clicked", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_url_clicked event.", e)
        }
    }

    override fun onActionWillExecute(notification: ActitoNotification, action: ActitoNotification.Action) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("action", action.toJson())

            ActitoPushUIPluginEventBroker.dispatchEvent("action_will_execute", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the action_will_execute event.", e)
        }
    }

    override fun onActionExecuted(notification: ActitoNotification, action: ActitoNotification.Action) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("action", action.toJson())

            ActitoPushUIPluginEventBroker.dispatchEvent("action_executed", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the action_executed event.", e)
        }
    }

    override fun onActionFailedToExecute(
        notification: ActitoNotification,
        action: ActitoNotification.Action,
        error: Exception?
    ) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("action", action.toJson())
            if (error != null) json.put("error", error.localizedMessage)

            ActitoPushUIPluginEventBroker.dispatchEvent("action_failed_to_execute", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the action_failed_to_execute event.", e)
        }
    }

    override fun onCustomActionReceived(
        notification: ActitoNotification,
        action: ActitoNotification.Action,
        uri: Uri
    ) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("action", action.toJson())
            json.put("url", uri.toString())

            ActitoPushUIPluginEventBroker.dispatchEvent("custom_action_received", uri.toString())
        } catch (e: Exception) {
            logger.error("Failed to emit the custom_action_received event.", e)
        }
    }

    // endregion

    private fun registerListener(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        ActitoPushUIPluginEventBroker.setup(preferences, object : ActitoPushUIPluginEventBroker.Consumer {
            override fun onEvent(event: ActitoPushUIPluginEventBroker.Event) {
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

private fun CallbackContext.void() {
    sendPluginResult(PluginResult(PluginResult.Status.OK, null as String?))
}
