/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import common from './common.js'

let strapi = require(`./strapi`).default || {};
let customListPageHelper = {};
try {
  const options = require('./../../../options')
  customListPageHelper = options.default.apiPrintHelper;
} catch (e) {
  // console.error({e})
}
export default {
  mixins: [common, strapi, customListPageHelper],
  // alernative
}
