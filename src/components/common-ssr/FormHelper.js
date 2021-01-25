/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import common from './common.js'

let customListPageHelper = {};
try {
  const schemeHelper = '../../../../crypto/cryptoApiHelper';//process.env.schemeHelper;
  // console.log(9, {schemeHelper}, __dirname)
  customListPageHelper = require('../../../../crypto/cryptoApiHelper').default || {};
  // console.log(7, {schemeHelper});
} catch (e) {
  console.error(8, {e})
  customListPageHelper = require(`./strapi`).default || {};
}

export default {
  mixins: [common, customListPageHelper],
  // alernative
  mounted() {
    let name = _.get(this, 'api', undefined);
    this.loadData();
  }
}
