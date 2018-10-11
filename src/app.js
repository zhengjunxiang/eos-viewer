import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { sync } from 'vuex-router-sync'
import VueI18n from 'vue-i18n'
import iview from 'iview'
import titleMixin from './util/title'
import * as filters from './util/filters'
import 'iview/dist/styles/iview.css'
import langage from 'src/lang/langage'
import util from 'src/util/util.js'
import en from 'iview/dist/locale/en-US'
import zh from 'iview/dist/locale/zh-CN'

const isServer = process.env.VUE_ENV === "server"

// mixin for handling title
Vue.mixin(titleMixin)

// use iview
Vue.use(iview)

// useVueI18n
Vue.use(VueI18n)

Vue.locale = () => {}
// instance langage package
const I18n = new VueI18n({
  locale: isServer ? 'zh' : util.checkLan(),
  messages: {
    en: Object.assign(langage.en, en),
    zh: Object.assign(langage.zh, zh)
  }
})

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// Expose a factory function that creates a fresh set of store, router,
// app instances on each call (which is called for each SSR request)
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
