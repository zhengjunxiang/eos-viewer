import API from 'src/api/axios';
import {apiHost} from 'src/libs/config';

export default {
  state: {},
  mutations: {},
  actions: {
    async getBlock ({ commit, rootGetters }, {block}) {
      const res = await (
        () => API.post(apiHost[rootGetters.apiHost]+'/v1/chain/get_block',
        {'block_num_or_id': block}
      ))()
      return res.data;
    },
  },
  getters: {}
};
