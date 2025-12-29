// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "cordova-plugin-actito-push-ui",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "cordova-plugin-actito-push-ui", targets: ["cordova-plugin-actito-push-ui"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master"),
        .package(url: "https://github.com/Actito/actito-sdk-ios.git", from: "5.0.0-beta.2"),
    ],
    targets: [
        .target(
            name: "cordova-plugin-actito-push-ui",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "ActitoKit", package: "actito-sdk-ios", condition: nil),
                .product(name: "ActitoPushUIKit", package: "actito-sdk-ios", condition: nil),
            ],
            path: "src/ios",
            resources: [],
            publicHeadersPath: "."
        )
    ]
)
