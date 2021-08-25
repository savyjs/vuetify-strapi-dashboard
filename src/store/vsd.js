export default {
  namespaced: true,
  state: () => {
    return {
      printFormData: {},
      nightMode: null,
    }
  },
  mutations: {
    setNightMode(state, {status = null, $vuetify}) {
      $vuetify.theme.dark = state.nightMode = (status == null ? state.nightMode = !state.nightMode : (state.nightMode = !!status));
    }
  },
  actions: {
    toggleNightMode: function ({commit}) {
      commit('updateNightMode');
    }
  }
}
