import ActitoKit
import ActitoInboxKit

@MainActor
@objc(ActitoInboxPlugin)
class ActitoInboxPlugin : CDVPlugin {

    override func pluginInitialize() {
        super.pluginInitialize()

        Actito.shared.inbox().delegate = self
    }

    @objc func registerListener(_ command: CDVInvokedUrlCommand) {
        ActitoInboxPluginEventBroker.startListening(settings: commandDelegate.settings) { event in
            var payload: [String: Any] = [
                "name": event.name,
            ]

            if let data = event.payload {
                payload["data"] = data
            }

            let result = CDVPluginResult(status: .ok, messageAs: payload)
            result!.keepCallback = true

            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    // MARK: - Actito Inbox

    @objc func getItems(_ command: CDVInvokedUrlCommand) {
        do {
            let items = try Actito.shared.inbox().items.map { try $0.toJson() }

            let result = CDVPluginResult(status: .ok, messageAs: items)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func getBadge(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.inbox().badge)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func refresh(_ command: CDVInvokedUrlCommand) {
        Actito.shared.inbox().refresh { result in
            switch result {
            case .success:
                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func open(_ command: CDVInvokedUrlCommand) {
        let json = command.argument(at: 0) as! [String: Any]
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: json)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)

            return
        }

        Actito.shared.inbox().open(item) { result in
            switch result {
            case let .success(notification):
                do {
                    let json = try notification.toJson()

                    let result = CDVPluginResult(status: .ok, messageAs: json)
                    self.commandDelegate!.send(result, callbackId: command.callbackId)
                } catch {
                    let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                    self.commandDelegate!.send(result, callbackId: command.callbackId)
                }
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func markAsRead(_ command: CDVInvokedUrlCommand) {
        let json = command.argument(at: 0) as! [String: Any]
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: json)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)

            return
        }

        Actito.shared.inbox().markAsRead(item) { result in
            switch result {
            case .success:
                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func markAllAsRead(_ command: CDVInvokedUrlCommand) {
        Actito.shared.inbox().markAllAsRead { result in
            switch result {
            case .success:
                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func remove(_ command: CDVInvokedUrlCommand) {
        let json = command.argument(at: 0) as! [String: Any]
        let item: ActitoInboxItem

        do {
            item = try ActitoInboxItem.fromJson(json: json)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)

            return
        }

        Actito.shared.inbox().remove(item) { result in
            switch result {
            case .success:
                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func clear(_ command: CDVInvokedUrlCommand) {
        Actito.shared.inbox().clear { result in
            switch result {
            case .success:
                let result = CDVPluginResult(status: .ok)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }
}

extension ActitoInboxPlugin: ActitoInboxDelegate {
    func actito(_ actitoInbox: ActitoInbox, didUpdateInbox items: [ActitoInboxItem]) {
        do {
            ActitoInboxPluginEventBroker.dispatchEvent(
                name: "inbox_updated",
                payload: try items.map { try $0.toJson() }
            )
        } catch {
            logger.error("Failed to emit the inbox_updated event.", error: error)
        }
    }

    func actito(_ actitoInbox: ActitoInbox, didUpdateBadge badge: Int) {
        ActitoInboxPluginEventBroker.dispatchEvent(
            name: "badge_updated",
            payload: badge
        )
    }
}
