import Helper from './assets/helper'

export default function (ctx, inject) {
    // Options
    // Inject it to nuxt context
    inject('$Helper', Helper)
    ctx.$Helper = Helper

}
