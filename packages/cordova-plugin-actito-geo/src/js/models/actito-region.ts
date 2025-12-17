export interface ActitoRegion {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly referenceKey?: string;
  readonly geometry: ActitoRegionGeometry;
  readonly advancedGeometry?: ActitoRegionAdvancedGeometry;
  readonly major?: number;
  readonly distance: number;
  readonly timeZone: string;
  readonly timeZonOffset: number;
}

export interface ActitoRegionGeometry {
  readonly type: string;
  readonly coordinate: ActitoRegionCoordinate;
}

export interface ActitoRegionAdvancedGeometry {
  readonly type: string;
  readonly coordinates: ActitoRegionCoordinate[];
}

export interface ActitoRegionCoordinate {
  readonly latitude: number;
  readonly longitude: number;
}
