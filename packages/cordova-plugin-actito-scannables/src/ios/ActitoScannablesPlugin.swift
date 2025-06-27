import ActitoKit
import ActitoScannablesKit

@objc(ActitoScannablesPlugin)
class ActitoScannablesPlugin : CDVPlugin {

    private var rootViewController: UIViewController? {
        get {
            UIApplication.shared.delegate?.window??.rootViewController
        }
    }

    override func pluginInitialize() {
        super.pluginInitialize()

        Actito.shared.scannables().delegate = self
    }

    @objc func registerListener(_ command: CDVInvokedUrlCommand) {
        ActitoScannablesPluginEventBroker.startListening(settings: commandDelegate.settings) { event in
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

    // MARK: - Actito Scannables

    @objc func canStartNfcScannableSession(_ command: CDVInvokedUrlCommand) {
        let result = CDVPluginResult(status: .ok, messageAs: Actito.shared.scannables().canStartNfcScannableSession)
        self.commandDelegate!.send(result, callbackId: command.callbackId)
    }

    @objc func startScannableSession(_ command: CDVInvokedUrlCommand) {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                let result = CDVPluginResult(status: .error, messageAs: "Cannot start a scannable session with a nil root view controller.")
                self.commandDelegate!.send(result, callbackId: command.callbackId)

                return
            }

            Actito.shared.scannables().startScannableSession(controller: rootViewController)

            let result = CDVPluginResult(status: .ok)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func startNfcScannableSession(_ command: CDVInvokedUrlCommand) {
        DispatchQueue.main.async {
            Actito.shared.scannables().startNfcScannableSession()

            let result = CDVPluginResult(status: .ok)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func startQrCodeScannableSession(_ command: CDVInvokedUrlCommand) {
        DispatchQueue.main.async {
            guard let rootViewController = self.rootViewController else {
                let result = CDVPluginResult(status: .error, messageAs: "Cannot start a scannable session with a nil root view controller.")
                self.commandDelegate!.send(result, callbackId: command.callbackId)

                return
            }

            Actito.shared.scannables().startQrCodeScannableSession(controller: rootViewController, modal: true)

            let result = CDVPluginResult(status: .ok)
            self.commandDelegate!.send(result, callbackId: command.callbackId)
        }
    }

    @objc func fetch(_ command: CDVInvokedUrlCommand) {
        let tag = command.argument(at: 0) as! String

        Actito.shared.scannables().fetch(tag: tag) { result in
            switch result {
            case let .success(scannable):
                do {
                    let json = try scannable.toJson()

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
}

extension ActitoScannablesPlugin: ActitoScannablesDelegate {
    func actito(_ actitoScannables: ActitoScannables, didDetectScannable scannable: ActitoScannable) {
        do {
            ActitoScannablesPluginEventBroker.dispatchEvent(
                name: "scannable_detected",
                payload: try scannable.toJson()
            )
        } catch {
            logger.error("Failed to emit the scannable_detected event.", error: error)
        }
    }

    func actito(_ actitoScannables: ActitoScannables, didInvalidateScannerSession error: Error) {
        ActitoScannablesPluginEventBroker.dispatchEvent(
            name: "scannable_session_failed",
            payload: error.localizedDescription
        )
    }
}
