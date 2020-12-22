const fs = require('fs');
const path = require('path');
const proceedDir = require('./proceedDir');

module.exports = function copyFiles(sourceDir, destDir, filesPattern, removeOrigin = false) {
  const returnPromise = proceedDir(sourceDir, filesPattern, (f, resolver) => {
    fs.copyFile(f, path.resolve(destDir, f.replace(/.*(?:\/|\\)(.*)/, '$1')), (copyError) => {
      if (copyError) {
        throw copyError;
      }

      resolver();

      if (removeOrigin) {
        fs.unlink(f, (removeErr) => {
          if (removeErr) {
            throw removeErr;
          }
        });
      }
    });
  });

  return returnPromise;
};
