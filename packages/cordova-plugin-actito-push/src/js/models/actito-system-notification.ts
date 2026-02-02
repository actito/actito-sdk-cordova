/**
 * Represents a system-level notification sent by Actito.
 *
 * An {@link ActitoSystemNotification} contains metadata about system events or updates,
 * distinct from user-targeted notifications. These notifications may include
 * additional information in the [extra] map.
 */
export interface ActitoSystemNotification {
  /**
   * Unique identifier of the system notification.
   */
  readonly id: string;

  /**
   * Type of the system notification.
   */
  readonly type: string;

  /**
   * Collection of key-value pairs used to add extra information to the notification.
   */
  readonly extra: Record<string, string | null>;
}
