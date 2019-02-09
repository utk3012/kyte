<template>    
    <b-container style="margin-top: 24vh;">
		<div class="row text-center">
			<div class="col-sm-12">
				<h2>Kyte - Reset Password</h2>
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
                                    v-model="email"
                                    placeholder="Enter email">
                        </b-form-input>
                    </b-form-group>
                    <b-alert variant="danger" :show="invalidMessage.length > 0">
                        {{ invalidMessage }}
                    </b-alert>
                    <b-alert variant="success" :show="resetSent">
                        Reset link has been sent to your email
                    </b-alert>
                    <b-button type="submit" variant="dark">Reset</b-button>
                </b-form>
			</div>
		</div>
    </b-container>
    
</template>
<script>
export default {
    data: () => {
        return {
            email: '',
            invalidMessage: '',
            resetSent: false,
            re: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        };
    },
    methods: {
        async onSubmit(evt) {
            evt.preventDefault();
            try {
                const res = await this.$http.post('login/reset', { email: this.email });
                if (res.status === 200) {
                    this.resetSent = true;
                }
                
            }
            catch (err) {
                console.log(err);
                if (err.status === 422 || err.status === 401) {
                    this.invalidMessage = err.body.msg;
                    setTimeout(() => {
                        this.invalidMessage = '';
                    }, 5000);
                }
            }
        }
    },
    computed: {
        stateEmail () {
            if (this.email === '') {
                return null;
            }
            return this.re.test(this.email);
        },
        invalidEmail() {
            if (!this.re.test(this.email)) {
                return 'Invalid email';
            }
            return '';
        }
    }
}
</script>