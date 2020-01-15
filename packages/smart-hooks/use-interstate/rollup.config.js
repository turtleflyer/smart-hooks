/* eslint-disable import/no-extraneous-dependencies */
import babel from 'rollup-plugin-babel';
import bundleTypesDeclaration from '../../../bundleTypesDeclaration';
import pkg from './package.json';
import tsbundle from './tsbundle.json';
import determineInput from '../../../determineInput';

const input = determineInput(tsbundle);
const name = 'useInterstate';

export default {
  input,

  external: ['react'],

  plugins: [
    babel({ extensions: ['.js'] }),
    bundleTypesDeclaration(input, pkg.types),
  ],

  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
    {
      file: pkg.browser,
      format: 'iife',
      name,

      globals: {
        react: 'React',
      },
    },
  ],
};
