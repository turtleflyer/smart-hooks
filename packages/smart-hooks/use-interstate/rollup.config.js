/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { uglify } from 'rollup-plugin-uglify';
import pkg from './package.json';
import tsconfigBundle from './tsconfig.bundle.json';
import { determineInput } from '../../../bundle_utilities/determineInput';
import { bundleTypesDeclaration } from '../../../bundle_utilities/bundleTypesDeclaration';

const name = 'useInterstate';
const input = determineInput(tsconfigBundle);
bundleTypesDeclaration(input, pkg.types);

export default [
  {
    input,

    external: ['react', '@smart-hooks/use-smart-memo'],

    plugins: [babel({ extensions: ['.js'] })],

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

    plugins: [babel({ extensions: ['.js'] }), resolve(), commonjs(), uglify()],

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
