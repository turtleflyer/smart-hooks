const path = require('path');

module.exports = function determineInput(tsConfig) {
  const {
    files: [tsConfigFile],
    compilerOptions: { outDir: tsConfigOutDir },
  } = tsConfig;

  const proceedFileName = tsConfigFile.match(/(.*(?:\/|\\))(.*)/);

  return path.resolve(tsConfigOutDir, proceedFileName[1], proceedFileName[2].replace(/tsx?/, 'js'));
};
