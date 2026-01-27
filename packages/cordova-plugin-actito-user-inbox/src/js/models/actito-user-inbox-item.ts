import type { ActitoNotification } from 'cordova-plugin-actito';

/**
 * Represents an item in the Actito user inbox.
 *
 * An {@link ActitoUserInboxItem} contains a notification and metadata about its delivery
 * and read state. Inbox items may also have an optional expiration date after
 * which they are no longer valid.
 */
export interface ActitoUserInboxItem {
  /**
   * Unique identifier of the inbox item.
   */
  readonly id: string;

  /**
   * Notification associated with this inbox item.
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
