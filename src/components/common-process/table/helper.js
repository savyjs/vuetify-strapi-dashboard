import config from './config.js'
import common from './common.js'
import options from './../../../options'

let strapi = require(`./strapi`).default || {};
let customListPageHelper = {};
try {
  customListPageHelper = options.apiListHelper;
} catch (e) {
  // console.error({e})
}

export default {
  mixins: [config, common, strapi, customListPageHelper],
}
