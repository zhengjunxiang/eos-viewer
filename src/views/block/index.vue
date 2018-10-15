<template>
  <div class="block">
    <h2 class="page-title">{{$t('block.title')}}:
      <span style="cursor: pointer;" v-clipboard:copy="block" v-clipboard:success="handleCopy">
        {{$U.fNum(block, 0)}} <Icon type="ios-copy" />
      </span>
    </h2>
    <Card style="margin: 0;">
      <Row class="info-box" :gutter="120">
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('block.bH')}}:</span>
            <span style="float: right; cursor: pointer;" v-clipboard:copy="block" v-clipboard:success="handleCopy">
              {{$U.fNum(block, 0) || '--'}} <Icon type="ios-copy" />
            </span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('block.bT')}}:</span>
            <span style="float: right;">{{data.timestamp ? $U.utcToLa(data.timestamp) : '--'}}</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('block.producer')}}:</span>
            <span style="float: right;">
              <router-link :to="{ name: 'account', params: { account: data.producer}}" v-if="data.producer">
                {{data.producer}}
              </router-link>
              <span v-else>--</span>
            </span>
          </p>
        </Col>
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('block.nOfT')}}:</span>
            <span style="float: right;">{{data.transactions && data.transactions.length || '0'}}</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('block.nOfA')}}:</span>
            <span style="float: right;">{{actionNum || '0'}}</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('block.irr')}}:</span>
            <span style="float: right;">{{isIrreversible ? $t(`common.${isIrreversible}`) : '--'}}</span>
          </p>
        </Col>
      </Row>
    </Card>
    <Card >
      <h2 class="card-title">{{$t('block.txs')}}</h2>
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
  name: 'block',
  data() {
    return {
      columns: columns(this), txList: [], block: '', data: {}, isLoading: false,
      actionNum: 0, isIrreversible: ''
    }
  },
  computed: {
    ...mapGetters(['apiHost'])
  },
  watch: {
    $route() {
      this.block = this.$route.params.block;
      this.resetData();
      this.fetchGetBlock();
    },
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  mounted() { this.init() },
  methods: {
    init() {
      this.block = this.$route.params.block;
      this.fetchGetBlock();
    },
    resetData() {
      this.txList = []; this.data = {}; this.actionNum = 0; this.isIrreversible = '';
    },
    handleCopy() { this.$Message.info(this.$root.$t('common.copy')) },
    async fetchGetBlock() {
      this.isLoading = true;
      this.$store.commit('setLoading', true)
      Promise.all([
        this.$store.dispatch('getBlock', {block: this.block}),
        this.$store.dispatch('chainGetInfo')
      ]).then(([block, globalInfo]) => {
        this.$store.commit('setLoading', false)
        this.isLoading = false;
        let actionNum = 0;
        this.data = block;
        block.transactions.forEach(item => {
          if (item.trx.transaction && item.trx.transaction.actions) actionNum += item.trx.transaction.actions.length;
        });
        this.actionNum = actionNum;
        this.isIrreversible = (globalInfo.last_irreversible_block_num >= this.block) ? 'yes' : 'no';
        block.transactions.map(item => {
          if (typeof item.trx === 'object') {
            this.txList.push({
              id: item.trx.id,
              expiration: item.trx.transaction.expiration,
              CPU_Usage: item.cpu_usage_us,
              NET_Usage: item.net_usage_words,
              actions: item.trx.transaction.actions.length
            })
          } else {
            this.txList.push({
              id: item.trx,
              expiration: '',
              CPU_Usage: item.cpu_usage_us,
              NET_Usage: item.net_usage_words,
              actions: ''
            })
          }
        });
      }, (err) => {
        this.$store.commit('setLoading', false)
      })
    }
  }
}
</script>
<style lang='less'>
@import '../../styles/variable.less';
@import './index.less';
</style>
