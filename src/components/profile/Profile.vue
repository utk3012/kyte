<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container">
            <br>
            <div class="row justify-content-center">
            <div class="col-sm-10 col-md-10 col-lg-8">
                <div class="card">
                    <div class="card-body">
                        <div class="row">
                            <div class="col-6 col-md-4 col-lg-3">
                                <img :src="loadedUser.image" alt="profile-img" class="rounded-circle img-fluid" width="150px"
                            height="150px" style="cursor: pointer">
                            </div>
                            <div class="col-6 col-md-8 col-lg-9">
                                <h3>{{ loadedUser.name }}</h3>
                                <h6>{{ loadedUser.gender === 'male' ? 'Male' : 'Female' }}</h6>
                                <h6>{{ birthday }}</h6>
                                <b-button :size="'sm'" :variant="'primary'" v-if='relation === -1'>
                                    Edit profile
                                </b-button>
                                <b-button :size="'sm'" :variant="'primary'" @click="sendRequest" v-if='relation === -2'>
                                    Send friend request
                                </b-button>
                                <b-button :size="'sm'" :variant="'danger'" @click="rejectRequest" v-if='relation === 1'>
                                    Unfriend
                                </b-button>
                                <b-button :size="'sm'" :variant="'secondary'" @click="rejectRequest" v-if='relation === 0 && actionUser === user.id'>
                                    Request sent
                                </b-button>
                                <b-button :size="'sm'" :variant="'success'" @click="acceptRequest" v-if='relation === 0 && actionUser === loadedUser.id'>
                                    Accept friend request
                                </b-button>
                                &nbsp;
                                <b-button :size="'sm'" :variant="'danger'" @click="rejectRequest" v-if='relation === 0 && actionUser === loadedUser.id'>
                                    Reject friend request
                                </b-button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
       <br>
		<div class="row justify-content-center">
			<div class="col-sm-10 col-md-10 col-lg-8">
                <div v-if="showPosts">
				    <app-posts :posts="posts"></app-posts>
                </div>
                <div class="text-center" v-else>
                    <h3 class="text-muted">No posts</h3>
                </div>
			</div>
		</div>
	</div>
    </div>
    
</template>
<script>
import Posts from '../home/posts/Posts'
import { mapGetters } from 'vuex'
const moment = require('moment')

export default {
    components: {
        'app-posts': Posts
    },
    data: () => {
        return {
            foreignProfile: false,
            loadedUser: {},
            loadedUserId: -1,
            relation: -9,
            actionUser: 0,
            posts: [],
            relationId: 0
        };
    },
    methods: {
        async getPosts() {
            this.username = this.$route.params.username;
            try {
                const res = await this.$http.post('post/getposts', { username: this.username });
                if (res.status === 200) {
                    this.posts = [...res.body.posts];
                    this.posts.sort(function compare(a, b) {
                        const date1 = a.updatedAt != null ? new Date(a.updatedAt).getTime() : 0;
                        const date2 = b.updatedAt != null ? new Date(b.updatedAt).getTime() : 0;
                        return date2 - date1;
                    });
                    this.relation = res.body.relation;
                    this.loadedUserId = res.body.u_id;
                    this.actionUser = res.body.actionUser;
                    this.relationId = res.body.relId;
                }
                if (this.user.username === this.username) {
                    this.loadedUser = {...this.user};
                    return;
                }
                const result = await this.$http.post('user/getuser', { id: this.loadedUserId });
                if (result.status === 200) {
                    this.loadedUser = result.body.user;
                }
            }
            catch (error) {
                if (error.status === 404 && error.body.msg === 'user not found') {
                    this.$router.push('not-found');
                }
                console.log(error);
            }
        },
        async sendRequest() {
            try {
                const res = await this.$http.post('user/sendrequest', { id: this.loadedUserId });
                if (res.status === 200) {
                    this.relation = 0;
                    this.actionUser = this.user.id;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async acceptRequest() {
            try {
                const res = await this.$http.post('user/acceptrequest', { relId: this.relationId });
                if (res.status === 200) {
                    this.relation = 1;
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async rejectRequest() {
            try {
                const res = await this.$http.post('user/rejectrequest', { relId: this.relationId });
                if (res.status === 200) {
                    this.relation = -2;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    watch: {
        '$route'(to, from) {
            this.username = to.params.username;
            this.getPosts();
        },
    },
    created() {
        this.getPosts();
    },
    computed: {
        ...mapGetters(['user']),
        showPosts() {
            return this.posts.length > 0 ? true : false;
        },
        birthday() {
            if (this.loadedUser.birthday) {
                return moment(this.loadedUser.birthday.split('T')[0]).format('LL');
            }
            else
                return '';
        }
    }
}
</script>