// swift-tools-version:5.5

import PackageDescription

let package = Package(
    name: "cordova-plugin-actito-geo",
    platforms: [.iOS(.v13)],
    products: [
        .library(name: "cordova-plugin-actito-geo", targets: ["cordova-plugin-actito-geo"])
    ],
    dependencies: [
        .package(url: "https://github.com/apache/cordova-ios.git", branch: "master"),
        .package(url: "https://github.com/Actito/actito-sdk-ios.git", from: "5.0.0"),
    ],
    targets: [
        .target(
            name: "cordova-plugin-actito-geo",
            dependencies: [
                .product(name: "Cordova", package: "cordova-ios"),
                .product(name: "ActitoKit", package: "actito-sdk-ios", condition: nil),
                .product(name: "ActitoGeoKit", package: "actito-sdk-ios", condition: nil),
            ],
            path: "src/ios",
            resources: [],
            publicHeadersPath: "."
        )
    ]
)
