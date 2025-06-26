export class ActitoEventsModule {
  /**
   * Logs in Actito a custom event in the application.
   *
   * This function allows logging, in Actito, of application-specific events,
   * optionally associating structured data for more detailed event tracking and
   * analysis.
   *
   * @param {string} event - The name of the custom event to log.
   * @param {Record<string, any>} data - Optional structured event data for
   * further details.
   * @returns {Promise<void>} - A promise that resolves when the custom event
   * has been successfully logged.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async logCustom(event: string, data?: Record<string, any>) {
    return new Promise((resolve, reject) => {
      cordova.exec(resolve, reject, 'Actito', 'logCustom', [event, data]);
    });
  }
}
