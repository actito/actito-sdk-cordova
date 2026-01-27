/**
 * Represents a push notification subscription for a device.
 *
 * An {@link ActitoPushSubscription} stores the push token that allows Actito to send
 * push notifications to the device.
 */
export interface ActitoPushSubscription {
  /**
   * Device push token used to receive notifications.
   *
   * This may be null if the device has not yet registered for push notifications.
   */
  readonly token: string;
}
