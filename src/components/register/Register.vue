<template>
    <div class="container" style="margin-top: 12vh;">
		<div class="row text-center">
			<div class="col-sm-12">
				<h2>Kyte - Register</h2>
				<br>
			</div>
		</div>
		<div class="row justify-content-center">
			<div class="col-sm-10 col-md-8 col-lg-6">
				<b-form @submit="onRegister" novalidate autocomplete="off">
                    <b-form-group :invalid-feedback="invalidName" :state="stateName">
                        <b-form-input id="name"
                                    type="text"
                                    v-model="user.name"
                                    :state="stateName"
                                    placeholder="Enter name">
                        </b-form-input>
                    </b-form-group>
                    <b-form-row>
                    <b-form-group class="col md-6" :invalid-feedback="invalidEmail" :state="stateEmail">
                        <b-form-input id="email"
                                    type="email"
                                    v-model="user.email"
                                    :state="stateEmail"
                                    placeholder="Enter email">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group class="col md-6" :invalid-feedback="invalidUsername" :state="stateUsername">
                        <div class="input-group">
							  <div class="input-group-prepend">
									<div class="input-group-text">@</div>
								  </div>
                        
                        <b-form-input id="username"
                                    type="text"
                                    v-model="user.username"
                                    :state="stateUsername"
                                    placeholder="Enter username">
                        </b-form-input>
                        </div>
                    </b-form-group>
                    </b-form-row>
                    <b-form-group :invalid-feedback="invalidPassword" :state="statePassword">
                        <b-form-input id="password"
                                    type="password"
                                    v-model="user.password"
                                    :state="statePassword"
                                    placeholder="Enter Password">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="Birthday" label-for="birthday" :invalid-feedback="invalidBirthday" :state="stateBirthday">
                        <b-form-input id="birthday"
                                    type="date"
                                    v-model="user.birthday"
                                    :state="stateBirthday">
                        </b-form-input>
                    </b-form-group>

                    <b-form-group label="Gender">
                    <b-form-radio-group id="gender" v-model="user.gender" name="gender">
                        <b-form-radio value="male">Male</b-form-radio>
                        <b-form-radio value="female">Female</b-form-radio> 
                    </b-form-radio-group>
                    </b-form-group>
                    <b-alert variant="danger" :show="invalidMessage.length > 0">
                        {{ invalidMessage }}
                    </b-alert>
                    <b-button type="submit" variant="dark">Register</b-button>
                    &nbsp;
                    <b-button to="/login" type="button" variant="outline-dark">Login</b-button>
                </b-form>
			</div>
		</div>
	</div>
</template>
<script>
export default {
    data: () => {
        return {
            user: {
                name: "",
                email: "",
                password: "",
                username: "",
                birthday: "",
                gender: ""
            },
            invalidMessage: '',
            re: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };
    },
    methods: {
        async onRegister(evt) {
            evt.preventDefault();
            let res;
            try {
                res = await this.$http.post('register', this.user);
                if (res.status === 200) {
                    this.$router.push('login');
                }
            }
            catch (err) {
                console.log(err);
                if (err.status === 422) {
                    this.invalidMessage = err.body.msg;
                }
            }
        } 
    },
    computed: {
        stateName () {
            if (this.user.name === '') {
                return null;
            }
            return this.user.name.length >= 3 ? true : false
        },
        invalidName() {
            return this.user.name.length < 3 ? 'Name should be atleast 3 characters' : ''
        },
        stateEmail () {
            if (this.user.email === '') {
                return null;
            }
            return this.re.test(this.user.email);
        },
        invalidEmail() {
            if (!this.re.test(this.user.email)) {
                return 'Invalid email';
            }
        },
        statePassword () {
            if (this.user.password === '') {
                return null;
            }
            return this.user.password.length >= 5 ? true : false
        },
        invalidPassword() {
            return this.user.password.length < 5 ? 'Invalid password' : ''
        },
        stateUsername () {
            if (this.user.username === '') {
                return null;
            }
            let re = /^[a-z0-9]+$/i;
            return (this.user.username.length >= 5 && re.test(this.user.username)) ? true : false
        },
        invalidUsername() {
            let re = /^[a-z0-9]+$/i;
            if (!re.test(this.user.username)) {
                return 'Should be alpha-numeric'
            }
            else if (this.user.username.length < 5) {
                return 'Should be atleast 5 characters'
            }
        },
        stateBirthday() {
            let ye = Number(this.user.birthday.substring(0, 4));
            if (ye === 0) {
                return null;
            }
            return (ye >= (new Date().getFullYear()-10) || ye < 1900) ? false : true;
        },
        invalidBirthday() {
            let ye = Number(this.user.birthday.substring(0, 4));
            if (ye >= (new Date().getFullYear()-10) || ye < 1900) {
                return 'Invalid';
            }
        }
    },
}
</script>