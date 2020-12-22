#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const proceedDir = require('./reusable/proceedDir');

function insertSpaceLines(dirName, filesPattern, dotExt) {
  const dotExtToAdd = dotExt ? `.${dotExt}` : '';

  proceedDir(dirName, filesPattern, (f) => {
    fs.readFile(f, 'utf8', (readError, data) => {
      if (readError) {
        throw readError;
      }
      const newData = data.replace(/(?:(\}|;)(?:\r?\n)+(?!\s*(?:import|\}|:|\?|&|$)))/g, '$1\n\n');
      fs.writeFile(f.replace(/(.*)(\..*)/, `$1${dotExtToAdd}$2`), newData, (writeError) => {
        if (writeError) {
          throw writeError;
        }
      });
    });
  });
}

insertSpaceLines(path.resolve(process.cwd(), process.argv[2]), process.argv[3], process.argv[4]);
