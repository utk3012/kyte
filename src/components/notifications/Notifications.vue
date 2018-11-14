<template>
    <div>
        <app-navbar></app-navbar>
        <div class="w3-container w3-content" style="max-width:1400px;margin-top:80px">
        <div class="w3-row">
            <div class="w3-col m2" style="color: white;">*</div>
            <div class="w3-col m8">
            <ul class="w3-ul w3-border">
                <li><h2>Notifications</h2></li>
                <span v-if="showMess">
                <li><h4>No notifications</h4></li>
                </span>
                <span v-if="!showMess">
                <li v-for="n in notifications" :key="n.time_stamp">
                    <h4>{{ n.notification }}</h4>
                </li>
                </span>
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
            showMess: false,
            notifications: []
        };
    },
    created() {
        const accessToken = localStorage.getItem('accessToken');
        const username = localStorage.getItem('username');
        const header = {
            Authorization: `Bearer ${accessToken}`
        };
        this.$http.post('get_notifications', {username: username}, {headers: header})
            .then(response => {
                if (response.body.success === 1) {
                    this.notifications = response.body.data;
                    this.notifications.sort(function compare(a, b) {
                    const date1 = a.time_stamp != null ? new Date(a.time_stamp).getTime() : 0;
                    const date2 = b.time_stamp != null ? new Date(b.time_stamp).getTime() : 0;
                    return date2 - date1;
                    });
                } else {
                    this.showMess = true;
                }
            }, error => {
                console.log(error);
            });
    }
}
</script>

