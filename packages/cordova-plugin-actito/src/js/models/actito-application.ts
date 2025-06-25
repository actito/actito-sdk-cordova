import type { ActitoNotificationAction } from './actito-notification';

export interface ActitoApplication {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly services: Record<string, boolean>;
  readonly inboxConfig?: ActitoInboxConfig;
  readonly regionConfig?: ActitoRegionConfig;
  readonly userDataFields: ActitoUserDataField[];
  readonly actionCategories: ActitoActionCategory[];
}

export interface ActitoInboxConfig {
  readonly useInbox: boolean;
  readonly autoBadge: boolean;
}

export interface ActitoRegionConfig {
  readonly proximityUUID?: string;
}

export interface ActitoUserDataField {
  readonly type: string;
  readonly key: string;
  readonly label: string;
}

export interface ActitoActionCategory {
  readonly type: string;
  readonly name: string;
  readonly description?: string;
  readonly actions: ActitoNotificationAction[];
}
