/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import tsbundle from './tsbundle.json';
import { determineInput } from '../../../bundle_utilities/determineInput';
import { bundleTypesDeclaration } from '../../../bundle_utilities/bundleTypesDeclaration';

const name = 'useSmartRef';
const input = determineInput(tsbundle);
bundleTypesDeclaration(input, pkg.types);

export default [
  {
    input,

    external: ['react'],

    plugins: [babel({ extensions: ['.js'], exclude: 'node_modules/**' })],

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
  },
  {
    input,

    external: ['react'],

    plugins: [babel({ extensions: ['.js'] }), resolve(), commonjs()],

    output: [
      {
        file: pkg.browser,
        format: 'umd',
        name,

        globals: {
          react: 'React',
        },
      },
    ],
  },
];
