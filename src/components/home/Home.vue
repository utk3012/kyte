<template>
<div>
    <app-navbar></app-navbar>
    <div class="container">
		<br>
		<div class="row justify-content-center">
			<div class="col-sm-10 col-md-10 col-lg-8">
        <b-form @submit="makePost">
            <b-form-group label="Write a post!"
                          label-for="post">
              <b-form-textarea id="post"
                     v-model="post.post"
                     placeholder="Enter something"
                     :rows="4"
                     :max-rows="5">
              </b-form-textarea>
            </b-form-group>
            <b-button type="submit" variant="dark">Post</b-button>&nbsp;
            <b-button type="reset" variant="danger">Reset</b-button>
            &emsp;&emsp;&emsp;
            <b-form-checkbox id="checkbox1"
                     v-model="post.public"
                     value="1"
                     unchecked-value="0">
                     Public
            </b-form-checkbox>         
          </b-form>
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
import Navbar from '../navbar/Navbar'
import Posts from './posts/Posts'

export default {
    data: () => {
        return {
            post: {post: "", public: '0'},
            posts: []
        };
    },
    components: {
        'app-navbar': Navbar,
        'app-posts': Posts
    },
    computed: {
        showPosts() {
            return this.posts.length > 0 ? true : false;
        }
    },
    methods: {
        async makePost(e) {
            e.preventDefault();
            if (this.post.post.length === 0) {
                return;
            }
            try {
                const res = await this.$http.post('post/save', {post: this.post.post, public: this.post.public});
                if (res.status === 200) {
                    this.post.post = '';
                    this.post.public = false;
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    async created() {
        try {
            const res = await this.$http.post('post/getfriendposts');
            if (res.status === 200) {
                this.posts = [...res.body.posts];
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
</script>