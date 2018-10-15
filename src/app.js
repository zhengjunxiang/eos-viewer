import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import iview from './components'
import titleMixin from './libs/title'
import * as filters from './libs/filters'
import 'iview/dist/styles/iview.css'
import langage from 'src/lang/langage'
import util from 'src/libs/util.js'
import en from 'iview/dist/locale/en-US'
import zh from 'iview/dist/locale/zh-CN'
import VueClipboard from 'vue-clipboard2';

VueClipboard.config.autoSetContainer = true
Vue.locale = () => {}
Vue.prototype.$U = util
Vue.use(VueClipboard)
Vue.mixin(titleMixin)
Vue.use(iview)
Vue.use(VueI18n)

const isServer = process.env.VUE_ENV === "server"
const I18n = new VueI18n({
  locale: 'en',
  messages: {
    en: Object.assign(langage.en, en),
    zh: Object.assign(langage.zh, zh)
  }
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

export function createApp () {
  const store = createStore()
  const router = createRouter()
  sync(store, router)
  const app = new Vue({
    router,
    store,
    i18n: I18n,
    render: h => h(App)
  })
  return { app, router, store }
}
