import ActitoKit
import ActitoAssetsKit

#if canImport(Cordova)
import Cordova
#endif

@MainActor
@objc(ActitoAssetsPlugin)
class ActitoAssetsPlugin : CDVPlugin {

    // MARK: - Actito Assets

    @objc func fetch(_ command: CDVInvokedUrlCommand) {
        let group = command.argument(at: 0) as! String

        Actito.shared.assets().fetch(group: group) { result in
            switch result {
            case let .success(assets):
                do {
                    let payload = try assets.map { try $0.toJson() }

                    let result = CDVPluginResult(status: .ok, messageAs: payload)
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
