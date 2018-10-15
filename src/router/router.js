import SearchError from 'src/views/search-error/index.vue'
import Home from 'src/views/home/index'
import Block from 'src/views/block/index'
import Account from 'src/views/account/index'
import Txs from 'src/views/txs/index'
import Token from 'src/views/token/index'
import Accounts from 'src/views/accounts/index'
import Blacklist from 'src/views/blacklist/index'

const appRouter = [
  {
    path: '/home',
    name: 'home',
    meta: { title: 'Home - 首页' },
    component: Home
  }, {
    path: '/blacklist',
    name: 'blacklist',
    meta: { title: 'Blacklist - 黑名单' },
    component: Blacklist
  }, {
    path: '/block/:block',
    name: 'block',
    meta: { title: 'Block - 区块' },
    component: Block
  }, {
    path: '/accounts',
    name: 'accounts',
    meta: { title: 'Accounts - 账户' },
    component: Accounts
  }, {
    path: '/account/:account',
    name: 'account',
    meta: { title: 'Account - 账户' },
    component: Account
  }, {
    path: '/txs/:txs',
    name: 'txs',
    meta: { title: 'Txs - 交易' },
    component: Txs
  }, {
    path: '/token',
    name: 'token',
    meta: { title: 'Token - 合约' },
    component: Token
  }, {
    path: '/search_error',
    name: 'search-error',
    meta: { title: 'Search Error - 搜索错误' },
    component: SearchError
  }, {
    path: '/',
    redirect: { name: 'home' }
  }, {
    path: '*',
    redirect: { name: 'home' }
  }
]

appRouter.forEach(router => {
  if (router.component && router.meta) router.component.title = router.meta.title
})

export const routers = appRouter;
