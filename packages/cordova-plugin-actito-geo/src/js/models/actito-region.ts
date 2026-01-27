/**
 * Represents a geographic region configured in Actito.
 *
 * An {@link ActitoRegion} defines a location-based area that can be used for proximity
 * detection, geofencing, or region-triggered actions.
 * Regions may be defined using simple or advanced geometries.
 */
export interface ActitoRegion {
  /**
   * Unique identifier of the region.
   */
  readonly id: string;

  /**
   * Human-readable name of the region.
   */
  readonly name: string;

  /**
   * Optional description of the region.
   */
  readonly description?: string;

  /**
   * Optional reference key associated with the region.
   */
  readonly referenceKey?: string;

  /**
   * Primary geometry defining the region.
   */
  readonly geometry: ActitoRegionGeometry;

  /**
   * Optional advanced geometry defining complex region shapes.
   */
  readonly advancedGeometry?: ActitoRegionAdvancedGeometry;

  /**
   * Optional major value associated with the region.
   *
   * This is typically used for beacon-based regions.
   */
  readonly major?: number;

  /**
   * Distance from the device to the region in meters.
   */
  readonly distance: number;

  /**
   * Time zone identifier associated with the region.
   */
  readonly timeZone: string;

  /**
   * Time zone offset of the region in hours relative to UTC.
   */
  readonly timeZonOffset: number;
}

/**
 * Defines the basic geometry of an Actito region.
 */
export interface ActitoRegionGeometry {
  /**
   * Geometry type.
   */
  readonly type: string;

  /**
   * Coordinate defining the geometry's reference point.
   */
  readonly coordinate: ActitoRegionCoordinate;
}

/**
 * Defines an advanced geometry for complex region shapes.
 */
export interface ActitoRegionAdvancedGeometry {
  /**
   * Geometry type.
   */
  readonly type: string;

  /**
   * List of coordinates defining the geometry.
   */
  readonly coordinates: ActitoRegionCoordinate[];
}

/**
 * Represents a geographic coordinate.
 *
 * Coordinates are expressed in decimal degrees.
 */
export interface ActitoRegionCoordinate {
  /**
   * Latitude in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Longitude in decimal degrees.
   */
  readonly longitude: number;
}
