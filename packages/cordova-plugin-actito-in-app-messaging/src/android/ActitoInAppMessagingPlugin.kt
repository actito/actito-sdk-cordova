package com.actito.iam.cordova

import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONObject
import com.actito.Actito
import com.actito.iam.ActitoInAppMessaging
import com.actito.iam.ktx.inAppMessaging
import com.actito.iam.models.ActitoInAppMessage

class ActitoInAppMessagingPlugin : CordovaPlugin(), ActitoInAppMessaging.MessageLifecycleListener {

    override fun pluginInitialize() {
        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        Actito.inAppMessaging().addLifecycleListener(this)
    }

    override fun onDestroy() {
        Actito.inAppMessaging().removeLifecycleListener(this)
    }

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "hasMessagesSuppressed" -> hasMessagesSuppressed(args, callback)
            "setMessagesSuppressed" -> setMessagesSuppressed(args, callback)

            // Event broker
            "registerListener" -> registerListener(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito In-App Messaging

    private fun hasMessagesSuppressed(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        callback.success(Actito.inAppMessaging().hasMessagesSuppressed)
    }

    private fun setMessagesSuppressed(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        try {
            val suppressed = args.getBoolean(0)
            val evaluateContext =
                if (!args.isNull(1)) {
                    args.getBoolean(1)
                } else {
                    false
                }

            Actito.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext)

            callback.void()
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    // endregion

    // region ActitoInAppMessaging.MessageLifecycleListener

    override fun onMessagePresented(message: ActitoInAppMessage) {
        try {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent("message_presented", message.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the message_presented event.", e)
        }
    }

    override fun onMessageFinishedPresenting(message: ActitoInAppMessage) {
        try {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent("message_finished_presenting", message.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the message_finished_presenting event.", e)
        }
    }

    override fun onMessageFailedToPresent(message: ActitoInAppMessage) {
        try {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent("message_failed_to_present", message.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the message_failed_to_present event.", e)
        }
    }

    override fun onActionExecuted(message: ActitoInAppMessage, action: ActitoInAppMessage.Action) {
        try {
            val json = JSONObject()
            json.put("message", message.toJson())
            json.put("action", action.toJson())

            ActitoInAppMessagingPluginEventBroker.dispatchEvent("action_executed", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the action_executed event.", e)
        }
    }

    override fun onActionFailedToExecute(
        message: ActitoInAppMessage,
        action: ActitoInAppMessage.Action,
        error: Exception?
    ) {
        try {
            val json = JSONObject()
            json.put("message", message.toJson())
            json.put("action", action.toJson())

            if (error != null) {
                json.put("error", error.message)
            }

            ActitoInAppMessagingPluginEventBroker.dispatchEvent("action_failed_to_execute", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the action_failed_to_execute event.", e)
        }
    }

    // endregion

    private fun registerListener(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        ActitoInAppMessagingPluginEventBroker.setup(preferences, object : ActitoInAppMessagingPluginEventBroker.Consumer {
            override fun onEvent(event: ActitoInAppMessagingPluginEventBroker.Event) {
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

private fun CallbackContext.success(b: Boolean) {
    sendPluginResult(PluginResult(PluginResult.Status.OK, b))
}
