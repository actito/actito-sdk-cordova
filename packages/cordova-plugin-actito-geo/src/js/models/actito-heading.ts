export interface ActitoHeading {
  readonly magneticHeading: number;
  readonly trueHeading: number;
  readonly headingAccuracy: number;
  readonly x: number;
  readonly y: number;
  readonly z: number;
  readonly timestamp: string;
}
