import type { ActitoNotificationAction } from './actito-notification';

/**
 * Represents an Actito application configuration.
 *
 * An {@link ActitoApplication} describes the capabilities, services, and configuration
 * of an application as defined in Actito. It includes enabled services, region
 * and inbox configuration, available user data fields, and supported action categories.
 */
export interface ActitoApplication {
  /**
   * Unique identifier of the application.
   */
  readonly id: string;

  /**
   * Name of the application.
   */
  readonly name: string;

  /**
   * Category of the application as defined in Actito.
   */
  readonly category: string;

  /**
   * Map of enabled services for the application.
   */
  readonly services: Record<string, boolean>;

  /**
   * Optional inbox-related configuration.
   */
  readonly inboxConfig?: ActitoInboxConfig;

  /**
   * Optional region-related configuration.
   */
  readonly regionConfig?: ActitoRegionConfig;

  /**
   * List of user data fields supported by the application.
   */
  readonly userDataFields: ActitoUserDataField[];

  /**
   * List of action categories available in the application.
   */
  readonly actionCategories: ActitoActionCategory[];
}

/**
 * Configuration related to the Actito inbox feature.
 */
export interface ActitoInboxConfig {
  /**
   * Whether the inbox feature is enabled for the application.
   */
  readonly useInbox: boolean;

  /**
   * Whether unread inbox messages should automatically update the application
   * badge count.
   */
  readonly autoBadge: boolean;
}

/**
 * Configuration related to region-based features.
 */
export interface ActitoRegionConfig {
  /**
   * Optional UUID used for beacon detection.
   */
  readonly proximityUUID?: string;
}

/**
 * Describes a user data field supported by an Actito application.
 *
 * User data fields define the structure of user attributes that can be
 * stored and leveraged for segmentation or personalization.
 */
export interface ActitoUserDataField {
  /**
   * The data type of the field.
   */
  readonly type: string;

  /**
   * The unique key identifying the field.
   */
  readonly key: string;

  /**
   * Human-readable label for the field.
   */
  readonly label: string;
}

/**
 * Groups related actions that can be triggered from notifications
 * or other engagement mechanisms.
 */
export interface ActitoActionCategory {
  /**
   * The category type identifier.
   */
  readonly type: string;

  /**
   * The name of the action category.
   */
  readonly name: string;

  /**
   * Optional description explaining the purpose of the category.
   */
  readonly description?: string;

  /**
   * List of actions belonging to this category.
   */
  readonly actions: ActitoNotificationAction[];
}
