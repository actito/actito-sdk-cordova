import { ActitoNotification, ActitoNotificationAction } from 'cordova-plugin-actito';
import { EventSubscription } from './events';

export class ActitoPushUI {
  /**
   * Presents a notification to the user.
   *
   * This method launches the UI for displaying the provided
   * {@link ActitoNotification}.
   *
   * @param {ActitoNotification} notification - The {@link ActitoNotification}
   * to present.
   * @returns {Promise<void>} - A promise that resolves when the presentation process is initiated.
   */
  public static async presentNotification(notification: ActitoNotification): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPushUI', 'presentNotification', [notification]);
    });
  }

  /**
   * Presents an action associated with a notification.
   *
   * This method presents the UI for executing a specific
   * {@link ActitoNotificationAction} associated with the provided
   * {@link ActitoNotification}.
   *
   * @param {ActitoNotification} notification - The {@link ActitoNotification}
   * to present.
   * @param {ActitoNotificationAction} action - The {@link ActitoNotificationAction}
   * to execute.
   * @returns {Promise<void>} - A promise that resolves when the presentation process is initiated.
   */
  public static async presentAction(notification: ActitoNotification, action: ActitoNotificationAction): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      cordova.exec(resolve, reject, 'ActitoPushUI', 'presentAction', [notification, action]);
    });
  }

  // region Events

  /**
   * Called when a notification is about to be presented.
   *
   * This method is invoked before the notification is shown to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationWillPresent event. It will provide the
   * {@link ActitoNotification} that will be presented.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationWillPresent event.
   */
  public static onNotificationWillPresent(callback: (notification: ActitoNotification) => void): EventSubscription {
    return new EventSubscription('notification_will_present', callback);
  }

  /**
   * Called when a notification has been presented.
   *
   * This method is triggered when the notification has been shown to the user.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationPresented event. It will provide the
   * {@link ActitoNotification} that was presented.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationPresented event.
   */
  public static onNotificationPresented(callback: (notification: ActitoNotification) => void): EventSubscription {
    return new EventSubscription('notification_presented', callback);
  }

  /**
   * Called when the presentation of a notification has finished.
   *
   * This method is invoked after the notification UI has been dismissed or the
   * notification interaction has completed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationFinishedPresenting event. It will provide the
   * {@link ActitoNotification} that finished presenting.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationFinishedPresenting event.
   */
  public static onNotificationFinishedPresenting(
    callback: (notification: ActitoNotification) => void,
  ): EventSubscription {
    return new EventSubscription('notification_finished_presenting', callback);
  }

  /**
   * Called when a notification fails to present.
   *
   * This method is invoked if there is an error preventing the notification from
   * being presented.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationFailedToPresent event. It will provide the
   * {@link ActitoNotification} that failed to present.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationFailedToPresent event.
   */
  public static onNotificationFailedToPresent(callback: (notification: ActitoNotification) => void): EventSubscription {
    return new EventSubscription('notification_failed_to_present', callback);
  }

  /**
   * Called when a URL within a notification is clicked.
   *
   * This method is triggered when the user clicks a URL in the notification.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onNotificationUrlClicked event. It will provide the string URL and the
   * {@link ActitoNotification} containing it.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onNotificationUrlClicked event.
   */
  public static onNotificationUrlClicked(
    callback: (data: { notification: ActitoNotification; url: string }) => void,
  ): EventSubscription {
    return new EventSubscription('notification_url_clicked', callback);
  }

  /**
   * Called when an action associated with a notification is about to execute.
   *
   * This method is invoked right before the action associated with a notification
   * is executed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionWillExecute event. It will provide the
   * {@link ActitoNotificationAction} that will be executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onActionWillExecute event.
   */
  public static onActionWillExecute(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction }) => void,
  ): EventSubscription {
    return new EventSubscription('action_will_execute', callback);
  }

  /**
   * Called when an action associated with a notification has been executed.
   *
   * This method is triggered after the action associated with the notification
   * has been successfully executed.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionExecuted event. It will provide the
   * {@link ActitoNotificationAction} that was executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onActionExecuted event.
   */
  public static onActionExecuted(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction }) => void,
  ): EventSubscription {
    return new EventSubscription('action_executed', callback);
  }

  /**
   * Called when an action associated with a notification is available but has
   * not been executed by the user.
   *
   * This method is triggered after the action associated with the notification
   * has not been executed, caused by user interaction.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionNotExecuted event. It will provide the
   * {@link ActitoNotificationAction} that was not executed and the
   * {@link ActitoNotification} containing it.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onActionNotExecuted event.
   */
  public static onActionNotExecuted(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction }) => void,
  ): EventSubscription {
    return new EventSubscription('action_not_executed', callback);
  }

  /**
   * Called when an action associated with a notification fails to execute.
   *
   * This method is triggered if an error occurs while trying to execute an
   * action associated with the notification.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onActionFailedToExecute event. It will provide the
   * {@link ActitoNotificationAction} that was failed to execute and the
   * {@link ActitoNotification} containing it. It may also provide the error
   * that caused the failure.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onActionFailedToExecute event.
   */
  public static onActionFailedToExecute(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction; error?: string }) => void,
  ): EventSubscription {
    return new EventSubscription('action_failed_to_execute', callback);
  }

  /**
   * Called when a custom action associated with a notification is received.
   *
   * This method is triggered when a custom action associated with the
   * notification is received, such as a deep link or custom URL scheme.
   *
   * @param callback - A callback that will be invoked with the result of the
   * onCustomActionReceived event. It will provide the
   * {@link ActitoNotificationAction} that triggered the custom action and
   * the {@link ActitoNotification} containing it. It also provides the URL
   * representing the custom action.
   * @returns {EventSubscription} - The {@link EventSubscription} for the
   * onCustomActionReceived event.
   */
  public static onCustomActionReceived(
    callback: (data: { notification: ActitoNotification; action: ActitoNotificationAction; url: string }) => void,
  ): EventSubscription {
    return new EventSubscription('custom_action_received', callback);
  }

  // endregion
}
