module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          chrome: '49',
          firefox: '54.0',
          ie: '11',
        },
        modules: false,
      },
    ],
  ],

  comments: false,
};
