/**
 * Represents a recorded visit or stay at a specific location.
 *
 * An {@link ActitoVisit} captures the geographic coordinates of the location along
 * with the arrival and departure timestamps. This is typically used for location
 * tracking, analytics, or region-based engagement.
 */
export interface ActitoVisit {
  /**
   * Timestamp when the visit ended.
   */
  readonly departureDate: string;

  /**
   * Timestamp when the visit started.
   */
  readonly arrivalDate: string;

  /**
   * Latitude of the visited location in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Longitude of the visited location in decimal degrees.
   */
  readonly longitude: number;
}
