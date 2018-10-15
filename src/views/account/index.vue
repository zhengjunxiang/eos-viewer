<template>
  <div class="account">
    <h2 class="page-title">{{$t('account.title')}}:
      <span style="cursor: pointer;" v-clipboard:copy="account" v-clipboard:success="handleCopy">
        {{account}} <Icon type="ios-copy" />
      </span>
    </h2>
    <Card style="margin: 0;">
      <Row class="info-box" :gutter="120">
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('account.balance')}}:</span>
            <span style="float: right;">{{$U.fNum(balance, 4) || '0'}} EOS</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('account.available')}}:</span>
            <span style="float: right;">{{$U.fNum(data.core_liquid_balance, 4) || '0'}} EOS</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('account.refund')}}:</span>
            <span style="float: right;">{{$U.fNum(refund, 4) || '0'}} EOS</span>
          </p>
        </Col>
        <Col :sm="12">
          <p class="info-num">
            <span style="float: left;">{{$t('account.stakedToOther')}}:</span>
            <span style="float: right;">{{$U.fNum(stakedToOther, 4) || '0'}} EOS</span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('account.stakedToSelf')}}:</span>
            <span style="float: right;">
              <Tooltip placement="left">
                {{$U.fNum(stakedToSelf, 4) || '0'}} EOS
                <div slot="content" style="width: 220px">
                  <div>{{$t('account.selfStaked')}}: <span style="float: right;">{{selfStaked || 0}} EOS</span></div>
                  <div>{{$t('account.stakedByOther')}}: <span style="float: right;">{{stakedByOther || 0}} EOS</span></div>
                </div>
              </Tooltip>
            </span>
          </p>
          <p class="info-num">
            <span style="float: left;">{{$t('account.timeCreated')}}:</span>
            <span style="float: right;">{{data.created ? $U.utcToLa(data.created) : '--'}}</span>
          </p>
        </Col>
      </Row>

      <div class="token-box" v-if="token.length">
        <div :class="{'token-item-box': true, more: moreTokenClick}">
          <div v-for="i in token" class="token-item">
            <img :src="i.logo" alt="" width="32" height="32" style="float: left">
            <span class="text">{{i.value}}</span>
          </div>
        </div>
      </div>

      <h3 class="info-box-title" style="margin-top: 20px;">{{$t('account.resources')}}</h3>
      <Row class="info-box" :gutter="50">
        <Col :sm="8">
          <p class="info-num" style="margin: 0;">RAM:
            <span style="margin-left: 10px;" v-if="data.ram_quota !== -1">({{ramStaked}} EOS)</span>
          </p>
          <Progress :percent="ramP" status="active" v-if="data.ram_quota !== -1" />
          <p style="text-align: center;" v-if="data.ram_quota !== -1">
            {{data.ram_usage && $U.fNum(data.ram_usage / 1024, 2) || '--'}}KB used /
            {{data.ram_quota && $U.fNum(data.ram_quota / 1024, 2) || '--'}}KB
          </p>
          <p v-else style="text-align: center;">Unlimited</p>
        </Col>
        <Col :sm="8">
          <p class="info-num" style="margin: 0;">CPU:
            <span style="margin-left: 10px;" v-if="(data.cpu_limit && data.cpu_limit.max) !== -1">
              ({{data.total_resources && (data.total_resources.cpu_weight === 0 ? '0.0000' : data.total_resources.cpu_weight) || '0.0000'}} staked)
            </span>
          </p>
          <Progress :percent="cpuP" status="active" v-if="(data.cpu_limit && data.cpu_limit.max) !== -1" />
          <p style="text-align: center;" v-if="(data.cpu_limit && data.cpu_limit.max) !== -1">
            {{data.cpu_limit && $U.fNum(data.cpu_limit.used / 1000, 3) || '--'}}ms used /
            {{data.cpu_limit && $U.fNum(data.cpu_limit.max / 1000, 3) || 0}}ms
          </p>
          <p v-else style="text-align: center;">Unlimited</p>
        </Col>
        <Col :sm="8">
          <p class="info-num" style="margin: 0;">NET:
            <span style="margin-left: 10px;" v-if="(data.net_limit && data.net_limit.max) !== -1">
              ({{data.total_resources && (data.total_resources.net_weight === 0 ? '0.0000' : data.total_resources.net_weight) || '0.0000'}} staked)
            </span>
          </p>
          <Progress :percent="netP" status="active" v-if="(data.net_limit && data.net_limit.max) !== -1" />
          <p style="text-align: center;" v-if="(data.net_limit && data.net_limit.max) !== -1">
            {{data.net_limit && $U.fNum(data.net_limit.used / 1024, 2) || '--'}}KB used /
            {{data.net_limit && (data.net_limit.max === -1 ? 'unlimited' : $U.fNum(data.net_limit.max / 1024, 2)) || 0}}KB
          </p>
          <p v-else style="text-align: center;">Unlimited</p>
        </Col>
      </Row>
    </Card>
    <Card >
      <h2 class="card-title">{{$t('account.actions')}}</h2>
      <div class="table-box">
        <Table size="small" :columns="columns($root)" :data="actionList" :loading="isLoading" :no-data-text="$t('common.noData')" />
        <div style="margin-top: 10px;">
          <p style="text-align: center;" v-show="!isLoading">
            -- <Button @click="handleMore" :disabled="!moreActionClick">{{$t('common.more')}}</Button> --
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
  name: 'account',
  data() {
    return {
      columns: columns(this), actionList: [], account: '', data: {}, isLoading: false, offset: -50, page: 1,
      balance: '', ramStaked: '--', ramP: 0, cpuP: 0, netP: 0, moreActionClick: true,
      stakedToOther: '', stakedToSelf: '', refund: '', selfStaked: '', stakedByOther: '',
      token: [], moreTokenClick: true
    }
  },
  computed: {
    ...mapGetters(['apiHost'])
  },
  watch: {
    page() {
      const scrollTo = this.$U.pageScrollY();
      this.fetchGetHistoryActions(() => {
        setTimeout(() => { this.$U.pageScrollY(scrollTo) }, 0);
      })
    },
    $route() {
      this.account = this.$route.params.account;
      this.resetData();
      this.fetchGetAccount();
      this.fetchGetHistoryActions();
      this.fetchGetToken();
    },
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  mounted() { this.init() },
  methods: {
    init() {
      this.account = this.$route.params.account;
      this.fetchGetAccount();
      this.fetchGetHistoryActions();
      this.fetchGetToken();
    },
    resetData() {
      this.actionList = []; this.data = {}; this.page = 1; this.balance = '';
      this.ramStaked = '--'; this.ramP = 0; this.cpuP = 0; this.netP = 0; this.selfStaked = '', this.stakedByOther = '',
      this.stakedToOther = ''; this.stakedToSelf = ''; this.refund = ''; this.token = [];
    },
    handleCopy() { this.$Message.info(this.$root.$t('common.copy')) },
    async fetchGetAccount() {
      this.$store.commit('setLoading', true)
      Promise.all([
        this.$store.dispatch('getAccount', {account: this.account}),
        this.$store.dispatch('getTableRows', {table: 'rammarket'}),
        this.$store.dispatch('getTableRows', {table: 'delband', scope: this.account, limit: 100})
      ]).then(([account, tableRows, tableRowsA]) => {
        this.$store.commit('setLoading', false)
        const ramPrice = (parseFloat(tableRows.rows[0].quote.balance) / parseFloat(tableRows.rows[0].base.balance) * 1024).toFixed(6);
        this.data = account;
        if (tableRowsA) {
          let stakedToOther = 0;
          tableRowsA.rows.forEach(item => {
            if (item.to !== this.account) stakedToOther += (parseFloat(item.net_weight) || 0) + (parseFloat(item.cpu_weight) || 0);
          });
          this.stakedToOther = stakedToOther || '';
        }
        if (account) {
          if (account.total_resources) {
            const totalRes = account.total_resources, selfDel = account.self_delegated_bandwidth;
            this.stakedToSelf = (parseFloat(totalRes.cpu_weight) || 0) + (parseFloat(totalRes.net_weight) || 0);
            this.selfStaked = selfDel ? this.$U.fNum(parseFloat(selfDel.cpu_weight) + parseFloat(selfDel.net_weight), 4) : 0;
            this.stakedByOther = this.$U.fNum(this.stakedToSelf - this.selfStaked, 4);
          }
          if (account.refund_request && account.refund_request.owner === this.account) {
            this.refund = (parseFloat(account.refund_request.cpu_amount) || 0) + (parseFloat(account.refund_request.net_amount) || 0);
          }
        }
        if (account.voter_info) this.balance = parseFloat(account.core_liquid_balance) + (account.voter_info.staked) / 10000 + (this.refund || 0);
        else this.balance = parseFloat(account.core_liquid_balance) + (this.refund || 0);
        this.ramStaked = this.$U.fNum(account.ram_quota / 1024 * ramPrice, 4);
        this.ramP = account.ram_quota === 0 ? 100 : parseFloat(this.$U.fNum(account.ram_usage / account.ram_quota * 100));
        if (account.cpu_limit.max > 0) {
          const cpuP = parseFloat(this.$U.fNum(account.cpu_limit.used / account.cpu_limit.max * 100));
          this.cpuP = cpuP > 100 ? 100 : cpuP;
        }
        else if (account.cpu_limit.max === 0) this.cpuP = 100;
        else if (account.cpu_limit.max === -1) this.cpuP = 0;
        if (account.net_limit.max > 0) this.netP = parseFloat(this.$U.fNum(account.net_limit.used / account.net_limit.max * 100));
        else if (account.net_limit.max === 0) this.netP = 100;
        else if (account.net_limit.max === -1) this.netP = 0;
      }, (err) => {
        this.$store.commit('setLoading', false)
        console.log(err)
      })
    },
    async fetchGetHistoryActions(cb) {
      this.isLoading = true;
      const size = -this.offset * this.page;
      try {
        const res = await this.$store.dispatch('getHistoryActions', {account: this.account, offset: this.offset * this.page});
        this.actionList = res.actions.filter(item => {
          if (item.action_trace.act.name === 'transfer') {
            if (item.action_trace.receipt.receiver === this.account) return true;
            return false;
          }
          return true;
        }).reverse();
        this.moreActionClick = res.actions.length >= size;
        this.isLoading = false;
        if (cb) cb();
      } catch (err) { this.isLoading = false }
    },
    handleMore() { this.page += 1 },
    async fetchGetToken() {
      const res = await this.$store.dispatch('getToken');
      if (res) {
        const tokenArr = [];
        res.forEach(async r => {
          const accountToken = await this.$store.dispatch('getAccountToken', {code: r.account, account: this.account, symbol: r.symbol})
          if (accountToken[0]) tokenArr.push({ value: accountToken[0], logo: r.logo });;
        });
        this.token = tokenArr;
      }
    },
    onCopy(value) {
      this.$copyText(value).then((e) => {
        this.$Message.info(this.$root.$t('common.copy'))
      },(e) => {})
    }
  }
}
</script>
