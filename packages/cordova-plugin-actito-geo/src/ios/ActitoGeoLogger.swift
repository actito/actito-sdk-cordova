import Foundation
import ActitoUtilitiesKit

internal let loggerGeo: ActitoLogger = {
    var logger = ActitoLogger(
        subsystem: "com.actito.geo.cordova",
        category: "ActitoGeoCordova",
        labelIgnoreList: ["ActitoGeoCordova"]
    )

    return logger
}()
