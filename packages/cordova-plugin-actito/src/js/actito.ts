import { ActitoDeviceModule } from './actito-device-module';
import { ActitoEventsModule } from './actito-events-module';
import { EventSubscription } from './events';
import { ActitoApplication } from './models/actito-application';
import { ActitoNotification } from './models/actito-notification';
import { ActitoDevice } from './models/actito-device';
import { ActitoDynamicLink } from './models/actito-dynamic-link';

export class Actito {
  private static readonly deviceModule = new ActitoDeviceModule();
  private static readonly eventsModule = new ActitoEventsModule();

  //
  // Modules
  //

  public static device(): ActitoDeviceModule {
    return this.deviceModule;
  }

  public static events(): ActitoEventsModule {
    return this.eventsModule;
  }

  //
  // Methods
  //

  /**
   * Indicates whether Actito has been configured.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if
   * Actito is successfully configured, and `false` otherwise.
   */
  public static async isConfigured(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'isConfigured', []);
    });
  }

  /**
   * Indicates whether Actito is ready.
   *
   * @returns {Promise<boolean>} - A promise that resolves to`true` once
   * the SDK has completed the initialization process and is ready for use.
   */
  public static async isReady(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'isReady', []);
    });
  }

  /**
   * Launches the Actito SDK, and all the additional available modules,
   * preparing them for use.
   *
   * @returns {Promise<void>} - A promise that resolves when the Actito SDK
   * and its modules have been successfully launched and are ready for use.
   */
  public static async launch(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'launch', []);
    });
  }

  /**
   * Unlaunches the Actito SDK.
   *
   * This method shuts down the SDK, removing all data, both locally and remotely
   * in the servers. It destroys all the device's data permanently.
   *
   * @returns {Promise<void>} - A promise that resolves when the SDK has been
   * successfully unlaunched and all data has been removed.
   */
  public static async unlaunch(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'unlaunch', []);
    });
  }

  /**
   * Provides the current application metadata, if available.
   *
   * @returns {Promise<ActitoApplication | null>} - A promise that resolves
   * to a {@link ActitoApplication} object representing the configured
   * application, or `null` if the application is not yet available.
   */
  public static async getApplication(): Promise<ActitoApplication | null> {
    return new Promise<ActitoApplication>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'getApplication', []);
    });
  }

  /**
   * Fetches the application metadata.
   *
   * @return {Promise<ActitoApplication>} - A promise that resolves to a
   * {@link ActitoApplication} object containing the application metadata.
   */
  public static async fetchApplication(): Promise<ActitoApplication> {
    return new Promise<ActitoApplication>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchApplication', []);
    });
  }

  /**
   * Fetches a {@link ActitoNotification} by its ID.
   *
   * @param {string} id The ID of the notification to fetch.
   * @return {Promise<ActitoNotification>} - A promise that resolves to
   * the {@link ActitoNotification} object associated with the provided ID.
   */
  public static async fetchNotification(id: string): Promise<ActitoNotification> {
    return new Promise<ActitoNotification>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchNotification', [id]);
    });
  }

  /**
   * Fetches a {@link ActitoDynamicLink} from a URL.
   *
   * @param {string} url - The URL to fetch the dynamic link from.
   * @return {Promise<ActitoDynamicLink>} - A promise that resolves to
   * the {@link ActitoDynamicLink} object.
   */
  public static async fetchDynamicLink(url: string): Promise<ActitoDynamicLink> {
    return new Promise<ActitoDynamicLink>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchDynamicLink', [url]);
    });
  }

  /**
   * Checks if a deferred link exists and can be evaluated.
   *
   * @return {Promise<boolean>} - A promise that resolves to `true` if
   * a deferred link can be evaluated, `false` otherwise.
   */
  public static async canEvaluateDeferredLink(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'canEvaluateDeferredLink', []);
    });
  }

  /**
   * Evaluates the deferred link. Once the deferred link is evaluated, Actito
   * will open the resolved deep link.
   *
   * @return {Promise<boolean>} - A promise that resolves to `true` if
   * the deferred link was successfully evaluated, `false` otherwise.
   */
  public static async evaluateDeferredLink(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'evaluateDeferredLink', []);
    });
  }

  //
  // Events
  //

  /**
   * Called when the Actito SDK is fully ready and the application metadata
   * is available.
   *
   * This method is invoked after the SDK has been successfully launched and is
   * available for use.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onReady event. It will the {@link ActitoApplication} object containing
   * the application's metadata.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onReady
   * event.
   */
  static onReady(callback: (application: ActitoApplication) => void): EventSubscription {
    return new EventSubscription('ready', callback);
  }

  /**
   * Called when the Actito SDK has been unlaunched.
   *
   * This method is invoked after the SDK has been shut down (unlaunched) and
   * is no longer in use.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUnlaunched event.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onUnlaunched
   * event.
   */
  static onUnlaunched(callback: () => void): EventSubscription {
    return new EventSubscription('unlaunched', callback);
  }

  /**
   * Called when the device has been successfully registered with the Actito
   * platform.
   *
   * This method is triggered after the device is initially created, which
   * happens the first time `launch()` is called.
   * Once created, the method will not trigger again unless the device is
   * deleted by calling `unlaunch()` and created again on a new `launch()`.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onDeviceRegistered event. It will provide the registered {@link ActitoDevice}
   * instance representing the device's registration details.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onDeviceRegistered
   * event.
   */
  static onDeviceRegistered(callback: (device: ActitoDevice) => void): EventSubscription {
    return new EventSubscription('device_registered', callback);
  }

  /**
   * Called when the device opens a URL.
   *
   * This method is invoked when the device opens a URL.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onUrlOpened event. It will provide the opened URL.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onUrlOpened
   * event.
   */
  static onUrlOpened(callback: (url: string) => void): EventSubscription {
    return new EventSubscription('url_opened', callback);
  }
}
