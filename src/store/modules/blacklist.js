import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {},
  mutations: {},
  actions: {
    async getBlacklist ({ commit, rootGetters }) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_table_rows',
        {
          "json": true, "code": "theblacklist", "scope": "theblacklist",
          "table": "theblacklist", "table_key": "", "limit": 100
        }
      ))()
      return res.data;
    },
  },
  getters: {}
};
