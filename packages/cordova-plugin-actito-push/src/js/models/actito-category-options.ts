/**
 * iOS-specific notification category options.
 *
 * These options configure the behavior and presentation of notification
 * categories on iOS.
 *
 * - `'customDismissAction'` - Adds a custom dismiss action to the notification
 * category.
 * - `'allowInCarPlay'` - Allows notifications in this category to be displayed
 * in CarPlay.
 * - `'hiddenPreviewsShowTitle'` - Displays the notification title when previews
 * are hidden.
 * - `'hiddenPreviewsShowSubtitle'` - Displays the notification subtitle when
 * previews are hidden.
 * - `'allowAnnouncement'` - Allows notifications in this category to be announced
 * using voice assistance.
 */
export type ActitoCategoryOptions =
  | 'customDismissAction'
  | 'allowInCarPlay'
  | 'hiddenPreviewsShowTitle'
  | 'hiddenPreviewsShowSubtitle'
  | 'allowAnnouncement';
