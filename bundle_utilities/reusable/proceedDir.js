const fs = require('fs');
const path = require('path');

function getFreshPromise() {
  let resolver;
  const promise = new Promise((r) => {
    resolver = r;
  });

  return [promise, resolver];
}

module.exports = function proceedDir(dir, filePattern, callback) {
  const regExpsToTestAgainst = (Array.isArray(filePattern) ? filePattern : [filePattern]).map((p) =>
    RegExp(
      p.replace('.', '\\.').replace('*', '.*').replace(/^(\w)/, '^$1').replace(/(\w)$/, '$1$'),
      'i'
    )
  );
  function testFile(f) {
    return regExpsToTestAgainst.some((r) => r.test(f));
  }

  const [mainPromise, mainResolver] = getFreshPromise();
  let allPromises;

  fs.readdir(dir, (err, files) => {
    if (err) {
      throw err;
    }

    allPromises = files
      .filter((f) => testFile(f))
      .map((f) => {
        const [promise, resolver] = getFreshPromise();
        callback(path.resolve(dir, f), resolver);

        return promise;
      });

    mainResolver();
  });

  return mainPromise.then(() => Promise.all(allPromises));
};
