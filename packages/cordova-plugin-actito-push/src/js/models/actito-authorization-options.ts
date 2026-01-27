/**
 * iOS-specific authorization options used when requesting notification permissions.
 *
 * These options map directly to iOS notification authorization settings.
 *
 * - `'alert'` - Allows the app to display alert notifications.
 * - `'badge'` - Allows the app to update the app icon badge.
 * - `'sound'` - Allows the app to play notification sounds.
 * - `'carPlay'` - Allows notifications to be displayed in CarPlay.
 * - `'providesAppNotificationSettings'` - Allows the app to provide custom
 * notification settings.
 * - `'provisional'` - Allows the ability to post noninterrupting notifications
 * provisionally to the Notification Center.
 * - `'criticalAlert'` - Allows the app to play sounds for critical alerts.
 * - `'announcement'` -  Allows notifications to be announced using voice assistance.
 */
export type ActitoAuthorizationOptions =
  | 'alert'
  | 'badge'
  | 'sound'
  | 'carPlay'
  | 'providesAppNotificationSettings'
  | 'provisional'
  | 'criticalAlert'
  | 'announcement';
