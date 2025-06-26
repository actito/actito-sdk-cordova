package com.actito.cordova

import android.content.Intent
import android.net.Uri
import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import org.json.JSONArray
import org.json.JSONObject
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.ktx.device
import com.actito.ktx.events
import com.actito.models.*

class ActitoPlugin : CordovaPlugin() {

    override fun pluginInitialize() {
        logger.hasDebugLoggingEnabled = Actito.options?.debugLoggingEnabled ?: false

        Actito.intentReceiver = ActitoPluginReceiver::class.java

        val intent = cordova.activity.intent
        if (intent != null) onNewIntent(intent)
    }

    override fun onNewIntent(intent: Intent) {
        // Try handling the test device intent.
        if (Actito.handleTestDeviceIntent(intent)) return

        // Try handling the dynamic link intent.
        if (Actito.handleDynamicLinkIntent(cordova.activity, intent)) return

        val url = intent.data?.toString()
        if (url != null) {
            ActitoPluginEventBroker.dispatchEvent("url_opened", url)
        }
    }

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "isConfigured" -> isConfigured(args, callback)
            "isReady" -> isReady(args, callback)
            "launch" -> launch(args, callback)
            "unlaunch" -> unlaunch(args, callback)
            "getApplication" -> getApplication(args, callback)
            "fetchApplication" -> fetchApplication(args, callback)
            "fetchNotification" -> fetchNotification(args, callback)
            "fetchDynamicLink" -> fetchDynamicLink(args, callback)
            "canEvaluateDeferredLink" -> canEvaluateDeferredLink(args, callback)
            "evaluateDeferredLink" -> evaluateDeferredLink(args, callback)
            //
            // Device
            //
            "getCurrentDevice" -> getCurrentDevice(args, callback)
            "register" -> register(args, callback)
            "updateUser" -> updateUser(args, callback)
            "fetchTags" -> fetchTags(args, callback)
            "addTag" -> addTag(args, callback)
            "addTags" -> addTags(args, callback)
            "removeTag" -> removeTag(args, callback)
            "removeTags" -> removeTags(args, callback)
            "clearTags" -> clearTags(args, callback)
            "getPreferredLanguage" -> getPreferredLanguage(args, callback)
            "updatePreferredLanguage" -> updatePreferredLanguage(args, callback)
            "fetchDoNotDisturb" -> fetchDoNotDisturb(args, callback)
            "updateDoNotDisturb" -> updateDoNotDisturb(args, callback)
            "clearDoNotDisturb" -> clearDoNotDisturb(args, callback)
            "fetchUserData" -> fetchUserData(args, callback)
            "updateUserData" -> updateUserData(args, callback)
            //
            // Events
            //
            "logCustom" -> logCustom(args, callback)
            //
            // Event broker
            //
            "registerListener" -> registerListener(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito

    private fun isConfigured(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        callback.success(Actito.isConfigured)
    }

    private fun isReady(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        callback.success(Actito.isReady)
    }

    private fun launch(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.launch(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun unlaunch(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.unlaunch(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun getApplication(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        try {
            callback.nullableSuccess(Actito.application?.toJson())
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    private fun fetchApplication(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.fetchApplication(object : ActitoCallback<ActitoApplication> {
            override fun onSuccess(result: ActitoApplication) {
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

    private fun fetchNotification(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val id = args.getString(0)

        Actito.fetchNotification(id, object : ActitoCallback<ActitoNotification> {
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

    private fun fetchDynamicLink(args: CordovaArgs, callback: CallbackContext) {
        val url = args.getString(0)
        val uri = Uri.parse(url)

        Actito.fetchDynamicLink(uri, object : ActitoCallback<ActitoDynamicLink> {
            override fun onSuccess(result: ActitoDynamicLink) {
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

    private fun canEvaluateDeferredLink(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.canEvaluateDeferredLink(object : ActitoCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                callback.success(result)
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun evaluateDeferredLink(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.evaluateDeferredLink(object : ActitoCallback<Boolean> {
            override fun onSuccess(result: Boolean) {
                callback.success(result)
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    // endregion

    // region Actito Device Manager

    private fun getCurrentDevice(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        try {
            callback.nullableSuccess(Actito.device().currentDevice?.toJson())
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    private fun register(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val userId: String? = args.optionalString(0)
        val userName: String? = args.optionalString(1)

        Actito.device().register(userId, userName, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun updateUser(args: CordovaArgs, callback: CallbackContext) {
        val userId: String? = args.optionalString(0)
        val userName: String? = args.optionalString(1)

        Actito.device().updateUser(userId, userName, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun fetchTags(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.device().fetchTags(object : ActitoCallback<List<String>> {
            override fun onSuccess(result: List<String>) {
                try {
                    val json = JSONArray()
                    result.forEach { json.put(it) }

                    callback.success(json)
                } catch (e: Exception) {
                    callback.error(e.message)
                }
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun addTag(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val tag = args.getString(0)

        Actito.device().addTag(tag, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun addTags(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val json = args.getJSONArray(0)

        val tags = mutableListOf<String>()
        for (i in 0 until json.length()) {
            tags.add(json.getString(i))
        }

        Actito.device().addTags(tags, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun removeTag(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val tag = args.getString(0)

        Actito.device().removeTag(tag, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun removeTags(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val json = args.getJSONArray(0)

        val tags = mutableListOf<String>()
        for (i in 0 until json.length()) {
            tags.add(json.getString(i))
        }

        Actito.device().removeTags(tags, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun clearTags(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.device().clearTags(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun getPreferredLanguage(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        callback.nullableSuccess(Actito.device().preferredLanguage)
    }

    private fun updatePreferredLanguage(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val language: String? = args.optionalString(0)

        Actito.device().updatePreferredLanguage(language, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun fetchDoNotDisturb(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.device().fetchDoNotDisturb(object : ActitoCallback<ActitoDoNotDisturb?> {
            override fun onSuccess(result: ActitoDoNotDisturb?) {
                try {
                    callback.nullableSuccess(result?.toJson())
                } catch (e: Exception) {
                    callback.error(e.message)
                }
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun updateDoNotDisturb(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val dnd: ActitoDoNotDisturb = try {
            ActitoDoNotDisturb.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.device().updateDoNotDisturb(dnd, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun clearDoNotDisturb(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.device().clearDoNotDisturb(object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun fetchUserData(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        Actito.device().fetchUserData(object : ActitoCallback<ActitoUserData> {
            override fun onSuccess(result: ActitoUserData) {
                try {
                    val json = JSONObject()
                    result.forEach { json.put(it.key, it.value) }

                    callback.success(json)
                } catch (e: Exception) {
                    callback.error(e.message)
                }
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun updateUserData(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val userData = mutableMapOf<String, String?>()

        try {
            val json = args.getJSONObject(0)
            val iterator = json.keys()

            while (iterator.hasNext()) {
                val key = iterator.next()
                userData[key] = if (json.isNull(key)) null else json.getString(key)
            }
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.device().updateUserData(userData, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    // endregion

    // region Actito Events Manager

    private fun logCustom(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val event = args.getString(0)
        val json: JSONObject? = if (!args.isNull(1)) args.getJSONObject(1) else null

        val data: ActitoEventData? = try {
            json?.let { ActitoEvent.createData(it) }
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.events().logCustom(event, data, object : ActitoCallback<Unit> {
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
        ActitoPluginEventBroker.setup(preferences, object : ActitoPluginEventBroker.Consumer {
            override fun onEvent(event: ActitoPluginEventBroker.Event) {
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

private fun CordovaArgs.optionalString(index: Int, defaultValue: String? = null): String? {
    return if (isNull(index)) defaultValue else getString(index)
}

private fun CallbackContext.void() {
    sendPluginResult(PluginResult(PluginResult.Status.OK, null as String?))
}

private fun CallbackContext.success(b: Boolean) {
    sendPluginResult(PluginResult(PluginResult.Status.OK, b))
}

private fun CallbackContext.nullableSuccess(str: String?) {
    if (str == null) {
        void()
    } else {
        success(str)
    }
}

private fun CallbackContext.nullableSuccess(json: JSONObject?) {
    if (json == null) {
        void()
    } else {
        success(json)
    }
}
