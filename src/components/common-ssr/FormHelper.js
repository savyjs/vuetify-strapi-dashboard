/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import common from './common.js'

let envModule = {};
try {
  const envName = process.env.envName;
  envModule = require(`./${envName}`).default || {};
} catch (e) {
  envModule = require(`./strapi`).default || {};
}

export default {
  mixins: [common, envModule],
  // alernative
  mounted() {
    let name = _.get(this, 'api', undefined);
    this.loadData();
  }
}
