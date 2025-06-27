import { EventSubscription } from './events';
import { ActitoScannable } from './models/actito-scannable';

export class ActitoScannables {
  /**
   * Indicates whether an NFC scannable session can be started on the current device.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if the device
   * supports NFC scanning, otherwise `false`.
   */
  public static async canStartNfcScannableSession(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoScannables', 'canStartNfcScannableSession', []);
    });
  }

  /**
   * Starts a scannable session, automatically selecting the best scanning method
   * available.
   *
   * If NFC is available, it starts an NFC-based scanning session. If NFC is not
   * available, it defaults to starting a QR code scanning session.
   *
   * @returns {Promise<void>} - A promise that resolves when the scanning session
   * has been successfully started.
   */
  public static async startScannableSession(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoScannables', 'startScannableSession', []);
    });
  }

  /**
   * Starts an NFC scannable session.
   *
   * Initiates an NFC-based scan, allowing the user to scan NFC tags. This will
   * only function on devices that support NFC and have it enabled.
   *
   * @returns {Promise<void>} - A promise that resolves when the NFC scanning session
   * has been successfully started.
   */
  public static async startNfcScannableSession(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoScannables', 'startNfcScannableSession', []);
    });
  }

  /**
   * Starts a QR code scannable session.
   *
   * Initiates a QR code-based scan using the device camera, allowing the user
   * to scan QR codes.
   *
   * @returns {Promise<void>} - A promise that resolves when the QR code scanning session
   * has been successfully started.
   */
  public static async startQrCodeScannableSession(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoScannables', 'startQrCodeScannableSession', []);
    });
  }

  /**
   * Fetches a scannable item by its tag.
   *
   * @param {string} tag - The tag identifier for the scannable item to be fetched.
   * @return {Promise<ActitoScannable>} - A promise that resolves to the
   * {@link ActitoScannable} object corresponding to the provided tag.
   */
  public static async fetch(tag: string): Promise<ActitoScannable> {
    return new Promise<ActitoScannable>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoScannables', 'fetch', [tag]);
    });
  }

  // region Events

  /**
   * Called when a scannable item is detected during a scannable session.
   *
   * This method is triggered when either an NFC tag or a QR code is successfully
   * scanned, and the corresponding [ActitoScannable] is retrieved. This
   * callback will be invoked on the main thread.
   *
   * @param callback - A callback that will be invoked with the
   * result of the onScannableDetected event. It will provide the detected
   * {@link ActitoScannable}.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onScannableDetected event.
   */
  public static onScannableDetected(callback: (scannable: ActitoScannable) => void): EventSubscription {
    return new EventSubscription('scannable_detected', callback);
  }

  /**
   * Called when an error occurs during a scannable session.
   *
   * This method is triggered if there's a failure while scanning or processing
   * the scannable item, either due to NFC or QR code scanning issues, or if the
   * scannable item cannot be retrieved. This callback will be invoked on the
   * main thread.
   *
   * @param callback - A callback that will be invoked with the
   * result of the onScannableSessionFailed event. It will provide the error
   * that caused the session to fail, if it exists.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onScannableSessionFailed event.
   */
  public static onScannableSessionFailed(callback: (error: string | null) => void): EventSubscription {
    return new EventSubscription('scannable_session_failed', callback);
  }

  // endregion
}
