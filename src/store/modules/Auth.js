import Router from "../../router";
import { Povidom } from '../../povidom'
import Notifications from '../../notifications'

export default {
    namespaced: true,
    state: {
        auth: false,
        error: null
    },
    getters: {
        isAuth (state) {
            return state.auth
        },
        error (state) {
            return state.error
        }
    },
    mutations: {
        setAuthState (state, bool) {
            state.auth = bool
        },
        setError (state, error) {
            state.error = error
        },
        clearError (state) {
            state.error = null
        }
    },
    actions: {
        async login ({commit}, credentials) {
            credentials = Object.assign({}, credentials);

            await Povidom.Auth.login(credentials);
        },

        async register ({commit}, credentials) {
            credentials = Object.assign({}, credentials);

            await Povidom.Auth.register(credentials);
        },

        async logout ({commit}) {
            commit('setAuthState', false);
            await Povidom.Auth.logout();
            await Povidom.Events.disconnect();
            commit('clearState', null, {root: true});
            Router.push('/authorize');

            return true
        },
    }
}
