module.exports = {
  presets: [
    '@babel/typescript',
    [
      '@babel/env',
      {
        targets: {
          browsers: ['last 2 versions', 'safari >= 7'],
        },
        modules: false,
      },
    ],
  ],
};
