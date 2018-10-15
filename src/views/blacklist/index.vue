<template>
  <div id="blacklist">
    <Card style="margin-top: 30px;">
      <h2>{{$t('blacklist.blacklist')}}</h2>
      <div class="table-box">
        <Table size="small" :columns="columns($root)" :data="blackList" :loading="isLoading" />
      </div>
    </Card>
  </div>
  </div>
</template>
<script>
import columns from './columns'
import {mapGetters} from 'vuex'
export default {
  name: "blacklist",
  data: () => ({
    columns: columns(this), isLoading: false, blackList: []
  }),
  computed: {
    ...mapGetters(['apiHost'])
  },
  mounted() { this.init() },
  watch: {
    apiHost() {
      this.resetData();
      this.init();
    }
  },
  methods: {
    resetData() { this.blackList = [] },
    async init() {
      this.isLoading = true;
      try {
        const res = await this.$store.dispatch('getBlacklist');
        if (res) this.blackList = res.rows.reverse();
        this.isLoading = false;
      } catch (err) {
        this.isLoading = false
      }
    }
  }
}
</script>
<style lang="less">
#blacklist {
  .download-btn {
    display: inline-block;
    padding: 8px 20px;
    background: #e6e6e6;
    color: #555;
    border-radius: 4px;
    text-decoration: none;
  }
  .ivu-table:before {
    height: 0px;
  }
}
</style>
