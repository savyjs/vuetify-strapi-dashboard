<template>
  <span class="text-center mx-2">
        <v-btn
          :loading="loader"
          text
          fab
          icon
          small
          :color="color"
          @click="menu=!menu"
        >
          <v-icon>notifications</v-icon>
          </v-btn>
     <v-menu
       v-model="menu"
       :close-on-content-click="false"
       :nudge-width="200"
       offset-x
     >
      <v-card>
        {{messageRxd}}
          <v-card-actions>
          <v-btn
            :to="crmNotification"
            text
            class="green--text"
            small>
              <v-icon class="mx-1" small>list</v-icon>
              <small>{{$t('all')}}</small>
          </v-btn>
            <v-spacer/>
          <v-btn
            @click="getNotifications"
            fab
            icon
            :loading="loader"
            class="green--text"
            small>
              <v-icon class="mx-1" small>refresh</v-icon>
          </v-btn>
          </v-card-actions>
                        <v-divider/>
        <v-list v-if="getUnreadMessages.length">
          <v-list-item class="grey lighten-4" v-for="(message,i) in getUnreadMessages" :key="i">
            <v-list-item-content>
                <small>{{message.text}}</small>
            </v-list-item-content>
            <v-list-item-icon>
                <v-icon small v-if="message.type">{{icons[message.type] || icons['alert']}}</v-icon>
              </v-list-item-icon>
              <v-list-item-icon>
                <v-btn
                  @click="markRead(message)"
                  class="green--text"
                  icon
                  flat
                  small
                >
                <v-icon small>check</v-icon>
              </v-btn>
              </v-list-item-icon>
          </v-list-item>
        </v-list>
          <div class="full font-12 text-center ma-1 grey--text lighten-1" v-else>
              {{$t('empty')}}
          </div>
        <v-divider/>
        <v-card-actions>
            <v-btn class="" x-small color="success" @click="markAllRead()">
                <v-icon small class="mx-1">check</v-icon>
                {{$t('mark_all')}}
            </v-btn>
            <v-spacer/>
            <v-btn class="" x-small color="error" @click="menu = false">
                <v-icon small class="mx-1">close</v-icon>
                {{$t('close')}}
            </v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

  </span>
</template>

<i18n>
{"en":{
  "mark_all" : "mark all as read",
  "close" : "close",
  "all" : "all messages",
  "empty" : "empty",
  "profile_details" : "profile data",
  "logout" : "logout"
},
  "fa" : {
    "mark_all" : "مارک همه به عنوان خوانده شده",
    "close" : "بستن",
    "all" : "همه پیام ها",
    "empty" : "هیچ پیامی نیست",
    "edit_profile" : " ویرایش پروفایل",
    "profile_details" : "مشاهده اطلاعات پروفایل"
  }}
</i18n>
<script>
import _ from 'lodash'
/*
  import io from 'socket.io-client'
  const socketServer = 'http://socket.savyjs.com';
  const socket = io(socketServer, {
    path: '/sc'
  });
  socket.on("connect", () => {
    // console.log(socket.connected); // true
  });
*/
export default {
  props: ['color'],
  data() {
    return {
      icons: {
        error: '',
        success: '',
        alert: '',
        info: '',
      },
      messageRxd: '',
      loader: false,
      menu: false,
      count: 1,
      socket: {},
      messages: []
    }
  },
  computed: {
    getUnreadMessages() {
      let messages = this.messages.filter(item => !item.seen);
      return _.take(messages, 10);
    },
    crmNotification() {
      return _.get(this.vsd, 'notification.show', '/crm/notifications')
    }
  },
  methods: {
    getMessages() {
      /*socket.emit('join', {room: 1, username: 'abc123'}, (error) => {
        alert('hi');
        if (error) {
          // alert(error);
        } else {
          // alert('connect');
          socket.on('welcome', (data) => {
            // alert(data);
          });
        }
      });*/
    },
    markAllRead() {
      this.loader = true;
      let url = _.get(this.vsd, 'notification.url', '/notifications') + '/read-all';
      this.$axios.$post(url).then(res => {
        this.messages = res;
      }).catch(err => {
        console.error({err})
      }).finally(() => {
        this.loader = false;
      })
    },
    markRead(message) {
      this.loader = true;
      let url = _.get(this.vsd, 'notification.url', '/notifications') + '/' + message.id;
      this.$axios.$put(url, {seen: true}).then(res => {
        this.markAllRead()
      }).catch(err => {
        console.error({err})
      }).finally(() => {
        this.loader = false;
      })
    },
    getNotifications() {
      this.getMessages();
      this.loader = true;
      let url = _.get(this.vsd, 'notification.url', '/notifications');
      this.$axios.$get(url).then(res => {
        this.messages = res;
      }).catch(err => {
        console.error({err})
      }).finally(() => {
        this.loader = false;
      })
    }
  },
  created() {
    this._ = _;
    this.getNotifications();
  },
  mounted() {
    this.getNotifications();
  }
}
</script>
