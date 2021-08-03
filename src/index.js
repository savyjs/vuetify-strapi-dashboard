import webpack from "webpack";

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

  try {
    let listOfFiles = getFiles(path.resolve(__dirname, './components'));

    let options = {
      rtl: false,
      i18n: true,
      builder: {
        form: '/forms',
        group: '/groups',
        element: '/elements',
        record: '/records',
      },
      crm: {
        home: '/crm',
        support: '/crm/ticket/new',
        menu: {}
      },
      notification: {
        show: false,
        url: null
      },
      apiListHelper: {},
      apiShowHelper: {},
      apiFormHelper: {},
      config: {}, // config of vsd
      settings: {}, // fields in setting page
      menu: {},
      validations: {},
      ...moduleOptions
    }

    if (_.get(options, 'axios', true)) {
      let axiosOptions = _.get(this, 'nuxt.options.axios', {});
      this.addModule({
        src: "@nuxtjs/axios",
        options: {
          ...axiosOptions
        }
      });
    }

    let baseURL = _.get(this, 'nuxt.options.axios.baseURL', _.get(process, 'env.API_URL', ''));
    options.API_URL = baseURL;

    this.addPlugin({
      fileName: 'options.js',
      src: path.resolve(__dirname, 'options.js'),
      options
    })

    for (const componentName of listOfFiles) {
      let pName = 'components/' + componentName;
      this.addTemplate({
        fileName: pName,
        src: path.resolve(__dirname, pName),
        options
      })
    }

    if (_.get(options, 'sweetalert', true)) {
      this.addModule({
        src: "nuxt-sweetalert2"
      });
    }

    if (_.get(options, 'socket', false)) {
      let io = _.get(this, 'nuxt.options.io', {});
      this.addModule({
        src: "nuxt-socket-io",
        options: {
          ...io
        }
      });
    }

    this.nuxt.options.store = true;
    if (_.get(options, 'i18n', true)) {
      let i18nOption = _.get(this, 'nuxt.options.i18n', {});
      let i18nOptionLocales = _.get(this, 'nuxt.options.i18n.locales', {});
      this.addModule({
        src: "nuxt-i18n",
        options: {
          vueI18nLoader: true,
          defaultLocale: _.get(moduleOptions, 'lang', 'en'),
          ...i18nOption
        }
      });
    }

    if (_.get(options, 'auth', true)) {
      let authOptions = _.get(this, 'nuxt.options.auth', {});
      this.addModule({
        src: "@nuxtjs/auth",
        options: {
          ...authOptions
        }
      });
    }

    if (_.get(options, 'strapi', true)) {
      let strapiOptions = _.get(this, 'nuxt.options.strapi', {});
      this.addModule({
        src: "@nuxtjs/strapi",
        options: {
          ...strapiOptions
        }
      });
    }

    this.addTemplate({
      fileName: 'components/component-vsd.js',
      src: path.resolve(__dirname, 'components/component-vsd.js'),
      options
    })


    this.addTemplate({
      fileName: 'assets/vsd.png',
      src: path.resolve(__dirname, 'assets/vsd.png')
    })

    this.addTemplate({
      fileName: 'assets/avatar.png',
      src: path.resolve(__dirname, 'assets/avatar.png')
    })

    this.addTemplate({
      fileName: 'assets/styles.css',
      src: path.resolve(__dirname, 'assets/styles.css')
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
      fileName: 'VsdPlugin.js',
      src: path.resolve(__dirname, 'VsdPlugin.js'),
      options
    })

    this.addLayout({
      name: "vsd",
      src: path.resolve(__dirname, 'layout/vsd.vue'),
    })

    this.addLayout({
      name: "vsdAuth",
      src: path.resolve(__dirname, 'layout/vsdAuth.vue'),
    })

    this.addLayout({
      name: "vsdCrm",
      src: path.resolve(__dirname, 'layout/vsdCrm.vue'),
    })

  } catch (e) {
    console.error({e})
  }
}

module.exports.meta = require('../package.json')
