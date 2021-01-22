import Helper from './assets/helper'
import Vue from 'vue'

import * as components from "./components";

for (let component of components) {
    Vue.component(component);
}

// Vue.component('CommonTypesShow', CommonTypesShow);

export default function (ctx, inject) {
    // Options
    // Inject it to nuxt context
    inject('$Helper', Helper)
    ctx.$Helper = Helper
}
