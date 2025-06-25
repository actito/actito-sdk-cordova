/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require('fs');
const path = require('path');
const gradleConfigDefaults = require('./actito-gradle-config-defaults');

module.exports = function (context) {
  // Make sure android platform is part of build
  if (!context.opts.platforms.includes('android')) return;

  updateUserProjectGradleConfig(context);
};

function updateUserProjectGradleConfig(context) {
  const cordovaCommon = context.requireCordovaModule('cordova-common');
  const configXml = new cordovaCommon.ConfigParser('config.xml');

  // Generate project gradle config
  const projectGradleConfig = {
    ...gradleConfigDefaults,
    ...getUserGradleConfig(configXml),
  };

  // Write out changes
  const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
  const projectGradleConfigPath = path.join(platformRoot, 'actito-gradle-config.json');
  fs.writeFileSync(projectGradleConfigPath, JSON.stringify(projectGradleConfig, null, 2));
}

function getUserGradleConfig(configXml) {
  const configXmlToGradleMapping = [
    {
      xmlKey: 'ActitoServicesGradlePluginVersion',
      gradleKey: 'ACTITO_SERVICES_GRADLE_PLUGIN_VERSION',
      type: String,
    },
  ];

  return configXmlToGradleMapping.reduce((config, mapping) => {
    const rawValue = configXml.getPreference(mapping.xmlKey, 'android');

    // ignore missing preferences (which occur as '')
    if (rawValue) {
      config[mapping.gradleKey] = parseStringAsType(rawValue, mapping.type);
    }

    return config;
  }, {});
}

/** Converts given string to given type */
function parseStringAsType(value, type) {
  switch (type) {
    case String:
      return String(value);
    case Number:
      return parseFloat(value);
    case Boolean:
      return value.toLowerCase() === 'true';
    default:
      throw new Error('Invalid type: ' + type);
  }
}
