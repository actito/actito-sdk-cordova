import { EventSubscription } from './events';
import { ActitoNotification, ActitoNotificationAction } from 'cordova-plugin-actito';
import { ActitoSystemNotification } from './models/actito-system-notification';
import { ActitoNotificationDeliveryMechanism } from './models/actito-notification-delivery-mechanism';
import { PushPermissionRationale, PushPermissionStatus } from './permissions';
import { ActitoTransport } from './models/actito-transport';
import { ActitoPushSubscription } from './models/actito-push-subscription';

export class ActitoPush {
  /**
   * Defines the authorization options used when requesting push notification
   * permissions.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param {string[]} options - The authorization options to be set.
   * @returns {Promise<void>} - A promise that resolves when the authorization
   * options have been successfully set.
   */
  public static async setAuthorizationOptions(options: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'setAuthorizationOptions', [options]);
    });
  }

  /**
   * Defines the notification category options for custom notification actions.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param {string[]} options - The category options to be set.
   * @returns {Promise<void>} - A promise that resolves when the category options
   * have been successfully set.
   */
  public static async setCategoryOptions(options: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'setCategoryOptions', [options]);
    });
  }

  /**
   * Defines the presentation options for displaying notifications while the app
   * is in the foreground.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param {string[]} options - The presentation options to be set.
   * @returns {Promise<void>} - A promise that resolves when the presentation
   * options have been successfully set.
   */
  public static async setPresentationOptions(options: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'setPresentationOptions', [options]);
    });
  }

  /**
   * Indicates whether remote notifications are enabled.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if remote
   * notifications are enabled for the application, and `false` otherwise.
   */
  public static async hasRemoteNotificationsEnabled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'hasRemoteNotificationsEnabled', []);
    });
  }

  /**
   * Provides the current push transport information.
   *
   * @returns {Promise<ActitoTransport | null>} - A promise that resolves to
   * the {@link ActitoTransport} assigned to the device, or `null` if no transport
   * has been set.
   */
  public static async getTransport(): Promise<ActitoTransport | null> {
    return new Promise<ActitoTransport | null>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'getTransport', []);
    });
  }

  /**
   * Provides the current push subscription token.
   *
   * @returns {Promise<ActitoPushSubscription | null>} - A promise that
   * resolves to the device's current {@link ActitoPushSubscription}, or
   * `null` if no {@link ActitoPushSubscription} is available.
   */
  public static async getSubscription(): Promise<ActitoPushSubscription | null> {
    return new Promise<ActitoPushSubscription | null>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'getSubscription', []);
    });
  }

  /**
   * Indicates whether the device is capable of receiving remote notifications.
   *
   * This function returns `true` if the user has granted permission to receive
   * push notifications and the device has successfully obtained a push token
   * from the notification service. It reflects whether the app can present
   * notifications as allowed by the system and user settings.
   *
   * @return {Promise<boolean>} - A promise that resolves to `true` if the device
   * can receive remote notifications, `false` otherwise.
   */
  public static async allowedUI(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'allowedUI', []);
    });
  }

  /**
   * Enables remote notifications.
   *
   * This function enables remote notifications for the application,
   * allowing push notifications to be received.
   *
   * **Note**: Starting with Android 13 (API level 33), this function requires
   * the developer to explicitly request the `POST_NOTIFICATIONS` permission from
   * the user.
   *
   * @returns {Promise<void>} - A promise that resolves when remote notifications
   * have been successfully enabled.
   */
  public static async enableRemoteNotifications(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'enableRemoteNotifications', []);
    });
  }

  /**
   * Disables remote notifications.
   *
   * This function disables remote notifications for the application, preventing
   * push notifications from being received.
   *
   * @returns {Promise<void>} - A promise that resolves when remote notifications
   * have been successfully disabled.
   */
  public static async disableRemoteNotifications(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'disableRemoteNotifications', []);
    });
  }

  //
  // Permission utilities
  //

  /**
   * Checks the current status of the push permission.
   *
   * @returns {Promise<PushPermissionStatus>} - A promise that resolves to a
   * {@link PushPermissionStatus} enum containing the given permission status.
   */
  public static async checkPermissionStatus(): Promise<PushPermissionStatus> {
    return new Promise<PushPermissionStatus>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'checkPermissionStatus', []);
    });
  }

  /**
   * Determines if the app should display a rationale for requesting the push permission.
   *
   * This method is Android focused and will therefore always resolve to `false`
   * for iOS.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if a
   * rationale should be shown, or `false` otherwise.
   */
  public static async shouldShowPermissionRationale(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'shouldShowPermissionRationale', []);
    });
  }

  /**
   * Presents a rationale to the user for requesting push permission.
   *
   * This method is Android focused, and should only be used after the {@link shouldShowPermissionRationale()}
   * conditional method to ensure correct behaviour on both platforms.
   *
   * This method displays a custom rationale message to the user, explaining why the app requires
   * push permission. The rationale should be presented prior to initiating the permission
   * request if a rationale is deemed necessary.
   *
   * @param {PushPermissionRationale} rationale - The {@link PushPermissionRationale} details,
   * including the title and message to present to the
   * user.
   * @returns {Promise<void>} - A promise that resolves when the rationale has
   * been successfully dismissed by the user.
   */
  public static async presentPermissionRationale(rationale: PushPermissionRationale): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'presentPermissionRationale', [rationale]);
    });
  }

  /**
   * Requests the push permission from the user.
   *
   * This method prompts the user to grant or deny push permission. The returned status
   * indicates the result of the user's decision, which can be one of several states such as
   * "granted", "denied" or "permanently_denied".
   *
   * @returns {Promise<PushPermissionStatus>} - A promise that resolves to a
   * {@link PushPermissionStatus} enum containing the push permission status.
   */
  public static async requestPermission(): Promise<PushPermissionStatus> {
    return new Promise<PushPermissionStatus>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'requestPermission', []);
    });
  }

  /**
   * Opens the application's settings page.
   *
   * @returns {Promise<void>} - A promise that resolves when the application's
   * settings page has been successfully opened.
   */
  public static async openAppSettings(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPush', 'openAppSettings', []);
    });
  }

  // region Events

  /**
   * Called when a push notification is received.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationInfoReceived event. It will provide the
   * {@link ActitoNotification} received and the
   * {@link ActitoNotificationDeliveryMechanism} used for its delivery.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationInfoReceived event.
   */
  public static onNotificationInfoReceived(
    callback: (data: {
      notification: ActitoNotification;
      deliveryMechanism: ActitoNotificationDeliveryMechanism;
    }) => void
  ): EventSubscription {
    return new EventSubscription('notification_info_received', callback);
  }

  /**
   * Called when a custom system notification is received.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onSystemNotificationReceived event. It will provide the
   * {@link ActitoSystemNotification} received.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onSystemNotificationReceived event.
   */
  public static onSystemNotificationReceived(
    callback: (notification: ActitoSystemNotification) => void
  ): EventSubscription {
    return new EventSubscription('system_notification_received', callback);
  }

  /**
   * Called when an unknown notification is received.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUnknownNotificationReceived event. It will provide the unknown
   * notification received.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onUnknownNotificationReceived event.
   */
  public static onUnknownNotificationReceived(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (notification: Record<string, any>) => void
  ): EventSubscription {
    return new EventSubscription('unknown_notification_received', callback);
  }

  /**
   * Called when a push notification is opened by the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationOpened event. It will provide the
   * {@link ActitoNotification} that was opened.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationOpened event.
   */
  public static onNotificationOpened(callback: (notification: ActitoNotification) => void): EventSubscription {
    return new EventSubscription('notification_opened', callback);
  }

  /**
   * Called when an unknown notification is opened by the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUnknownNotificationOpened event. It will provide the unknown notification
   * that was opened.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onUnknownNotificationOpened event.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static onUnknownNotificationOpened(callback: (notification: Record<string, any>) => void): EventSubscription {
    return new EventSubscription('unknown_notification_opened', callback);
  }

  /**
   * Called when a push notification action is opened by the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationActionOpened event. It will provide the
   * {@link ActitoNotificationAction} opened by the user and the
   * {@link ActitoNotification} containing it.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationActionOpened event.
   */
  public static onNotificationActionOpened(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction }) => void
  ): EventSubscription {
    return new EventSubscription('notification_action_opened', callback);
  }

  /**
   * Called when an unknown notification action is opened by the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUnknownNotificationActionOpened event. It will provide the
   * action opened by the user and the unknown notification containing it. It
   * will also provide a response text, if it exists.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onUnknownNotificationActionOpened event.
   */
  public static onUnknownNotificationActionOpened(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: (data: { notification: Record<string, any>; action: string; responseText?: string }) => void
  ): EventSubscription {
    return new EventSubscription('unknown_notification_action_opened', callback);
  }

  /**
   * Called when the notification settings are changed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationSettingsChanged event. It will provide a boolean indicating
   * whether the app is permitted to display notifications. `true` if
   * notifications are allowed, `false` if they are restricted by the user.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationSettingsChanged event.
   */
  public static onNotificationSettingsChanged(callback: (granted: boolean) => void): EventSubscription {
    return new EventSubscription('notification_settings_changed', callback);
  }

  /**
   * Called when the device's push subscription changes.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onSubscriptionChanged event. It will provide the updated
   * {@link ActitoPushSubscription}, or `null` if the subscription token is
   * unavailable.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onSubscriptionChanged event.
   */
  public static onSubscriptionChanged(
    callback: (subscription: ActitoPushSubscription | undefined) => void
  ): EventSubscription {
    return new EventSubscription('subscription_changed', callback);
  }

  /**
   * Called when a notification prompts the app to open its settings screen.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onShouldOpenNotificationSettings event. It will provide the
   * {@link ActitoNotification} that prompted the app to open its settings
   * screen.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onShouldOpenNotificationSettings event.
   */
  public static onShouldOpenNotificationSettings(
    callback: (notification: ActitoNotification | null) => void
  ): EventSubscription {
    return new EventSubscription('should_open_notification_settings', callback);
  }

  /**
   *  Called when the app encounters an error during the registration process for
   *  push notifications.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onFailedToRegisterForRemoteNotifications event. It will provide the error
   * that caused the registration to fail.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onFailedToRegisterForRemoteNotifications event.
   */
  public static onFailedToRegisterForRemoteNotifications(callback: (error: string) => void): EventSubscription {
    return new EventSubscription('failed_to_register_for_remote_notifications', callback);
  }

  // endregion
}
