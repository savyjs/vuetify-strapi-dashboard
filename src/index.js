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


    this.addPlugin({
      fileName: 'options.js',
      src: path.resolve(__dirname, 'options.js'),
      options
    })

    // console.log(1, {options})
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

    this.addModule({
      src: "@nuxtjs/auth"
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
      fileName: 'plugin.js',
      src: path.resolve(__dirname, 'plugin.js'),
      options
    })

    this.addLayout({
      name: "admin",
      src: path.resolve(__dirname, 'layout/admin.vue'),
    })

    this.addLayout({
      name: "adminAuth",
      src: path.resolve(__dirname, 'layout/adminAuth.vue'),
    })

  } catch (e) {
    console.error({e})
  }
}

module.exports.meta = require('../package.json')
