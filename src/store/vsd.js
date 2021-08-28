export default {
  namespaced: true,
  state: () => {
    return {
      printFormData: {},
      nightMode: null,
    }
  },
  mutations: {
    setNightMode(state, {status = null, $vuetify, $auth}) {
      $vuetify.theme.dark = state.nightMode = (status == null ? state.nightMode = !state.nightMode : (state.nightMode = !!status));
      $auth.$storage.setUniversal('nightMode', !!state.nightMode)
    }
  },
  actions: {}
}
