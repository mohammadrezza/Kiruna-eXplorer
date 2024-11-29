const { alias } = require('react-app-rewired');
const path = require('path');

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    '@': path.resolve(__dirname, 'src'), // set alias for `@`
  };
  return config;
};
