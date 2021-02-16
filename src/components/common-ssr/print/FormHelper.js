/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import common from './common.js'
import options from './../../../options'

let strapi = require(`./strapi`).default || {};
let customListPageHelper = {};
try {
  customListPageHelper = options.apiPrintHelper;
} catch (e) {
  console.error({e})
}
export default {
  mixins: [common, strapi, customListPageHelper],
  // alernative
}
