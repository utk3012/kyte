<template>
    <div>
        <app-navbar></app-navbar>
        
        <b-container fluid class="main-body">
        <div class="row">
        <div class="listBox">
        <div class="row friend-item" v-for="u in users" :key="u.id" @click="selectFriend(u.id)"
          :style="{'background-color': (selectedFriend === u.id) ? '#bcbcbc' : 'white'}">
                <div class="col-3">
                  <img :src="u.image" alt="u-img" width="50" height="50">
                </div>
    
    <div class="col-9">
      <div class="row">
        <div class="col-8">
      <strong>{{ u.name }}</strong>
        </div>
      <div class="col-4 text-muted">10:19</div>
      </div>
        <div class="row">
        <div class="col-8">
          Hello
        </div>
        <div class="col-4">
          seen
        </div>
      </div>
    </div>
                </div>
            </div>
            <div class="messageBox" v-if="selectedFriend !== -1">
                <div class="messageCase" ref="scrollMe">
                    <div class="messageWrapper" v-for="m in messages[selectedFriend]" :key="m.id+rerender" :class="{'text-right': (+m.s_id === myId)}">
                      <span class="messageItem" :style="{'background-color': (+m.s_id !== myId) ? '#0084FF' : '#bbbec4', 'color': (+m.s_id !== myId) ? 'white' : 'black'}">{{ m.msg }}
                        <!-- <span class="timeStamp text-muted">
                          {{ m.dts }}
                        </span> -->
                        </span>
                      </div>
                </div>
                <div class="formBox row">
                  <div class="col-11">
                  <b-form novalidate autocomplete="off" @submit.prevent="onSend">
                    <b-form-group>
                        <b-form-input id="message"
                                    type="text"
                                    v-model="mes"
                                    placeholder="Type your message">
                        </b-form-input>
                    </b-form-group>
                  </b-form>
                  </div>
                  <div class="col-1">
                  <b-button type="button" variant="success" :disabled="mes === ''">
                    Send
                  </b-button>
                  </div>
                </div>
            </div>
            <div v-else style="margin: 20px auto;">
              <h3>Select a chat!</h3>
          </div>
        </div>
        </b-container>
    </div>
    
</template>
<script>
import io from 'socket.io-client';

export default {
    data: () => {
        return {
            selectedFriend: -1,
            users: [],
            showMess: false,
            myId: 0,
            rerender: 0,
            messages: {},
            lastMessages: [],
            displayMessages: [],
            mes: '',
            socket: io('localhost:5000')
        };
    },
    methods: {
      async selectFriend(userId) {
          const res  = await this.$http.post('message/get', { 'r_id': userId, 'pag_no': 0});
          if (res.status === 200) {
            this.messages[userId] = [];
            this.messages[userId].push(...res.body.messages);
            this.messages[userId].sort(function compare(a, b) {
              const date1 = a.dts != null ? new Date(a.dts).getTime() : 0;
              const date2 = b.dts != null ? new Date(b.dts).getTime() : 0;
              return date1 - date2;
            });
            this.selectedFriend = userId;
          }
          setTimeout(() => {
              this.$refs.scrollMe.scrollTop = this.$refs.scrollMe.scrollHeight;
          }, 2);
      },
      async onSend() {
        if (this.mes === '') {
          return;
        }
        try {
          const res = await this.$http.post('message/send', {msg: this.mes, 'r_id': this.selectedFriend});
          if (res.status === 200) {
            this.messages[this.selectedFriend].push({'id': res.body.id, 'msg': this.mes, 's_id': this.myId, 'r_id': this.selectedFriend, 'dts': res.body.dts, 'seen': 1});
          }
        }
        catch (error) {
          console.log(error);
        }
        this.$refs.scrollMe.scrollTop = this.$refs.scrollMe.scrollHeight;
        this.mes = '';
      }
    },
    async created() {
        const token = localStorage.getItem('token');
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace('-', '+').replace('_', '/');
        this.myId = JSON.parse(atob(base64)).userId;
        this.socket.emit('join_chat', this.myId);
        this.socket.on('message', (msg) => {
          this.messages[msg.s_id].push(msg);
          this.rerender += 1;
        });
        try {
            const res = await this.$http.post('user/getfriends');
            if (res.status === 200) {
              this.users = [...res.body.friends];
              for (let u of this.users) {
                this.messages[u.id] = [];
              }
            }
        }
        catch (error) {
            console.log(error);
        }
    },
    beforeDestroy() {
      this.socket.emit('leave_chat', this.myId);
    }
}
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css?family=Lato');
.listBox {
  background-color: #f7f7f7;
  width: 28%;
  border-right: 1px solid #bcbcbc;
  overflow-y: scroll;
  overflow-x: hidden;
  padding: 0px;
  height: calc(100vh - 62px);
}
.messageBox {
  height: calc(100vh - 62px);
  width: 72%;
  overflow-y: hidden;
}
.friend-item {
  height: 12vh;
  align-items: center;
  border-bottom: 1px solid #d7dde5;
  cursor: pointer;
}
.friend-item:hover {
  background-color: #e4e2e2 !important;
  transition: cubic-bezier(0.175, 0.885, 0.32, 1.275)
}
.friend-item img {
  margin: 0 1vw;
  border-radius: 50%;
}
.messageCase {
  height: calc(100vh - 62px - 58px);
  padding: 10px 20px;
  overflow-y: scroll;
}
.messageItem {
  padding: 4px 14px;
  border-radius: 21px;
}
.messageWrapper {
  margin-bottom: 7px;
  font-family: 'Lato', 'sans serif'
}
.timeStamp {
  font-size: 10px;
}
.formBox {
  width: 72%;
  position: absolute;
  bottom: 0;
}
input[type=text] {
  margin-left: 14px;
  border-radius: 25px;
}
</style>
