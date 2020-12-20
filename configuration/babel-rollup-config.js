const basePluginTransforRuntimeSettings = {
  corejs: false,
  helpers: true,
  // eslint-disable-next-line global-require
  version: require('@babel/runtime/package.json').version,
  regenerator: true,
};

const esmAndCjsBasePreset = {
  comments: false,
  babelHelpers: 'runtime',
  presets: [['@babel/preset-env', { exclude: ['transform-typeof-symbol'] }]],
};

export const esmPreset = {
  ...esmAndCjsBasePreset,
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      { ...basePluginTransforRuntimeSettings, useESModules: true },
    ],
  ],
};

export const cjsPreset = {
  ...esmAndCjsBasePreset,
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      { ...basePluginTransforRuntimeSettings, useESModules: false },
    ],
  ],
};

export const umdPreset = {
  comments: false,
  babelHelpers: 'bundled',
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['>0.2%', 'not dead', 'not op_mini all'],
        modules: false,
        exclude: ['transform-typeof-symbol'],
      },
    ],
  ],
};
