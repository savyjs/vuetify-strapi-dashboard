<template>
  <v-card elevation="5">
    <v-card-title>
      <h3>
        <v-icon>flag</v-icon>
        پاپ آپ
      </h3>
      <v-spacer/>
      <v-btn fab icon @click="$emit('closeIt',true)" small color="error">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <table class="oddTable">
        <tbody>
        <tr>
          <td><v-icon class="mx-1 font-15 pb-1">perm_identity</v-icon>شناسه</td>
          <td>{{_.get(item,'id','-')}}</td>
        </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="error" @click="$emit('closeIt',true)">
        <v-icon>close</v-icon>
        بستن
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
  export default {
    props: ['value'],
    data() {
      return {}
    },
    computed: {
      item() {
        console.log(this.value)
        return _.get(this, 'value', {});
      }
    },
  }
</script>
