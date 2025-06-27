/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs-extra');
const plist = require('plist');

function setupPlistSettings(appConfig) {
  const appName = appConfig.name();
  const extName = 'NotificationServiceExtension';
  const iosPath = 'platforms/ios/';
  const appPlistPath = `${iosPath}${appName}/${appName}-Info.plist`;
  const extPlistPath = `${iosPath}${extName}/${extName}-Info.plist`;

  let appInfoPlist;
  let extInfoPlist;

  try {
    appInfoPlist = plist.parse(fs.readFileSync(appPlistPath, 'utf8'));
  } catch (e) {
    console.log(`Failed to parse ${appName}-Info.plist: ${e}`);
  }

  try {
    extInfoPlist = plist.parse(fs.readFileSync(extPlistPath, 'utf8'));
  } catch (e) {
    console.log(`Failed to parse ${extName}-Info.plist: ${e}`);
  }

  if (!extInfoPlist) {
    return;
  }

  try {
    const bundleShortVersion = getBundleShortVersion(appConfig);
    const bundleVersion = getBundleVersion(appConfig);
    const developmentRegion = getDevelopmentRegion(appConfig, appInfoPlist);

    extInfoPlist.CFBundleShortVersionString = bundleShortVersion;
    extInfoPlist.CFBundleVersion = bundleVersion;
    extInfoPlist.CFBundleDevelopmentRegion = developmentRegion;

    let info_contents = plist.build(extInfoPlist, { indent: '\t', offset: -1 });
    info_contents = info_contents.replace(/<string>[\s\r\n]*<\/string>/g, '<string></string>');

    fs.writeFileSync(extPlistPath, info_contents, 'utf-8');
    console.log(`Successfully updated ${extName}-Info.plist.`);
  } catch (e) {
    console.error(`Failed to update ${extName}-Info.plist: ${e}`);
  }
}

function getBundleShortVersion(appConfig) {
  return appConfig.version();
}

function getBundleVersion(appConfig) {
  return appConfig.ios_CFBundleVersion() || appConfig.version().split('-')[0];
}

function getDevelopmentRegion(appConfig, appInfoPlist) {
  if (!appInfoPlist) {
    return appConfig.getAttribute('defaultlocale') || 'en';
  }

  return appConfig.getAttribute('defaultlocale') || appInfoPlist.CFBundleDevelopmentRegion || 'en';
}

module.exports.setupPlistSettings = setupPlistSettings;
