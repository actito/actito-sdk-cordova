/**
 * iOS-specific options that control how a notification is presented
 * when the app is in the foreground.
 *
 * - `'banner'` - Displays the notification as a banner.
 * - `'alert'` - Displays the notification as an alert.
 * - `'list'` - Displays the notification in the Notification Center.
 * - `'badge'` - Updates the app icon badge when the notification is delivered.
 * - `'sound'` - Plays a sound when the notification is delivered.
 */
export type ActitoPresentationOptions = 'banner' | 'alert' | 'list' | 'badge' | 'sound';
