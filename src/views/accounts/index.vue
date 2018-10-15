<template>
  <div class="account">
    <div v-for="(a, i) in systemAccount">
      <h2 class="page-title">{{$t('account.title')}}:
        <router-link :to="{ name: 'account', params: { account: systemA[i].account }}">{{systemA[i].account}}</router-link>
        <span style="cursor: pointer;" v-clipboard:copy="systemA[i].account" v-clipboard:success="handleCopy" v-show="systemA[i].account">
          <Icon type="ios-copy" />
        </span>
      </h2>
      <Card style="margin: 0;">
        <Row class="info-box" :gutter="120">
          <Col :sm="12">
            <p class="info-num">
              <span style="float: left;">{{$t('account.balance')}}:</span>
              <span style="float: right;">{{$U.fNum(systemA[i].balance, 4) || '0'}} EOS</span>
            </p>
            <p class="info-num">
              <span style="float: left;">{{$t('account.available')}}:</span>
              <span style="float: right;">{{$U.fNum(systemA[i].data.core_liquid_balance, 4) || '0'}} EOS</span>
            </p>
            <p class="info-num">
              <span style="float: left;">{{$t('account.refund')}}:</span>
              <span style="float: right;">{{$U.fNum(systemA[i].refund, 4) || '0'}} EOS</span>
            </p>
          </Col>
          <Col :sm="12">
            <p class="info-num">
              <span style="float: left;">{{$t('account.stakedToOther')}}:</span>
              <span style="float: right;">{{$U.fNum(systemA[i].stakedToOther, 4) || '0'}} EOS</span>
            </p>
            <p class="info-num">
              <span style="float: left;">{{$t('account.stakedToSelf')}}:</span>
              <span style="float: right;">
                <Tooltip placement="left">
                  {{$U.fNum(systemA[i].stakedToSelf, 4) || '0'}} EOS
                  <div slot="content" style="width: 220px">
                    <div>{{$t('account.selfStaked')}}: <span style="float: right;">{{systemA[i].selfStaked || 0}} EOS</span></div>
                    <div>{{$t('account.stakedByOther')}}: <span style="float: right;">{{systemA[i].stakedByOther || 0}} EOS</span></div>
                  </div>
                </Tooltip>
              </span>
            </p>
            <p class="info-num">
              <span style="float: left;">{{$t('account.timeCreated')}}:</span>
              <span style="float: right;">{{systemA[i].data.created ? $U.utcToLa(systemA[i].data.created) : '--'}}</span>
            </p>
          </Col>
        </Row>

        <div class="token-box" v-if="token[i] && token[i].length">
          <div :class="{'token-item-box': true, more: moreTokenClick[i].value}">
            <div v-for="j in token[i]" class="token-item">
              <img :src="j.logo" alt="" width="32" height="32" style="float: left">
              <span class="text">{{j.value}}</span>
            </div>
          </div>
        </div>

        <h3 class="info-box-title" style="margin-top: 20px;">{{$t('account.resources')}}</h3>
        <Row class="info-box" :gutter="50">
          <Col :sm="8">
            <p class="info-num" style="margin: 0;">RAM:
              <span style="margin-left: 10px;" v-if="systemA[i].data.ram_quota !== -1">({{systemA[i].ramStaked || '--'}} EOS)</span>
            </p>
            <Progress :percent="systemA[i].ramP" status="active" v-if="systemA[i].data.ram_quota !== -1" />
            <p style="text-align: center;" v-if="systemA[i].data.ram_quota !== -1">
              {{systemA[i].data.ram_usage && $U.fNum(systemA[i].data.ram_usage / 1024, 2) || '--'}}KB used /
              {{systemA[i].data.ram_quota && $U.fNum(systemA[i].data.ram_quota / 1024, 2) || '--'}}KB
            </p>
            <p v-else style="text-align: center;">Unlimited</p>
          </Col>
          <Col :sm="8">
            <p class="info-num" style="margin: 0;">CPU:
              <span style="margin-left: 10px;" v-if="(systemA[i].data.cpu_limit && systemA[i].data.cpu_limit.max) !== -1">
                ({{systemA[i].data.total_resources && (systemA[i].data.total_resources.cpu_weight === 0 ? '0.0000' : systemA[i].data.total_resources.cpu_weight) || '0.0000'}} staked)
              </span>
            </p>
            <Progress :percent="systemA[i].cpuP" status="active" v-if="(systemA[i].data.cpu_limit && systemA[i].data.cpu_limit.max) !== -1" />
            <p style="text-align: center;" v-if="(systemA[i].data.cpu_limit && systemA[i].data.cpu_limit.max) !== -1">
              {{systemA[i].data.cpu_limit && $U.fNum(systemA[i].data.cpu_limit.used / 1000, 3) || '--'}}ms used /
              {{systemA[i].data.cpu_limit && $U.fNum(systemA[i].data.cpu_limit.max / 1000, 3) || 0}}ms
            </p>
            <p v-else style="text-align: center;">Unlimited</p>
          </Col>
          <Col :sm="8">
            <p class="info-num" style="margin: 0;">NET:
              <span style="margin-left: 10px;" v-if="(systemA[i].data.net_limit && systemA[i].data.net_limit.max) !== -1">
                ({{systemA[i].data.total_resources && (systemA[i].data.total_resources.net_weight === 0 ? '0.0000' : systemA[i].data.total_resources.net_weight) || '0.0000'}} staked)
              </span>
            </p>
            <Progress :percent="systemA[i].netP" status="active" v-if="(systemA[i].data.net_limit && systemA[i].data.net_limit.max) !== -1" />
            <p style="text-align: center;" v-if="(systemA[i].data.net_limit && systemA[i].data.net_limit.max) !== -1">
              {{systemA[i].data.net_limit && $U.fNum(systemA[i].data.net_limit.used / 1024, 2) || '--'}}KB used /
              {{systemA[i].data.net_limit && (systemA[i].data.net_limit.max === -1 ? 'unlimited' : $U.fNum(systemA[i].data.net_limit.max / 1024, 2)) || 0}}KB
            </p>
            <p v-else style="text-align: center;">Unlimited</p>
          </Col>
        </Row>
      </Card>
    </div>
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
export default {
  name: "accounts",
  data() {
    return { systemA: [], token: [], moreTokenClick: [] }
  },
  computed: {
    ...mapGetters(['apiHost', 'systemAccount'])
  },
  watch: {
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  created() { this.setSystemA() },
  mounted() { this.init() },
  methods: {
    init() {
      this.fetchGetAccount();
      this.fetchGetToken();
    },
    resetData() {
      this.systemA.forEach(item => {
        item.data = {}; item.balance = ''; item.ramStaked = ''; item.ramP = 0; item.cpuP = 0; item.netP = 0;
        item.stakedToOther = ''; item.stakedToSelf = ''; item.refund = '';  selfStaked = ''; stakedByOther = '';
      })
    },
    handleCopy() { this.$Message.info(this.$root.$t('common.copy')) },
    setSystemA() {
      this.systemAccount.forEach(item => {
        this.systemA.push({
          account: '', data: {}, balance: '', ramStaked: '', ramP: 0, cpuP: 0, netP: 0,
          stakedToOther: '', stakedToSelf: '', refund: '', selfStaked: '', stakedByOther: ''
        });
        this.moreTokenClick.push({value: true});
      })
    },
    fetchGetAccount() {
      this.$store.commit('setLoading', true)
      Promise.all(this.systemAccount.map(item => this.$store.dispatch('getTableRows', {table: 'delband', scope: item, limit: 100}))).then(relArr => {
        this.$store.commit('setLoading', false)
        relArr.forEach((i, ind) => {
          let stakedToOther = 0;
          i.rows.forEach(item => {
            if (item.to !== item.from) stakedToOther += (parseFloat(item.net_weight) || 0) + (parseFloat(item.cpu_weight) || 0);
          });
          this.systemA[ind].stakedToOther = stakedToOther || '';
        })
      }, (err) => {
        this.$store.commit('setLoading', false)
        console.log(err)
      });
      this.$store.commit('setLoading', true)
      Promise.all(this.systemAccount.map(item => this.$store.dispatch('getAccount', {account: item}))).then(async relArr => {
        const tableRows = await this.$store.dispatch('getTableRows', {table: 'rammarket'});
        this.$store.commit('setLoading', false)
        const ramPrice = (parseFloat(tableRows.rows[0].quote.balance) / parseFloat(tableRows.rows[0].base.balance) * 1024).toFixed(6);
        relArr.forEach((account, i) => {
          const name = account.account_name;
          this.systemA[i].account = name;
          this.systemA[i].data = account;
          if (account) {
            if (account.total_resources) {
              const totalRes = account.total_resources, selfDel = account.self_delegated_bandwidth;
              this.systemA[i].stakedToSelf = (parseFloat(totalRes.cpu_weight) || 0) + (parseFloat(totalRes.net_weight) || 0) || '';
              this.systemA[i].selfStaked = selfDel ? this.$U.fNum(parseFloat(selfDel.cpu_weight) + parseFloat(selfDel.net_weight), 4) : 0;
              this.systemA[i].stakedByOther = this.$U.fNum(this.systemA[i].stakedToSelf - this.systemA[i].selfStaked, 4);
            }
            if (account.refund_request && account.refund_request.owner === name) {
              this.systemA[i].refund = (parseFloat(account.refund_request.cpu_amount) || 0) + (parseFloat(account.refund_request.net_amount) || 0);
            }
          }
          if (account.voter_info) {
            this.systemA[i].balance = parseFloat(account.core_liquid_balance) + (account.voter_info.staked) / 10000 + (this.systemA[i].refund || 0)
          } else this.systemA[i].balance = parseFloat(account.core_liquid_balance) + (this.systemA[i].refund || 0);
          this.systemA[i].ramStaked = this.$U.fNum(account.ram_quota / 1024 * ramPrice, 4);
          this.systemA[i].ramP = account.ram_quota === 0 ? 100 : parseFloat(this.$U.fNum(account.ram_usage / account.ram_quota * 100));
          if (account.cpu_limit.max > 0) {
            this.systemA[i].cpuP = parseFloat(this.$U.fNum(account.cpu_limit.used / account.cpu_limit.max * 100));
          } else if (account.cpu_limit.max === 0) this.systemA[i].cpuP = 100;
          else if (account.cpu_limit.max === -1) this.systemA[i].cpuP = 0;

          if (account.net_limit.max > 0) {
            this.systemA[i].netP = parseFloat(this.$U.fNum(account.net_limit.used / account.net_limit.max * 100));
          } else if (account.net_limit.max === 0) this.systemA[i].netP = 100;
          else if (account.net_limit.max === -1) this.systemA[i].netP = 0;
        })
      }, (err) => {
        this.$store.commit('setLoading', false)
        console.log(err)
      });
    },
    async fetchGetToken() {
      this.$store.commit('setLoading', true)
      try {
        const res = await this.$store.dispatch('getToken');
        this.$store.commit('setLoading', false)
        if (res) {
          const tokenArr = [];
          res.forEach(j => {
            this.systemAccount.forEach(async (account, i) => {
              if (!tokenArr[i]) tokenArr[i] = [];
              const r = await this.$store.dispatch('getAccountToken', {code: j.account, account, symbol: j.symbol})
              if (r[0]) tokenArr[i].push({ value: r[0], logo: j.logo });
            })
          });
          this.token = tokenArr;
        };
      } catch (err) {
        this.$store.commit('setLoading', false)
      }
    }
  }
}
</script>
<style lang="less">
</style>
