import path from 'path'
import _ from 'lodash'

export default async function VuetifyStrapiDashboardModule(moduleOptions) {
  // Register `plugin.js` template
  // console.log({moduleOptions})
  try {
    const options = {
      ...moduleOptions
    }
    // console.log(1, {options})
    process.env['schemeHelper'] = _.get(options, 'scheme', undefined)
    this.addPlugin({
      src: path.resolve(__dirname, 'plugin.js'),
      options
    })
  } catch (e) {
    console.error({e})
  }
}

module.exports.meta = require('../package.json')
