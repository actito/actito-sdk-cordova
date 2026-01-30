/**
 * Represents heading and orientation data captured from a device.
 *
 * An {@link ActitoHeading} contains compass and motion sensor information that may be
 * used for location-aware features.
 */
export interface ActitoHeading {
  /**
   * Magnetic heading of the device in degrees.
   *
   * This value is relative to magnetic north.
   */
  readonly magneticHeading: number;

  /**
   * True heading of the device in degrees.
   *
   * This value is relative to true north.
   */
  readonly trueHeading: number;

  /**
   * Estimated accuracy of the heading measurement in degrees.
   */
  readonly headingAccuracy: number;

  /**
   * X-axis component of the device's orientation vector.
   */
  readonly x: number;

  /**
   * Y-axis component of the device's orientation vector.
   */
  readonly y: number;

  /**
   * Z-axis component of the device's orientation vector.
   */
  readonly z: number;

  /**
   * Timestamp indicating when the heading data was recorded.
   */
  readonly timestamp: string;
}
