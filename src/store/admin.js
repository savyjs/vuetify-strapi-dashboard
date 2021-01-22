const Cookie = process.client ? require('js-cookie') : undefined

export const state = () => {
  return {
    profile: null,
    jwt: null,
  }
}

export const mutations = {
  updateProfile(state, data) {
    state.profile = data;
  },
  updateToken(state, data) {
    state.jwt = data;
  }
}


export const actions = {
  logout: function ({commit}) {
    if (Cookie) Cookie.remove('jwt');
    commit("updateToken", null)
    commit("updateProfile", null)
  },
  getProfile: function ({commit}, axios) {
    if (Cookie && Cookie.get("jwt")) {
      let accessToken = (Cookie.get("jwt")).replace('"', '').replace('"', '');
      axios.setHeader("Authorization", `Bearer ${accessToken}`)
      axios.$get('users/me').then(res => {
        commit('updateProfile', res)
      }).catch(err => {
      })
    }
  },
  updateAuth: function ({req, commit}) {
    let accessToken = null
    if (req.headers.cookie) {
      let parsed = cookieparser.parse(req.headers.cookie)
      if (parsed.jwt) {
        accessToken = parsed.jwt
        commit("updateToken", accessToken)
      }
    }
  }
}
