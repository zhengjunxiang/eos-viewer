import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {
    systemAccount: [
      'eosio.ram', 'eosio.ramfee', 'eosio.stake', 'eosio.token', 'eosio.saving',
      'eosio.names', 'eosio.vpay', 'eosio.bpay', 'eosio.msig'
    ]
  },
  mutations: {},
  actions: {
    async getAccount ({ commit, rootGetters }, {account}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_account',
        {'account_name': account}
      ))()
      return res.data;
    },
    async getCurrencyBalance ({ commit, rootGetters }, {account}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_currency_balance',
        {"code": "eosio.token", account, "symbol": "EOS"}
      ))()
      return res.data;
    },
    async getAccountToken ({ commit, rootGetters }, {code, account, symbol}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_currency_balance',
        {code, account, symbol}
      ))()
      return res.data;
    },
    async getHistoryActions ({ commit, rootGetters }, {account, offset}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/history/get_actions',
        {"account_name": account, "pos": -1, offset}
      ))()
      return res.data;
    }
  },
  getters: {
    systemAccount: state => state.systemAccount
  }
};
