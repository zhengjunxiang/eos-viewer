import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {},
  mutations: {},
  actions: {
    async chainGetInfo ({ commit, rootGetters }, data) {
      const res = await (() => API.get(apiHost[rootGetters.apiHost]+'/v1/chain/get_info'))()
      return res.data;
    },
    async marketPrice ({ commit }, data) {
      const res = await (() => API.get('https://api.coinmarketcap.com/v2/ticker/1765/'))()
      return res.data;
    },
    async getProducers ({ commit, rootGetters }, {limit}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_producers',
        {'json': true, 'limit': limit || 100})
      )()
      return res.data;
    },
    async getTableRows ({ commit, rootGetters }, {scope = "eosio", table, limit = 1}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_table_rows',
        {"json": true, "code": "eosio", scope, table, limit})
      )()
      return res.data;
    },
    async getCurrencyStats ({ commit, rootGetters }) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_currency_stats',
        {"code": "eosio.token", "symbol": "EOS"})
      )()
      return res.data;
    }
  },
  getters: {}
};
