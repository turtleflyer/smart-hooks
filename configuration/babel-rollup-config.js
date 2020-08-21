export const baseConfig = { extensions: ['.js'], comments: false, babelHelpers: 'bundled' };

export const cjsPreset = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['last 1 chrome version', 'last 1 firefox version', 'last 1 safari version'],
        modules: false,
      },
    ],
  ],
};

export const umdPreset = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['>0.2%', 'not dead', 'not op_mini all'],
        modules: false,
      },
    ],
  ],
};

export const optInRuntime = {
  babelHelpers: 'runtime',
  plugins: ['@babel/plugin-transform-runtime'],
};
