import Vue from 'vue'
import Router from 'vue-router'

import App from '../components/App'
import Authorize from '../components/Authorize'

import Store from '../store'
import {Povidom} from '../povidom'

Vue.use(Router);

const authGuard = async (to, from, next) => {
    if (!Povidom.Auth.checkAuthState()) {
        console.log('router authGuard => logout');
        await Store.dispatch('Auth/logout');
        next()
    }
    else {
        next()
    }
};

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            name: 'App',
            component: App,
            beforeEnter: authGuard
        },
        {
            path: '/authorize',
            name: 'Authorize',
            component: Authorize
        },
        {
            path: '*',
            redirect: '/authorize'
        }
    ]
})
