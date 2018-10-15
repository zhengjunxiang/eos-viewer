import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {
    tickerApi: [
      'https://api.coinmarketcap.com/v2/ticker/2930/',
      'https://api.coinmarketcap.com/v2/ticker/1838/',
      'https://api.coinmarketcap.com/v2/ticker/2644/',
      'https://api.coinmarketcap.com/v2/ticker/3136/',
      'https://api.coinmarketcap.com/v2/ticker/3137/'
    ]
  },
  mutations: {},
  actions: {
    async getToken ({ commit }) {
      const res = await (() => API.get('https://raw.githubusercontent.com/eoscafe/eos-airdrops/master/tokens.json'))()
      return res.data;
    },
    async getTokenStats ({ commit, rootGetters }, {code, symbol}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_currency_stats',
        {code, symbol}
      ))()
      return res.data;
    },
    async getTokenTicker ({ commit }, {url}) {
      const res = await (() => API.get(url))()
      return res.data;
    },
  },
  getters: {
    tickerApi: state => state.tickerApi
  }
};
