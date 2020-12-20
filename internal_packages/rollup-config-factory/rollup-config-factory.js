/* eslint-disable import/no-dynamic-require */
const path = require('path');
const { babel } = require('@rollup/plugin-babel');
const commonjs = require('@rollup/plugin-commonjs');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const { terser } = require('rollup-plugin-terser');
const BabelRollupConfig = require('./babel-rollup-config');
const determineInput = require('../../bundle_utilities/determineInput');

const pkg = require(path.resolve(process.cwd(), './package.json'));
const tsconfigBundle = require(path.resolve(process.cwd(), './tsconfig.bundle.json'));

const input = determineInput(tsconfigBundle);

function resolveBabelConfig({ babelConfig }) {
  return babelConfig.reduce((acc, conf) => ({ ...acc, ...BabelRollupConfig[conf] }), {});
}

function resolveExternal(baseArr, possibleUndefined) {
  return [...baseArr, ...(possibleUndefined.external || [])];
}

module.exports = function rollupConfigFactory(options) {
  const defOptions = {
    esm: { babelConfig: ['esmPreset'] },
    cjs: { babelConfig: ['cjsPreset'] },
    umd: { babelConfig: ['umdPreset'] },
  };

  const { esm: esmOptions, cjs: cjsOptions, umd: umdOptions } = ['esm', 'cjs', 'umd'].reduce(
    (acc, prop) =>
      options && options[prop] && options[prop].disable
        ? acc
        : { ...acc, [prop]: { ...defOptions[prop], ...options[prop] } },
    {}
  );

  return [
    esmOptions
      ? {
          input,

          external: resolveExternal(['react', /^@babel\/runtime\/.*\/esm\//], esmOptions),

          plugins: [babel(resolveBabelConfig(esmOptions))],

          output: [{ file: pkg.module, format: 'es' }],
        }
      : null,

    cjsOptions
      ? {
          input,

          external: resolveExternal(['react', /^@babel\/runtime\/(?!.*\/esm\/)/], cjsOptions),

          plugins: [babel(resolveBabelConfig(cjsOptions))],

          output: [{ file: pkg.main, format: 'cjs' }],
        }
      : null,

    umdOptions
      ? {
          input,

          external: resolveExternal(['react'], umdOptions),

          plugins: [babel(resolveBabelConfig(umdOptions)), nodeResolve(), commonjs(), terser()],

          output: [
            { file: pkg.unpkg, format: 'umd', name: umdOptions.name, globals: { react: 'React' } },
          ],
        }
      : null,
  ].filter((c) => c !== null);
};
