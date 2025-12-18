import ActitoKit
import ActitoInAppMessagingKit

@MainActor
@objc(ActitoInAppMessagingPlugin)
class ActitoInAppMessagingPlugin : CDVPlugin {

    override func pluginInitialize() {
        super.pluginInitialize()

        Actito.shared.inAppMessaging().delegate = self
    }

    @objc func registerListener(_ command: CDVInvokedUrlCommand) {
        ActitoInAppMessagingPluginEventBroker.startListening(settings: commandDelegate.settings as? [AnyHashable: Any]) { event in
            var payload: [String: Any] = [
                "name": event.name,
            ]

            if let data = event.payload {
                payload["data"] = data
            }

            let result = CDVPluginResult(status: .ok, messageAs: payload)
            result.keepCallback = true

            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    // MARK: - Actito In-App Messaging

    @objc func hasMessagesSuppressed(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.inAppMessaging().hasMessagesSuppressed)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func setMessagesSuppressed(_ command: CDVInvokedUrlCommand) {
        let suppressed = command.argument(at: 0) as! Bool
        let evaluateContext = command.argument(at: 1) as? Bool ?? false

        Actito.shared.inAppMessaging().setMessagesSuppressed(suppressed, evaluateContext: evaluateContext)

        let result = CDVPluginResult(status: .ok)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }
}

extension ActitoInAppMessagingPlugin: ActitoInAppMessagingDelegate {
    func actito(_ actito: ActitoInAppMessaging, didPresentMessage message: ActitoInAppMessage) {
        do {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent(
                name: "message_presented",
                payload: try message.toJson()
            )
        } catch {
            logger.error("Failed to emit the message_presented event.", error: error)
        }
    }

    func actito(_ actito: ActitoInAppMessaging, didFinishPresentingMessage message: ActitoInAppMessage) {
        do {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent(
                name: "message_finished_presenting",
                payload: try message.toJson()
            )
        } catch {
            logger.error("Failed to emit the message_finished_presenting event.", error: error)
        }
    }

    func actito(_ actito: ActitoInAppMessaging, didFailToPresentMessage message: ActitoInAppMessage) {
        do {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent(
                name: "message_failed_to_present",
                payload: try message.toJson()
            )
        } catch {
            logger.error("Failed to emit the message_failed_to_present event.", error: error)
        }
    }

    func actito(_ actito: ActitoInAppMessaging, didExecuteAction action: ActitoInAppMessage.Action, for message: ActitoInAppMessage) {
        do {
            ActitoInAppMessagingPluginEventBroker.dispatchEvent(
                name: "action_executed",
                payload: [
                    "message": try message.toJson(),
                    "action": try action.toJson(),
                ]
            )
        } catch {
            logger.error("Failed to emit the action_executed event.", error: error)
        }
    }

    func actito(_ actito: ActitoInAppMessaging, didFailToExecuteAction action: ActitoInAppMessage.Action, for message: ActitoInAppMessage, error: Error?) {
        do {
            var payload: [String: Any] = [
                "message": try message.toJson(),
                "action": try action.toJson(),
            ]

            if let error = error {
                payload["error"] = error.localizedDescription
            }

            ActitoInAppMessagingPluginEventBroker.dispatchEvent(
                name: "action_failed_to_execute",
                payload: payload
            )
        } catch {
            logger.error("Failed to emit the action_failed_to_execute event.", error: error)
        }
    }
}
