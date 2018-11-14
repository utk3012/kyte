<template>
    <div>
        <app-navbar></app-navbar>
        <div class="w3-container w3-content" style="max-width:1400px;margin-top:80px" v-if="showData">
        <div class="w3-row">
            <div class="w3-col m2" style="color: white;">*</div>
            <div class="w3-col m8">
            <h3>Friend Requests</h3>
            <h4 v-if="users.length === 0">No requests</h4>
            <ul class="w3-ul w3-card-4">
                <li class="w3-bar" @click="viewUser(user.username)" v-for="user in users" :key="user.username">
                <div class="w3-right">
                    <button class="w3-button w3-block w3-green w3-section" title="Accept" @click="acceptRequest(user.username)"><i class="fa fa-check"></i></button>
                </div>
                <div class="w3-right">
                    <button class="w3-button w3-block w3-red w3-section" title="Decline"><i class="fa fa-remove"></i></button>
                </div>
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
            users: [],
            username: ''
        };
    },
    method: {
        viewUser(username) {
            this.$router.push(`/${username}`);
        },
        acceptRequest(fromUsername) {
            const accessToken = localStorage.getItem('accessToken');
            const header = {
                Authorization: `Bearer ${accessToken}`
            };
            this.$http.post('accept_request', {forUsername: this.username, fromUsername: fromUsername}, {headers: header})
                .then(response => {
                    if(response.body.success === 1) {
                        this.viewUser(fromUsername);
                    }
                }, error => {
                    console.log(error);
                });
        }
    },
    created() {
        const accessToken = localStorage.getItem('accessToken');
        this.username = localStorage.getItem('username');
        const header = {
            Authorization: `Bearer ${accessToken}`
        };
        this.$http.post('get_requests', {username: this.username}, {headers: header})
            .then(response => {
                if (response.body.success === 1) {
                    this.users = [...response.body.data]
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

