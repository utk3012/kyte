<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container">
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
import Posts from '../home/posts/Posts'

export default {
    components: {
        'app-navbar': Navbar,
        'app-posts': Posts
    },
    data: () => {
        return {
            user: {name: "", info: "", image: "", birthday: "", place: ""},
            showData: 0,
            username: '',
            myId: 0,
            foreignProfile: false,
            friendProfile: false,
            relationStatus: -1,
            posts: []
        };
    },
    methods: {
    },
    watch: {
        '$route'(to, from) {
            this.username = to.params.username;
            this.created();
        },
    },
    async created() {
        this.username = this.$route.params.username;
        try {
            const res = await this.$http.post('post/getposts', { username: this.username });
            if (res.status === 200) {
                this.posts = [...res.body.posts];
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    computed: {
        showPosts() {
            return this.posts.length > 0 ? true : false;
        }
    }
}
</script>

