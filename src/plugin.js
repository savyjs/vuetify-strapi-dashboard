import Vue from 'vue'
import JsonExcel from "vue-json-excel";
import Helper from './assets/helper'
import CommonStore from './store/common'
import Navigation from './store/navigation'
import CommonSelectStore from './store/commonSelect'
import * as components from "./components/index";

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import 'material-design-icons-iconfont/dist/material-design-icons.css' // Ensure you are using css-loader
//import '@fontawesome/fontawesome-free/css/all.css'
// import 'font-awesome/css/font-awesome.min.css';
import 'material-icons/iconfont/material-icons.css';

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
      Vue.set(Vue.prototype, '$Helper', Helper);
      for (const componentName in components.default) {
        let component = components.default[componentName]
        console.log({componentName})
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

  inject('$Helper', Helper)
  ctx.$Helper = Helper

  try {
    ctx.store.registerModule('navigation', Navigation)
    ctx.store.registerModule('common', CommonStore)
    ctx.store.registerModule('commonSelect', CommonSelectStore)
  } catch (e) {
    console.error({e}, 'error on loading strore')
  }

  // Vue.use(ComponentLibrary)
  ComponentLibrary.install(Vue);
}

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.use(ComponentLibrary)
}
