import path from 'path'

export default function VuetifyStrapiDashboardModule(moduleOptions) {
    // Register `plugin.js` template
  this.addPlugin(path.resolve(__dirname, 'plugin.js'))
}

module.exports.meta = require('../package.json')
