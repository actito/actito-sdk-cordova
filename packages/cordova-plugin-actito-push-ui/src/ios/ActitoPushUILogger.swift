import Foundation
import ActitoUtilitiesKit

internal let loggerPushUI: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.push.ui.cordova",
        category: "ActitoPushUICordova",
        labelIgnoreList: ["ActitoPushUICordova"]
    )

    return logger
}()
