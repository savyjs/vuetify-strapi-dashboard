import path from 'path'

export default function VuetifyStrapiDashboardModule(moduleOptions) {
  // Register `plugin.js` template
  try {
    this.addPlugin(path.resolve(__dirname, 'plugin.js'))
  } catch (e) {
    console.error({e})
  }
}

module.exports.meta = require('../package.json')
