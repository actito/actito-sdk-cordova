package com.actito.cordova

import android.content.Context
import com.actito.ActitoIntentReceiver
import com.actito.models.ActitoApplication
import com.actito.models.ActitoDevice

class ActitoPluginReceiver : ActitoIntentReceiver() {

    override fun onReady(context: Context, application: ActitoApplication) {
        try {
            ActitoPluginEventBroker.dispatchEvent("ready", application.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the ready event.", e)
        }
    }

    override fun onUnlaunched(context: Context) {
        ActitoPluginEventBroker.dispatchEvent("unlaunched", null)
    }

    override fun onDeviceRegistered(context: Context, device: ActitoDevice) {
        try {
            ActitoPluginEventBroker.dispatchEvent("device_registered", device.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the device_registered event.", e)
        }
    }
}
