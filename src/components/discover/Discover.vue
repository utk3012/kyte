<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container">
            <br>
            <div class="row justify-content-center">
			<div class="col-sm-10 col-md-10 col-lg-8">
                <div v-if="showUsers">
                    <div v-for="user in users" :key="user.id">
				    <div class="card" style="margin-bottom: 10px;">
            <div class="card-body">
                <div class="row">
                    <div class="col-2 col-sm-2 col-xl-1">
                        <img :src="user.image" alt="profile-img" class="rounded-circle" width="50px"
                            height="50px" style="cursor: pointer">
                    </div>
                    <div class="col-8 col-sm-7 col-xl-8">
                        <h5 class="card-title">&nbsp; <router-link :to="user.username" class="user__route">{{ user.name }}</router-link></h5>
                        <h6 class="card-subtitle mb-2 text-muted" style="text-transform: capitalize;">&nbsp; {{ user.gender }}</h6>
                    </div>
                    <div class="col-2 col-sm-3 col-xl-3">
                        <div class="row justify-content-end">
                            <span v-if="user.friends === 1" data-toggle="tooltip" title="Friends"><i class="fas fa-user-friends"></i>&emsp;</span>
                        </div>
                    </div>
                </div>
                <!-- <p class="card-text">
                    {{ user.post }}
                </p> -->
                <!-- <span style="cursor: pointer;" @click="onLike(post.p_id, i)">
                    <i class="fas fa-thumbs-up" :class="{liked: liked(i)}"></i></span>
                    <span> {{ post.likes.length }}</span> -->
                <!-- &emsp;
                <a href="#" class="card-link">Comments</a> -->
            </div>
			</div>
        </div>
                </div>
                <div class="text-center" v-else>
                    <h3 class="text-muted">No users</h3>
                </div>
			</div>
		</div>
        </div>
    </div>
</template>
<script>
export default {
    data: () => {
        return {
            users: []
        };
    },
    methods: {
        navigate(username) {
            this.$router.push(`/${username}`);
        }
    },
    async created() {
        try {
            const res = await this.$http.post('user/getallusers');
            if (res.status === 200) {
                this.users = [...res.body.users];
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    computed: {
        showUsers() {
            return (this.users.length > 0 ? true : false);
        }
    }
}
</script>