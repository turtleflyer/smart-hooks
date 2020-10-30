export const baseConfig = { comments: false, babelHelpers: 'bundled' };

process.env.BABEL_ENV = 'production';
export const cjsPreset = {
  babelHelpers: 'runtime',
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
