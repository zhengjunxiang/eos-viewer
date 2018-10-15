<template>
<div id="header">
  <div class="container-inner">
      <div class="logo-box">
        <a href="/" target="_block">
          <img src="../../styles/images/logo.png" alt="logo" class="logo">
        </a>
        <div class="logo-text-box">
          <p style="font-weight: 500;">
            <a href="/" style="color: #333;">EOS Viewer</a>
          </p>
          <p class="antpool-text">By <a href="https://www.eosantpool.com">EOS AntPool</a></p>
        </div>
      </div>
      <div class="navbar">
        <span class="nav-item">
          <router-link :to="{ path: '/home' }">{{$t('header.home')}}</router-link>
        </span>
        <span class="nav-item">
          <router-link :to="{ path: '/token' }">Token</router-link>
        </span>
        <span class="nav-item">
          <router-link :to="{ path: '/accounts' }">{{$t('header.account')}}</router-link>
        </span>
        <span class="nav-item">
          <router-link :to="{ path: '/blacklist' }">{{$t('header.blacklist')}}</router-link>
        </span>
      </div>

      <Dropdown trigger="click" class="navbar-box">
        <a href="javascript:void(0)"><Icon type="md-reorder" size="28" /></a>
        <DropdownMenu slot="list">
          <DropdownItem><router-link :to="{ path: '/home' }">{{$t('header.home')}}</router-link></DropdownItem>
          <DropdownItem><router-link :to="{ path: '/token' }">Token</router-link></DropdownItem>
          <DropdownItem><router-link :to="{ path: '/accounts' }">{{$t('header.account')}}</router-link></DropdownItem>
          <DropdownItem><router-link :to="{ path: '/blacklist' }">{{$t('header.blacklist')}}</router-link></DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Dropdown trigger="click" @on-click="handleChangeLangage" class="change-lan-box">
        <Button type="primary">
          <span class="text">{{language}}</span>
          <Icon type="md-arrow-dropdown" />
        </Button>
        <DropdownMenu slot="list">
          <DropdownItem name="zh">中文</DropdownItem>
          <DropdownItem name="en">English</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <div class="search-box">
        <Input v-model="search" size="large" :placeholder="$t('header.search')" icon="ios-search" @on-enter="handleSearch" @on-click="handleSearch" />
      </div>
    </div>
</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  name: "ant-header",
  data() {
    return { search: '' }
  },
  computed: {
    ...mapGetters(['lan', 'currCoin']),
    language() {
      if (this.lan === 'zh') return '中文'
      else if (this.lan === 'en') return 'English'
      else return '中文'
    }
  },
  methods: {
    handleSearch() {
      if (this.search === '') return;
      this.$store.commit('handleSearch', this.search);
    },
    handleChangeLangage(name) {
      this.$i18n.locale = name;
      this.$store.commit('setLan', name)
      localStorage.setItem('language', name)
    }
  }
}
</script>
<style lang="less">
@import '../../styles/variable.less';
@import './header.less';
</style>
