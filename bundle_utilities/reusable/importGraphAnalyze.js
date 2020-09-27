const fs = require('fs');
const proceedDir = require('./proceedDir');

function addTypeDescriptionExt(f) {
  return `${f}.d.ts`;
}

module.exports = function importGraphAnalyze(sourceDir, startFile) {
  let connectedFiles = [startFile.replace(/(.*)\.d\.ts/, '$1')];

  function nextStepAnalyze(pattern) {
    let combineFiles = [];
    const resultPromise = proceedDir(sourceDir, pattern, (f, resolver) => {
      fs.readFile(f, 'utf8', (readError, data) => {
        if (readError) {
          throw readError;
        }

        const chunks = data.split(/(?:import)|(?:export)/);
        resolver(chunks);
      });
    })
      .then((result) => {
        result.forEach((fileData) =>
          fileData.forEach((chunk) => {
            combineFiles = [
              ...new Set([
                ...combineFiles,
                ...chunk
                  .split('from')
                  .filter((d, i) => i === 1)
                  .map((d) => d.replace(/(?:\s+'\.\/(.*)'.*\r?\n?)|(.*\r?\n?)/g, '$1'))
                  .filter((d) => d.length > 0),
              ]),
            ];
          })
        );
      })
      .then(() => {
        const nextFilesSet = [...new Set([...connectedFiles, ...combineFiles])];
        const diff = nextFilesSet.slice(connectedFiles.length).map(addTypeDescriptionExt);
        connectedFiles = nextFilesSet;

        return diff.length > 0 ? nextStepAnalyze(diff) : connectedFiles.map(addTypeDescriptionExt);
      });

    return resultPromise;
  }

  return nextStepAnalyze(startFile);
};
