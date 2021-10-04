<template>
  <div v-if="_.includes(['textarea','json'],type)">
    <v-textarea :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors"
                :placeholder="placeholder"
                :hint="hint"
                :height="_.get(field,'height',undefined)"
                :label="label" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['rich','editor'],type)">
    <text-editor
      :required="_.get(field,'required',false)" :error-messages="errors" :label="label" dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['audio'],type)">
    <select-audio
      :required="_.get(field,'required',false)" :error-messages="errors" :label="label" :getId="true" dense filled
      v-model="data"/>
  </div>
  <div v-else-if="_.includes(['image'],type)">
    <select-photo
      :required="_.get(field,'required',false)" :error-messages="errors" :label="label" :getId="true" dense filled
      v-model="data"/>
  </div>
  <div v-else-if="_.includes(['media-upload','mediaUpload'],type)">
    <media-uploader
      :required="_.get(field,'required',false)" :error-messages="errors" :type="_.get(field,'types',undefined)"
      :label="label"
      :getId="true"
      dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['media'],type)">
    <select-all-media
      :required="_.get(field,'required',false)" :error-messages="errors" :type="_.get(field,'types',undefined)"
      :label="label"
      :getId="true"
      dense filled v-model="data"/>
  </div>
  <div v-else-if="_.includes(['combobox'],type)">
    <v-combobox
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" multiple chips
      :label="label"
      dense
      filled
      v-model="data"/>
  </div>
  <div v-else-if="_.includes(['bool'],type)">
    <v-checkbox
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" v-model="data" dense filled
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['price'],type)">
    <v-text-field
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors"
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
    <v-text-field
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :placeholder="placeholder"
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
    <date-time-picker
      :required="_.get(field,'required',false)"
      :use-seconds="true"
      :filled="true" :rules="getRules" :error-messages="errors" :locale="getLocale" :hint="hint" :type="type"
      :field="field"
      v-model="data"
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['time'],type)">
    <time-picker
      :required="_.get(field,'required',false)"
      :use-seconds="true"
      :filled="true"
      :rules="getRules" :error-messages="errors"
      :locale="getLocale"
      :hint="hint"
      :type="type"
      :field="field"
      v-model="data"
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['date'],type)">
    <date-picker
      :required="_.get(field,'required',false)" :filled="true" :rules="getRules" :error-messages="errors" :hint="hint"
      :locale="getLocale"
      v-model="data" :type="type"
      :field="field"
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['jdate'],type)">
    <date-picker
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :isJalali="true"
      :locale="getLocale"
      :hint="hint"
      v-model="data" :type="type"
      :field="field"
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['select'],type)">
    <select-relation
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :hint="hint"
      v-model="data"
      :type="type"
      :field="field"
      :label="label"/>
  </div>
  <div v-else-if="_.includes(['icons'],type)">
    <select-icon
      :required="_.get(field,'required',false)"
      :rules="getRules"
      :error-messages="errors"
      :hint="hint"
      v-model="data"
      :type="type"
      :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['enum'],type)">
    <select-enum
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :hint="hint" v-model="data"
      :type="type"
      :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['password'],type)">
    <v-text-field
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :placeholder="placeholder"
      :type="!toggle ? 'password' : 'text'"
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
      :required="_.get(field,'required',false)"
      @updateFormData="updateFormData"
      :formData="formData"
      v-model="data"
      :label="label"
      :field="field"
      dense :rules="getRules" :error-messages="errors"
      filled
    ></CRUD>
  </div>
  <div v-else-if="type=='linearCrud'">
    <LinearCRUD
      :required="_.get(field,'required',false)"
      @updateFormData="updateFormData"
      :formData="formData"
      v-model="data"
      :label="label"
      :field="field"
      dense :rules="getRules" :error-messages="errors"
      filled
    ></LinearCRUD>
  </div>
  <div v-else-if="_.includes(['calc'],type)">
    <calc
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors"
      @updateFormData="updateFormData"
      :formData="formData" :hint="hint" v-model="data" :type="type" :field="field" :label="label"/>
  </div>
  <div v-else-if="_.includes(['label'],type)">
    <v-subheader>
      <v-icon>{{ icon }}</v-icon>
      {{ label }}
    </v-subheader>
    <v-divider v-if="hasDivider"/>
  </div>
  <div v-else-if="_.includes(['counter'],type)">
    <counter
      :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors" :outlined="false"
      v-model="data"
      :type="type"
      :label="label" :icon="icon"
      :field="field"/>
  </div>
  <div v-else-if="_.includes(['custom'],type)">
    <component
      :required="_.get(field,'required',false)"
      :is="_.get(field,'meta.component',undefined)"
      :outlined="false"
      v-model="data" :rules="getRules" :error-messages="errors"
      :place="place || 'create'"
      :type="type"
      :formData="formData"
      @updateFormData="updateFormData"
      @reload="reload"
      :label="label"
      :icon="icon"
      :field="field"></component>
  </div>
  <div v-else>
    <v-text-field :required="_.get(field,'required',false)" :rules="getRules" :error-messages="errors"
                  :placeholder="placeholder" persistent-hint
                  :hint="hint" v-model="data" filled dense
                  :label="label"/>
  </div>
</template>

<i18n>
{
  "en": {
    "$": "$"
  },
  "fa": {
    "$": "ریال"
  }
}
</i18n>
<script>

import _ from 'lodash'

/**
 * @value: any - this property value
 * @type: String - this property type
 * list of available elements:
 textarea
 json
 rich
 editor
 audio
 image
 media-upload
 media
 combobox
 bool
 price
 number
 dateTime
 time
 date
 jdate
 select
 icons
 enum
 password
 crud
 linearCrud
 calc
 label
 counter
 custom
 * @item: Object - all properties of item
 * @field: Object - filed properties
 * */

export default {
  name: 'CommonTypesField',
  props: ['value', 'formData', 'type', 'errors', 'field', 'place'],
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
      hint = isNumber ? `${this.$Helper.numberFormat(this.data) || 0} ${unit || ''}` : hint;
      hint = isPrice ? (this.$Helper.price(this.data, unit) || 0) : hint;
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
      // check initial value from store
      if (!this.value) {
        if (_.has(this.field, 'store') || _.has(this.field, 'server')) {
          this.loadData();
        }
      }
      // check path
      return _.has(this.field, 'meta.value') && !_.includes(this.field.type, ['store', 'server']) ? _.get(this.value, this.field.meta.value, this.value) : this.value;
    },
    label() {
      return this.$t(_.get(this.field, 'text', ''))
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
        return this.$emit('input', this.isNumeric && val != "" && val != null && val != undefined && val != NaN ? parseFloat(val) : val);
      },
      deep: true
    }
  },
  methods: {
    updateFormData(val) {
      this.$emit('updateFormData', val);
    },
    reload(val) {
      this.$emit('reload', val);
    },
    loadData() {
      if (_.has(this.field, 'store', undefined)) {
        let name = _.get(this.field, 'store', null);
        let isCustomStore = (name.split('.').length > 1 || name.split('/').length > 1)
        try {
          let response = isCustomStore ? this.$store.dispatch(`${name.replace('.', '/')}`, name) : this.$store.dispatch(`commonSelect/${name}`, name);
          if (typeof response.then === 'function') {
            response.then((res) => {
              this.data = res;
            });
          } else {
            this.data = response;
          }
        } catch (e) {
        }
      } else if (_.has(this.field, 'server', undefined)) {
        try {
          this.$store.dispatch(`commonSelect/server`, this.field);
        } catch (e) {
        }
      }
    }
  },
  created() {
    this._ = _;
  },
}
</script>
