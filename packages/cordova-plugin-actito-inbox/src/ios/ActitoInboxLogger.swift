import Foundation
import ActitoUtilitiesKit

internal let loggerInbox: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.inbox.cordova",
        category: "ActitoInboxCordova",
        labelIgnoreList: ["ActitoInboxCordova"]
    )

    return logger
}()
