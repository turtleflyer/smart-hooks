module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/preset-env',
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
        modules: false,
      },
    ],
  ],
};
