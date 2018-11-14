<template>
    <div>
        <app-navbar></app-navbar>
        <div class="container" v-if="myId">
        <div class="w3-col m4 listBox">
        <h3 v-if="users.length === 0" class="w3-center">No friends</h3>
        <div class="friend-item w3-row" v-for="user in users" :key="user.id"
            @click="selectFriend(user.id)"
            :style="{'background-color': selectedFriend === user.id ? 'lightblue' : 'white'}">
            <div class="w3-col m3">
            <img :src="user.image" alt="user-img" width="50" height="50">
            </div>
            <!-------------------------------------------------------------------------------->
            <div class="w3-col m12" v-if="lastMessages[user.id]">
            <div class="w3-row">
                <div class="w3-col m10">
            <strong>{{ user.name }}</strong>
                </div>
            <div class="w3-col m2 w3-right" style="padding-right: 1vw">{{ lastMessages[user.id].dts }}</div>
            </div>
            <div class="w3-row">
            <div class="w3-col m10">
                {{ lastMessages[user.id].msg }}
            </div>
            <div class="w3-col m2 w3-right" style="padding-right: 1vw">
                <!--<span style="color: blue">{{ lastMessages[user.id].seen === 't' ? 'Seen' : '' }}</span>-->
            </div>
            </div>
            </div>
            <!-------------------------------------------------------------------------------->
            <div class="w3-col m12" v-if="!lastMessages[user.id]">
            <div class="w3-row">
                <div class="w3-col m10">
                <strong>{{ user.name }}</strong>
                </div>
                <div class="w3-col m2 w3-right" style="padding-right: 1vw">&nbsp;</div>
            </div>
            <div class="w3-row">
                <div class="w3-col m10">
                &nbsp;
                </div>
                <div class="w3-col m2 w3-right" style="padding-right: 1vw">
                <span class="">&nbsp;</span>
                </div>
            </div>
            </div>
            <!------------------------------------------------------------------------------ -->
        </div>
        </div>
        <div class="w3-col m8 messageBox" style="overlfow-y: scroll;" ref="scrollMe">
        <div class="w3-row">
            <div class="w3-col m12" v-if="selectedFriend !== -1">
            <div>
                <div class="messageScroll">
                <div class="messageCase" v-for="(m, index) in messages" :key="index">
                    <span class="messageItem"
                            :class = "{'w3-right': +m.s_id === myId}"
                            :style = "{'background-color': (+m.s_id !== myId) ? '#ededed' : '#8f959e'}">
                        {{ m.msg }}
                    </span>
                    <br>
                </div>
                </div>
                <div style="height: 50px"></div>
                <form>
                    <div class="w3-row formBox">
                    <div class="w3-col m11">
                        <input class="w3-input w3-border" type="text" id="mess" name="message" v-model="mes" placeholder="Type your message here!" autocomplete="off" size="45">
                    </div>
                    <div class="w3-col m1">
                        <button type="submit" class="w3-button w3-block w3-green" @click.prevent="onSend">
                        Send
                        </button>
                    </div>
                    </div>
                </form>
            </div>
            <div v-if="selectedFriend === -1">
                <div class="w3-center">
                <h3>Select a chat</h3>
                </div>
            </div>
            </div>
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
            selectedFriend: -1,
            username: '',
            users: [],
            showMess: false,
            myId: 0,
            messages: [],
            lastMessages: [],
            mes: ''
        };
    },
    methods: {
        getLastMessages() {
            for (let f of this.users) {
            for (let i = this.messages.length - 1; i>=0; i--) {
                const m = this.messages[i];
                if (m.s_id === f.id || m.r_id === f.id) {
                const tim = (new Date(m.dts).toISOString()).split('T')[1].substring(0, 5);
                this.lastMessages[f.id] = {msg: m.msg, dts: tim, seen: m.seen};
                break;
                }
            }
            }
        },
        selectFriend(userId) {
            this.selectedFriend = userId;
            setTimeout(() => {
                this.$refs.scrollMe.scrollTop = this.$refs.scrollMe.scrollHeight;
            }, 2);
        }
    },
    created() {
        const accessToken = localStorage.getItem('accessToken');
        this.username = localStorage.getItem('username');
        const header = {
            Authorization: `Bearer ${accessToken}`
        };
        this.$http.post('friends', {username: this.username}, {headers: header})
            .then(response => {
                if (response.body.success === 1) {
                    this.users = [...response.body.data];
                    this.$http.post('get_messages', {username: this.username, dts: '2018-09-23T10:01:00'}, {headers: header})
                        .then(resp => {
                            this.messages = [...resp.body.data];
                            this.getLastMessages();
                            this.myId = response.body.myid;
                        }, error => {
                            console.log(error);
                        });
                }
                else {
                    this.users = [];
                }
                this.showMess = true;
            }, error => {
                console.log(error);
            });
    }
}
</script>

<style scoped>
.container {
  overflow-y: hidden;
}
.listBox {
  background-color: #f7f7f7;
  height: 93vh;
  margin-top: 7vh;
  border-right: 1px solid #bcbcbc;
  overflow-y: auto;
}
.messageBox {
  height: 93vh;
  margin-top: 7vh;
  overflow-y: auto;
}
.friend-item {
  height: 12vh;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #d7dde5;
  cursor: pointer;
}
.friend-item img {
  margin: 0 2vw;
  border-radius: 50%;
}
.messages {
  height: 80vh;
}
.messageItem {
  padding: 4px 14px;
  margin-bottom: 4px;
  border-radius: 21px;
}
.messageCase {
  margin: 15px;
}
.formBox {
  width: 63vw;
  position: absolute;
  bottom: 0;
}
input[type=text] {
  margin: 10px;
  border-radius: 4px;
}
.formBox button {
  border-radius: 4px;
  padding-left: 10px;
  margin-left: 20px;
  margin-top: 10px;
}
</style>
