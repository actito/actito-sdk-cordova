/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

function getCordovaAppConfig(context) {
  const cordovaCommon = context.requireCordovaModule('cordova-common');
  return new cordovaCommon.ConfigParser('config.xml');
}

function getCordovaPackageName(appConfig, platform) {
  let packageName;

  if (platform === 'ios') {
    packageName = appConfig.ios_CFBundleIdentifier();
  }

  if (platform === 'android') {
    packageName = appConfig.android_packageName();
  }

  if (!isEmptyString(packageName)) {
    return packageName;
  }

  return appConfig.packageName();
}

function isPreferenceSet(appConfig, key, platform) {
  const preference = appConfig.getPlatformPreference(key, platform);

  return !isEmptyString(preference.toString());
}

function isPreferenceOptedIn(appConfig, key, platform) {
  const preference = appConfig.getPlatformPreference(key, platform);

  if (isEmptyString(preference.toString())) {
    return false;
  }

  return getPreferenceBoolean(preference);
}

function isEmptyString(str) {
  return !str || 0 === str.length;
}

function getPreferenceBoolean(str) {
  if (!str) {
    return false;
  }

  const value = str.toLowerCase();
  return value === 'true';
}

function copyResources(srcPath, destPath) {
  const exists = fs.existsSync(srcPath);
  const stats = exists && fs.statSync(srcPath);
  const isDirectory = exists && stats.isDirectory();

  if (exists && isDirectory) {
    fs.mkdirSync(destPath);
    fs.readdirSync(srcPath).forEach(function (fileName) {
      copyResources(path.join(srcPath, fileName), path.join(destPath, fileName));
    });
  } else {
    fs.linkSync(srcPath, destPath);
  }
}

module.exports.getCordovaAppConfig = getCordovaAppConfig;
module.exports.getCordovaPackageName = getCordovaPackageName;
module.exports.isPreferenceOptedIn = isPreferenceOptedIn;
module.exports.isPreferenceSet = isPreferenceSet;
module.exports.isEmptyString = isEmptyString;
module.exports.getPreferenceBoolean = getPreferenceBoolean;
module.exports.copyResources = copyResources;
