import ActitoKit

@MainActor
@objc(ActitoPlugin)
class ActitoPlugin : CDVPlugin {

    override func pluginInitialize() {
        super.pluginInitialize()

        logger.hasDebugLoggingEnabled = Actito.shared.options?.debugLoggingEnabled ?? false
        Actito.shared.delegate = self

        _ = ActitoSwizzler.addInterceptor(self)
    }

    override func handleOpenURL(_ notification: Notification) {
        guard let url = notification.object as? URL else {
            return
        }

        if Actito.shared.handleTestDeviceUrl(url) {
            return
        }

        if Actito.shared.handleDynamicLinkUrl(url) {
            return
        }

        ActitoPluginEventBroker.dispatchEvent(
            name: "url_opened",
            payload: url.absoluteString
        )
    }

    @objc func registerListener(_ command: CDVInvokedUrlCommand) {
        ActitoPluginEventBroker.startListening(settings: commandDelegate.settings as? [AnyHashable: Any]) { event in
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

    // MARK: - Actito

    @objc func isConfigured(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.isConfigured)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func isReady(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.isReady)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }


    @objc func launch(_ command: CDVInvokedUrlCommand) {
        Actito.shared.launch { result in
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

    @objc func unlaunch(_ command: CDVInvokedUrlCommand) {
        Actito.shared.unlaunch { result in
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

    @objc func getApplication(_ command: CDVInvokedUrlCommand) {
        do {
            let json = try Actito.shared.application?.toJson()

            let result = if let json {
                CDVPluginResult(status: .ok, messageAs: json)
            } else {
                CDVPluginResult(status: .ok)
            }

            self.commandDelegate!.send(result, callbackId: command.callbackId)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func fetchApplication(_ command: CDVInvokedUrlCommand) {
        Actito.shared.fetchApplication { result in
            switch result {
            case let .success(application):
                do {
                    let json = try application.toJson()

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

    @objc func fetchNotification(_ command: CDVInvokedUrlCommand) {
        let id = command.argument(at: 0) as! String

        Actito.shared.fetchNotification(id) { result in
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

    @objc func fetchDynamicLink(_ command: CDVInvokedUrlCommand) {
        let url = command.argument(at: 0) as! String

        Actito.shared.fetchDynamicLink(url) { result in
            switch result {
            case let .success(dynamicLink):
                do {
                    let json = try dynamicLink.toJson()

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

    @objc func canEvaluateDeferredLink(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.canEvaluateDeferredLink)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func evaluateDeferredLink(_ command: CDVInvokedUrlCommand) {
        Actito.shared.evaluateDeferredLink { result in
            switch result {
            case let .success(evaluated):
                let result = CDVPluginResult(status: .ok, messageAs: evaluated)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    // MARK: - Actito Device Module

    @objc func getCurrentDevice(_ command: CDVInvokedUrlCommand) {
        do {
            let json = try Actito.shared.device().currentDevice?.toJson()

            let result = if let json {
                CDVPluginResult(status: .ok, messageAs: json)
            } else {
                CDVPluginResult(status: .ok)
            }

            self.commandDelegate!.send(result, callbackId: command.callbackId)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func register(_ command: CDVInvokedUrlCommand) {
        let userId = command.argument(at: 0) as! String?
        let userName = command.argument(at: 1) as! String?

        Actito.shared.device().register(userId: userId, userName: userName) { result in
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

    @objc func updateUser(_ command: CDVInvokedUrlCommand) {
        let userId = command.argument(at: 0) as! String?
        let userName = command.argument(at: 1) as! String?

        Actito.shared.device().updateUser(userId: userId, userName: userName) { result in
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

    @objc func fetchTags(_ command: CDVInvokedUrlCommand) {
        Actito.shared.device().fetchTags { result in
            switch result {
            case let .success(tags):
                let result = CDVPluginResult(status: .ok, messageAs: tags)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func addTag(_ command: CDVInvokedUrlCommand) {
        let tag = command.argument(at: 0) as! String

        Actito.shared.device().addTag(tag) { result in
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

    @objc func addTags(_ command: CDVInvokedUrlCommand) {
        let tags = command.argument(at: 0) as! [String]

        Actito.shared.device().addTags(tags) { result in
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

    @objc func removeTag(_ command: CDVInvokedUrlCommand) {
        let tag = command.argument(at: 0) as! String

        Actito.shared.device().removeTag(tag) { result in
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

    @objc func removeTags(_ command: CDVInvokedUrlCommand) {
        let tags = command.argument(at: 0) as! [String]

        Actito.shared.device().removeTags(tags) { result in
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

    @objc func clearTags(_ command: CDVInvokedUrlCommand) {
        Actito.shared.device().clearTags { result in
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

    @objc func getPreferredLanguage(_ command: CDVInvokedUrlCommand) {
        let preferredLanguage = Actito.shared.device().preferredLanguage

        let result = if let preferredLanguage {
            CDVPluginResult(status: .ok, messageAs: preferredLanguage)
        } else {
            CDVPluginResult(status: .ok)
        }

        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func updatePreferredLanguage(_ command: CDVInvokedUrlCommand) {
        let language = command.argument(at: 0) as! String?

        Actito.shared.device().updatePreferredLanguage(language) { result in
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

    @objc func fetchDoNotDisturb(_ command: CDVInvokedUrlCommand) {
        Actito.shared.device().fetchDoNotDisturb { result in
            switch result {
            case let .success(dnd):
                do {
                    let json = try dnd?.toJson()

                    let result = if let json {
                        CDVPluginResult(status: .ok, messageAs: json)
                    } else {
                        CDVPluginResult(status: .ok)
                    }

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

    @objc func updateDoNotDisturb(_ command: CDVInvokedUrlCommand) {
        let json = command.argument(at: 0) as! [String: Any]
        let dnd: ActitoDoNotDisturb

        do {
            dnd = try ActitoDoNotDisturb.fromJson(json: json)
        } catch {
            let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
            return
        }

        Actito.shared.device().updateDoNotDisturb(dnd) { result in
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

    @objc func clearDoNotDisturb(_ command: CDVInvokedUrlCommand) {
        Actito.shared.device().clearDoNotDisturb { result in
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

    @objc func fetchUserData(_ command: CDVInvokedUrlCommand) {
        Actito.shared.device().fetchUserData { result in
            switch result {
            case let .success(userData):
                let result = CDVPluginResult(status: .ok, messageAs: userData)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            case let .failure(error):
                let result = CDVPluginResult(status: .error, messageAs: error.localizedDescription)
                self.commandDelegate!.send(result, callbackId: command.callbackId)
            }
        }
    }

    @objc func updateUserData(_ command: CDVInvokedUrlCommand) {
        let userData = command.argument(at: 0) as! [String: String?]

        Actito.shared.device().updateUserData(userData) { result in
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

    @objc func logCustom(_ command: CDVInvokedUrlCommand) {
        let event = command.argument(at: 0) as! String
        let data = command.argument(at: 1) as? [String: Any]

        Actito.shared.events().logCustom(event, data: data) { result in
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

extension ActitoPlugin: ActitoDelegate {
    func actito(_ actito: Actito, didRegisterDevice device: ActitoDevice) {
        do {
            ActitoPluginEventBroker.dispatchEvent(
                name: "device_registered",
                payload: try device.toJson()
            )
        } catch {
            logger.error("Failed to emit the ready event.", error: error)
        }
    }

    func actito(_ actito: Actito, onReady application: ActitoApplication) {
        do {
            ActitoPluginEventBroker.dispatchEvent(
                name: "ready",
                payload: try application.toJson()
            )
        } catch {
            logger.error("Failed to emit the ready event.", error: error)
        }

        let holdEventsUntilReady = commandDelegate.settings["com.actito.cordova.hold_events_until_ready"] as? String
        if holdEventsUntilReady == "true" {
            NotificationCenter.default.post(name: Notification.Name("com.actito.cordova.on_ready"), object: nil)
        }
    }

    func actitoDidUnlaunch(_ actito: Actito) {
        ActitoPluginEventBroker.dispatchEvent(name: "unlaunched", payload: nil)
    }
}

extension ActitoPlugin: ActitoAppDelegateInterceptor {
    func application(_ application: UIApplication, continue userActivity: NSUserActivity, restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
        guard let url = userActivity.webpageURL else {
            return false
        }

        if Actito.shared.handleTestDeviceUrl(url) {
            return true
        }

        return Actito.shared.handleDynamicLinkUrl(url)
    }
}
