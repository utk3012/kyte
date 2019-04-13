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
                                            
                                            <span v-if="post.u_id === user.id" @click="onDelete(post.p_id)" style="color: red;cursor: pointer;"><i class="fas fa-trash"></i></span>
                                            &emsp;
                                        </div>
                                    </div>
                                </b-row>
                                <b-row style="margin-top: 9px; margin-bottom: 10px;">
                                    <p class="card-text col-12">
                                        {{ post.post }}
                                    </p>
                                </b-row>
                                <b-row style="font-size: 15px;">
                                    <div class="col-6">
                                        <span style="cursor: pointer;" @click="onLike(post.p_id)">
                                            <i class="fas fa-thumbs-up" :class="{liked: liked()}"></i></span>
                                            <span> {{ post.likes.length }}</span>
                                        &emsp;
                                        <span class="text-muted">{{ post.noOfComments }} {{ +post.noOfComments === 1 ? 'Comment' : 'Comments' }}</span>
                                    </div>
                                    <div class="col-6">
                                        <span class="row justify-content-end text-muted">
                                            {{ post.fullTime }}&emsp;&emsp;
                                        </span>
                                    </div>
                                </b-row>
                                <hr>
                                <b-row>
                                    <div class="col-12">
                                        <div class="row comment__grid" v-for="(comm) in comments" :key="comm.id" style="margin-top: 10px;">
                                            <div class="comment__image">
                                                <img :src="comm.image" alt="profile-img" class="rounded-circle" width="32px"
                                                    height="32px" style="cursor: pointer; margin-right: 17px;">
                                            </div>
                                            <div class="comment__text">
                                                <div class="comment__">
                                                    <span><b-link :to="`/${comm.username}`">{{ comm.name }}</b-link>&nbsp;</span>
                                                    <span>
                                                        {{ comm.comment }}
                                                    </span>
                                                    <!-- <br> -->
                                                </div>
                                                <span class="comment__meta row">
                                                    <b-link>Like</b-link>
                                                    &emsp;
                                                    <b-link style="color: red" class="justify-content-end">Delete</b-link>
                                                    &emsp;
                                                    <span class="text-muted">{{ comm.time }}</span>
                                                </span>
                                            </div>
                                        </div>

                                        <div class="row" style="margin-top: 8px;">
                                            <div class="col-1">
                                                <img :src="user.image" alt="profile-img" class="rounded-circle" width="32px"
                                                    height="32px" style="cursor: pointer; margin-right: 17px;">
                                            </div>
                                            <div class="col-11">
                                                <div class="comment__write">
                                                    <b-form-textarea
                                                        id="commentWrite"
                                                        v-model="comment"
                                                        @keydown.native="inputHandler"
                                                        placeholder="Write a comment..."
                                                        :no-resize="true">
                                                    </b-form-textarea>
                                                    <br>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </b-row>
                            </div>
                        </div>
                    </div>
                    <div class="text-center" v-else>
                        <h3 class="text-muted">No posts</h3>
                    </div>
                </div>
            </div>
        </b-container>
        <br>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import moment from 'moment';

export default {
    data() {
        return {
            notFound: false,
            postId: -1,
            post: {},
            showPost: false,
            comment: '',
            comments: []
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
                const resp = await this.$http.post('comment/getall', { postId: this.postId });
                if (res.status === 200) {
                    this.post = res.body.post[0];
                    this.post.time = moment(this.post.updatedAt).fromNow();
                    this.post.fullTime = moment(this.post.updatedAt).format('lll');
                    this.showPost = true;
                }
                if (resp.status === 200) {
                    this.comments = [...resp.body.comments];
                    for (let i=0; i < this.comments.length; i++) {
                        this.comments[i].time = moment(this.comments[i].updatedAt).fromNow();
                    }
                    this.comments.sort(function compare(a, b) {
                        const date1 = a.updatedAt != null ? new Date(a.updatedAt).getTime() : 0;
                        const date2 = b.updatedAt != null ? new Date(b.updatedAt).getTime() : 0;
                        return date1 - date2;
                    });
                }
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
                        this.$toasted.show('Post liked', { 
                            theme: "toasted-primary", 
                            position: "top-right", 
                            duration : 2000
                        });
                    }
                    else {
                        this.post.likes.splice(index, 1);
                        this.$toasted.show('Post unliked', { 
                            theme: "toasted-primary", 
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
        },
        inputHandler(e) {
            if (e.keyCode === 13 && !e.shiftKey) {
                e.preventDefault();
                this.saveComment();
            }
        },
        async saveComment() {
            if (this.comment.length === 0) {
                return;
            }
            if (this.comment.length > 5000) {
                this.$toasted.show('Comment too long', { 
                    theme: "toasted-primary", 
                    type: "error",
                    position: "top-right", 
                    duration : 2000
                });
            }
            try {
                const resp = await this.$http.post('comment/save', { comment: this.comment, reply: 0, postId: this.postId });
                if (resp.status === 200) {
                    this.comments.push({
                        id: resp.body.id,
                        u_id: this.user.id,
                        comment: this.comment,
                        reply: 0,
                        updatedAt: new Date().toISOString(),
                        time: moment(new Date().toISOString()).fromNow(),
                        username: this.user.username,
                        name: this.user.name,
                        image: this.user.image
                    });
                    this.$toasted.show('Comment saved', { 
                        theme: "toasted-primary", 
                        position: "top-right", 
                        duration : 2000
                    });
                    this.comment = '';
                }
            }
            catch (error) {
                console.log(error);
            }
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
    .comment__grid {
        margin-left: 1px;
    }
    .comment__image {
        margin-right: 7px;
    }
    .comment__ {
        background-color: #e4e5e7;
        border-radius: 25px;
        max-width: 48vw;
        padding: 5px 14px;
        font-size: 15px;
    }
    .comment__write {
        height: 40px;
    }
    .comment__write textarea {
        border-radius: 25px;
        height: 36px;
    }
    .comment__meta {
        margin-left: 15px;
        font-size: 13px;
    }
</style>