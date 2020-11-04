import '@babel/polyfill'
import Vue from 'vue'
import Root from './Root'
import router from './router'
import store from './store'
import './plugins/vuetify'
import './prototypes/array'
import Scroller from './components/Scroller'
import Wrapper from './components/Wrapper'
import Avatar from './components/Avatar'

Vue.component('Scroller', Scroller);
Vue.component('Wrapper', Wrapper);
Vue.component('Avatar', Avatar);

Vue.config.productionTip = false;


new Vue({
    router,
    store,
    render: h => h(Root)
}).$mount('#app');
