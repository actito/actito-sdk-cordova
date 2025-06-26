/* eslint-disable @typescript-eslint/no-var-requires */

const utils = require('cordova-plugin-actito/src/hooks/utils');
const { setupBeaconsFlag } = require('./setup-beacons-flag');

module.exports = function (context) {
  const appConfig = utils.getCordovaAppConfig(context);

  if (!utils.isPreferenceSet(appConfig, 'ActitoBeaconsSupportEnabled', 'android')) {
    console.log(`Actito beacons support preference is not specified, dependency will be included by default.`);
    return;
  }

  const isPreferenceOptedIn = utils.isPreferenceOptedIn(appConfig, 'ActitoBeaconsSupportEnabled', 'android');

  setupBeaconsFlag(context, isPreferenceOptedIn);
};
