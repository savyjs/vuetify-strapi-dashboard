<template>
  <section>
    <v-container grid-list-lg>
      <v-card :loading="loader">
        <v-card-actions class="text-left">
          <v-layout wrap row class="pa-1">
            <v-flex class="pa-1 text-right">
              <v-subheader>
                <v-icon class="mx-1">edit</v-icon>
                {{title}}
              </v-subheader>
            </v-flex>
            <v-flex class="pa-1 text-left">
              <v-btn v-if="_.get(main,'back',undefined)!==false" small color="warning" class="mx-4" :to="back">
                <v-icon class="mx-1">backspace</v-icon>
                {{$t("back")}}
              </v-btn>
              <v-btn v-if="_.get(main,'editItem',true) !==false" class="px-5" small color="success"
                     :to="`${back}/edit/${value.id}`">
                <v-icon class="mx-1">edit</v-icon>
                {{$t("edit")}}
              </v-btn>
            </v-flex>
          </v-layout>
        </v-card-actions>
        <v-card-text>
          <table class="oddTable">
            <tbody>
            <tr v-for="field in getHeaders" v-if="canShow(field) && hasPermission(field)">
              <td>
                <v-icon class="mx-1 font-15 pb-1">{{_.gt(field,'icon','perm_identity')}}</v-icon>
                {{_.get(field,'text','')}}
              </td>
              <td>
                <common-types-show
                  @update="update"
                  @reload="loadData"
                  :item="formData"
                  :fields="fields"
                  :value="_.get(item,_.get(field,'value',null),'-')"
                  :type="_.get(field,'type',null)"
                  :field="field"
                />
              </td>
            </tr>
            </tbody>
          </table>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

<i18n>
  {
  "en":{
  "can_not_update":"can not update",
  "successful":"done"
  },
  "fa":{
  "back":"برگشت",
  "edit":"ویرایش",
  "can_not_update":"مشکلی در بروزرسانی رخ داد",
  "successful":"با موفقیت انجام شد"
  }
  }
</i18n>
<script>
  import formHelper from './FormHelper';
  import options from './../../../options'

  let customListPageHelper = require(`./strapi`).default || {};
  try {
    customListPageHelper = options.apiShowHelper;
  } catch (e) {
    console.error({e})
  }

  export default {
    mixins: [formHelper, customListPageHelper],
    props: ['value']
  }
</script>
