<template>
  <section v-if="!isModal">
    <v-container grid-list-lg>
      <v-card :loading="loader">
        <v-form lazy-validation v-model="validity">
          <v-card-header margin-right="1%" width="98%" v-if="showSimple!==true">
            <v-layout class="pa-1">
              <v-flex :class="`pa-1 `  + (vsd.rtl ? `text-right` : `text-left`)">
              <span class="px-1">
                <v-icon class="mx-1">{{headerIcon || icon || 'edit'}}</v-icon>
                {{title}}
              </span>
              </v-flex>
              <v-flex :class="`pa-1 ` + (vsd.rtl ? `text-left` : `text-right`)">
                <v-btn v-if="showBack!==false" small color="white" class="mx-2  warning--text" :to="back">
                  <v-icon class="mx-1">backspace</v-icon>
                  {{$t("back")}}
                </v-btn>
                <v-btn :disabled="!validity" class="px-5 mx-2 success--text" small color="white" @click="save">
                  <v-icon class="mx-1">save</v-icon>
                  {{$t("save")}}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-header>
          <v-card-actions v-else>
            <v-layout wrap row class="pa-1">
              <v-flex class="pa-1 text-right">
                <v-subheader>
                  <v-icon class="mx-1">{{headerIcon || 'edit'}}</v-icon>
                  {{title}}
                </v-subheader>
              </v-flex>
              <v-flex :class="`pa-1 ` + (vsd.rtl ? `text-left` : `text-right`)">
                <v-btn v-if="showBack!==false" small color="warning" class="mx-4" :to="back">
                  <v-icon class="mx-1">backspace</v-icon>
                  {{$t("back")}}
                </v-btn>
                <v-btn class="px-5" small color="success" @click="save">
                  <v-icon class="mx-1">save</v-icon>
                  {{$t("save")}}
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
          <v-card-text>
            <data-form
              :fields="fields"
              :type="type"
              name="name"
              title="title"
              v-model="formData"
              @save="save"
            />
          </v-card-text>
          <v-card-actions v-if="fields.length > 15" class="text-left">
            <v-layout wrap row class="pa-1">
              <v-flex xs12 class="pa-1 text-left">
                <v-btn :disabled="!validity" small color="success" @click="save">
                  <v-icon class="mx-1">save</v-icon>
                  ذخیره
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-container>
  </section>
  <section v-else>
    <v-card elevation="0">
      <v-card-text>
        <DataForm
          :fields="fields"
          :type="type"
          name="name"
          title="title"
          v-model="formData"
          @save="save"
        />
      </v-card-text>
      <v-card-actions class="text-left">
        <v-layout wrap row class="pa-1">
          <v-flex xs12 class="pa-1 text-center ">
            <v-btn
              :disabled="!canSave"
              class="mx-1" v-for="btn in _.get(config,'btns',[]) " :key="btn.text" large
              :color="_.get(btn,'color','success')"
              @click="doAction(btn)">
              <v-icon class="mx-1">{{_.get(btn,'icon','save')}}</v-icon>
              {{_.get(btn,'text',$t("save"))}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </section>
</template>

<i18n>
  {
  "en":{
  "problem_id":"Id not found",
  "back":"back",
  "save":"save",
  "success":"done",
  "":""
  },
  "fa":{
  "problem_id":"مشکلی در پیدا کردن شناسه رخ داد",
  "back":"برگشت",
  "save":"ذخیره",
  "success":"با موفقیت ذخیره شد"
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
