const fs = require('fs')
const path = require('path')
const _ = require('lodash')

const getFiles = path => {
  const files = []
  for (const file of fs.readdirSync(path)) {
    const fullPath = path + '/' + file
    if (fs.lstatSync(fullPath).isDirectory())
      getFiles(fullPath).forEach(x => files.push(file + '/' + x))
    else files.push(file)
  }
  return files
}

export default async function VuetifyStrapiDashboardModule(moduleOptions) {

  // Register `plugin.js` template
  // console.log({moduleOptions})
  try {
    let listOfFiles = getFiles(path.resolve(__dirname, './components'));

    const options = {
      ...moduleOptions
    }

    for (const componentName of listOfFiles) {
      let pName = 'components/' + componentName;
      this.addTemplate({
        fileName: pName,
        src: path.resolve(__dirname, pName),
        options
      })
      // console.log({pName})
    }

    this.addModule({
      src: "nuxt-sweetalert2"
    });
    this.addTemplate({
      fileName: 'components/index.js',
      src: path.resolve(__dirname, 'components/index.js'),
      options
    })

    this.addTemplate({
      fileName: 'assets/helper.js',
      src: path.resolve(__dirname, 'assets/helper.js'),
      options
    })

    this.addTemplate({
      fileName: 'store/common.js',
      src: path.resolve(__dirname, 'store/common.js'),
      options
    })

    this.addTemplate({
      fileName: 'store/navigation.js',
      src: path.resolve(__dirname, 'store/navigation.js'),
      options
    })

    this.addTemplate({
      fileName: 'store/commonSelect.js',
      src: path.resolve(__dirname, 'store/commonSelect.js'),
      options
    })

    this.addPlugin({
      src: path.resolve(__dirname, 'plugin.js'),
      options
    })

  } catch (e) {
    console.error({e})
  }
}

module.exports.meta = require('../package.json')
