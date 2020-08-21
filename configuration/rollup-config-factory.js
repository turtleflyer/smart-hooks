/* eslint-disable global-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/no-extraneous-dependencies */
import babel from '@rollup/plugin-babel';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import { bundleTypesDeclaration } from '../bundle_utilities/bundleTypesDeclaration';
import { determineInput } from '../bundle_utilities/determineInput';
import * as BabelRollupConfig from './babel-rollup-config';

function resolveBabelConfig(configArray) {
  return configArray.reduce((acc, conf) => ({ ...acc, ...BabelRollupConfig[conf] }), {});
}

function resolveExternal(baseArr, possibleUndefined) {
  return [...baseArr, ...(possibleUndefined.external ? possibleUndefined.external : [])];
}

export function rollupConfigFactory(options) {
  const defOptions = {
    cjs: { config: ['baseConfig', 'cjsPreset', 'optInRuntime'] },
    umd: { config: ['baseConfig', 'umdPreset'] },
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
  const input = determineInput(tsconfigBundle);
  bundleTypesDeclaration(input, pkg.types);

  return [
    cjsOptions
      ? {
          input,

          external: resolveExternal(['react', /@babel\/runtime/], cjsOptions),

          plugins: [babel(resolveBabelConfig(cjsOptions.config))],

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

          plugins: [babel(resolveBabelConfig(umdOptions.config)), resolve(), commonjs(), terser()],

          output: [
            {
              file: pkg.browser,
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
