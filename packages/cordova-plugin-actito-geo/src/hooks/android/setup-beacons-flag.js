/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require('fs');
const path = require('path');

function setupBeaconsFlag(context, flag) {
  const platformRoot = path.join(context.opts.projectRoot, 'platforms/android');
  const projectGradlePropertiesPath = path.join(platformRoot, 'gradle.properties');

  let properties = fs.readFileSync(projectGradlePropertiesPath, {
    encoding: 'utf-8',
  });

  properties = properties.replace(/^actitoBeaconsSupportEnabled.+/m, '');
  properties += `\r\nactitoBeaconsSupportEnabled=${flag}`;

  fs.writeFileSync(projectGradlePropertiesPath, properties);
}

module.exports.setupBeaconsFlag = setupBeaconsFlag;
