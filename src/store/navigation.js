export default {
  namespaced: true,
  state: () => ({
    meta: null,
    siteTitle: '',
    title: null,
    loading: true,
    description: null,
    path: null,
    drawer: false,
    dialog: false,
    isMobile: false
  }),
  mutations: {
    updateLoading(state, val) {
      state.loading = !!val;
    },
    setDrawer(state, val) {
      state.drawer = val
    }, setDialog(state, val) {
      state.dialog = val
    }, setMeta(state, items) {
      state.meta = items
    },
    pushMeta(state, items) {
      state.meta.push(items)
    },
    setTitle(state, title) {
      state.title = title
    },
    setDescription(state, val) {
      state.description = val
    },
    setPath(state, data) {
      state.path = data
    }
  }
}
