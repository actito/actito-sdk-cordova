import Foundation
import ActitoUtilitiesKit

internal let loggerInAppMessaging: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.iam.cordova",
        category: "ActitoInAppMessagingCordova",
        labelIgnoreList: ["ActitoInAppMessagingCordova"]
    )

    return logger
}()
