/* eslint-disable @typescript-eslint/no-var-requires */

const utils = require('cordova-plugin-actito/src/hooks/utils');
const { setupPlistSettings } = require('./setup-plist-settings');
const { setupServiceExtension } = require('./setup-notification-service-extension');

module.exports = function (context) {
  const appConfig = utils.getCordovaAppConfig(context);

  if (!utils.isPreferenceOptedIn(appConfig, 'ActitoNotificationServiceExtensionEnabled', 'ios')) {
    console.log(`Actito notifications service extension not opted-in, skipping.`);
    return;
  }

  setupServiceExtension(context, appConfig);
  setupPlistSettings(context, appConfig);
};
