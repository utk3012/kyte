import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        user: {}
    },
    getters: {
        user: state => {
            return state.user;
        }
    },
    mutations: {
        saveUser: (state, payload) => {
            state.user = {...payload};
        }
    },
    actions: {
        getUser: async ({ commit }) => {
            try {
                const res = await Vue.http.post('user/getuser', {id: -1});
                if (res.status === 200) {
                    commit('saveUser', res.body.user);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
});