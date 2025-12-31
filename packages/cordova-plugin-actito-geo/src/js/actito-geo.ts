import { EventSubscription } from './events';
import { ActitoLocation } from './models/actito-location';
import { ActitoRegion } from './models/actito-region';
import { ActitoBeacon } from './models/actito-beacon';
import { ActitoVisit } from './models/actito-visit';
import { ActitoHeading } from './models/actito-heading';
import { PermissionGroup, PermissionRationale, PermissionStatus } from './permissions';

export class ActitoGeo {
  /**
   * Indicates whether location services are enabled.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the
   * location services are enabled by the application, and `false` otherwise.
   */
  public static async hasLocationServicesEnabled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'hasLocationServicesEnabled', []);
    });
  }

  /**
   * Indicates whether Bluetooth is enabled.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if Bluetooth
   * is enabled and available for beacon detection and ranging, and `false` otherwise.
   */
  public static async hasBluetoothEnabled(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'hasBluetoothEnabled', []);
    });
  }

  /**
   * Provides a list of regions currently being monitored.
   *
   * @returns {Promise<ActitoRegion[]>} - A promise that resolves to  a list
   * of {@link ActitoRegion} objects representing the geographical regions
   * being actively monitored for entry and exit events.
   */
  public static async getMonitoredRegions(): Promise<ActitoRegion[]> {
    return new Promise<ActitoRegion[]>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'getMonitoredRegions', []);
    });
  }

  /**
   * Provides a list of regions the user has entered.
   *
   * @returns {Promise<ActitoRegion[]>} - A promise that resolves to a list
   * of {@link ActitoRegion} objects representing the regions that the user
   * has entered and not yet exited.
   */
  public static async getEnteredRegions(): Promise<ActitoRegion[]> {
    return new Promise<ActitoRegion[]>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'getEnteredRegions', []);
    });
  }

  /**
   * Enables location updates, activating location tracking, region monitoring,
   * and beacon detection.
   *
   * **Note**: This function requires explicit location permissions from the user.
   * Starting with Android 10 (API level 29), background location access requires
   * the ACCESS_BACKGROUND_LOCATION permission. For beacon detection, Bluetooth
   * permissions are also necessary. Ensure all permissions are requested before
   * invoking this method.
   *
   * The behavior varies based on granted permissions:
   * - **Permission denied**: Clears the device's location information.
   * - **When In Use permission granted**: Tracks location only while the
   * app is in use.
   * - **Always permission granted**: Enables geofencing capabilities.
   * - **Always + Bluetooth permissions granted**: Enables geofencing
   * and beacon detection.
   *
   * @returns {Promise<void>} - A promise that resolves when location updates
   * have been successfully enabled.
   */
  public static async enableLocationUpdates(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'enableLocationUpdates', []);
    });
  }

  /**
   * Disables location updates.
   *
   * This method stops receiving location updates, monitoring regions, and
   * detecting nearby beacons.
   *
   * @returns {Promise<void>} - A promise that resolves when location updates
   * have been successfully disabled.
   */
  public static async disableLocationUpdates(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'disableLocationUpdates', []);
    });
  }

  //
  // Permission utilities
  //

  /**
   * Checks the current status of a specific permission.
   *
   * @param {PermissionGroup} permission - The {@link PermissionGroup} to
   * check the status for.
   * @returns {Promise<PermissionStatus>} - A promise that resolves to a
   * {@link PermissionStatus} enum containing the given permission status.
   */
  public static async checkPermissionStatus(permission: PermissionGroup): Promise<PermissionStatus> {
    return new Promise<PermissionStatus>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'checkPermissionStatus', [permission]);
    });
  }

  /**
   * Determines if the app should display a rationale for requesting the specified permission.
   *
   * This method is Android focused and will therefore always resolve to `false`
   * for iOS.
   *
   * @param {PermissionGroup} permission - The {@link PermissionGroup} to evaluate
   * if a permission rationale is needed.
   * @returns {Promise<boolean>} - A promise that resolves to `true` if a rationale
   * should be shown, or `false` otherwise.
   */
  public static async shouldShowPermissionRationale(permission: PermissionGroup): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'shouldShowPermissionRationale', [permission]);
    });
  }

  /**
   * Presents a rationale to the user for requesting a specific permission.
   *
   * This method is Android focused, and should only be used after the {@link shouldShowPermissionRationale()}
   * conditional method to ensure correct behaviour on both platforms.
   *
   * This method displays a custom rationale message to the user, explaining why the app requires
   * the specified permission. The rationale should be presented prior to initiating the permission
   * request if a rationale is deemed necessary.
   *
   * @param {PermissionGroup} permission - The {@link PermissionGroup} being requested.
   * @param {PermissionRationale }rationale - The {@link PermissionRationale} details,
   * including the title and message to present to the user.
   * @returns {Promise<void>} - A promise that resolves once the rationale has been
   * successfully dismissed by the user.
   */
  public static async presentPermissionRationale(
    permission: PermissionGroup,
    rationale: PermissionRationale,
  ): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'presentPermissionRationale', [permission, rationale]);
    });
  }

  /**
   * Requests a specific permission from the user.
   *
   * This method prompts the user to grant or deny the specified permission. The returned status
   * indicates the result of the user's decision, which can be one of several states such as
   * "granted", "denied", "restricted", or "permanently_denied".
   *
   * @param {PermissionGroup} permission - The {@link PermissionGroup} being requested.
   * @returns {Promise<PermissionStatus>} - A promise that resolves to a {@link PermissionStatus}
   * enum containing the requested permission status.
   */
  public static async requestPermission(permission: PermissionGroup): Promise<PermissionStatus> {
    return new Promise<PermissionStatus>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'requestPermission', [permission]);
    });
  }

  /**
   *  Opens the application's settings page.
   *
   *  @returns {Promise<void>} - A promise that resolves when the application
   *  settings page has been successfully opened.
   */
  public static async openAppSettings(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoGeo', 'openAppSettings', []);
    });
  }

  // region Events

  /**
   * Called when a new location update is received.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onLocationUpdated event. It will provide the updated {@link ActitoLocation}
   * object representing the user's new location.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onLocationUpdated
   * event.
   */
  public static onLocationUpdated(callback: (location: ActitoLocation) => void): EventSubscription {
    return new EventSubscription('location_updated', callback);
  }

  /**
   * Called when the user enters a monitored region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionEntered event. It will provide the {@link ActitoRegion}
   * representing the region the user has entered.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onRegionEntered
   * event.
   */
  public static onRegionEntered(callback: (region: ActitoRegion) => void): EventSubscription {
    return new EventSubscription('region_entered', callback);
  }

  /**
   * Called when the user exits a monitored region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onRegionExited event. It will provide the {@link ActitoRegion}
   * representing the region the user has exited.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onRegionExited
   * event.
   */
  public static onRegionExited(callback: (region: ActitoRegion) => void): EventSubscription {
    return new EventSubscription('region_exited', callback);
  }

  /**
   * Called when the user enters the proximity of a beacon.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconEntered event. It will provide the {@link ActitoBeacon}
   * representing the beacon the user has entered the proximity of.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onBeaconEntered
   * event.
   */
  public static onBeaconEntered(callback: (beacon: ActitoBeacon) => void): EventSubscription {
    return new EventSubscription('beacon_entered', callback);
  }

  /**
   * Called when the user exits the proximity of a beacon.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconExited event. It will provide the {@link ActitoBeacon}
   * representing the beacon the user has exited the proximity of.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onBeaconExited
   * event.
   */
  public static onBeaconExited(callback: (beacon: ActitoBeacon) => void): EventSubscription {
    return new EventSubscription('beacon_exited', callback);
  }

  /**
   * Called when beacons are ranged in a monitored region.
   *
   * This method provides the list of beacons currently detected within the given
   * region.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onBeaconsRanged event. It will provide a list of {@link ActitoBeacon}
   * that were detected and the {@link ActitoRegion} where they were detected.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onBeaconsRanged
   * event.
   */
  public static onBeaconsRanged(
    callback: (data: { region: ActitoRegion; beacons: ActitoBeacon[] }) => void,
  ): EventSubscription {
    return new EventSubscription('beacons_ranged', callback);
  }

  /**
   * Called when the device registers a location visit.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onVisit event. It will provide a {@link ActitoVisit} object representing
   * the details of the visit.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onVisit
   * event.
   */
  public static onVisit(callback: (visit: ActitoVisit) => void): EventSubscription {
    return new EventSubscription('visit', callback);
  }

  /**
   * Called when there is an update to the device’s heading.
   *
   * **Note**: This method is only supported on iOS.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onHeadingUpdated event. It will provide a {@link ActitoHeading} object
   * containing the details of the updated heading.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onHeadingUpdated
   * event.
   */
  public static onHeadingUpdated(callback: (heading: ActitoHeading) => void): EventSubscription {
    return new EventSubscription('heading_updated', callback);
  }

  // endregion
}
