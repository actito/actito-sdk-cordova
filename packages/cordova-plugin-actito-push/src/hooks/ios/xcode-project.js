function getConfigReferences(proj, name) {
  const references = [];
  const config = proj.hash.project.objects['XCBuildConfiguration'];

  for (const ref in config) {
    if (
      config[ref].buildSettings &&
      config[ref].buildSettings.PRODUCT_NAME &&
      config[ref].buildSettings.PRODUCT_NAME.includes(name)
    ) {
      references.push(ref);
    }
  }

  return references;
}

function isReleaseReference(proj, ref) {
  const config = proj.hash.project.objects['XCBuildConfiguration'];
  return config[ref].name && config[ref].name.includes('Release');
}

module.exports.getConfigReferences = getConfigReferences;
module.exports.isReleaseReference = isReleaseReference;
