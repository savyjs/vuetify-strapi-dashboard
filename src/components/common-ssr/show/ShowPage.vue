<template>
  <section>
    <v-container grid-list-lg>
      <v-card :loading="loader">
        <vsd-v-card-header
          margin-top="0"
          margin-bottom="0"
          margin-right="1%" width="98%">
          <v-layout :class="`pa-1 `+ (vsd.rtl ? 'rtl':'')">
            <v-flex :class="`pa-1 `  + (vsd.rtl ? `text-right` : `text-left`)">
              <v-subheader>
                <v-icon class="mx-1">{{ icon || headerIcon || 'eye' }}</v-icon>
                {{ title }}
              </v-subheader>
            </v-flex>
            <v-flex :class="`pa-1 ` + (vsd.rtl ? `text-left` : `text-right`)">
              <v-btn v-if="showBack" small color="warning" class="mx-1 px-4" :to="backUrl">
                <v-icon class="mx-1">backspace</v-icon>
                {{ $t("back") }}
              </v-btn>
              <v-btn v-if="editItem" class="mx-1 px-5" small
                     color="success"
                     :to="`${backUrl}/edit/${id}`">
                <v-icon class="mx-1">edit</v-icon>
                {{ $t("edit") }}
              </v-btn>
              <v-btn fab icon v-if="_.get(value,'refresh',true)" small class="mx-1"
                     color="white"
                     @click="loadData">
                <v-icon>refresh</v-icon>
              </v-btn>
            </v-flex>
          </v-layout>
        </vsd-v-card-header>
        <v-card-text>
          <table class="oddTable">
            <tbody>
            <tr v-for="field in getFields" v-if="canShow(field) && hasPermission(field)">
              <td>
                <v-icon class="mx-1 font-15 pb-1">{{ _.gt(field, 'icon', 'perm_identity') }}</v-icon>
                {{ _.get(field, 'text', '') }}
              </td>
              <td :class="_.get(field,'direction','') ? ('hasDirection ' + _.get(field,'direction','')) : undefined">
                <common-types-show
                  @update="update"
                  @reload="loadData"
                  :item="formData"
                  :fields="fields"
                  :value="_.get(formData,_.get(field,'value',null),'-')"
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
  "en": {
    "back": "back",
    "edit": "edit",
    "can_not_update": "can not update",
    "problem_id": "Id not found",
    "successful": "done"
  },
  "fa": {
    "back": "برگشت",
    "problem_id": "مشکلی در پیدا کردن شناسه رخ داد",
    "edit": "ویرایش",
    "can_not_update": "مشکلی در بروزرسانی رخ داد",
    "successful": "با موفقیت انجام شد"
  }
}
</i18n>
<script>
import formHelper from './FormHelper';

export default {
  props: ['value', 'id'],
  mixins: [formHelper]
}
</script>
