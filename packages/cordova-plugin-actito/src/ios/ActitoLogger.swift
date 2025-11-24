import Foundation
import ActitoUtilitiesKit

internal let logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.cordova",
        category: "ActitoCordova",
        labelIgnoreList: ["ActitoCordova"]
    )

    return logger
}()
