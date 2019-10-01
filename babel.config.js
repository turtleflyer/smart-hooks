module.exports = {
  presets: ['@babel/preset-env', '@babel/preset-react', '@babel/typescript'],
  env: {
    test: {
      plugins: ['@babel/plugin-transform-runtime'],
    },
  },
};
