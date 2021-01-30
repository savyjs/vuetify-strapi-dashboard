import Vue from 'vue'
import JsonExcel from "vue-json-excel";
import Helper from 'vuetify-strapi-dashboard/src/assets/helper'
import CommonStore from 'vuetify-strapi-dashboard/src/store/common'
import CommonSelectStore from 'vuetify-strapi-dashboard/src/store/commonSelect'
import * as components from "vuetify-strapi-dashboard/src/components/index";
// const moduleOptions = <%= JSON.stringify(options) %>;
// const mixins = require(`${moduleOptions.scheme}`).default || [];
let CONSTANTS, MENU;
try {
  CONSTANTS = require('~/assets/js/constants').default;
  MENU = require('~/assets/js/menu').default;
} catch (e) {
  console.warn('please register valid menu and constants options')
}

const ComponentLibrary = {
  install(Vue, options = {}) {
    // console.log(2, {options})
    try {
      Vue.component("downloadExcel", JsonExcel);
      Vue.set(Vue.prototype, 'Helper', Helper);
      // Vue.set(Vue.prototype, '$Helper', Helper);
      for (const componentName in components.default) {
        let component = components.default[componentName]
        // console.log({component, componentName})
        try {
          Vue.component(componentName, component);
        } catch (e) {
          console.error({componentName, e})
        }
      }
    } catch (e) {
      console.error({e})
    }
  }
}

export default function (ctx, inject) {
  // Options
  // Inject it to nuxt context
  // components

  let vsd = {
    helper: Helper,
    menu: MENU,
    constants: CONSTANTS,
  }

  inject('vsd', vsd)
  inject('$vsd', vsd)
  ctx.vsd = vsd;
  ctx.$vsd = vsd;

  inject('Helper', Helper)
  inject('$Helper', Helper)
  ctx.Helper = Helper
  ctx.$Helper = Helper

  ctx.store.registerModule('common', CommonStore)
  ctx.store.registerModule('commonSelect', CommonSelectStore)

  // Vue.use(ComponentLibrary)
  ComponentLibrary.install(Vue);
}


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}
