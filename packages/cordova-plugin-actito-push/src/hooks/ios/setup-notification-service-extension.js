/* eslint-disable @typescript-eslint/no-var-requires */

const cordovaIos = require('cordova-ios');
const fs = require('fs');
const path = require('path');
const xcode = require('xcode');
const utils = require('cordova-plugin-actito/src/hooks/utils');
const { getDevelopmentTeam } = require('./development-team');
const { isReleaseReference, getConfigReferences } = require('./xcode-project');

function setupServiceExtension(context, appConfig) {
  const appBundleID = utils.getCordovaPackageName(appConfig, 'ios');
  const projectRoot = context.opts.projectRoot;
  const iosPlatformPath = path.join(projectRoot, 'platforms', 'ios');
  const iosProject = new cordovaIos('ios', iosPlatformPath);
  const xcodeProject = xcode.project(iosProject.locations.pbxproj);
  const extName = 'NotificationServiceExtension';
  const extFiles = ['NotificationService.swift', `${extName}-Info.plist`];
  const extFilesSrcPath = `plugins/cordova-plugin-actito-push/src/hooks/ios/${extName}/`;
  const extFilesDestPath = path.join(iosPlatformPath, extName);
  const isExtExists = fs.existsSync(extFilesDestPath);

  try {
    xcodeProject.parseSync();

    if (!isExtExists) {
      utils.copyResources(extFilesSrcPath, extFilesDestPath);

      const extTarget = xcodeProject.addTarget(extName, 'app_extension');
      const extGroup = xcodeProject.addPbxGroup(extFiles, extName, extName);
      const groups = xcodeProject.hash.project.objects['PBXGroup'];

      // Making files visible in Xcode
      Object.keys(groups).forEach(function (key) {
        if (groups[key].name === 'CustomTemplate') {
          xcodeProject.addToPbxGroup(extGroup.uuid, key);
        }
      });

      xcodeProject.addBuildPhase(['NotificationService.swift'], 'PBXSourcesBuildPhase', 'Sources', extTarget.uuid);
      xcodeProject.addBuildPhase([], 'PBXResourcesBuildPhase', 'Resources', extTarget.uuid);
    }

    const extConfigRefs = getConfigReferences(xcodeProject, extName);

    initialSetup(xcodeProject, extConfigRefs, appBundleID, extName);
    updateDeploymentTarget(xcodeProject, extConfigRefs, appConfig);
    updateDevelopmentTeam(xcodeProject, extConfigRefs, context, appBundleID);

    fs.writeFileSync(iosProject.locations.pbxproj, xcodeProject.writeSync());
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
