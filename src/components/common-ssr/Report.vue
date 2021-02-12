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
          label="فیلد"
          @change="chargeFieldSelectType(j)"
          v-model="names[j]"
          :items="reportFields"
        />
      </v-col>
      <v-col>
        <v-autocomplete
          outlined
          dense
          label="عبارت شرطی"
          v-model="operators[j]"
          :items="getValueList(j)"
        />
      </v-col>
      <v-col>
        <common-types-report-field
          label="مقدار"
          v-if="fieldAttr[j]"
          :field="fieldAttr[j]"
          v-model="values[j]"
        />
        <v-text-field
          v-else
          outlined
          dense
          label="مقدار"
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
          دریافت اکسل
        </v-btn>
        <v-btn small color="success darken-3" @click="showReportData">
          <v-icon class="mx-1">search</v-icon>
          نمایش گزارش
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  import CommonTypesFilterField from "./CommonTypesFilterField";
  import CommonTypesReportField from "./CommonTypesReportField";

  export default {
    components: {CommonTypesReportField, CommonTypesFilterField},
    props: ['value', 'isQuery', 'hasReport', 'fields'],
    data() {
      return {
        names: {},
        operators: {},
        fieldAttr: {},
        values: {},
        types: {},
        conditions: {},
        id: null,
        allValueList: [
          {text: "بزرگتر از", value: "gt", type: "numeric"},
          {text: "کوچکتر از", value: "lt", type: "numeric"},
          {text: "مساوی با", value: "eq"},
          {text: "بزرگتر مساوی با", value: "get", type: "numeric"},
          {text: "کوچکتر مساوی با", value: "let", type: "numeric"},
          {text: "نابرابر با", value: "ne"},
          {text: "شامل", value: "include"},
        ],
        textValueList: [
          {text: "مساوی با", value: "eq"},
          {text: "نابرابر با", value: "ne"},
          {text: "شامل", value: "include"},
        ],
        boolValueList: [
          {text: "مساوی با", value: "eq"},
        ],
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
    computed: {
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
      getValueList(index) {
        //let nameOfField = this.names[index];
        let indexOfField = this.names[index];
        //let indexOfField = this.reportFields.findIndex(x => x.value == nameOfField)
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
        //let nameOfField = this.names[index];
        let indexOfField = this.names[index];
        //let indexOfField = this.reportFields.findIndex(x => x.value == nameOfField)
        return _.get(this.reportFields[indexOfField], 'type', 'text');
      },
      chargeFieldSelectType(j) {
        //let fieldName = this.names[j];
        let index = this.names[j];
        //let index = this.fields.findIndex(item => item.value == fieldName && item.text == fieldName);
        // console.log({fieldName, index});
        if (index > -1) this.fieldAttr[j] = this.fields[index];
        if (index > -1) this.types[j] = this.getRowFieldType(j);
      },
      excelReportData() {
        //console.log({data: this.reportData})
        this.$emit('excel', this.reportData);
      },
      showReportData() {
        //console.log({data: this.reportData})
        this.$emit('search', this.reportData);
      },
      initiate() {
        _.forEach(this.fields, (item, index) => {
          // console.log('item:', {item});
          let text = _.get(item, 'text', null);
          let value = index //this.fields.findIndex(_.get(item, 'value', false);

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
          if (isActive && value && !_.includes(['actions'], value)) {
            this.reportFields.push({text, value, type, field: item})
          }
        })
      },
      filter() {
        // console.log(1, this.formData, this.data)
        this.$emit('input', this.formData);
        return false;
      },
      doSearch(val) {
        // search after 1 second's
        setTimeout(() => {
          if (this.search == val) {
            this.$emit('search', this.search);
          }
        }, 500)
      }
    }
  }
</script>
