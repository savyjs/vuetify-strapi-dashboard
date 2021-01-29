<template>
  <span class="text-center mx-2">
        <v-btn
          text
          fab
          icon
          @click="menu=!menu"
        >
          <v-icon color="white">notifications</v-icon>
          </v-btn>
     <v-menu
       v-model="menu"
       :close-on-content-click="false"
       :nudge-width="200"
       offset-x
     >
      <v-card>
        <v-list>
          <v-list-item class="grey lighten-4">
            <v-list-item-content v-for="message in messages" :key="message.title">
              <v-list-item-title>
                <v-icon small>{{icons[message.type] || icons['alert']}}</v-icon>
                {{message.title}}</v-list-item-title>
              <v-list-item-subtitle>{{message.text}}</v-list-item-subtitle>
            </v-list-item-content>

            <v-list-item-action>
              <v-btn
                to="/admin/notification/show/1"
                class="green--text"
                icon
                small
              >
                <v-icon small>input</v-icon>
              </v-btn>
              <v-checkbox class="mt-2"/>
            </v-list-item-action>
          </v-list-item>
        </v-list>

        <v-divider></v-divider>

        <v-list>

          <v-list-item>
            <v-list-item-action>
              <v-checkbox v-model="sms" color="purple"></v-checkbox>
            </v-list-item-action>
            <v-list-item-title>تایید همه</v-list-item-title>
          </v-list-item>
        </v-list>

        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn outlined @click="menu = false">بستن</v-btn>
        </v-card-actions>
      </v-card>
    </v-menu>

  </span>
</template>
<script>
  export default {
    data() {
      return {
        icons: {
          error: '',
          alert: '',
        },
        menu: false,
        sms: "",
        count: 1,
        messages: [
          {
            type: 'error',
            title: 'هشدار قطعی سیستم',
            text: 'لطفا با مدیر سیستم تماس بگیرید. اتصال به سامانه با اختلال مواجه شده است.'
          }
        ]
      }
    },
  }
</script>
