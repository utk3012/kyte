<template>
    <div>
        <app-navbar></app-navbar>
        <b-container>
            <br>
            <div class="row justify-content-center">
                <div class="col-sm-10 col-md-10 col-lg-8">
                    <div v-if="!notFound">
                        <div class="card" v-if="showPost">
                            <div class="card-body">
                                <div class="row">
                                    <div class="col-3 col-sm-2 col-xl-1">
                                        <img :src="post.image" alt="profile-img" class="rounded-circle" width="50px"
                                            height="50px" style="cursor: pointer">
                                    </div>
                                    <div class="col-6 col-sm-7 col-xl-8">
                                        <h5 class="card-title">&nbsp; <router-link :to="post.username" class="user__route">{{ post.name }}</router-link></h5>
                                        <h6 class="card-subtitle mb-2 text-muted">&nbsp; {{ post.time }}</h6>
                                    </div>
                                    <div class="col-3 col-sm-3 col-xl-3">
                                        <div class="row justify-content-end">
                                            <span v-if="post.public == 1" style="margin-right: 10px;"><i class="fas fa-globe"></i></span>
                                            
                                            <span v-if="post.u_id === user.id" @click="onDelete(post.p_id)" style="color: red;cursor: pointer;"><i class="fas fa-trash"></i></span>
                                            &emsp;
                                        </div>
                                    </div>
                                </div>
                                <p class="card-text">
                                    {{ post.post }}
                                </p>
                                <span style="cursor: pointer;" @click="onLike(post.p_id)">
                                    <i class="fas fa-thumbs-up" :class="{liked: liked()}"></i></span>
                                    <span> {{ post.likes.length }}</span>
                                &emsp;
                                <a href="#" class="card-link">Comments</a>
                            </div>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        <h3 class="text-muted">No posts</h3>
                    </div>
                </div>
            </div>
        </b-container> 
    </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
    data() {
        return {
            notFound: false,
            postId: -1,
            post: {},
            showPost: false
        }
    },
    watch: {
        '$route'(to, from) {
            this.username = to.params.id;
            this.getPost();
        },
    },
    created() {
        this.getPost();
    },
    methods: {
        async getPost() {
            this.postId = this.$route.params.id;
            try {
                const res = await this.$http.post('post/getpost', { postId: this.postId });
                this.post = res.body.post[0];
                this.showPost = true;
            }
            catch (error) {
                console.log(error);
            }
        },
        async onLike(postId) {
            try {
                const res = await this.$http.post('post/like', { postId: postId });
                if (res.status === 200) {
                    const index = this.post.likes.indexOf(this.user.id);
                    if (index === -1) {
                        this.post.likes.push(this.user.id);
                    }
                    else {
                        this.post.likes.splice(index, 1);
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async onDelete(postId) {
            try {
                const res = await this.$http.post('post/delete', { postId: postId });
                if (res.status === 200) {
                    this.$router.push('/home');
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        liked() {
            return this.post.likes.indexOf(this.user.id) === -1 ? false : true;
        }
    },
    computed: {
        ...mapGetters(['user'])
    }
}
</script>
<style scoped>
    .user__route {
        color: black;
    }
    .user__route:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    .liked {
        color: blue;
    }
</style>