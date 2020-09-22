export const baseConfig = { extensions: ['.js'], comments: false, babelHelpers: 'bundled' };

process.env.BABEL_ENV = 'production';
export const cjsPreset = {
  presets: ['react-app'],
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
