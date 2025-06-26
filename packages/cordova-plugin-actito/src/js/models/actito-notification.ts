export interface ActitoNotification {
  readonly id: string;
  readonly partial: boolean;
  readonly type: string;
  readonly time: string;
  readonly title?: string;
  readonly subtitle?: string;
  readonly message: string;
  readonly content: ActitoNotificationContent[];
  readonly actions: ActitoNotificationAction[];
  readonly attachments: ActitoNotificationAttachment[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly extra: Record<string, any>;
  readonly targetContentIdentifier?: string;
}

export interface ActitoNotificationContent {
  readonly type: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;
}

export interface ActitoNotificationAction {
  readonly type: string;
  readonly label: string;
  readonly target?: string;
  readonly keyboard: boolean;
  readonly camera: boolean;
  readonly destructive?: boolean;
  readonly icon?: ActitoNotificationActionIcon;
}

export interface ActitoNotificationActionIcon {
  readonly android?: string;
  readonly ios?: string;
  readonly web?: string;
}

export interface ActitoNotificationAttachment {
  readonly mimeType: string;
  readonly uri: string;
}
