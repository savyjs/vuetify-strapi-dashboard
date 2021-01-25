import Vue from 'vue'
import JsonExcel from "vue-json-excel";
import * as components from "~/modules/core/src/components/index";
import Helper from '~/modules/core/src/assets/helper'

try {

  Vue.set(Vue.prototype, 'Helper', Helper);
  Vue.component("downloadExcel", JsonExcel);

  // Vue.set(Vue.prototype, '$Helper', Helper);
  for (const componentName in components.default) {
    let component = components.default[componentName]
    // console.log({component, componentName})
    try {
      Vue.component(componentName, component);
      console.log('registerd: ' + componentName)
    } catch (e) {
      console.error({componentName, e})
    }
  }
} catch (e) {
  console.error({e})
}
