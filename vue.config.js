// eslint-disable-next-line @typescript-eslint/no-var-requires
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  lintOnSave: false,
  css: { extract: { ignoreOrder: true } },
  transpileDependencies: ['vuetify'],

  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({ patterns: [{ from: './src/assets', to: 'assets' }] }),
    ],
  },
};
