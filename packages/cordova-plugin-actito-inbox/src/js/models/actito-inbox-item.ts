import type { ActitoNotification } from 'cordova-plugin-actito';

/**
 * Represents an item in the Actito inbox.
 *
 * An {@link ActitoInboxItem} contains a notification and metadata about its delivery
 * and read state within the inbox. Inbox items can optionally have an expiration
 * date.
 */
export interface ActitoInboxItem {
  /**
   * Unique identifier of the inbox item.
   */
  readonly id: string;

  /**
   * {@link ActitoNotification} associated with this inbox item.
   */
  readonly notification: ActitoNotification;

  /**
   * Timestamp indicating when the item was received.
   */
  readonly time: string;

  /**
   * Indicates whether the item has been opened by the user.
   */
  readonly opened: boolean;

  /**
   * Optional expiration timestamp of the item.
   */
  readonly expires?: string;
}
