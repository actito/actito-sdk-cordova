import type { ActitoUserInboxItem } from './actito-user-inbox-item';

export interface ActitoUserInboxResponse {
  readonly count: number;
  readonly unread: number;
  readonly items: ActitoUserInboxItem[];
}
