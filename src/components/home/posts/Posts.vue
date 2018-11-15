<template>
<div>
    <span v-for="(post, i) in posts" :key="post.p_id">
        <div class="card">
            <div class="card-body">
                <div class="row">
                    <div class="col-3 col-sm-2 col-xl-1">
                        <img :src="post.image" alt="profile-img" class="rounded-circle" width="50px"
                            height="50px" style="cursor: pointer">
                    </div>
                    <div class="col-6 col-sm-7 col-xl-8">
                        <h5 class="card-title">&nbsp; <span class="user__route">{{ post.name }}</span></h5>
                        <h6 class="card-subtitle mb-2 text-muted">&nbsp; {{ post.time }}</h6>
                    </div>
                    <div class="col-3 col-sm-3 col-xl-3">
                        <div class="row justify-content-end">
                            <span v-if="post.public == 1" style="margin-right: 10px;"><i class="fas fa-globe"></i></span>
                            
                            <span v-if="post.p_id === user.id" @click="onDelete(post.p_id, i)" style="color: red;cursor: pointer;"><i class="fas fa-trash"></i></span>
                            &emsp;
                        </div>
                    </div>
                </div>
                <p class="card-text">
                    {{ post.post }}
                </p>
                <span style="cursor: pointer;" @click="onLike(post.p_id, i)">
                    <i class="fas fa-thumbs-up" :class="{liked: liked(i)}"></i></span>
                    <span> {{ post.likes.length }}</span>
                &emsp;
                <a href="#" class="card-link">Comments</a>
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
                    }
                    else {
                        this.posts[ind].likes.splice(index, 1);
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
    .user__route:hover {
        cursor: pointer;
        text-decoration: underline;
    }
    .liked {
        color: blue;
    }
</style>