import { EventSubscription } from './events';
import { ActitoInAppMessage, ActitoInAppMessageAction } from './models/actito-in-app-message';

export class ActitoInAppMessaging {
  /**
   * Indicates whether in-app messages are currently suppressed.
   *
   * @returns {Promise<boolean>} - A promise that resolves to `true` if message
   * dispatching and the presentation of in-app messages are temporarily
   * suppressed and `false` if in-app messages are allowed to be presented.
   */
  public static async hasMessagesSuppressed(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoInAppMessaging', 'hasMessagesSuppressed', []);
    });
  }

  /**
   * Sets the message suppression state.
   *
   * When messages are suppressed, in-app messages will not be presented to the
   * user. By default, stopping the in-app message suppression does not
   * re-evaluate the foreground context.
   *
   * To trigger a new context evaluation after stopping in-app message
   * suppression, set the `evaluateContext` parameter to `true`.
   *
   * @param {boolean} suppressed - Set to `true` to suppress in-app messages, or
   * `false` to stop suppressing them.
   * @param {boolean} evaluateContext - Set to `true` to re-evaluate the foreground
   * context when stopping in-app message
   * suppression.
   * @returns {Promise<void>} - A promise that resolves when the message suppression
   * state has been successfully set.
   */
  public static async setMessagesSuppressed(suppressed: boolean, evaluateContext?: boolean): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoInAppMessaging', 'setMessagesSuppressed', [suppressed, evaluateContext]);
    });
  }

  // region Events

  /**
   * Called when an in-app message is successfully presented to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onMessagePresented event. It will provide the {@link ActitoInAppMessage}
   * that was presented.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onMessagePresented
   * event.
   */
  public static onMessagePresented(callback: (message: ActitoInAppMessage) => void): EventSubscription {
    return new EventSubscription('message_presented', callback);
  }

  /**
   * Called when the presentation of an in-app message has finished.
   *
   * This method is invoked after the message is no longer visible to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onMessageFinishedPresenting event. It will provide the
   * {@link ActitoInAppMessage} that finished presenting.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onMessageFinishedPresenting
   * event.
   */
  public static onMessageFinishedPresenting(callback: (message: ActitoInAppMessage) => void): EventSubscription {
    return new EventSubscription('message_finished_presenting', callback);
  }

  /**
   * Called when an in-app message failed to present.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onMessageFailedToPresent event. It will provide the
   * {@link ActitoInAppMessage} that failed to present.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onMessageFailedToPresent
   * event.
   */
  public static onMessageFailedToPresent(callback: (message: ActitoInAppMessage) => void): EventSubscription {
    return new EventSubscription('message_failed_to_present', callback);
  }

  /**
   * Called when an action is successfully executed for an in-app message.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionExecuted event. It will provide the
   * {@link ActitoInAppMessageAction} that was executed and the
   * {@link ActitoInAppMessage} for which the action was executed.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onActionExecuted
   * event.
   */
  public static onActionExecuted(
    callback: (data: { message: ActitoInAppMessage; action: ActitoInAppMessageAction }) => void,
  ): EventSubscription {
    return new EventSubscription('action_executed', callback);
  }

  /**
   * Called when an action execution failed for an in-app message.
   *
   * This method is triggered when an error occurs while attempting to execute
   * an action.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionFailedToExecuted event. It will provide the
   * {@link ActitoInAppMessageAction} that failed to execute and the
   * {@link ActitoInAppMessage} for which the action was attempted.
   * @returns {EventSubscription} - The {@link EventSubscription} for the onActionFailedToExecute
   * event.
   */
  public static onActionFailedToExecute(
    callback: (data: { message: ActitoInAppMessage; action: ActitoInAppMessageAction; error?: string }) => void,
  ): EventSubscription {
    return new EventSubscription('action_failed_to_execute', callback);
  }

  // endregion
}
