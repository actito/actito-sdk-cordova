import type { ActitoNotification } from 'cordova-plugin-actito';

export interface ActitoScannable {
  readonly id: string;
  readonly name: string;
  readonly tag: string;
  readonly type: string;
  readonly notification?: ActitoNotification;
}
