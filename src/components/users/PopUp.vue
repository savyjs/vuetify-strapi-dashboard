<template>
  <v-card elevation="5">
    <v-card-title>
      <h3>
        <v-icon>book</v-icon>
        مشاهده جزئیات
      </h3>
      <v-spacer/>
      <v-btn fab icon @click="$emit('closeIt',true)" small color="error">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <table class="oddTable">
        <tbody>
        <template v-for="field in showFields">
          <tr>
            <td class="grey--text">
              <v-icon class="font-15">{{_.get(field,'icon','keyboard_arrow_left')}}</v-icon>
              {{field.text}}
            </td>
            <td v-if="field.value =='blocked' || field.value =='confirmed'">
              <v-icon>{{_.get(item,field.value,false) ? 'check' : 'close'}}</v-icon>
            </td>
            <td v-else-if="field.value =='created_at' || field.value =='updated_at'">
              {{$Helper.toJalaali(_.get(item,field.value,'-'))}}
            </td>
            <td v-else>{{_.get(item,field.value,'-')}}</td>
          </tr>
        </template>
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
  import fields from '~/assets/admin/users/fields.js'

  const showFields = fields.show
  export default {
    props: ['value'],
    data() {
      return {
        showFields
      }
    },
    computed: {
      item() {
        console.log(this.value)
        return _.get(this, 'value', {});
      }
    },
  }
</script>
