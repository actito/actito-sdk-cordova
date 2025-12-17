import { ActitoDevice } from './models/actito-device';
import { ActitoDoNotDisturb } from './models/actito-do-not-disturb';

export class ActitoDeviceModule {
  /**
   * @returns {Promise<ActitoDevice | null>} - A promise that resolves to
   * the current {@link ActitoDevice} information, or 'null' in case no
   * device is registered.
   */
  public async getCurrentDevice(): Promise<ActitoDevice | null> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'getCurrentDevice', []);
    });
  }

  /**
   * @returns {Promise<string | null>} - A promise that resolves to the
   * preferred language of the current device for notifications and messages, or
   * `null` if no preferred language is set.
   */
  public async getPreferredLanguage(): Promise<string | null> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'getPreferredLanguage', []);
    });
  }

  /**
   * Updates the preferred language setting for the device.
   *
   * @param {string | null} language - The preferred language code.
   * @returns {Promise<void>} - A promise that resolves when the preferred language
   * has been successfully updated.
   */
  public async updatePreferredLanguage(language: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'updatePreferredLanguage', [language]);
    });
  }

  /**
   * Registers a user for the device.
   *
   * To register the device anonymously, set both `userId` and `userName` to `null`.
   *
   * @param {string | null} userId - Optional user identifier.
   * @param {string | null} userName - Optional username.
   * @returns {Promise<void>} - A promise that resolves when the user has been
   * successfully registered.
   *
   * @deprecated Use updateUser() instead.
   */
  public async register(userId: string | null, userName: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'register', [userId, userName]);
    });
  }

  /**
   * Updates the user information for the device.
   *
   * To register the device anonymously, set both `userId` and `userName` to `null`.
   *
   * @param {string | null} userId - Optional user identifier.
   * @param {string | null} userName - Optional username.
   * @returns {Promise<void>} - A promise that resolves when the user information
   * has been successfully updated.
   */
  public async updateUser(userId: string | null, userName: string | null): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'updateUser', [userId, userName]);
    });
  }

  /**
   * Fetches the tags associated with the device.
   *
   * @return {Promise<string[]>} - A promise that resolves to a list of tags
   * currently associated with the device.
   */
  public async fetchTags(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchTags', []);
    });
  }

  /**
   * Adds a single tag to the device.
   *
   * @param {string} tag - The tag to add.
   * @returns {Promise<void>} - A promise that resolves when the tag has been
   * successfully added to the device.
   */
  public async addTag(tag: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'addTag', [tag]);
    });
  }

  /**
   * Adds multiple tags to the device.
   *
   * @param {string[]} tags - A list of tags to add.
   * @returns {Promise<void>} - A promise that resolves when all the tags have
   * been successfully added to the device.
   */
  public async addTags(tags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'addTags', [tags]);
    });
  }

  /**
   * Removes a specific tag from the device.
   *
   * @param {string} tag - The tag to remove.
   * @returns {Promise<void>} - A promise that resolves when the tag has been
   * successfully removed from the device.
   */
  public async removeTag(tag: string): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'removeTag', [tag]);
    });
  }

  /**
   * Removes multiple tags from the device.
   *
   * @param {string[]} tags - A list of tags to remove.
   * @returns {Promise<void>} - A promise that resolves when all the specified tags
   * have been successfully removed from the device.
   */
  public async removeTags(tags: string[]): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'removeTags', [tags]);
    });
  }

  /**
   * Clears all tags from the device.
   *
   * @returns {Promise<void>} - A promise that resolves when all tags have been
   * successfully cleared from the device.
   */
  public async clearTags(): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'clearTags', []);
    });
  }

  /**
   * Fetches the "Do Not Disturb" (DND) settings for the device.
   *
   * @return {Promise<ActitoDoNotDisturb | null>} - A promise that resolves
   * to the current {@link ActitoDoNotDisturb} settings, or `null` if
   * none are set.
   */
  public async fetchDoNotDisturb(): Promise<ActitoDoNotDisturb | null> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchDoNotDisturb', []);
    });
  }

  /**
   * Updates the "Do Not Disturb" (DND) settings for the device.
   *
   * @param {ActitoDoNotDisturb} dnd - The new {@link ActitoDoNotDisturb}
   * settings to apply.
   * @returns {Promise<void>} - A promise that resolves when the DND settings
   * have been successfully updated.
   */
  public async updateDoNotDisturb(dnd: ActitoDoNotDisturb): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'updateDoNotDisturb', [dnd]);
    });
  }

  /**
   * Clears the "Do Not Disturb" (DND) settings for the device.
   *
   * @returns {Promise<void>} - A promise that resolves when the DND settings
   * have been successfully cleared.
   */
  public async clearDoNotDisturb(): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'clearDoNotDisturb', []);
    });
  }

  /**
   * Fetches the user data associated with the device.
   *
   * @return {Promise<Record<string, string>>} - A promise that resolves to a
   * {@link Record} object containing the current user data.
   */
  public async fetchUserData(): Promise<Record<string, string>> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'fetchUserData', []);
    });
  }

  /**
   * Updates the custom user data associated with the device.
   *
   * @param {Record<string, string | null>} userData - The updated user data to associate
   * with the device.
   * @returns {Promise<void>} - A promise that resolves when the user data has
   * been successfully updated.
   */
  public async updateUserData(userData: Record<string, string | null>): Promise<void> {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'updateUserData', [userData]);
    });
  }
}
