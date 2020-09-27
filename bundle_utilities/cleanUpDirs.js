const fs = require('fs');
const path = require('path');

function cleanUpDistFolder(dirNames) {
  dirNames.forEach((dir) => {
    const resolvedDir = path.resolve(process.cwd(), dir);
    fs.readdir(resolvedDir, (readDirErr, files) => {
      if (readDirErr) {
        if (readDirErr.code !== 'ENOENT') {
          throw readDirErr;
        }
      } else {
        files.forEach((f) => {
          const fullPath = path.resolve(resolvedDir, f);
          fs.lstat(fullPath, (lstatErr, stats) => {
            if (lstatErr) {
              throw lstatErr;
            }

            if (stats.isDirectory) {
              fs.rmdir(fullPath, { recursive: true }, (rmDirErr) => {
                if (rmDirErr) {
                  throw rmDirErr;
                }
              });
            } else {
              fs.unlink(fullPath, (unlinkErr) => {
                if (unlinkErr) {
                  throw unlinkErr;
                }
              });
            }
          });
        });
      }
    });
  });
}

cleanUpDistFolder(process.argv.slice(2));
