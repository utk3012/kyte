<template>
<div>
    <span v-for="(post, i) in posts" :key="post.p_id">
        <div class="card">
            <div class="card-body">
                <b-row>
                    <div class="col-3 col-sm-2 col-xl-1">
                        <img :src="post.image" alt="profile-img" class="rounded-circle" width="50px"
                            height="50px" style="cursor: pointer">
                    </div>
                    <div class="col-6 col-sm-7 col-xl-8">
                        <h5 class="card-title">&nbsp; <router-link :to="`/${post.username}`" class="user__route">{{ post.name }}</router-link></h5>
                        <h6 class="card-subtitle mb-2 text-muted">&nbsp; {{ post.time }}</h6>
                    </div>
                    <div class="col-3 col-sm-3 col-xl-3">
                        <div class="row justify-content-end">
                            <span v-if="post.public == 1" style="margin-right: 10px;"><i class="fas fa-globe"></i></span>
                            
                            <span v-if="post.u_id === user.id" @click="onDelete(post.p_id, i)" style="color: red;cursor: pointer;"><i class="fas fa-trash"></i></span>
                            &emsp;
                        </div>
                    </div>
                </b-row>
                <b-row style="margin-top: 5px; margin-bottom: 9px;">
                    <p class="card-text col-12">
                        {{ post.post.length > 500 ? post.post.substring(0, 500) + '...' : post.post }}
                        <span v-if="post.post.length > 500"> <b-link :to="`post/${post.p_id}`">View full post</b-link></span>
                    </p>
                </b-row>
                <b-row style="font-size: 15px;">
                    <div class="col-10">
                        <span style="cursor: pointer;" @click="onLike(post.p_id, i)">
                            <i class="fas fa-thumbs-up" :class="{liked: liked(i)}"></i></span>
                            <span> {{ post.likes.length }}</span>
                        &emsp;
                        <b-link :to="`post/${post.p_id}`">{{ posts[i].noOfComments }} {{ +posts[i].noOfComments === 1 ? 'Comment' : 'Comments' }}</b-link>
                    </div>
                    <div class="col-2">
                        <b-link :to="`post/${post.p_id}`">View post</b-link>
                    </div>
                </b-row>
            </div>
        </div>
        <br>
    </span>
</div>
</template>
<script>
const moment = require('moment');
import { mapGetters } from 'vuex';

export default {
    props: ['posts'],
    methods: {
        async onLike(postId, ind) {
            try {
                const res = await this.$http.post('post/like', { postId: postId });
                if (res.status === 200) {
                    const index = this.posts[ind].likes.indexOf(this.user.id);
                    if (index === -1) {
                        this.posts[ind].likes.push(this.user.id);
                        this.$toasted.show('Post liked', { 
                            theme: "primary", 
                            position: "top-right", 
                            duration : 2000
                        });
                    }
                    else {
                        this.posts[ind].likes.splice(index, 1);
                        this.$toasted.show('Post unliked', { 
                            theme: "primary", 
                            position: "top-right", 
                            duration : 2000
                        });
                    }
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async onDelete(postId, ind) {
            try {
                const res = await this.$http.post('post/delete', { postId: postId });
                if (res.status === 200) {
                    this.posts.splice(ind, 1);
                    this.$toasted.show('Post deleted', { 
                        theme: "primary", 
                        position: "top-right", 
                        duration : 2000
                    });
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        liked(ind) {
            return this.posts[ind].likes.indexOf(this.user.id) === -1 ? false : true;
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created() {
        for (let i=0; i < this.posts.length; i++) {
            this.posts[i].time = moment(this.posts[i].updatedAt).fromNow();
        }
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