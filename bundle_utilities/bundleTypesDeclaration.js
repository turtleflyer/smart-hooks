/* eslint-disable no-console */
const fs = require('fs');

let copyingDone = false;

function bundleTypesDeclaration(input, types) {
  if (!copyingDone) {
    fs.rename(
      `${types.match(/.+\/(?!.+\/)/)[0] + input.match(/\/([^./]+)\.(?!.+(\/|\.))/)[1]}.d.ts`,
      types,
      (err) => {
        if (err) {
          console.error('While bundling the error occurred:', err);
        }
      }
    );
    copyingDone = true;
  }
}

export { bundleTypesDeclaration };
