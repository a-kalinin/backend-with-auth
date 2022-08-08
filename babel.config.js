'use strict'
module.exports = function(api) {
  return {
    env: {
      test: {
        presets: [
          ['@babel/preset-env', {targets: {node: 'current'}}],
          '@babel/preset-typescript',
        ],
        plugins: ["@babel/plugin-transform-modules-commonjs"]
      }
    }
  }
}
