import { ActitoPass } from './models/actito-pass';

export class ActitoLoyalty {
  /**
   * Fetches a pass by its serial number.
   *
   * @param {string} serial - The serial number of the pass to be fetched.
   * @return {Promise<ActitoPass>} - A promise that resolves to the fetched
   * {@link ActitoPass} corresponding to the given serial number.
   */
  public static async fetchPassBySerial(serial: string): Promise<ActitoPass> {
    return new Promise<ActitoPass>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoLoyalty', 'fetchPassBySerial', [serial]);
    });
  }

  /**
   * Fetches a pass by its barcode.
   *
   * @param {string} barcode - The barcode of the pass to be fetched.
   * @return {Promise<ActitoPass>} - A promise that resolves to the fetched
   * {@link ActitoPass} corresponding to the given barcode.
   */
  public static async fetchPassByBarcode(barcode: string): Promise<ActitoPass> {
    return new Promise<ActitoPass>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoLoyalty', 'fetchPassByBarcode', [barcode]);
    });
  }

  /**
   * Presents a pass to the user.
   *
   * @param {ActitoPass} pass - The {@link ActitoPass} to be presented
   * to the user.
   * @returns {Promise<void>} - A promise that resolves when the pass has
   * been successfully presented to the user.
   */
  public static async present(pass: ActitoPass): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoLoyalty', 'present', [pass]);
    });
  }
}
