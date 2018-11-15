<template>
    <b-navbar toggleable="md" type="dark" variant="dark">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand to="/home"><span class="brand__logo">kyte</span></b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">
      <div class="d-md-none">
        <b-navbar-nav>
            <b-nav-item to="/home" title="Home">Home</b-nav-item>
            <b-nav-item to="/notifications" title="Notifications">Notifications</b-nav-item>
            <b-nav-item to="/friends" title="Friends">Friends</b-nav-item>
            <b-nav-item to="/message" title="Messages">Messenger</b-nav-item>
            <b-nav-item to="/requests" title="Friend Requests">Requests</b-nav-item>
            <b-nav-item to="/discover" title="Discover People">Discover</b-nav-item>
        </b-navbar-nav>
    </div>
    <div class="d-none d-md-block">
        <b-navbar-nav>
            <b-nav-item to="/home" title="Home">&nbsp;&nbsp;<i class="fas fa-home"></i> </b-nav-item>
            <b-nav-item to="/notifications" title="Notifications">&nbsp;&nbsp;<i class="fas fa-bell"></i> </b-nav-item>
            <b-nav-item to="/friends" title="Friends">&nbsp;&nbsp;<i class="fas fa-user-friends"></i> </b-nav-item>
            <b-nav-item to="/message" title="Messages">&nbsp;&nbsp;<i class="fas fa-envelope"></i></b-nav-item>
            <b-nav-item to="/requests" title="Friend Requests">&nbsp;&nbsp;<i class="fas fa-user-plus"></i></b-nav-item>
            <b-nav-item to="/discover" title="Discover People">&nbsp;&nbsp;<i class="fas fa-globe-asia"></i></b-nav-item>
        </b-navbar-nav>
    </div>
    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <template slot="button-content">
          {{ user.name ? user.name.split(' ')[0] : '' }}
        </template>
        <b-dropdown-item :to="`${user.username}`">Profile</b-dropdown-item>
        <b-dropdown-item @click="onLogout">Logout</b-dropdown-item>
      </b-nav-item-dropdown>
    </b-navbar-nav>

  </b-collapse>
</b-navbar>
</template>
<script>
import { mapActions } from 'vuex';
import { mapGetters } from 'vuex';

export default {
    methods: {
        ...mapActions(['getUser']),
        onLogout() {
            localStorage.removeItem('token');
            this.$router.push('login');
        }
    },
    computed: {
        ...mapGetters(['user'])
    },
    created() {
        this.getUser();
    }
}
</script>
<style>
@import url('https://fonts.googleapis.com/css?family=Kaushan+Script');
.brand__logo {
    font-family: 'Kaushan Script', cursive, sans-serif;
    font-size: 1.5rem;
}
</style>


