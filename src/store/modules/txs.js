import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {},
  mutations: {},
  actions: {
    async getTransaction ({ commit, rootGetters }, {id}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/history/get_transaction',
        {id}
      ))()
      return res.data;
    },
  },
  getters: {}
};
