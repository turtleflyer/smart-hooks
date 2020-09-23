/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function insertSpaceLines(dirName, extPattern, dotExt) {
  const regExpExtPattern = RegExp(extPattern.replace('*', '.*').replace('.', '\\.'), 'i');
  const dotExtToAdd = dotExt ? `.${dotExt}` : '';

  fs.readdir(dirName, (err, files) => {
    if (err) {
      throw err;
    } else if (files.length) {
      files
        .filter((f) => regExpExtPattern.test(f))
        .forEach((f) => {
          fs.readFile(path.resolve(dirName, f), 'utf8', (readError, data) => {
            if (readError) {
              throw readError;
            }
            const newData = data.replace(/(?:(\}|;)(?:\r?\n)+(?!\s*(?:import|\}|:|\?|&|$)))/g, '$1\n\n');
            fs.writeFile(
              path.resolve(
                dirName,
                `${f.replace(/(.*)\..*/, '$1')}${dotExtToAdd}${f.replace(/.*(\..*)/, '$1')}`
              ),
              newData,
              (writeError) => {
                if (writeError) {
                  throw writeError;
                }
              }
            );
          });
        });
    }
  });
}

insertSpaceLines(path.resolve(process.cwd(), process.argv[2]), process.argv[3], process.argv[4]);
