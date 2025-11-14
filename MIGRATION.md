# MIGRATING

Actito 5.x is a complete rebranding of the Notificare SDK. Most of the migration involves updating the implementation from Notificare to Actito while keeping the original method invocations.

## Deprecations

Crash reporting is now deprecated and disabled by default. We recommend using another solution to collect crash analytics.
In case you have explicitly opted in, consider removing the following:
- Android: remove `re.notifica.crash_reports_enabled` meta-data from your `config.xml`.
- iOS: remove `CRASH_REPORTING_ENABLED` from your `ActitoOptions.plist`

## Breaking changes

### Removals

- Removed Scannables module.

### Dependencies

Open your `package.json` file and align dependencies.
Keep only the dependencies that you already use in your project.

```diff
-    "cordova-plugin-notificare": "^4.0.0",
-    "cordova-plugin-notificare-assets": "^4.0.0",
-    "cordova-plugin-notificare-geo": "^4.0.0",
-    "cordova-plugin-notificare-in-app-messaging": "^4.0.0",
-    "cordova-plugin-notificare-inbox": "^4.0.0",
-    "cordova-plugin-notificare-loyalty": "^4.0.0",
-    "cordova-plugin-notificare-push": "^4.0.0",
-    "cordova-plugin-notificare-push-ui": "^4.0.0",
-    "cordova-plugin-notificare-user-inbox": "^4.0.0",

+    "cordova-plugin-actito": "^5.0.0",
+    "cordova-plugin-actito-assets": "^5.0.0",
+    "cordova-plugin-actito-geo": "^5.0.0",
+    "cordova-plugin-actito-in-app-messaging": "^5.0.0",
+    "cordova-plugin-actito-inbox": "^5.0.0",
+    "cordova-plugin-actito-loyalty": "^5.0.0",
+    "cordova-plugin-actito-push": "^5.0.0",
+    "cordova-plugin-actito-push-ui": "^5.0.0",
+    "cordova-plugin-actito-user-inbox": "^5.0.0",
```

### Setup

#### Adjust the constants in your `config.xml`
Open your `config.xml` file and rename all constants starting with `re.notifica` to `com.actito` and `Notificare*` to `Actito*`. For instance, here's an example of enabling debug logging in Android:

```diff
<platform name="android">
    <config-file target="AndroidManifest.xml" parent="/manifest/application">
-       <meta-data android:name="re.notifica.debug_logging_enabled" android:value="true" />
+       <meta-data android:name="com.actito.debug_logging_enabled" android:value="true" />
    </config-file>
</platform>
```

And another example of enabling Notifications Service Extension in iOS:

```diff
<platform name="ios">
-        <preference name="NotificareNotificationServiceExtensionEnabled" value="true" />
+        <preference name="ActitoNotificationServiceExtensionEnabled" value="true" />
</platform>
```

### Configuration file

Rename configuration file:
- Android: `notificare-services.json` -> `actito-services.json`
- iOS: `NotificareServices.plist` -> `ActitoServices.plist`, also make sure to align the options file `NotificareOptions.plist` -> `ActitoOptions.plist`

And align the implementation inside your `config.xml`:

```diff
<platform name="android">
-        <resource-file src="notificare-services.json" target="app/notificare-services.json" />
+        <resource-file src="actito-services.json" target="app/actito-services.json" />
</platform>

<platform name="ios">
-        <resource-file src="NotificareServices.plist" target="NotificareServices.plist" />
-        <resource-file src="NotificareOptions.plist" target="NotificareOptions.plist" />

+        <resource-file src="ActitoServices.plist" target="ActitoServices.plist" />
+        <resource-file src="ActitoOptions.plist" target="ActitoOptions.plist" />
</platform>
```

### Implementation

You must update all references to the old Notificare classes and packages throughout your project.
Replace any class names starting with `Notificare` (for example, `NotificarePush`, `NotificarePushUI`, `NotificareGeo`, etc.) with their Actito equivalents (`ActitoPush`, `ActitoPushUI`, `ActitoGeo`, and so on).

Similarly, update all imports from the `import { Notificare* } from 'cordova-plugin-notificare*'` to `import { Actito* } from 'cordova-plugin-actito*'`.

Here is an example from the inbox implementation:

```diff
- import { NotificareInbox, NotificareInboxItem } from 'cordova-plugin-notificare-inbox';
- import { NotificarePushUI } from 'cordova-plugin-notificare-push-ui';

+ import { ActitoInbox, ActitoInboxItem } from 'cordova-plugin-actito-inbox';
+ import { ActitoPushUI } from 'cordova-plugin-actito-push-ui';

-  async function open(item: NotificareInboxItem) {
+  async function open(item: ActitoInboxItem) {
    try {
-      const notification = await NotificareInbox.open(item);
-      await NotificarePushUI.presentNotification(notification);

+      const notification = await ActitoInbox.open(item);
+      await ActitoPushUI.presentNotification(notification);
    } catch (e) {
      // handle error
    }
  }
```

> **Tip:**
>
> A global search-and-replace can accelerate this migration, but review your code carefully.

### Overriding Localizable Resources

#### Android

If your project overrides SDK-provided localizable strings or other resources, you must update their names to align with the new Actito namespace.
All resource identifiers previously prefixed with `notificare_` should now use the `actito_` prefix instead.

For example, in your `res/values/strings.xml` file:

```diff
- <string name="notificare_default_channel_name">Notifications</string>
+ <string name="actito_default_channel_name">Notifications</string>
```

Ensure this change is applied consistently across all localized resource files (for example, values-es, values-fr, etc.) within your res directory.

> **Tip:**
>
> A global search for `notificare_` in your `res/` folder will help you quickly locate and rename all relevant keys to the new `actito_` format.

#### iOS

If your project overrides SDK-provided localizable strings or other resources, you must update their names to align with the new Actito namespace.
All resource identifiers previously prefixed with `notificare_` should now use the `actito_` prefix instead.

For example, in your `fr.lproj/Localizable.strings` file:

```diff
- notificare_cancel_button = "Annuler";
+ actito_cancel_button = "Annuler";
```

> **Tip:**
>
> A global search for `notificare_` in your localizable folder will help you quickly locate and rename all relevant keys to the new `actito_` format.

### Restricted Tag Naming

Tag naming rules have been tightened to ensure consistency.
Tags added using `Actito.device().addTag()` or `Actito.device().addTags()` must now adhere to the following constraints:

- The tag name must be between 3 and 64 characters in length.
- Tags must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are allowed within the name.

> **Example:**
>
> ✅ `premium_user`  ✅ `en-GB`  ❌ @user

### Restricted Event Naming and Payload Size

Event naming and payload validation rules have also been standardized.
Custom events logged with `Actito.events().logCustom();` must comply with the following:

- Event names must be between 3 and 64 characters.
- Event names must start and end with an alphanumeric character.
- Only letters, digits, underscores (`_`), and hyphens (`-`) are permitted.
- The event data payload is limited to 2 KB in size. Ensure you are not sending excessively large or deeply nested objects when calling: `Actito.shared.events().logCustom(eventName, data: data)`.

> **Tip:**
>
> To avoid exceeding the payload limit, keep your event data minimal — include only the essential key–value pairs required for personalized content or campaign targeting.
