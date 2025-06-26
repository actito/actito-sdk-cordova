package com.actito.assets.cordova

import org.apache.cordova.CallbackContext
import org.apache.cordova.CordovaArgs
import org.apache.cordova.CordovaPlugin
import org.json.JSONArray
import com.actito.Actito
import com.actito.ActitoCallback
import com.actito.assets.ktx.assets
import com.actito.assets.models.ActitoAsset

class ActitoAssetsPlugin : CordovaPlugin() {

    override fun execute(action: String, args: CordovaArgs, callback: CallbackContext): Boolean {
        when (action) {
            "fetch" -> fetch(args, callback)

            else -> {
                callback.error("No implementation for action '$action'.")
                return false
            }
        }

        return true
    }

    // region Actito Assets

    private fun fetch(@Suppress("UNUSED_PARAMETER") args: CordovaArgs, callback: CallbackContext) {
        val group = args.getString(0)

        Actito.assets().fetch(group, object : ActitoCallback<List<ActitoAsset>> {
            override fun onSuccess(result: List<ActitoAsset>) {
                try {
                    val json = JSONArray()
                    result.forEach { json.put(it.toJson()) }

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

    // endregion
}
