<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container">
            <br>
        <div class="row justify-content-center">
            <div class="col-sm-10 col-md-10 col-lg-8">
            <h3>Friend Requests</h3>
            <h4 v-if="users.length === 0">No requests</h4>
            <span v-else>
                <div @click="viewUser(user.username)" v-for="user in users" :key="user.username">
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
                        <b-button :size="'sm'" :variant="'success'" @click="acceptRequest(user.relId, user.username)">
                            Accept
                        </b-button>&nbsp;
                        <b-button :size="'sm'" :variant="'danger'" @click="rejectRequest(user.relId)">
                            Reject
                        </b-button>
                    </div>
                </div>
            </div>
                </div>
                </div>
            </span>
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
        viewUser(username) {
            this.$router.push(`/${username}`);
        },
        async acceptRequest(relId, username) {
            try {
                const [resp] = await this.$http.post('user/acceptrequest', { relId: relId });
                if (resp.status === 200) {
                    console.log(resp);
                    this.viewUser(username);
                }
            }
            catch (error) {
                console.log(error);
            }
        },
        async rejectRequest(relId) {
            try {
                const [resp] = await this.$http.post('user/rejectrequest', { relId: relId });
                if (resp.status === 200) {
                    this.$router.push('/home');
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    },
    async created() {
        try {
            const res = await this.$http.post('user/getrequests');
            if (res.status === 200) {
                this.users = [...res.body.requests];
            }
        }
        catch (error) {
            console.log(error);
        }
    }
}
</script>

