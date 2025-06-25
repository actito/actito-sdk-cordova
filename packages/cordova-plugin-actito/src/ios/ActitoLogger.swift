import Foundation
import ActitoUtilitiesKit

internal var logger: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.cordova",
        category: "ActitoCordova"
    )

    logger.labelIgnoreList.append("ActitoCordova")

    return logger
}()
