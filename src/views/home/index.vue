<template>
  <div class="home">
    <Card class="bg-black">
      <Row class="info-box" type="flex" justify="center">
        <Col :md="4" :sm="8" :xs="12">
          <p class="info-num"><Icon type="logo-usd" v-if="eosPrice" class="info-text" /><span>{{eosPrice || '--'}}</span></p>
          <h3>EOS {{$t('home.price')}}</h3>
        </Col>
        <Col :md="4" :sm="8" :xs="12">
          <p class="info-num">
            <Icon type="logo-usd" v-if="marketCap" class="info-text" />{{marketCap || '--'}}<span v-if="marketCap">B</span>
          </p>
          <h3>{{$t('home.marketCap')}}</h3>
        </Col>
        <Col :md="5" :sm="8" :xs="12" class="hover">
          <p class="info-num">
            <span v-if="blockInfo.head_block_num">
              <router-link :to="{ name: 'block', params: { block: blockInfo.head_block_num}}">
                {{$U.fNum(blockInfo.head_block_num, 0)}}
              </router-link>
            </span>
            <span v-else>--</span>
          </p>
          <h3>{{$t('home.headBlock')}}</h3>
        </Col>
        <Col :md="5" :sm="12" :xs="12" class="hover">
          <p class="info-num">
            <span v-if="blockInfo.last_irreversible_block_num">
              <router-link :to="{ name: 'block', params: { block: blockInfo.last_irreversible_block_num}}">
                {{$U.fNum(blockInfo.last_irreversible_block_num, 0)}}
              </router-link>
            </span>
            <span v-else>--</span>
          </p>
          <h3>{{$t('home.irrBlocks')}}</h3>
        </Col>
        <Col :md="6" :sm="12" :xs="24" class="hover">
          <p class="info-num">
            <span v-if="blockInfo.head_block_producer">
              <router-link :to="{ name: 'account', params: { account: blockInfo.head_block_producer}}">
                {{blockInfo.head_block_producer}}
              </router-link>
            </span>
            <span v-else>--</span>
          <h3>{{$t('home.producer')}}</h3>
        </Col>
      </Row>
    </Card>
    <Card class="padding0">
      <Row class="info-box" type="flex" justify="center">
        <Col :md="8" :sm="12" :xs="24">
          <p class="info-num">{{ramPrice || '--'}} <span style="font-size: 20px;" v-if="ramPrice"  class="info-text">EOS/KB</span></p>
          <h3>RAM {{$t('home.price')}}</h3>

          <div class="conversion-box">
            <h3 style="text-align: center;">RAM</h3>
            <Input v-model="ramkb" size="large" @on-change="handleChangeV('ramkb')"><span slot="append">KB</span></Input>
            <Icon type="ios-repeat" size="24" />
            <Input v-model="rameos" size="large" @on-change="handleChangeV('rameos')"><span slot="append">EOS</span></Input>
          </div>
        </Col>
        <Col :md="8" :sm="12" :xs="24">
          <p class="info-num">
            <span v-if="maxRamSize">{{totalRamBytesReserved}} / {{maxRamSize}}
              <span style="font-size: 20px;" class="info-text">GB ({{ramRate}})</span>
            </span>
            <span v-else>--</span>
          </p>
          <h3>RAM {{$t('home.oRate')}}</h3>

          <div class="conversion-box">
            <h3 style="text-align: center;">CPU</h3>
            <Input v-model="cpums" size="large" @on-change="handleChangeV('cpums')"><span slot="append">MS</span></Input>
            <Icon type="ios-repeat" size="24" />
            <Input v-model="cpueos" size="large" @on-change="handleChangeV('cpueos')"><span slot="append">EOS</span></Input>
          </div>
        </Col>
        <Col :md="8" :sm="12" :xs="24">
          <p class="info-num">
            <span v-if="totalActivatedStake">
              {{totalActivatedStake}}<span style="font-size: 20px;" class="info-text"> ({{internetVoting}}%)</span>
            </span>
            <span v-else>--</span>
          </p>
          <h3>{{$t('home.internetVoting')}}</h3>

          <div class="conversion-box">
            <h3 style="text-align: center;">NET</h3>
            <Input v-model="netkb" size="large" @on-change="handleChangeV('netkb')"><span slot="append">KB/D</span></Input>
            <Icon type="ios-repeat" size="24" />
            <Input v-model="neteos" size="large" @on-change="handleChangeV('neteos')"><span slot="append">EOS</span></Input>
          </div>
        </Col>
      </Row>
    </Card>
    <Card class="search-card">
      <h3><Icon type="md-search" />{{$t('home.searchT')}}</h3>
      <Input v-model="search" size="large" :placeholder="$t('header.search')" @on-enter="handleSearch" @on-click="handleSearch" />
    </Card>
    <Card >
      <h2 class="card-title">{{$t('home.blockProducers')}}</h2>
      <div class="table-box">
        <Table size="small" :columns="columns($root)" :data="producersList" :row-class-name="rowClassName" :loading="isLoading" />
        <div style="margin-top: 10px;">
          <p style="text-align: center;" v-show="!isLoading">
            -- <Button @click="handleMore" :disabled="!moreClick">{{$t('common.more')}}</Button> --
          </p>
          <p style="text-align: center;" v-show="isLoading">
            -- <Button :disabled="true">{{$t('common.loading')}}</Button> --
          </p>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import columns from './columns'
