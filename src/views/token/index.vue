<template>
  <div id="token">
    <Card style="margin-top: 30px;">
      <h2>EOS Tokens</h2>
      <div class="table-box">
        <Table size="small" :columns="columns($root)" :data="tokenList" :loading="isLoading" />
      </div>
    </Card>
  </div>
</template>
<script>
import columns from './columns'
import {mapGetters} from 'vuex'
export default {
  name: "token",
  data: () => ({
    columns: columns(this), isLoading: false, tokenList: []
  }),
  computed: {
    ...mapGetters(['tickerApi', 'apiHost'])
  },
  mounted() { this.init() },
  watch: {
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  methods: {
    resetData() { this.tokenList = [] },
    async init() {
      this.isLoading = true;
      const res = await this.$store.dispatch('getToken'), arrApi = [];
      res.forEach(item => {
        arrApi.push(this.$store.dispatch('getTokenStats', {"code": item.account, "symbol": item.symbol}))
      })
      Promise.all(arrApi).then(arr => {
        res.forEach((item, ind) => {
          if (arr[ind][item.symbol]) item.supply = arr[ind][item.symbol].supply
        });
        Promise.all(this.tickerApi.map(url => this.$store.dispatch('getTokenTicker', {url}))).then(async tickers => {
          try {
            const eos_P_res = await this.$store.dispatch('marketPrice');
            const eos_P = eos_P_res.data.quotes.USD.price;
            this.isLoading = false;
            tickers.forEach(t => {
              res.forEach(item => {
                if (item.name === t.data.name || item.symbol === t.data.symbol) {
                  item.priceUSD = t.data.quotes.USD.price;
                  item.marketPrice = t.data.quotes.USD.price * parseInt(item.supply);
                  item.priceEOS = this.$U.fNum(t.data.quotes.USD.price / eos_P, 4);
                }
              })
            })
            if (res) this.tokenList = res.sort((i, j) => (j.marketPrice || 0) - (i.marketPrice || 0));
          } catch (err) { this.isLoading = false }
        }, () => { this.isLoading = false })
      }, () => { this.isLoading = false })
    }
  }
}
</script>
<style lang="less" scoped>
</style>
