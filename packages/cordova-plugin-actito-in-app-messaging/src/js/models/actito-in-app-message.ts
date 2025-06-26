export interface ActitoInAppMessage {
  readonly id: string;
  readonly identifier: string;
  readonly name: string;
  readonly type: string;
  readonly context?: string[] | null;
  readonly title?: string | null;
  readonly message?: string | null;
  readonly image?: string | null;
  readonly landscapeImage?: string | null;
  readonly delaySeconds: number;
  readonly primaryAction?: ActitoInAppMessageAction | null;
  readonly secondaryAction?: ActitoInAppMessageAction | null;
}

export interface ActitoInAppMessageAction {
  readonly label?: string | null;
  readonly destructive: boolean;
  readonly url?: string | null;
}
