<template>
  <div class="txs">
    <h2 class="page-title">{{$t('txs.title')}}:
      <span style="cursor: pointer; font-size: 16px;" v-clipboard:copy="txs" v-clipboard:success="handleCopy">
        {{txs}} <Icon type="ios-copy" />
      </span>
    </h2>
    <Card class="bg-black" style="margin: 0;">
      <Row class="info-box" :gutter="120">
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('txs.blockID')}}:</span>
            <router-link
              :to="{ name: 'block', params: { block: data.block_num}}"
              style="float: right;" v-if="data.block_num">
              {{$U.fNum(data.block_num, 0)}}
            </router-link>
            <span style="float: right;" v-else>--</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('txs.blockTime')}}:</span>
            <span style="float: right;">{{data.block_time ? $U.utcToLa(data.block_time) : '--'}}</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('txs.nOfA')}}:</span>
            <span style="float: right;">{{actionNum ? $U.fNum(actionNum, 0) : '0'}}</span>
          </p>
        </Col>
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('txs.cpuUsage')}}:</span>
            <span style="float: right;">{{$U.fNum(cpu, 0) || '--'}} μs</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('txs.netUsage')}}:</span>
            <span style="float: right;">{{$U.fNum(net, 0) || '0'}} Bytes</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('txs.irr')}}:</span>
            <span style="float: right;">{{isIrreversible ? $t(`common.${isIrreversible}`) : '--'}}</span>
          </p>
        </Col>
      </Row>
    </Card>
    <Card >
      <h2 class="card-title">{{$t('txs.actions')}}</h2>
      <div class="table-box">
        <Table size="small" :columns="columns($root)" :data="txList" :loading="isLoading" :no-data-text="$t('common.noData')" />
      </div>
    </Card>
  </div>
</template>

<script>
import columns from './columns'
import {mapGetters} from 'vuex'
export default {
  name: 'txs',
  data() {
    return {
      columns: columns(this), txList: [], txs: '', data: {}, actionNum: 0, cpu: '', net: '',
      isIrreversible: '', isLoading: false
    }
  },
  computed: {
    ...mapGetters(['apiHost'])
  },
  watch: {
    $route() {
      this.txs = this.$route.params.txs;
      this.resetData();
      this.fetchGetTransaction();
    },
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  mounted() { this.init() },
  methods: {
    init() {
      this.txs = this.$route.params.txs;
      this.fetchGetTransaction();
    },
    resetData() {
      this.txList = []; this.data = {}; this.actionNum = 0; this.cpu = ''; this.net = ''; this.isIrreversible = '';
    },
    handleCopy() { this.$Message.info(this.$root.$t('common.copy')) },
    async fetchGetTransaction() {
      this.isLoading = true;
      this.$store.commit('setLoading', true)
      try {
        const res = await this.$store.dispatch('getTransaction', {id: this.txs});
        this.isLoading = false;
        this.$store.commit('setLoading', false)
        this.data = res;
        this.actionNum = res.trx.trx && res.trx.trx.actions.length;
        this.cpu = res.trx.receipt.cpu_usage_us;
        this.net = res.trx.receipt.net_usage_words * 8;
        this.txList = res.trx.trx && res.trx.trx.actions;
        this.isIrreversible = res.block_num > res.last_irreversible_block ? 'no' : 'yes';
      } catch (err) {
        this.$store.commit('setLoading', false)
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang='less'>
@import '../../styles/variable.less';
@import './index.less';
</style>
