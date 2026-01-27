/**
 * Represents a beacon configured in Actito.
 *
 * An {@link ActitoBeacon} describes a proximity beacon that can be used to trigger
 * proximity-based events.
 */
export interface ActitoBeacon {
  /**
   * Unique identifier of the beacon.
   */
  readonly id: string;

  /**
   * Human-readable name of the beacon.
   */
  readonly name: string;

  /**
   * Major value of the beacon.
   *
   * This value is used to group related beacons.
   */
  readonly major: number;

  /**
   * Optional minor value of the beacon.
   *
   * When provided, this value identifies a specific beacon within a group.
   */
  readonly minor?: number;

  /**
   * Indicates whether this beacon can be used in triggers.
   */
  readonly triggers: boolean;

  /**
   * Proximity level associated with the beacon.
   *
   * Supported proximity values:
   *
   * - `unknown`
   * - `immediate`
   * - `near`
   * - `far`
   */
  readonly proximity: string;
}
