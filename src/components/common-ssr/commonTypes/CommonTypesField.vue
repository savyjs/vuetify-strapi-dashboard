<template>
  <div v-if="_.includes(['textarea','json'],type)">
    <v-textarea :rules="getRules" :placeholder="placeholder" :hint="hint" :label="label" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['rich'],type)">
    <text-editor :label="label" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['image'],type)">
    <select-photo :label="label" :getId="true" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['combobox'],type)">
    <v-combobox :rules="getRules" multiple chips :label="label" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['bool'],type)">
    <v-checkbox :rules="getRules" v-model="data" dense filled :label="label"/>
  </div>
  <div v-else-if="_.includes(['price'],type)">
    <v-text-field :rules="getRules"
                  :placeholder="placeholder"
                  v-model="data"
                  persistent-hint
                  :hint="hint"
                  :label="label"
                  dense
                  ref="data"
                  filled
    />
  </div>
  <div v-else-if="_.includes(['number'],type)">
    <v-text-field :rules="getRules" :placeholder="placeholder"
                  persistent-hint
                  :hint="hint"
                  :label="label"
                  dense
                  ref="data"
                  filled
                  v-model="data"
    />
  </div>
  <div v-else-if="_.includes(['dateTime'],type)">
    <date-time-picker :rules="getRules" :locale="getLocale" :hint="hint" :type="type" :field="field" v-model="data"
                      :label="label"/>
  </div>
  <div v-else-if="_.includes(['date'],type)">
    <date-picker :rules="getRules" :hint="hint" :locale="getLocale" v-model="data" :type="type" :field="field"
                 :label="label"/>
  </div>
  <div v-else-if="_.includes(['jdate'],type)">
    <date-picker :rules="getRules" :isJalali="true" :locale="getLocale" :hint="hint" v-model="data" :type="type"
                 :field="field"
                 :label="label"/>
  </div>
  <div v-else-if="_.includes(['select'],type)">
    <select-relation :rules="getRules" :hint="hint" v-model="data" :type="type" :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['enum'],type)">
    <select-enum :rules="getRules" :hint="hint" v-model="data" :type="type" :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['password'],type)">
    <v-text-field :rules="getRules" :placeholder="placeholder" :type="!toggle ? 'password' : 'text'"
                  @input="(val)=>data=val ?val: undefined" filled dense
                  :label="label">
      <template v-if="toggle" v-slot:append>
        <v-btn icon class="mb-1" @click="toggle=!toggle">
          <v-icon>visibility_off</v-icon>
        </v-btn>
      </template>
      <template v-else v-slot:append>
        <v-btn icon class="mb-1" @click="toggle=!toggle">
          <v-icon>visibility</v-icon>
        </v-btn>
      </template>
    </v-text-field>
  </div>
  <div v-else-if="type=='crud'">
    <CRUD
      @updateFormData="updateFormData"
      :formData="formData"
      v-model="data"
      :label="label"
      :field="field"
      dense :rules="getRules"
      filled
    ></CRUD>
  </div>
  <div v-else-if="type=='linearCrud'">
    <LinearCRUD
      @updateFormData="updateFormData"
      :formData="formData"
      v-model="data"
      :label="label"
      :field="field"
      dense :rules="getRules"
      filled
    ></LinearCRUD>
  </div>
  <div v-else-if="_.includes(['calc'],type)">
    <calc :rules="getRules" @updateFormData="updateFormData"
          :formData="formData" :hint="hint" v-model="data" :type="type" :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['label'],type)">
    <v-subheader>
      <v-icon>{{icon}}</v-icon>
      {{label}}
    </v-subheader>
    <v-divider v-if="hasDivider"/>
  </div>
  <div v-else-if="_.includes(['counter'],type)">
    <counter :rules="getRules" :outlined="false" v-model="data" :type="type" :label="label" :icon="icon"
             :field="field"/>
  </div>
  <div v-else-if="_.includes(['custom'],type)">
    <component
      :is="_.get(field,'meta.component',undefined)"
      :outlined="false"
      v-model="data" :rules="getRules"
      :place="place || 'create'"
      :type="type"
      :formData="formData"
      @updateFormData="updateFormData"
      :label="label"
      :icon="icon"
      :field="field"></component>
  </div>
  <div v-else>
    <v-text-field :rules="getRules" :placeholder="placeholder" persistent-hint :hint="hint" v-model="data" filled dense
                  :label="label"/>
  </div>
</template>

<i18n>
  {
  "en":{
  "$":"$"
  },
  "fa":{
  "$":"ریال"
  }
  }
</i18n>
<script>

  import _ from 'lodash'

  /**
   * @value: any - this property value
   * @type: String - this property type - image bool text rich ...
   * @item: Object - all properties of item
   * @field: Object - filed properties
   * */

  export default {
    name: 'CommonTypesField',
    props: ['value', 'formData', 'type', 'field', 'place'],
    data() {
      return {
        toggle: undefined,
        data: this.value,
        errorMessages: '',
      }
    },
    mounted() {
      this.data = this.initial;
    },
    computed: {
      getLocale() {
        return _.get(this.vsd, 'locale', undefined)
      },
      isNumeric() {
        return !!_.get(this.field, 'numeric', _.includes(['price', 'number'], this.type));
      },
      getRules() {
        return _.get(this.field, 'rules', undefined);
      },
      placeholder() {
        return _.get(this.field, 'placeholder', undefined)
      },
      hint() {
        let hint = _.get(this.field, 'hint', undefined);
        let unit = _.get(this.field, 'unit', undefined);
        let isNumber = _.includes(['number'], _.get(this.field, 'type', undefined));
        let isPrice = (_.get(this.field, 'isPrice', false) || _.includes(['price'], _.get(this.field, 'type', undefined)));
        hint = isNumber ? `${this.$Helper.numberFormat(this.data) || 0}` : hint;
        hint = isPrice ? ((this.$Helper.numberFormat(this.data) || 0) + this.$t("$")) : hint;
        hint = unit ? (((this.data) || '') + unit) : hint;
        return hint;
      },
      icon() {
        let icon = undefined;
        return _.get(this.field, 'icon', undefined);
      },
      hasDivider() {
        return _.get(this.field, 'divider', false);
      },
      initial() {
        // check path
        let value = _.has(this.field, 'meta.value') ? _.get(this.value, this.field.meta.value, this.value) : this.value;
        // check initital value from store
        if (!this.value) {
          if (_.has(this.field, 'store') || _.has(this.field, 'server')) {
            this.loadData();
          }
        }
        return value;
      },
      label() {
        return _.get(this.field, 'text', '')
      },
    },
    watch: {
      value: {
        handler(val) {
          this.data = this.initial;
        },
        deep: true
      },
      data: {
        handler(val) {
          return this.$emit('input', this.isNumeric ? parseInt(val) : val);
        },
        deep: true
      }
    },
    methods: {
      updateFormData(val) {
        this.$emit('updateFormData', val);
      },
      loadData() {
        if (_.has(this.field, 'store', undefined)) {
          let name = _.get(this.field, 'store', null);
          let response = this.$store.dispatch(`commonSelect/${name}`, name);
          if (typeof response.then === 'function') {
            response.then((res) => {
              this.data = res;
            });
          } else {
            this.data = response;
          }
        } else if (_.has(this.field, 'server', undefined)) {
          this.$store.dispatch(`commonSelect/server`, this.field);
        }
      }
    },
    created() {
      this._ = _;
    },
  }
</script>
