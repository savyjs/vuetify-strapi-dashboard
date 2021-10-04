<template>
  <v-text-field :placeholder="placeholder" dense persistent-hint :hint="getHint" filled :readonly="isReadOnly"
                :label="label" v-model="data">
    <template v-if="canBeHandy" v-slot:append-outer>
      <v-checkbox dense v-model="handy"/>
    </template>
  </v-text-field>
</template>
<script>
  import _ from "lodash";

  export default {
    props: ['value', 'formData', 'type', 'field', 'label'],
    data() {
      return {
        handy: false,
        data: this.value,
        final: null,
        hint: undefined
      }
    },
    mounted() {
      this.calculate();
    },
    created() {
      this._ = _;
    },
    watch: {
      value(val) {
        this.data = this.value;
      },
      main: {
        handler() {
          if (!this.handy) this.calculate();
        },
        deep: true
      },
      data: {
        handler(val) {
          if (this.handy) this.final = val;
        },
        deep: true
      },
      final(val) {
        this.$emit('input', val)
      },
      getVal(val) {
        if (!this.handy) this.final = val;
      }
    },
    computed: {
      getHint() {
        let val = this.hint;
        if (_.isNumber(val)) this.hint = `${val}`
      },
      canBeHandy() {
        return _.includes(['sum', 'formula', 'multiply'], _.get(this.field, 'calc', []));
      },
      isReadOnly() {
        return this.canBeHandy ? !this.handy : false;
      },
      placeholder() {
        return _.get(this.field, 'placeholder', undefined);
      },
      isPrice() {
        return _.get(this.field, 'isPrice', false);
      },
      // output
      getVal() {
        let calcType = _.get(this.field, 'calc', undefined);
        if (calcType) {
          if (_.has(this, calcType, undefined)) {
            return _.result(this, calcType, undefined);
          }
        }
      },
      values() {
        return this.getValues(_.get(this.field, 'input', []), this.formData)
      },

    },
    methods: {
      calculate() {
        this.final = this.getVal
      },
      multiply() {
        let total = this.values;
        let output = _.isArray(total) ? total.reduce((a, b) => a * b, 1) : 0;
        if (!this.handy) this.data = this.isPrice ? parseFloat(output) : output;
        this.hint = this.isPrice ? this.$Helper.price(this.data) : this.data;
        return output;
      },
      sum() {
        let total = this.values;
        let output = _.isArray(total) ? total.reduce((a, b) => a + b, 0) : 0;
        if (!this.handy) this.data = this.isPrice ? parseFloat(output) : output;
        this.hint = this.isPrice ? this.$Helper.price(this.data) : this.data;
        return output;
      },
      formula() {
        let input = _.get(this.field, 'input', []);
        let data = {};
        _.forEach(this.values, (value, key) => {
          data[input[key]] = parseFloat(value) || 0;
        });
        let formula = _.get(this.field, 'formula', null);
        try {
          let output = eval(formula);
          output = this.isPrice ? parseFloat(output) : output;
          this.hint = this.isPrice ? this.$Helper.price(this.data) : this.data;
          return output;
        } catch (e) {
          console.warn('math formula error!', {error: e})
          return null;
        }
      },
      getValues(input, formData) {
        let total = [];
        if (_.isString(input)) {
          let item = _.get(formData, input, 0);
          let val = parseFloat(item);
          total.push(val);
        } else if (_.isArray(input)) {
          _.forEach(input, (path) => {
            let item = _.get(formData, path, 0);
            let val = parseFloat(item);
            total.push(val);
          })
        } else if (_.isPlainObject(input)) {
          _.forEach(input, (child, father) => {
            _.forEach(_.get(formData, father, []), (subData) => {
              let values = this.getValues(child, subData);
              total = [...total, ...values];
            })
          })
        }
        return total;
      }
    },
  }</script>
