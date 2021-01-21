
/**
 * DO OT CHANGE THIS FILE!
 * For better understanding of this architecture, look at './strapi.js'
 * this file just act like a router!
 * @type {{head: {}, data: {}, getCommonMounted(), getMethods: {}, getCommonComputed: {}}}
 */
import common from './common.js'

const envName = process.env.envName;
let envModule = {};
try {
  envModule = require(`./${envName}`).default || {};
} catch (e) {
  envModule = require(`components/admin/core/common-ssr/strapi`).default || {};
}

let apiHelper = {
  getMethods: {},
  head: {},
  data: {},
  getCommonComputed: {},
  getCommonMounted() {
  },
  ...envModule
};
export default {
  ...common,
  ...apiHelper,
  head: {
    ...common.head,
    ...apiHelper.head,
  },
  data: {
    ...common.data,
    search: '',
    report: null,
    filter: {},
    ...apiHelper.data,
  },
  // alernative
  computed: {
    ...common.getCommonComputed,
    ...apiHelper.getCommonComputed,
  },
  mounted() {
    let name = _.get(this, 'api', undefined);
    common.getCommonMounted();
    apiHelper.getCommonMounted();
    this.loadData();
  },
  methods: {
    ...common.getMethods,
    ...apiHelper.getMethods,
  }

}
