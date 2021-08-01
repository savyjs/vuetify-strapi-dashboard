<template>
  <span class="text-center mx-2">
        <v-btn
          text
          fab
          icon
          :to="`/admin/${envName}/settings`"
        >
          <v-icon color="white">settings</v-icon>
          </v-btn>
     <v-menu
       v-model="menu"
       :close-on-content-click="false"
       :nudge-width="200"
       offset-x
     >

      <v-card>

        <v-list>
         <v-list-item to="/admin/system/profile/edit">
           <v-list-item-title>ویرایش پروفایل مدیر</v-list-item-title>
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
  const envName = process.env.envName || 'system';
  export default {
    data() {
      return {
        menu: false,
        count: 1,
        envName,
      }
    },
  }
</script>
