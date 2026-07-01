const env = process.env.NODE_ENV || 'development';
if (env === 'production') {
  module.exports = require('./webpack/webpack.production');
} else {
  module.exports = require('./webpack/webpack.development');
}
