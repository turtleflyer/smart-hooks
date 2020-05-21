/* eslint-disable no-console */
const fs = require('fs');
const path = require('path');

function cleanUpDistFolder(dirName) {
  fs.readdir(dirName, (err, files) => {
    if (err) {
      console.error('While bundling the error occurred:', err);
    } else if (files.length) {
      files.forEach((f) =>
        fs.unlink(path.join(dirName, f), (err2) => {
          if (err2) {
            console.error('While bundling the error occurred:', err2);
          }
        })
      );
    }
  });
}

cleanUpDistFolder(path.resolve(process.cwd(), process.argv[2]));
