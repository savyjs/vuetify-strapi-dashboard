export const state = () => {
  return {
    server: {},
    roles: [],
    categories: [],
    markets: [],
    currencies: [],
    marketInitiated: false,
    categoriesInitiated: false,
    rolesInitiated: false,
    servers: {},
    currenciesInitiated: false,
  }
}

export const mutations = {
  updateRoles(state, data) {
    let roles = _.cloneDeep(_.get(data, 'roles', []));
    _.forEach(roles, (item) => {
      state.roles.push({value: item.id, text: item.name})
    })
  }, updateServer(state, {res, field}) {
    state.server[field.value] = [];
    _.forEach(res, (item) => {
      state.server[field.value].push({
        value: _.get(item, field.meta.value, '-'),
        text: _.get(item, field.meta.text, '-')
      })
    })
  },
  updateCategories(state, data) {
    _.forEach(data, (item) => {
      state.categories.push({value: item.id, text: item.title})
    })
  },
  updateMarkets(state, data) {
    _.forEach(data.res, (item) => {
      //console.log({item})
      state.markets.push({value: item.id, text: item.name})
    })
  },
  updateCurrencies(state, data) {
    _.forEach(data.res, (item) => {
      //console.log({item})
      state.currencies.push({value: item.id, text: item.name_fa})
    })
  }
}

export const actions = {
  roles: function ({commit}) {
    if (!state.rolesInitiated) {
      this.$axios.$get('users-permissions/roles').then(res => {
        commit('updateRoles', res)
      }).catch(err => {
        console.log({err})
        state.rolesInitiated = false;
      })
      state.rolesInitiated = true;
    }
  },
  categories: function ({commit}) {
    if (!state.rolesInitiated) {
      this.$axios.$get('categories').then(res => {
        commit('updateCategories', res)
      }).catch(err => {
        console.log({err})
        state.categoriesInitiated = false;
      })
      state.categoriesInitiated = true;
    }
  },
  server: function ({commit}, field) {
    if (!_.has(state.server[field.server]) || !state.server[field.server]) {
      this.$axios.$get(field.server).then(res => {
        commit('updateServer', {res, field});
      }).catch(err => {
        console.log({err})
        state.server[field.server] = false;
      })
      state.server[field.server] = true;
    }
  },
  markets: function ({commit, state}, field) {
    if (!state.marketInitiated) {
      this.$axios.$post('/proxies/markets').then(res => {
        //console.log({res}, field.server)
        commit('updateMarkets', {res: _.get(res, 'data', res), field});
      }).catch(err => {
        state.marketInitiated = false;
      })
      state.marketInitiated = true;
    }
  },
  currencies: function ({commit, state}, field) {
    if (!state.currenciesInitiated) {
      this.$axios.$post('/proxies/currencies').then(res => {
        //console.log({res}, field.server)
        commit('updateCurrencies', {res: _.get(res, 'data', res), field});
      }).catch(err => {
        state.currenciesInitiated = false;
      })
      state.currenciesInitiated = true;
    }
  }
}
