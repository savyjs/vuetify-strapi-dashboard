<template>
  <section>
    <v-container grid-list-lg>
      <v-card class="mb-5 text-left">
        <v-card-actions class="text-left">
          <v-row align="center" align-content="center" class="pa-1">
            <v-col class="pa-1 text-right">
              <v-subheader>
                <v-icon class="mx-1">print</v-icon>
                {{title}}
              </v-subheader>
            </v-col>
            <v-col class="pa-1 text-left">
              <v-btn class="px-5" small color="success" @click="print">
                <v-icon class="mx-1">print</v-icon>
                پرینت
              </v-btn>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
      <v-card :loading="loader">
        <v-card-text>
          <v-row>
            <v-col
              v-for="field in getHeaders"
              :key="field.value"
              v-if="canPrint(field)"
              :cols="_.get(field,'cols',undefined)"
              :sm="_.get(field,'sm',undefined)"
              :md="_.get(field,'md',undefined)"
              :lg="_.get(field,'lg',undefined)"
            >
              <v-icon class="mx-1 font-15 pb-1">{{_.gt(field,'icon','perm_identity')}}</v-icon>
              <span v-if="hasColon(field)">{{_.get(field,'text','')}}: </span>
              <v-subheader v-if="!hasColon(field)">{{_.get(field,'text','')}}</v-subheader>

              <common-types-show
                :value="_.get(item,_.get(field,'value',null),undefined)"
                :type="_.get(field,'type',null)"
                :field="field"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>
  </section>
</template>

<i18n>
  {
  "en":{
  "can_not_update":"can not update",
  "successful":"done",
  "error":"an error occurred"
  },
  "fa":{
  "back":"برگشت",
  "edit":"ویرایش",
  "can_not_update":"مشکلی در بروزرسانی رخ داد",
  "successful":"با موفقیت انجام شد",
  "error":"مشکلی رخ داد"
  }
  }
</i18n>
<script>
  import formHelper from './FormHelper';

  export default {
    mixins: [formHelper]
  }
</script>
