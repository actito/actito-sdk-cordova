/**
 * Represents a geographic location captured from a device.
 *
 * An {@link ActitoLocation} contains latitude, longitude, altitude, movement, and
 * accuracy information, along with a timestamp indicating when the location was
 * recorded.
 */
export interface ActitoLocation {
  /**
   * Latitude of the location in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Longitude of the location in decimal degrees.
   */
  readonly longitude: number;

  /**
   * Altitude of the location in meters above sea level.
   */
  readonly altitude: number;

  /**
   * Direction of travel in degrees relative to true north.
   *
   * This value represents the device's course of movement.
   */
  readonly course: number;

  /**
   * Speed of the device in meters per second.
   */
  readonly speed: number;

  /**
   * Optional floor level of the location.
   *
   * This is typically used for indoor positioning systems.
   */
  readonly floor?: number;

  /**
   * Horizontal accuracy of the location measurement in meters.
   */
  readonly horizontalAccuracy: number;

  /**
   * Vertical accuracy of the location measurement in meters.
   */
  readonly verticalAccuracy: number;

  /**
   * Timestamp indicating when the location was recorded.
   */
  readonly timestamp: string;
}
