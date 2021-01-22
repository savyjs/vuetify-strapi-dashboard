import Helper from '~/modules/core/src/assets/helper'
import Vue from 'vue'
import JsonExcel from "vue-json-excel";

import AdminStore from '~/modules/core/src/store/admin'
import CommonStore from '~/modules/core/src/store/common'
import CommonSelectStore from '~/modules/core/src/store/commonSelect'


import * as components from "~/modules/core/src/components/index";
// Vue.component('CommonTypesShow', CommonTypesShow);
const ComponentLibrary = {
  install(Vue, options = {}) {

    Vue.component("downloadExcel", JsonExcel);

    Vue.set(Vue.prototype, 'Helper', Helper);
    //Vue.set(Vue.prototype, '$Helper', Helper);
    try {
      for (const componentName in components.default) {
        const component = components.default[componentName]
        // console.log({component, componentName})
        Vue.component(componentName, component)
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

  inject('Helper', Helper)
  inject('$Helper', Helper)
  ctx.Helper = Helper
  ctx.$Helper = Helper
  ctx.store.registerModule('admin', AdminStore)
  ctx.store.registerModule('common', CommonStore)
  ctx.store.registerModule('commonSelect', CommonSelectStore)
  ComponentLibrary.install(Vue);

}


if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}
