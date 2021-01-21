// import necessary dependencies
import vue from 'rollup-plugin-vue'
import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.js', // entry file for our components
  plugins: {
    preVue: [
      replace({
        'process.env.NODE_ENV': JSON.stringify('production'),
      }),
      commonjs(), // add support for CommonJS modules
    ],
    vue: {
      css: true, // include CSS in the output
      template: {
        isProduction: true,
      },
    },
    postVue: [
      buble(), // use buble to transpile ES2015
    ],
  },
}