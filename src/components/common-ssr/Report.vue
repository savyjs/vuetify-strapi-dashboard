<template>
  <v-container>
    <v-row v-for="(j,filterRowIndex) in filterRows" :key="j">
      <v-col v-if="filterRowIndex!=0">
        <v-btn-toggle mandatory dense tile v-model="conditions[j]">
          <v-btn value="and" outlined>AND</v-btn>
          <v-btn value="or" outlined>OR</v-btn>
        </v-btn-toggle>
      </v-col>
      <v-col
        @keydown.enter="filter">
        <v-autocomplete
          outlined
          dense
          :label="$t('field')"
          @change="chargeFieldSelectType(j)"
          v-model="indexes[j]"
          :items="reportFields"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          outlined
          dense
          :label="$t('condition')"
          v-model="operators[j]"
          :items="getValueList(j)"
        />
      </v-col>
      <v-col>
        <common-types-report-field
          :label="$t('value')"
          v-if="fieldAttr[j]"
          :field="fieldAttr[j]"
          v-model="values[j]"
        />
        <v-text-field
          v-else
          outlined
          dense
          :label="$t('value')"
          v-model="values[j]"
        />
      </v-col>
      <v-col class="pt-5">
        <v-btn
          v-if="filterRows.length != 1"
          small rounded color="error" icon outlined @click="filterRows.splice(filterRowIndex,1)">
          <v-icon small>remove</v-icon>
        </v-btn>
        <v-btn v-if="filterRowIndex+1 == filterRows.length" small rounded icon color="success"
               @click="filterRows.push(_.last(filterRows)+1)"
               outlined>
          <v-icon small>add</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" lg="12" class="text-left">
        <v-btn small v-if="false" color="info" @click="excelReportData">
          <v-icon class="mx-1">move_to_inbox</v-icon>
          {{$t("excel")}}
        </v-btn>
        <v-btn small color="success darken-3" @click="showReportData">
          <v-icon class="mx-1">search</v-icon>
          {{$t("show_report")}}
        </v-btn>
        <v-btn small right absolute color="warning" @click="clearFilter">
          <v-icon class="mx-1">close</v-icon>
          {{$t("clear")}}
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<i18n>
  {
  "en":{
  "delete":"delete",
  "field":"field",
  "value":"value",
  "excel":"download excel",
  "show_report":"show report",
  "condition":"condition",
  "condition":"condition",
  "gt":"greater than",
  "lt":"less than",
  "eq":"equal to",
  "ge":"greater equal",
  "le":"less equal",
  "ne":"not equal",
  "include":"include"
  },
  "fa":{
  "delete":"حذف",
  "field":"فیلد",
  "value":"مقدار",
  "value":"مقدار",
  "show_report":" نمایش گزارش",
  "excel":"دریافت اکسل",
  "condition":"عبارت شرطی",
  "gt":"بزرگتر از",
  "lt":"کوچکتر از",
  "eq":"مساوی",
  "ge":"بزرگتر مساوی",
  "le":"کوچکتر مساوی",
  "ne":"نابرابر",
  "include":"شامل"
  }
  }
</i18n>
<script>
  import _ from "lodash";

  export default {
    name: 'Report',
    props: ['value', 'isQuery', 'hasReport', 'fields'],
    data() {
      return {
        indexes: {},
        names: {},
        operators: {},
        fieldAttr: {},
        values: {},
        types: {},
        conditions: {},
        id: null,
        filterRows: [1],
        search: '',
        report: '',
        reportFields: [],
        items: [],
        newItem: '',
        data: {}
      }
    },
    watch: {
      value: {
        handler(val) {
          this.data = val;
        },
        deep: true
      },
    },
    created() {
      this._ = _;
    },
    computed: {
      allValueList() {
        return [
          {text: this.$t("gt"), value: "gt", type: "numeric"},
          {text: this.$t("lt"), value: "lt", type: "numeric"},
          {text: this.$t("eq"), value: "eq"},
          {text: this.$t("ge"), value: "ge", type: "numeric"},
          {text: this.$t("le"), value: "le", type: "numeric"},
          {text: this.$t("ne"), value: "ne"},
          {text: this.$t("include"), value: "include"},
        ]
      },
      textValueList() {
        return [
          {text: this.$t("eq"), value: "eq"},
          {text: this.$t("ne"), value: "ne"},
          {text: this.$t("include"), value: "include"},
        ]
      },
      boolValueList() {
        return [
          {text: this.$t("eq"), value: "eq"},
        ]
      },
      formData() {
        let filters = _.omitBy(this.data, v => (_.isBoolean(v) || _.isFinite(v)) ? false : _.isEmpty(v));
        return filters;
      },
      reportData() {
        let names = this.names;
        let types = this.types;
        let operators = this.operators;
        let values = this.values;
        let conditions = this.conditions;
        let final = {
          names: Object.values(names),
          types: Object.values(types),
          operators: Object.values(operators),
          values: Object.values(values),
          conditions: Object.values(conditions),
        };
        return final;
      }
    },
    mounted() {
      this.initiate();
    },
    methods: {
      clearFilter() {
        this.$emit('input', {});
        return false;
      },
      getValueList(index) {
        let indexOfField = this.indexes[index];
        let type = _.get(this.reportFields[indexOfField], 'type', 'text');
        if (type == 'text') {
          return this.textValueList
        } else if (type == 'bool') {
          return this.boolValueList;
        } else {
          return this.allValueList;
        }
      },
      getRowFieldType(index) {
        let indexOfField = this.indexes[index];
        return _.get(this.reportFields[indexOfField], 'type', 'text');
      },
      chargeFieldSelectType(j) {
        let index = this.indexes[j];
        if (index > -1) {
          this.names[j] = _.get(this.fields[index], 'value', '');
          this.fieldAttr[j] = this.fields[index];
          this.types[j] = this.getRowFieldType(j);
        }
      },
      excelReportData() {
        this.$emit('excel', this.reportData);
      },
      showReportData() {
        this.$emit('input', this.reportData);
      },
      initiate() {
        _.forEach(this.fields, (item, index) => {
          let text = _.get(item, 'text', null);
          let value = index; //this.fields.findIndex(_.get(item, 'value', false);
          let type = _.get(item, 'type', '');
          if ((_.get(item, 'numeric', false) || _.includes(['number', 'price'], type))) {
            type = 'numeric';
          } else if (_.includes(['date', 'jdate', 'dateTime', 'jdateTime', 'time'], type)) {
            type = 'date';
          } else if (_.includes(['bool', 'boolEdit', 'image'], type)) {
            type = 'bool';
          } else {
            type = 'text';
          }
          let isActive = _.get(item, 'reportable', true);
          if (isActive && !_.includes(['actions'], _.get(item, 'value', null))) {
            this.reportFields.push({text, value, type, field: item})
          }
        })
      },
      filter() {
        this.$emit('input', this.formData);
        return false;
      }
    }
  }
</script>
