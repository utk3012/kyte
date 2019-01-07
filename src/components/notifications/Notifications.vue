<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container">
            <br>
        <div class="row justify-content-center">
			<div class="col-sm-10 col-md-10 col-lg-8">
            
                <h2>Notifications</h2>
                <span v-if="notifications.length === 0">
                <h4>No notifications</h4>
                </span>
                <span v-else>
                <div v-for="n in notifications" :key="n.createdAt" class="card" style="margin-bottom: 10px">
                    <div class="card-body row">
                        <div class="col-8">
                            {{ n.notif }}
                        </div>
                        <div class="col-4">
                            <div class="row justify-content-end text-muted">
                                {{ getRelativeTime(n.createdAt) }}&nbsp;
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
const moment = require('moment');

export default {
    data: () => {
        return {
            notifications: []
        };
    },
    async created() {
        try {
            const res = await this.$http.post('user/getnotifications')
            if (res.status === 200) {
                this.notifications = res.body.notifications;
                this.notifications.sort(function compare(a, b) {
                    const date1 = a.createdAt != null ? new Date(a.createdAt).getTime() : 0;
                    const date2 = b.createdAt != null ? new Date(b.createdAt).getTime() : 0;
                    return date2 - date1;
                });
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    methods: {
        getRelativeTime(tim) {
            return moment(tim).fromNow();
        }
    }
}
</script>

