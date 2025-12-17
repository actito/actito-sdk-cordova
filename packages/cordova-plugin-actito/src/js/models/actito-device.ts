import type { ActitoDoNotDisturb } from './actito-do-not-disturb';

export interface ActitoDevice {
  readonly id: string;
  readonly userId?: string;
  readonly userName?: string;
  readonly timeZoneOffset: number;
  readonly dnd?: ActitoDoNotDisturb;
  readonly userData: Record<string, string>;
}
