<template>
    <div>
        <b-container style="margin-top: 20vh;">
		<div class="row text-center">
			<div class="col-sm-12">
				<h2>Kyte - Change Password</h2>
				<br>
			</div>
		</div>
		<div class="row justify-content-center">
			<div class="col-sm-10 col-md-8 col-lg-6">
                    <b-card v-if="invalidMessage === ''">
                        <!-- <div class="card-body"> -->
                <b-row>
                    <div class="col-3 col-sm-2 col-xl-1">
                        <img :src="user.image" alt="profile-img" class="rounded-circle" width="50px"
                            height="50px" style="cursor: pointer">
                    </div>
                    <div class="col-6 col-sm-7 col-xl-8 offset-1" style="margin-top: 10px;">
                        <h4 class="card-title">&nbsp; {{ user.name }}</h4>
                    </div>
                </b-row>
                    <!-- </div> -->
                    </b-card>
                <br>
                <b-form @submit="onSubmit" novalidate autocomplete="off">
                    <b-form-group :invalid-feedback="invalidPassword" :state="statePassword">
                        <b-form-input id="password"
                                    type="password"
                                    :state="statePassword"
                                    v-model="password.first"
                                    placeholder="Enter Password">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group :invalid-feedback="invalidConPassword" :state="stateConPassword">
                        <b-form-input id="passwordCon"
                                    type="password"
                                    :state="stateConPassword"
                                    v-model="password.second"
                                    placeholder="Confirm Password">
                        </b-form-input>
                    </b-form-group>
                    <b-alert variant="danger" :show="invalidMessage.length > 0">
                        {{ invalidMessage }}
                    </b-alert>
                    <b-alert variant="success" :show="passChanged">
                        Password has been reset
                    </b-alert>
                    <b-button type="submit" variant="dark" :disabled="!buttonEnable">Change Password</b-button>
                    &nbsp;
                    <b-button to='/reset' variant="dark" v-if="invalidMessage !== ''">Reset Password</b-button>
                </b-form>
			</div>
		</div>
    </b-container>
    </div>
</template>
<script>
export default {
    data() {
        return {
            token: '',
            password: {
                first: '',
                second: ''
            },
            invalidMessage: '',
            passChanged: false,
            user: {
                name: '',
                image: '',
                id: '',
                created: ''
            }
        }
    },
    computed: {
        statePassword () {
            if (this.password.first === '') {
                return null;
            }
            return this.password.first.length >= 5 ? true : false
        },
        invalidPassword() {
            return this.password.first.length < 5 ? 'Should be atleast 5 characters long' : ''
        },
        stateConPassword () {
            if (this.password.second === '') {
                return null;
            }
            return this.password.first ===  this.password.second ? true : false
        },
        invalidConPassword() {
            return this.password.first !== this.password.second ? 'Passwords do not match' : ''
        },
        buttonEnable() {
            if (this.invalidMessage === '' && this.statePassword && this.stateConPassword && this.password.second !== '') {
                return true;
            }
            return false;
        }
    },
    async created() {
        console.log(this.$route.params.token);
        this.token = this.$route.params.token;
        try {
            const res = await this.$http.post('login/check-token', { token: this.token });
            if (res.status === 200) {
                this.user = res.body.user;
            }
        }
        catch (error) {
            if (error.status === 422) {
                this.invalidMessage = (error.body.success === 0) ? 'Reset token has expired' : 'Reset Token invalid';
            }
            console.log(error);
        }
    },
    methods: {
        async onSubmit(e) {
            e.preventDefault();
            if (!this.stateConPassword) {
                return;
            }
            const res = await this.$http.post('login/change-password', { token: this.token, password: this.password.first, id: this.user.id });
            if (res.status === 200) {
                this.$router.push('/login');
            }
        }
    }
}
</script>
<style scoped>

</style>


