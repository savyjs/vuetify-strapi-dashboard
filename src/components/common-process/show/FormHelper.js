/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import config from './config.js'
import common from './common.js'
import options from './../../../options'

let strapi = require(`./strapi`).default || {};
let customListPageHelper = {};
try {
  customListPageHelper = options.apiFormHelper;
} catch (e) {
  console.error({e})
}

export default {
  mixins: [config, common, strapi, customListPageHelper],
  // alernative
}
