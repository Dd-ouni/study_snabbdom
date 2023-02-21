const path = require('path');

module.exports = {
  mode: 'development',
  entry:path.join(__dirname,"./src/index.js"),
  output: {
    path:path.join(__dirname,"./dist"),
    filename: 'bundle.js',
  },
  devServer: {
    port: 8080,
    hot: true,
    static: {
      directory: path.join(__dirname, 'www'),
    },
  }
};