<template>    
    <b-container style="margin-top: 24vh;">
		<div class="row text-center">
			<div class="col-sm-12">
				<h2>Social Media - Login</h2>
				<br>
			</div>
		</div>
		<div class="row justify-content-center">
			<div class="col-sm-10 col-md-8 col-lg-6">
                <b-form @submit="onSubmit" novalidate autocomplete="off">
                    <b-form-group :invalid-feedback="invalidEmail" :state="stateEmail">
                        <b-form-input id="email"
                                    type="email"
                                    :state="stateEmail"
                                    v-model="user.email"
                                    placeholder="Enter email">
                        </b-form-input>
                    </b-form-group>
                    <b-form-group :invalid-feedback="invalidPassword" :state="statePassword">
                        <b-form-input id="password"
                                    type="password"
                                    :state="statePassword"
                                    v-model="user.password"
                                    placeholder="Enter Password">
                        </b-form-input>
                    </b-form-group>
                    <b-alert variant="danger" :show="invalidMessage.length > 0">
                        {{ invalidMessage }}
                    </b-alert>
                    <b-button type="submit" variant="dark">Submit</b-button>
                    &nbsp;
                    <b-button to="/register" type="button" variant="outline-dark">Register</b-button>
                </b-form>
			</div>
		</div>
    </b-container>
    
</template>
<script>
export default {
    data: () => {
        return {
            user: {email: "", password: ""},
            invalidMessage: '',
            re: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault();
            let res;
            try {
                res = await this.$http.post('login', this.user);
                if (res.status === 200) {
                    localStorage.setItem('token', res.body.token);
                    this.$router.push('home');
                }
                
            }
            catch (err) {
                console.log(err);
                if (err.status === 422 || err.status === 401) {
                    this.invalidMessage = err.body.msg;
                }
            }
        }
    },
    computed: {
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
            if (this.user.password.length > 5) {
                return ''
            } 
            else if (this.user.password.length > 0) {
                return 'Invalid password'
            }
        }
    }
}
</script>