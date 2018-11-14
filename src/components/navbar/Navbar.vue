<template>
    <b-navbar toggleable="md" type="dark" variant="dark">

  <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

  <b-navbar-brand to="/home">Kyte</b-navbar-brand>

  <b-collapse is-nav id="nav_collapse">

    <b-navbar-nav>
        <b-nav-item to="/notifications" title="Notifications">Notifications</b-nav-item>
        <b-nav-item to="/friends" title="Friends">Friends</b-nav-item>
        <b-nav-item to="/message" title="Messages">Messenger</b-nav-item>
        <b-nav-item to="/requests" title="Friend Requests">Requests</b-nav-item>
        <b-nav-item to="/discover" title="Discover People">Discover</b-nav-item>
    </b-navbar-nav>

    <b-navbar-nav class="ml-auto">
      <b-nav-item-dropdown right>
        <template slot="button-content">
          {{ user.name }}
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

</style>


