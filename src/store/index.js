import Vue from 'vue';
import Vuex from 'vuex';

import app from './modules/app';
import home from './modules/home';
import block from './modules/block';
import account from './modules/account';
import txs from './modules/txs';
import token from './modules/token';
import blacklist from './modules/blacklist';

Vue.use(Vuex);

export const createStore = () => {
    const store = new Vuex.Store({
      modules: { app, home, block, account, txs, token, blacklist }
    })
    return store
}
