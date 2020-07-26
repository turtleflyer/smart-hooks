/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import { bundleTypesDeclaration } from '../../../bundle_utilities/bundleTypesDeclaration';
import { determineInput } from '../../../bundle_utilities/determineInput';
import pkg from './package.json';
import tsconfigBundle from './tsconfig.bundle.json';

const input = determineInput(tsconfigBundle);
bundleTypesDeclaration(input, pkg.types);

export default [
  {
    input,

    external: ['react'],

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
];
