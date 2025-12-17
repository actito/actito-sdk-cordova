package com.actito.inbox.user.cordova

import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.inbox.user.ktx.userInbox
import com.actito.inbox.user.models.ActitoUserInboxItem
import com.actito.models.ActitoNotification

class ActitoUserInboxPlugin : CordovaPlugin() {

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "parseResponseFromJson" -> parseResponseFromJson(args, callback)
            "parseResponseFromString" -> parseResponseFromString(args, callback)
            "open" -> open(args, callback)
            "markAsRead" -> markAsRead(args, callback)
            "remove" -> remove(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito User Inbox

    private fun parseResponseFromJson(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val json = try {
            args.getJSONObject(0)
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        try {
            val response = Actito.userInbox().parseResponse(json)
            callback.success(response.toJson())
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    private fun parseResponseFromString(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val jsonStr = try {
            args.getString(0)
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        try {
            val response = Actito.userInbox().parseResponse(jsonStr)
            callback.success(response.toJson())
        } catch (e: Exception) {
            callback.error(e.message)
        }
    }

    private fun open(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val item: ActitoUserInboxItem = try {
            ActitoUserInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.userInbox().open(item, object : ActitoCallback<ActitoNotification> {
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
        val item: ActitoUserInboxItem = try {
            ActitoUserInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.userInbox().markAsRead(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    private fun remove(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val item: ActitoUserInboxItem = try {
            ActitoUserInboxItem.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        Actito.userInbox().remove(item, object : ActitoCallback<Unit> {
            override fun onSuccess(result: Unit) {
                callback.void()
            }

            override fun onFailure(e: Exception) {
                callback.error(e.message)
            }
        })
    }

    // endregion
}

private fun CallbackContext.void() {
    sendPluginResult(PluginResult(PluginResult.Status.OK, null as String?))
}
