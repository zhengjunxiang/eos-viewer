<template>
  <div class="search-error content-box">
    <img src="../../styles/images/search-error.png" alt="" style="margin-top: 60px;">
    <div class="search-box">
      <Input v-model="search" size="large" :placeholder="$t('header.search')" icon="ios-search"
        @on-enter="handleSearch" @on-click="handleSearch"/>
    </div>
    <p style="color: #999; font-size: 14px;">{{$t('error.searchError')}}</p>
  </div>
</template>
<script>
export default {
  name: "search-error",
  data() {
    return {
      search: ''
    }
  },
  methods: {
    async handleSearch() {
      const id = this.search;
      this.$store.commit('handleSearch', id)
    }
  }
}
</script>
<style lang="less">
@import '../../styles/variable.less';
.search-error {
  min-height: 550px;
  margin-top: 60px;
  text-align: center;
  .search-box {
    width: 50%;
    margin: 30px auto 20px;
    .ivu-input-wrapper {
      border: 1px solid @main;
      border-radius: 5px;
      .ivu-icon-search {
        cursor: pointer;
        font-size: 26px;
        font-weight: 100;
        width: 90px;
        background: @main;
        color: #fff;
      }
      .ivu-input {
        border: 0;
        outline: 0;
      }
    }
  }
}
</style>
