import _ from 'lodash'
import Vue from 'vue'
import moduleOptions from './options'
import JsonExcel from "vue-json-excel";
import Helper from './assets/helper'
import CommonStore from './store/common'
import Navigation from './store/navigation'
import CommonSelectStore from './store/commonSelect'
import * as components from "./components/component-vsd";

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import './assets/styles.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
// import '@fontawesome/fontawesome-free/css/all.css'
import 'font-awesome/css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';
import wysiwyg from "vue-wysiwyg";

const t = (val) => _.isString(val) ? val.replace(/_/g, ' ') : val
const ComponentLibrary = {
  install(Vue, options = {}) {
    try {
      Vue.use(wysiwyg, {});
      Vue.component("downloadExcel", JsonExcel);
      Vue.set(Vue.prototype, '$Helper', Helper);
      Vue.set(Vue.prototype, 'vsd', moduleOptions);
      for (const componentName in components.default) {
        let component = components.default[componentName]
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


export default async (ctx, inject) => {

  inject('vsd', moduleOptions)
  ctx.vsd = moduleOptions

  inject('$Helper', Helper)
  ctx.$Helper = Helper

  try {
    ctx.store.registerModule('navigation', Navigation)
    ctx.store.registerModule('common', CommonStore)
    ctx.store.registerModule('commonSelect', CommonSelectStore)
  } catch (e) {
    console.error({e}, 'error on loading store files')
  }
  ComponentLibrary.install(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}
