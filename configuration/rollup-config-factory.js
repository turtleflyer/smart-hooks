/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import * as BabelRollupConfig from './babel-rollup-config';

function resolveBabelConfig({ babelConfig }) {
  return babelConfig.reduce((acc, conf) => ({ ...acc, ...BabelRollupConfig[conf] }), {});
}

function resolveExternal(baseArr, possibleUndefined) {
  return [...baseArr, ...(possibleUndefined.external || [])];
}

export function rollupConfigFactory(options) {
  const defOptions = {
    cjs: { babelConfig: ['baseConfig', 'cjsPreset'] },
    umd: { babelConfig: ['baseConfig', 'umdPreset'] },
  };
  const { cjs: cjsOptions, umd: umdOptions } = ['cjs', 'umd'].reduce(
    (acc, prop) =>
      options && options[prop] && options[prop].disable
        ? acc
        : { ...acc, [prop]: { ...defOptions[prop], ...options[prop] } },
    {}
  );
  const pkg = require('./package.json');
  const tsconfigBundle = require('./tsconfig.bundle.json');
  const determineInput = require('../../../bundle_utilities/determineInput');
  const input = determineInput(tsconfigBundle);

  return [
    cjsOptions
      ? {
          input,

          external: resolveExternal(['react', /^@babel\/runtime/], cjsOptions),

          plugins: [babel(resolveBabelConfig(cjsOptions))],

          output: [
            {
              file: pkg.main,
              format: 'cjs',
            },
            {
              file: pkg.module,
              format: 'es',
            },
          ],
        }
      : null,
    umdOptions
      ? {
          input,

          external: resolveExternal(['react'], umdOptions),

          plugins: [babel(resolveBabelConfig(umdOptions)), resolve(), commonjs(), terser()],

          output: [
            {
              file: pkg.unpkg,
              format: 'umd',
              name: umdOptions.name,

              globals: {
                react: 'React',
              },
            },
          ],
        }
      : null,
  ].filter((c) => c !== null);
}
