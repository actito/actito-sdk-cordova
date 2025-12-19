import ActitoKit
import ActitoPushUIKit

@MainActor
@objc(ActitoPushUIPlugin)
class ActitoPushUIPlugin : CDVPlugin {
    private var rootViewController: UIViewController? {
        get {
            self.viewController.view.window?.rootViewController
        }
    }

    override func pluginInitialize() {
        super.pluginInitialize()

        Actito.shared.pushUI().delegate = self
    }

    @objc func registerListener(_ command: CDVInvokedUrlCommand) {
        ActitoPushUIPluginEventBroker.startListening(settings: commandDelegate.settings as? [AnyHashable: Any]) { event in
            var payload: [String: Any] = [
                "name": event.name,
            ]

            if let data = event.payload {
                payload["data"] = data
            }

            let result: CDVPluginResult = CDVPluginResult(status: .ok, messageAs: payload)
            result.keepCallback = true

            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    // MARK: - Actito Push UI

    @objc func presentNotification(_ command: CDVInvokedUrlCommand) {
        let notification: ActitoNotification

        do {
            notification = try ActitoNotification.fromJson(json: command.argument(at: 0) as! [String: Any])
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                let result = CDVPluginResult(status: .error, messageAs: "Cannot present a notification action with a nil root view controller.")
                self.commandDelegate!.send(result, callbackId: command.callbackId)

                return
            }

            if notification.requiresViewController {
                let navigationController = self.createNavigationController()
                rootViewController.present(navigationController, animated: true) {
                    Actito.shared.pushUI().presentNotification(notification, in: navigationController)

                    let result = CDVPluginResult(status: .ok)
                    self.commandDelegate!.send(result, callbackId: command.callbackId)
                }
            } else {
                Actito.shared.pushUI().presentNotification(notification, in: rootViewController)

                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func presentAction(_ command: CDVInvokedUrlCommand) {
        let notification: ActitoNotification
        let action: ActitoNotification.Action

        do {
            notification = try ActitoNotification.fromJson(json: command.argument(at: 0) as! [String: Any])
            action = try ActitoNotification.Action.fromJson(json: command.argument(at: 1) as! [String: Any])
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
            return
        }

        onMainThread {
            guard let rootViewController = self.rootViewController else {
                let result = CDVPluginResult(status: .error, messageAs: "Cannot present a notification action with a nil root view controller.")
                self.commandDelegate!.send(result, callbackId: command.callbackId)

                return
            }

            Actito.shared.pushUI().presentAction(action, for: notification, in: rootViewController)

            let result = CDVPluginResult(status: .ok)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    private func createNavigationController() -> UINavigationController {
        let navigationController = UINavigationController()
        let theme = Actito.shared.options?.theme(for: navigationController)

        if let colorStr = theme?.backgroundColor {
            navigationController.view.backgroundColor = UIColor(hexString: colorStr)
        } else {
            if #available(iOS 13.0, *) {
                navigationController.view.backgroundColor = .systemBackground
            } else {
                navigationController.view.backgroundColor = .white
            }
        }

        return navigationController
    }
}

extension ActitoPushUIPlugin: ActitoPushUIDelegate {
    func actito(_ actitoPushUI: ActitoPushUI, willPresentNotification notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "notification_will_present",
                payload: try notification.toJson()
            )
        } catch {
            logger.error("Failed to emit the notification_will_present event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didPresentNotification notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "notification_presented",
                payload: try notification.toJson()
            )
        } catch {
            logger.error("Failed to emit the notification_presented event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didFinishPresentingNotification notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "notification_finished_presenting",
                payload: try notification.toJson()
            )
        } catch {
            logger.error("Failed to emit the notification_finished_presenting event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didFailToPresentNotification notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "notification_failed_to_present",
                payload: try notification.toJson()
            )
        } catch {
            logger.error("Failed to emit the notification_failed_to_present event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didClickURL url: URL, in notification: ActitoNotification) {
        do {
            let payload: [String: Any] = [
                "notification": try notification.toJson(),
                "url": url.absoluteString,
            ]

            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "notification_url_clicked",
                payload: payload
            )
        } catch {
            logger.error("Failed to emit the notification_url_clicked event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, willExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "action_will_execute",
                payload: [
                    "notification": try notification.toJson(),
                    "action": try action.toJson(),
                ]
            )
        } catch {
            logger.error("Failed to emit the action_will_execute event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "action_executed",
                payload: [
                    "notification": try notification.toJson(),
                    "action": try action.toJson(),
                ]
            )
        } catch {
            logger.error("Failed to emit the action_executed event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didNotExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "action_not_executed",
                payload: [
                    "notification": try notification.toJson(),
                    "action": try action.toJson(),
                ]
            )
        } catch {
            logger.error("Failed to emit the action_not_executed event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didFailToExecuteAction action: ActitoNotification.Action, for notification: ActitoNotification, error: Error?) {
        do {
            var payload: [String: Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "action_failed_to_execute",
                payload: payload
            )
        } catch {
            logger.error("Failed to emit the action_failed_to_execute event.", error: error)
        }
    }

    func actito(_ actitoPushUI: ActitoPushUI, didReceiveCustomAction url: URL, in action: ActitoNotification.Action, for notification: ActitoNotification) {
        do {
            let payload: [String : Any] = [
                "notification": try notification.toJson(),
                "action": try action.toJson(),
                "url": url.absoluteString,
            ]

            ActitoPushUIPluginEventBroker.dispatchEvent(
                name: "custom_action_received",
                payload: payload
            )
        } catch {
            logger.error("Failed to emit the custom_action_received event.", error: error)
        }
    }
}

private func onMainThread(_ action: @escaping () -> Void) {
    DispatchQueue.main.async {
        action()
    }
}
