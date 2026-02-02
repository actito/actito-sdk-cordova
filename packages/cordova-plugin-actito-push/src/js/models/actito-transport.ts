/**
 * Identifies the transport mechanism used to deliver a notification.
 *
 * This value indicates the underlying push delivery service used by Actito,
 * such as APNS for iOS or GCM for Android.
 *
 * - `'Notificare'` - Temporary transport used for a registered device without
 * remote notifications enabled, before APNS or GCM is available.
 * - `'GCM'` - Google Cloud Messaging.
 * - `'APNS'` - Apple Push Notification Service.
 */
export type ActitoTransport = 'Notificare' | 'GCM' | 'APNS';
