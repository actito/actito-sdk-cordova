/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const { isReleaseReference } = require('./xcode-project');

function getDevelopmentTeam(context, proj, bundleID) {
  return getTeamFromContext(context) || getTeamFromBuildJson(context) || getTeamFromBuildConfiguration(proj, bundleID);
}

function getTeamFromContext(context) {
  const team = context.opts.options.developmentTeam;

  if (!team) {
    return undefined;
  }

  const isRelease = context.opts.options.release;

  return {
    debug: isRelease ? undefined : team,
    release: isRelease ? team : undefined,
  };
}

function getTeamFromBuildJson(context) {
  const buildJsonPath = context.opts.options.buildConfig;

  if (!buildJsonPath) {
    return undefined;
  }

  let debug;
  let release;

  try {
    const buildJson = fs.readFileSync(buildJsonPath, 'utf8');
    const jsonData = JSON.parse(buildJson);

    if (jsonData && jsonData.ios) {
      if (jsonData.ios.debug) {
        debug = jsonData.ios.debug.developmentTeam;
      }

      if (jsonData.ios.release) {
        release = jsonData.ios.release.developmentTeam;
      }
    }
  } catch (e) {
    console.error('Could not get developer team from build.json: ', e);
  }

  if (!debug && !release) {
    return undefined;
  }

  return { debug, release };
}

function getTeamFromBuildConfiguration(proj, bundleID) {
  let debug;
  let release;

  const config = proj.hash.project.objects['XCBuildConfiguration'];

  for (const ref in config) {
    if (
      config[ref].buildSettings &&
      config[ref].buildSettings.PRODUCT_BUNDLE_IDENTIFIER &&
      config[ref].buildSettings.PRODUCT_BUNDLE_IDENTIFIER === bundleID
    ) {
      if (isReleaseReference(proj, ref)) {
        release = proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['DEVELOPMENT_TEAM'];
      } else {
        debug = proj.hash.project.objects['XCBuildConfiguration'][ref].buildSettings['DEVELOPMENT_TEAM'];
      }
    }
  }

  if (!debug && !release) {
    return undefined;
  }

  return { debug, release };
}

module.exports.getDevelopmentTeam = getDevelopmentTeam;
