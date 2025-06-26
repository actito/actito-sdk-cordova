/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const xcode = require('xcode');
const utils = require('cordova-plugin-actito/src/hooks/utils');
const { getDevelopmentTeam } = require('./development-team');
const { isReleaseReference, getConfigReferences } = require('./xcode-project');

function setupServiceExtension(context, appConfig) {
  const appName = appConfig.name();
  const appBundleID = utils.getCordovaPackageName(appConfig, 'ios');
  const iosPath = 'platforms/ios/';
  const projPath = `${iosPath}${appName}.xcodeproj/project.pbxproj`;
  const extName = 'NotificationServiceExtension';
  const extFiles = ['NotificationService.swift', 'NotificationServiceExtension-Info.plist'];
  const extFilesDir = `plugins/cordova-plugin-actito-push/src/hooks/ios/${extName}/`;
  const proj = xcode.project(projPath);
  const isExtExists = fs.existsSync(`${iosPath}${extName}`);

  try {
    proj.parseSync();

    if (!isExtExists) {
      utils.copyResources(`${extFilesDir}`, `${iosPath}${extName}`);

      const extTarget = proj.addTarget(extName, 'app_extension');
      const extGroup = proj.addPbxGroup(extFiles, extName, extName);
      const groups = proj.hash.project.objects['PBXGroup'];

      // Making files visible in Xcode
      Object.keys(groups).forEach(function (key) {
        if (groups[key].name === 'CustomTemplate') {
          proj.addToPbxGroup(extGroup.uuid, key);
        }
      });

      proj.addBuildPhase(['NotificationService.swift'], 'PBXSourcesBuildPhase', 'Sources', extTarget.uuid);
      proj.addBuildPhase([], 'PBXResourcesBuildPhase', 'Resources', extTarget.uuid);
    }

    const extConfigRefs = getConfigReferences(proj, extName);

    initialSetup(proj, extConfigRefs, appBundleID, extName);
    updateDeploymentTarget(proj, extConfigRefs, appConfig);
    updateDevelopmentTeam(proj, extConfigRefs, context, appBundleID);

    fs.writeFileSync(projPath, proj.writeSync());
    console.log(`Successfully ${!isExtExists ? 'added' : 'updated'} Notification Service Extension.`);
  } catch (e) {
    console.error(`Failed to ${!isExtExists ? 'add' : 'update'} Notification Service Extension: ${e}`);
  }
}

function initialSetup(proj, extConfigRefs, appBundleID, extName) {
  extConfigRefs.forEach((ref) => {
    if (proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['PRODUCT_BUNDLE_IDENTIFIER']) {
      return;
    }

    proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings[
      'PRODUCT_BUNDLE_IDENTIFIER'
    ] = `${appBundleID}.NotificationServiceExtension`;
    proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['PRODUCT_NAME'] = `${extName}`;
  });
}

function updateDeploymentTarget(proj, extConfigRefs, appConfig) {
  extConfigRefs.forEach((ref) => {
    proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['IPHONEOS_DEPLOYMENT_TARGET'] =
      appConfig.getPlatformPreference('deployment-target', 'ios') || '13.0';
  });
}

function updateDevelopmentTeam(proj, extConfigRefs, context, appBundleID) {
  const { debug, release } = getDevelopmentTeam(context, proj, appBundleID) || {};

  if (!debug && !release) {
    return;
  }

  extConfigRefs.forEach((ref) => {
    const isRelease = isReleaseReference(proj, ref);

    if (isRelease && release) {
      proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['DEVELOPMENT_TEAM'] = release;
    } else if (!isRelease && debug) {
      proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['DEVELOPMENT_TEAM'] = debug;
    }
  });
}

module.exports.setupServiceExtension = setupServiceExtension;
