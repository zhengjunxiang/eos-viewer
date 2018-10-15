<template>
  <div id="app">
    <Header />
    <div class="container" style="padding-top: 100px;">
      <div class="container-inner">
        <transition name="fade" mode="out-in">
          <router-view />
        </transition>
      </div>
      <BackTop />
      <Spin fix v-show="isLoading" style="position: fixed;" size="large" />
    </div>
    <Footer />
  </div>
</template>
<script>
import {mapGetters} from 'vuex'
import Header from 'src/views/layout/header.vue'
import Footer from 'src/views/layout/footer.vue'
export default {
  name: 'app',
  components: { Header, Footer },
  computed: {
    ...mapGetters(['isLoading'])
  }
}
</script>
<style lang="less">
@import './styles/variable.less';
@import './styles/common.less';
@import './styles/app.less';
@import './styles/style-m.less';
</style>
