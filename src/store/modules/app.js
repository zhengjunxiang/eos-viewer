import util from 'src/libs/util.js'

export default {
  state: {
    lan: 'en',
    isLoading: false,
    fetchingNum: 0,
    apiHost: '/'
  },
  mutations: {
    setLan(state, lan) { if (lan) state.lan = lan },
    setLoading(state, bool) {
      let num = state.fetchingNum, sum = 0;
      if (bool && num === 0) state.isLoading = true;
      if(bool) sum = num + 1;
      else sum = num - 1;
      state.fetchingNum = sum;
      if (sum === 0) state.isLoading = false;
    },
    setApiHost(state, host) { state.apiHost = host },
    async handleSearch(state, str) {
      const search = str.replace(/^\s+|\s+$|,/g, '');
      this.commit('setLoading', true);
      try {
        if (/^[0-9]*$/.test(search)) {
          await this.dispatch('getBlock', {block: search});
          vm.$router.push({ name: 'block', params: { block: search } });
        } else if (search.length > 60 && search.length <= 64 && /^[0-9a-fA-F]+$/.test(search)) {
          await this.dispatch('getTransaction', {id: search});
          vm.$router.push({ name: 'txs', params: { txs: search } });
        } else {
          await this.dispatch('getAccount', {account: search});
          vm.$router.push({ name: 'account', params: { account: search } });
        }
        this.commit('setLoading', false);
      } catch (err) { this.commit('setLoading', false) }
    }
  },
  getters: {
    lan: state => state.lan,
    isLoading: state => state.isLoading,
    apiHost: state => state.apiHost
  }
};