import {mapGetters} from 'vuex'
export default {
  name: 'home',
  data() {
    return {
      columns: columns(this), blockInfo: {}, producersList: [], timerChainInfo: null, timerMarket: null,
      limit: 100, page: 1, search: '', eosPrice: '', marketCap: '', ramPrice: '', ramRate: '', internetVoting: '',
      totalRamBytesReserved: '', maxRamSize: '', currencyStatsSupply: '', moreClick: true,
      totalVoteRows: '', totalVoteWeight: '', totalActivatedStake: '', isLoading: false,
      timerChainInfoFetching: false, marketPriceFetching: false, tableRowsMarketFetching: false,
      ramkb: '', rameos: '', cpums: '', cpueos: '', netkb: '', neteos: '',
      cpuPrice: '', netPrice: '', firstInto: true
    }
  },
  computed: {
    ...mapGetters(['apiHost'])
  },
  watch: {
    page() {
      const scrollTop = this.$U.pageScrollY();
      clearInterval(this.timerChainInfo);
      this.timerChainInfo = null;
      this.fetchChainGetInfo(true, () => {
        setTimeout(() => { this.$U.pageScrollY(scrollTop) }, 0);
      });
      this.timerChainInfo = setInterval(this.fetchChainGetInfo, 5000);
    },
    ramPrice() {
      this.rameos = 1;
      this.handleChangeV('rameos')
    },
    cpuPrice() {
      this.cpueos = 1;
      this.handleChangeV('cpueos')
    },
    netPrice() {
      this.neteos = 1;
      this.handleChangeV('neteos')
    },
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  mounted() { this.init() },
  destroyed() {
    clearInterval(this.timerChainInfo);
    clearInterval(this.timerMarket);
    this.timerChainInfo = null;
    this.timerMarket = null;
  },
  methods: {
    handleChangeV(type) {
      if (type === 'ramkb') {
        let sum = this.ramkb * this.ramPrice;
        this.rameos = sum && sum.toFixed(4) || '';
      } else if (type === 'rameos') {
        let sum = this.rameos / this.ramPrice;
        this.ramkb = sum && sum.toFixed(4) || '';
      } else if (type === 'cpums') {
        let sum = this.cpums / this.cpuPrice;
        this.cpueos = sum && sum.toFixed(4) || '';
      } else if (type === 'cpueos') {
        let sum = this.cpueos * this.cpuPrice;
        this.cpums = sum && sum.toFixed(4) || '';
      } else if (type === 'netkb') {
        let sum = this.netkb / this.netPrice;
        this.neteos = sum && sum.toFixed(4) || '';
      } else if (type === 'neteos') {
        let sum = this.neteos * this.netPrice;
        this.netkb = sum && sum.toFixed(4) || '';
      }
    },
    async getPrice() {
      const account = await this.$store.dispatch('getAccount', {account: 'eosantpoolbp'});
      this.cpuPrice = (account.cpu_limit.max / 1000) / parseFloat(account.total_resources.cpu_weight);
      this.netPrice = (account.net_limit.max / 1024) / parseFloat(account.total_resources.net_weight);
    },
    init() {
      this.fetchChainGetInfo(true);
      this.fetchMarketPrice();
      this.fetchTableRowsMarket();
      this.getPrice();
      setTimeout(this.createTimer, 2000);
    },
    resetData() {
      this.producersList = []; this.blockInfo = {}; this.eosPrice = '',
      this.marketCap = '', this.ramPrice = '', this.ramRate = '', this.internetVoting = '',
      this.totalRamBytesReserved = '', this.maxRamSize = '', this.currencyStatsSupply = '',
      this.totalVoteRows = '', this.totalVoteWeight = '', this.totalActivatedStake = ''
    },
    createTimer() {
      this.timerChainInfo = setInterval(this.fetchChainGetInfo, 5000);
      this.timerMarket = setInterval(() => {
        this.fetchMarketPrice();
        this.fetchTableRowsMarket();
      }, 12000);
    },
    fetchChainGetInfo(load, cb) {
      if (this.timerChainInfoFetching && !load) return;
      this.timerChainInfoFetching = true;
      if (load) this.isLoading = true;
      if (this.firstInto) {
        this.$store.commit('setLoading', true);
        this.firstInto = false
      }
      Promise.all([
        this.$store.dispatch('chainGetInfo'),
        this.$store.dispatch('getTableRows', {table: 'global'}),
        this.$store.dispatch('getCurrencyStats'),
        this.$store.dispatch('getProducers', {limit: this.limit * this.page})
      ]).then(arr => {
        if(load) this.isLoading = false;
        this.timerChainInfoFetching = false
        this.$store.commit('setLoading', false);
        const [chainGetInfo, totalVote, currencyStats, producers] = [...arr];
        if (chainGetInfo) this.blockInfo = chainGetInfo;
        if (totalVote.rows) {
          this.totalVoteRows = totalVote.rows;
          this.totalRamBytesReserved = (totalVote.rows[0].total_ram_bytes_reserved / 1024 / 1024 /1024).toFixed(2);
          this.maxRamSize = (totalVote.rows[0].max_ram_size / 1024 / 1024 / 1024).toFixed(2);
          this.ramRate = (this.totalRamBytesReserved / this.maxRamSize * 100).toFixed(2) + '%';
        }
        if (currencyStats.EOS) {
          this.currencyStatsSupply = currencyStats.EOS.supply;
          this.internetVoting = (parseInt(this.totalVoteRows[0].total_activated_stake)
            / parseInt(this.currencyStatsSupply) / 100).toFixed(2);
          this.totalActivatedStake = this.$U.fNum(parseInt(this.totalVoteRows[0].total_activated_stake / 10000), 0);
        }
        if (producers.rows) {
          const size = this.limit * this.page;
          this.producersList = producers.rows;
          this.moreClick = producers.rows.length >= size;
          this.totalVoteWeight = parseInt(producers.total_producer_vote_weight);
        }
        if (cb) cb();
      }, err => {
        this.timerChainInfoFetching = false
        if(load) this.isLoading = false
      })
    },
    async fetchMarketPrice() {
      if (this.marketPriceFetching) return;
      this.marketPriceFetching = true;
      const res = await this.$store.dispatch('marketPrice');
      this.marketPriceFetching = false;
      if (res.data) {
        this.eosPrice = res.data.quotes.USD.price && res.data.quotes.USD.price.toFixed(2);
        this.marketCap = (Math.round(res.data.quotes.USD.market_cap / 10000000) / 100).toFixed(2);
      }
    },
    async fetchTableRowsMarket() {
      if (this.tableRowsMarketFetching) return;
      this.tableRowsMarketFetching = true;
      const res = await this.$store.dispatch('getTableRows', {table: 'rammarket'});
      this.tableRowsMarketFetching = false;
      if (res.rows) {
        this.ramPrice = (parseFloat(res.rows[0].quote.balance) / parseFloat(res.rows[0].base.balance) * 1024).toFixed(4);
      }
    },
    rowClassName(row, index) {
      if (row.owner === this.blockInfo.head_block_producer) return 'head-block-producer';
    },
    handleSearch() {
      if (this.search === '') return;
      this.$store.commit('handleSearch', this.search);
    },
    handleMore() { this.page += 1 }
  }
}
</script>
<style lang='less'>
@import '../../styles/variable.less';
@import './index.less';
</style>
