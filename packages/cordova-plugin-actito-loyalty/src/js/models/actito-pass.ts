export interface ActitoPass {
  readonly id: string;
  readonly type?: string;
  readonly version: number;
  readonly passbook?: string;
  readonly template?: string;
  readonly serial: string;
  readonly barcode: string;
  readonly redeem: string;
  readonly redeemHistory: ActitoPassRedemption[];
  readonly limit: number;
  readonly token: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: Record<string, any>;
  readonly date: string;
  readonly googlePaySaveLink?: string;
}

export interface ActitoPassRedemption {
  readonly comments?: string;
  readonly date: string;
}
