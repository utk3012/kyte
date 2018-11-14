<template>
    <div>
        <app-navbar></app-navbar>
        <div class="w3-container w3-content" style="max-width:1400px;margin-top:80px" v-if="showData">
        <!-- The Grid -->
        <div class="w3-row">
            <!-- Left Column -->
            <div class="w3-col m2" style="color: white;">s</div>
            <div class="w3-col m8">
            <h3>Friends</h3>
            <span v-if="users.length === 0">
                <span style="font-size: 20px">No friends &nbsp;&nbsp;</span>
                <button type="button" class="w3-button w3-theme" @click="discover">
                <i class="fa fa-friends"></i>Discover
                </button>
            </span>
            <ul class="w3-ul w3-card-4">
                <li class="w3-bar" @click="navigate(user.username)" v-for="user in users" :key="user.username">
                <img :src="user.image" class="w3-bar-item w3-circle" style="width:85px">
                <div class="w3-bar-item">
                    <span class="w3-large">{{ user.name }}</span><br>
                    <span>{{ user.info }}</span>
                </div>
                </li>
            </ul>
            </div>
        </div>
        </div>
    </div>
</template>
<script>
import Navbar from '../navbar/Navbar'

export default {
    components: {
        'app-navbar': Navbar
    },
    data: () => {
        return {
            showData: false,
            users: []
        };
    },
    methods: {
        discover() {
            this.$router.push('/discover');
        },
        navigate(username) {
            this.$router.push(`/${username}`);
        }
    },
    created() {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        const header = {
            Authorization: `Bearer ${accessToken}`
        };
        this.$http.post('friends', {username: username}, {headers: header})
            .then(response => {
                if (response.body.success === 1) {
                    this.users = [...response.body.data];
                }
                else {
                    this.users = [];
                }
                this.showData = true;
            }, error => {
                console.log(error);
            });
    }
}
</script>

<style scoped>
.w3-bar:hover {
  cursor: pointer;
}
</style>