# CHANGELOG

## Upcoming release

- Added name and size restrictions to tag names, event names and event payloads
- Crash reporting is deprecated and disabled by default. We recommend using another solution to collect crash analytics

#### Native changes

- Add required referrer for embedded YouTube videos
- Improved network request retry mechanism

##### iOS

- Add option to enable reader mode in in-app browser
- Align with Swift 6 and its Strict Concurrency requirements
- Improved UI for iOS 26
- Changed the default `presentationOptions` to `[.banner, .badge, .sound]`
- Offload PKPass loading to the background
- Fix APNS token registration race condition

##### Android

- Updated to Kotlin 2.0
- Fix conflicting flags in geo pending intents

Prior to upgrading to v5.x, consult the [Migration Guide](./MIGRATION.md), which outlines all necessary changes and procedures to ensure a smooth migration.
