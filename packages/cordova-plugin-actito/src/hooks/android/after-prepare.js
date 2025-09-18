/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const utils = require('../utils');
const { isPreferenceSet } = require('../utils');

const ACTITO_SERVICES_GRADLE_PLUGIN_VERSION = '1.1.0';

module.exports = function (context) {
  // Make sure android platform is part of build
  if (!context.opts.platforms.includes('android')) return;

  updateRootGradleActitoPlugin(context);
  applyAppGradleActitoPlugin(context);
};

function updateRootGradleActitoPlugin(context) {
  const appConfig = utils.getCordovaAppConfig(context);
  const rootGradlePath = path.join(context.opts.projectRoot, 'platforms/android/build.gradle');

  let pluginVersionPreference;
  if (isPreferenceSet(appConfig, 'ActitoServicesGradlePluginVersion', 'android')) {
    pluginVersionPreference = appConfig.getPlatformPreference('ActitoServicesGradlePluginVersion', 'android');
  }

  const pluginDependency = 're.notifica.gradle:notificare-services';
  const pluginVersion = pluginVersionPreference ?? ACTITO_SERVICES_GRADLE_PLUGIN_VERSION;
  const pluginRegex = new RegExp(`(^\\s*classpath\\s*\\(?\\s*["']${pluginDependency}:)([^"']+)(["'].*$)`, 'm');
  const plugin = `classpath "${pluginDependency}:${pluginVersion}"`;

  let gradle = fs.readFileSync(rootGradlePath, 'utf8');

  if (pluginRegex.test(gradle)) {
    gradle = gradle.replace(pluginRegex, (_, beforeVersion, version, afterVersion) => {
      return `${beforeVersion}${pluginVersion}${afterVersion}`;
    });

    console.log(`Updated ${pluginDependency}:${pluginVersion} in android/build.gradle.`);
  } else {
    const lines = gradle.split('\n');
    let lastClasspathIndex = -1;

    lines.forEach((line, idx) => {
      if (line.trim().startsWith('classpath')) {
        lastClasspathIndex = idx;
      }
    });

    if (lastClasspathIndex >= 0) {
      lines.splice(lastClasspathIndex + 1, 0, '        ' + plugin);
      gradle = lines.join('\n');

      console.log(`Added ${pluginDependency}:${pluginVersion} to android/build.gradle.`);
    } else {
      throw new Error('Failed to add Actito plugin dependency to android/build.gradle.');
    }
  }

  fs.writeFileSync(rootGradlePath, gradle, 'utf8');
}

function applyAppGradleActitoPlugin(context) {
  const appGradlePath = path.join(context.opts.projectRoot, 'platforms/android/app/build.gradle');
  const plugin = "apply plugin: 're.notifica.gradle.notificare-services'";

  let gradle = fs.readFileSync(appGradlePath, 'utf8');

  if (gradle.includes(plugin)) {
    return;
  }

  if (!gradle.endsWith('\n')) gradle += '\n';

  gradle += '\n' + plugin + '\n';
  fs.writeFileSync(appGradlePath, gradle, 'utf8');

  console.log('Actito plugin applied in app/build.gradle');
}
