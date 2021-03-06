import _ from 'lodash'
export default {
  namespaced: true,
  state: () => {
    return {
      server: {},
      serverStatuses: {},
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
  },
  mutations: {
    updateRoles(state, data) {
      let roles = _.cloneDeep(_.get(data, 'roles', []));
      _.forEach(roles, (item) => {
        state.roles.push({value: item.id, text: item.name})
      })
    },
    updateServer(state, {res, field}) {
      state.server[field.server] = [];
      _.forEach(res, (item) => {
        state.server[field.server].push({
          value: _.get(item, _.get(field, 'meta.value', 'id'), '-'),
          text: _.get(item, _.get(field, 'meta.text', 'name'), '-')
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
    },
    setCurrenciesInitiated(state, data) {
      state.currenciesInitiated = data
    },
    setRolesInitiated(state, data) {
      state.rolesInitiated = data
    },
    setCategoriesInitiated(state, data) {
      state.categoriesInitiated = data
    },
    setMarketInitiated(state, data) {
      state.marketInitiated = data
    }
  },
  actions: {
    roles: function ({commit, state}) {
      if (!state.rolesInitiated) {
        this.$axios.$get('users-permissions/roles').then(res => {
          commit('updateRoles', res)
        }).catch(err => {
          console.log({err})
          commit('setRolesInitiated', false);
        })
        commit('setRolesInitiated', true);
      }
    },
    categories: function ({commit, state}) {
      if (!state.categoriesInitiated) {
        this.$axios.$get('categories').then(res => {
          commit('updateCategories', res)
        }).catch(err => {
          console.log({err})
          commit('setCategoriesInitiated', false);
        })
        commit('setCategoriesInitiated', true);
      }
    },
    server: function ({commit, state}, field) {
      if (!_.has(state.serverStatuses[field.server]) || !state.serverStatuses[field.server]) {
        this.$axios.$get(field.server).then(res => {
          commit('updateServer', {res, field});
        }).catch(err => {
          console.log({err})
          state.serverStatuses[field.server] = false;
        })
        state.serverStatuses[field.server] = true;
      }
    },
    markets: function ({commit, state}, field) {
      if (!state.marketInitiated) {
        this.$axios.$post('/proxies/markets').then(res => {
          //console.log({res}, field.server)
          commit('updateMarkets', {res: _.get(res, 'data', res), field});
        }).catch(err => {
          commit('setMarketInitiated', false);
        })
        commit('setMarketInitiated', true);
      }
    },
    currencies: function ({commit, state}, field) {
      if (!state.currenciesInitiated) {
        this.$axios.$post('/proxies/currencies').then(res => {
          //console.log({res}, field.server)
          commit('updateCurrencies', {res: _.get(res, 'data', res), field});
        }).catch(err => {
          commit('setCurrenciesInitiated', false);
        })
        commit('setCurrenciesInitiated', true);
      }
    }
  }
}
