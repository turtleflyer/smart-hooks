/* eslint-disable import/no-dynamic-require */
const fs = require('fs');
const path = require('path');
const determineInput = require('./determineInput');
const copyFiles = require('./reusable/copyFiles');
const importGraphAnalyze = require('./reusable/importGraphAnalyze');

const cwd = process.cwd();
const tsConfig = require(path.resolve(cwd, './tsconfig.bundle.json'));
const { types: typesDeclFilePath } = require(path.resolve(cwd, './package.json'));

function proceedTypeDeclarations() {
  const {
    files: [tsConfigFile],
  } = tsConfig;

  const typesEntryPoint = path.resolve(cwd, determineInput(tsConfig));
  const typesSourceDir = typesEntryPoint.replace(/(.*)(?:\/|\\).*/, '$1');
  const entryFile = typesEntryPoint.replace(/.*(?:\/|\\)(.*?)\..*/, '$1.d.ts');
  const typesDestDir = path.resolve(cwd, typesDeclFilePath.replace(/(.*(?:\/|\\)).*/, '$1'));

  importGraphAnalyze(typesSourceDir, entryFile)
    .then((files) => copyFiles(typesSourceDir, typesDestDir, files))
    .then(() =>
      fs.rename(
        path.resolve(typesDestDir, tsConfigFile.replace(/.*(?:\/|\\)(.*)\..*/, '$1.d.ts')),
        path.resolve(typesDestDir, typesDeclFilePath.replace(/.*(?:\/|\\)(.*)/, '$1')),
        (renameErr) => {
          if (renameErr) {
            throw renameErr;
          }
        }
      )
    );
}

proceedTypeDeclarations();
