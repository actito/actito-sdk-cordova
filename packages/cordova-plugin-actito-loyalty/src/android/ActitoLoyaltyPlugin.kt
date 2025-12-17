package com.actito.loyalty.cordova

import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.apache.cordova.PluginResult
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.loyalty.ktx.loyalty
import com.actito.loyalty.models.ActitoPass

class ActitoLoyaltyPlugin : CordovaPlugin() {

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "fetchPassBySerial" -> fetchPassBySerial(args, callback)
            "fetchPassByBarcode" -> fetchPassByBarcode(args, callback)
            "present" -> present(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito Loyalty

    private fun fetchPassBySerial(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val serial = args.getString(0)

        Actito.loyalty().fetchPassBySerial(serial, object : ActitoCallback<ActitoPass> {
            override fun onSuccess(result: ActitoPass) {
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

    private fun fetchPassByBarcode(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val barcode = args.getString(0)

        Actito.loyalty().fetchPassByBarcode(barcode, object : ActitoCallback<ActitoPass> {
            override fun onSuccess(result: ActitoPass) {
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

    private fun present(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val pass: ActitoPass = try {
            ActitoPass.fromJson(args.getJSONObject(0))
        } catch (e: Exception) {
            callback.error(e.message)
            return
        }

        val activity = cordova.activity ?: run {
            callback.error("Cannot present a pass without an activity.")
            return
        }

        Actito.loyalty().present(activity, pass)
        callback.void()
    }

    // endregion
}

private fun CallbackContext.void() {
    sendPluginResult(PluginResult(PluginResult.Status.OK, null as String?))
}
