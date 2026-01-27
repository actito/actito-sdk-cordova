/**
 * Represents a digital pass issued by Actito.
 *
 * An {@link ActitoPass} can be used for loyalty programs, coupons, tickets, or other
 * redeemable items. It includes metadata, redemption history, and optional
 * integrations with mobile wallets like Apple Wallet or Google Pay.
 */
export interface ActitoPass {
  /**
   * Unique identifier of the pass.
   */
  readonly id: string;

  /**
   * Optional type of the pass.
   *
   * Supported pass types:
   *
   * - `boarding`
   * - `coupon`
   * - `ticket`
   * - `generic`
   * - `card`
   */
  readonly type?: string;

  /**
   * Version of the pass.
   */
  readonly version: number;

  /**
   * Optional Apple Wallet passbook URL or identifier.
   */
  readonly passbook?: string;

  /**
   * Optional template identifier used to generate the pass.
   */
  readonly template?: string;

  /**
   * Serial number of the pass.
   */
  readonly serial: string;

  /**
   * Barcode value associated with the pass.
   */
  readonly barcode: string;

  /**
   * Redemption behavior of the pass.
   *
   * Supported redemption modes:
   *
   * - `once` — the pass can be redeemed a single time
   * - `limit` — the pass can be redeemed a limited number of times
   * - `always` — the pass can be redeemed an unlimited number of times
   */
  readonly redeem: string;

  /**
   * History of past redemptions for this pass.
   */
  readonly redeemHistory: ActitoPassRedemption[];

  /**
   * Maximum number of times the pass can be redeemed.
   */
  readonly limit: number;

  /**
   * Token associated with the pass for secure validation.
   */
  readonly token: string;

  /**
   * Additional custom data associated with the pass.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: Record<string, any>;

  /**
   * Timestamp indicating when the pass was created or issued.
   */
  readonly date: string;

  /**
   * Optional link to save the pass to Google Pay.
   */
  readonly googlePaySaveLink?: string;
}

/**
 * Represents a single redemption record for an Actito pass.
 *
 * Each {@link ActitoPassRedemption} records the time and optional comments
 * when a pass was redeemed.
 */
export interface ActitoPassRedemption {
  /**
   * Optional comments associated with the redemption.
   */
  readonly comments?: string;

  /**
   * Timestamp when the pass was redeemed.
   */
  readonly date: string;
}
