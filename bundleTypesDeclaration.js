/* eslint-disable no-console */
const fs = require('fs');

let copyingDone = false;

export default function pickDeclaration(input, types) {
  return {
    name: 'pick-declaration',
    writeBundle() {
      if (!copyingDone) {
        fs.rename(
          `${types.match(/.+\/(?!.+\/)/)[0] + input.match(/\/([^./]+)\.(?!.+(\/|\.))/)[1]}.d.ts`,
          types,
          err => {
            if (err) {
              console.error('While bundling the error occurred:', err);
            }
          },
        );
        copyingDone = true;
      }
    },
  };
}
