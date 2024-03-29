import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import App from './App.vue'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Toasted from 'vue-toasted'

import { routes } from './routes'
import { store } from './store/store'
import Navbar from './components/navbar/Navbar'

Vue.config.productionTip = false;
Vue.use(BootstrapVue);
Vue.use(VueRouter);
Vue.use(VueResource);
Vue.use(Toasted);
Vue.component('app-navbar', Navbar);
Vue.http.options.root = 'http://localhost:5000/api';

Vue.http.interceptors.push((request, next) => {
  if (request.method === 'POST' && request.url !== 'login' && request.url !== 'register') {
    const token = localStorage.getItem('token');
    request.headers.set('Authorization', `Bearer ${token}`);
    next();
  }
});

const router = new VueRouter({
  routes: routes,
  mode: 'history'
});

router.beforeEach((to, from, next) => {
  if (to.path === '/login' || to.path === '/register' || to.path === '/reset') {
    const token = localStorage.getItem('token');
    if (!token) {
      next();
    }
    else {
      next('/home');
    }
  }
  if (to.path !== '/login' && to.path !== '/register' && !to.path.startsWith('/reset')) {
    Vue.http.post('login/verify')
    .then(resp => {
      if (resp.status === 200 && resp.body.msg === "success") {
        next();
      }
    })
    .catch(err => {
      console.log(err);
      next('/login');
    });
  }
  next();
});

new Vue({
  router: router,
  store: store,
  render: h => h(App)
}).$mount('#app')
