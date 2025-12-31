/* eslint-disable @typescript-eslint/no-require-imports */

const cordovaIos = require('cordova-ios');
const fs = require('fs-extra');
const path = require('path');
const plist = require('plist');

function setupPlistSettings(context, appConfig) {
  const projectRoot = context.opts.projectRoot;
  const iosPlatformPath = path.join(projectRoot, 'platforms', 'ios');
  const iosProject = new cordovaIos('ios', iosPlatformPath);
  const projName = path.basename(iosProject.locations.xcodeCordovaProj);
  const extName = 'NotificationServiceExtension';
  const appPlistPath = path.join(iosProject.locations.xcodeCordovaProj, `${projName}-Info.plist`);
  const extPlistPath = path.join(iosPlatformPath, extName, `${extName}-Info.plist`);

  let appInfoPlist;
  let extInfoPlist;

  try {
    appInfoPlist = plist.parse(fs.readFileSync(appPlistPath, 'utf8'));
  } catch (e) {
    console.log(`Failed to parse ${projName}-Info.plist: ${e}`);
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
