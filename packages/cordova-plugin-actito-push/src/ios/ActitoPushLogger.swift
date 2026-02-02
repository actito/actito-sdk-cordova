import Foundation
import ActitoUtilitiesKit

internal let loggerPush: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.cordova",
        category: "ActitoPushCordova",
        labelIgnoreList: ["ActitoPushCordova"]
    )

    return logger
}()
