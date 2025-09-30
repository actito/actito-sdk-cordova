package com.actito.push.cordova

import android.content.Context
import org.json.JSONObject
import com.actito.models.ActitoNotification
import com.actito.push.ActitoPushIntentReceiver
import com.actito.push.models.ActitoNotificationDeliveryMechanism
import com.actito.push.models.ActitoSystemNotification
import com.actito.push.models.ActitoUnknownNotification

open class ActitoPushPluginReceiver : ActitoPushIntentReceiver() {

        override fun onNotificationReceived(
            context: Context,
            notification: ActitoNotification,
            deliveryMechanism: ActitoNotificationDeliveryMechanism
        ) {
            try {
                val json = JSONObject()
                json.put("notification", notification.toJson())
                json.put("deliveryMechanism", deliveryMechanism.rawValue)

                ActitoPushPluginEventBroker.dispatchEvent("notification_info_received", json)
            } catch (e: Exception) {
                logger.error("Failed to emit the notification_info_received event.", e)
            }
        }

    override fun onSystemNotificationReceived(context: Context, notification: ActitoSystemNotification) {
        try {
            ActitoPushPluginEventBroker.dispatchEvent("system_notification_received", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the system_notification_received event.", e)
        }
    }

    override fun onUnknownNotificationReceived(context: Context, notification: ActitoUnknownNotification) {
        try {
            ActitoPushPluginEventBroker.dispatchEvent("unknown_notification_received", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the unknown_notification_received event.", e)
        }
    }

    override fun onNotificationOpened(context: Context, notification: ActitoNotification) {
        try {
            ActitoPushPluginEventBroker.dispatchEvent("notification_opened", notification.toJson())
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_opened event.", e)
        }
    }

    override fun onActionOpened(
        context: Context,
        notification: ActitoNotification,
        action: ActitoNotification.Action
    ) {
        try {
            val json = JSONObject()
            json.put("notification", notification.toJson())
            json.put("action", action.toJson())

            ActitoPushPluginEventBroker.dispatchEvent("notification_action_opened", json)
        } catch (e: Exception) {
            logger.error("Failed to emit the notification_action_opened event.", e)
        }
    }
}
