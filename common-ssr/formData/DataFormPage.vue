<template>
  <section v-if="!isModal">
    <v-container grid-list-lg>
      <v-card :loading="loader">
        <v-form lazy-validation v-model="validity">
          <v-card-header v-if="showSimple!==true" class="text-left">
            <v-layout wrap row class="pa-1">
              <v-flex class="pa-1 text-right">
              <span>
                <v-icon class="mx-1">{{headerIcon || 'edit'}}</v-icon>
                {{title}}
              </span>
              </v-flex>
              <v-flex class="pa-1 text-left">
                <v-btn v-if="showBack!==false" small color="white" class="mx-2  warning--text" :to="back">
                  <v-icon class="mx-1">backspace</v-icon>
                  برگشت
                </v-btn>
                <v-btn :disabled="!validity" class="px-5 mx-2 success--text" small color="white" @click="save">
                  <v-icon class="mx-1">save</v-icon>
                  ذخیره
                </v-btn>
              </v-flex>
            </v-layout>
          </v-card-header>
          <v-card-actions v-else class="text-left">
            <v-layout wrap row class="pa-1">
              <v-flex class="pa-1 text-right">
                <v-subheader>
                  <v-icon class="mx-1">edit</v-icon>
                  {{title}}
                </v-subheader>
              </v-flex>
              <v-flex class="pa-1 text-left">
                <v-btn v-if="showBack!==false" small color="warning" class="mx-4" :to="back">
                  <v-icon class="mx-1">backspace</v-icon>
                  برگشت
                </v-btn>
                <v-btn class="px-5" small color="success" @click="save">
                  <v-icon class="mx-1">save</v-icon>
                  ذخیره
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
              {{_.get(btn,'text','ذخیره')}}
            </v-btn>
          </v-flex>
        </v-layout>
      </v-card-actions>
    </v-card>
  </section>
</template>
<script>
  import DataForm from "./DataForm";
  import formHelper from './strapi';
  import VCardHeader from "../../ui/VCardHeader";

  export default {
    props: ['value', 'isModal', 'config', 'name', 'fields', 'title', 'showBack', 'showSimple', 'headerIcon', 'resource'],
    ...formHelper,
    data() {
      return {
        validity: null,
        canSave: false,
        ...formHelper.getData,
        formData: {
          ...this.value
        }
      }
    },
    computed: {
      type() {
        return _.has(this.formData, 'id') ? 'edit' : 'create'
      },
      back() {
        return '/admin/' + this.name
      }
    },
    components: {VCardHeader, DataForm},
  }
</script>
