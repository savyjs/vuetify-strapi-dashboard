const perPage = 30
import strapi from './strapi'

export default {
  mixins: [strapi],
  data() {
    return {
      search: '',
      report: null,
      filter: {},
      perPage,
      selected: [],
      loading: false,
      searchText: '',
      page: 1,
      list: [],
      allItems: [],
      count: 0,
      length: 0,
      options: {},
      ...this.value,
    }
  },
  computed: {
    fields() {
      return this.Fields
    },
  },
  methods: {

    async getAllDataBeforeMakeExcel() {
      // this.options.itemsPerPage = 10000;
      this.loading = true;
      try {
        await this.loadData({per_page: 100});
        this.loading = false;
      } catch (e) {
        console.error({e})
      }
    },
    async excelData() {
      let fields = this.fields;
      await this.getAllDataBeforeMakeExcel();
      let data = this.list;
      //console.log({data, fields});
      if (!_.isArray(data) || !_.isArray(fields)) {
        return [];
      }
      let final = [];
      for (const item of data) {
        let row = {};
        let has = false;
        for (let field of fields) {
          if (_.get(field, 'reportable', true) && _.has(field, 'text') && _.has(field, 'value') && _.has(item, field.value)) {
            _.set(row, field.text, this.processExcelData(_.get(item, field.value, item), field));
            has = true;
          }
        }
        if (has) {
          //console.log(row);
          final.push(row);
        }
      }
      return final;
    },
    processExcelData(value, field, item = {}) {
      let type = _.get(field, 'type', 'text');
      if (_.includes(['custom'], type)) return value;
      let data = _.get(value, _.get(field, 'meta.text', ''), value);
      data = _.get(value, _.get(field, 'meta.path', ''), data);
      if (_.includes(['linearCrud', 'crud'], type)) {
        data = (_.isArray(data)) ? data : [];
        return data;
      }
      if (_.includes(['date'], type)) {
        // console.log('this is date time', {field, data, value, type})
        return this.$Helper.toJalaali(data, 'jYYYY/jM/jD');
      }
      if (_.includes(['dateTime'], type)) {
        // console.log('this is date time', {field, data, value, type})
        return this.$Helper.toJalaali(data);
      }
      if (_.includes(['number'], type)) {
        return this.$Helper.numberFormat(data);
      }
      if (_.includes(['price'], type)) {
        return this.$Helper.numberFormat(data) + ' ریال';
      }
      if (_.includes(['boolEdit', 'bool'], type)) {
        return !!data ? '✅' : '❌';
      }
      if (_.includes(['text', 'number'], type)) {
        return _.isArray(data) ? data.toString() : data;
      }
      if (_.includes(['enum'], type)) {
        return this.enumValue(data, field);
      }
      if (_.includes(['select'], type)) {
        return this.selectValue(data, field);
      }

      data = data === undefined ? '' : data;
      data = (_.get(field, 'isPrice', false) && _.get(field, 'type', 'number') != 'price') ? (this.$Helper.numberFormat(data) + 'ریال') : data;

      return data;
    },
    enumValue(data, field) {
      let value = data;
      let list = _.get(field, 'meta', []);
      let index = _.findKey(list, {value});
      return _.get(list, `[${index}].text`, value)
    },
    selectValue(data, field) {
      let value = data;
      let isMulti = _.get(field, 'multi', false);
      let hasStore = _.get(field, 'store', undefined);
      if (hasStore || _.has(field, 'server')) {
        this.loadSelectData();
      }
      let list = hasStore ? _.get(this.$store.state.commonSelect, _.get(field, 'store', []), []) : [];
      let valuePath = _.get(field, 'path', isMulti ? undefined : _.get(field, 'meta.text', 'name'));
      if (isMulti) {
        let items = valuePath ? _.get(value, valuePath, []) : value;
        let response = [];
        let textPath = _.get(field, 'meta.text', undefined);
        return _.map(items, (item, index) => {
          //console.log({index, item})
          let text = _.get(item, textPath, item);
          //console.log({text})
          return (text);
        }).toString()
      } else {
        let finalValue = _.get(value, valuePath, _.get(value, 'id', value));
        if (hasStore) {
          let index = _.findKey(list, {value: finalValue});
          return _.get(list, `[${index}].text`, finalValue)
        } else {
          return finalValue
        }
      }
    },
    loadSelectData(field) {
      if (_.has(field, 'store', undefined)) {
        let name = _.get(field, 'store', null);
        let response = this.$store.dispatch(`commonSelect/${name}`, name);
      } else if (_.has(field, 'server', undefined)) {
        this.$store.dispatch(`commonSelect/server`, field);
      }
    },
    doSelect(val) {
      this.selected = val.map(item => item.id)
    },
    deleteItems() {
      let ids = this.selected;
      this.$swal({
        title: 'حذف گزینه ها',
        text: "آیا مطمئن هستید می خواهید این موارد را حذف کنید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'لغو',
        confirmButtonText: 'حذف کن',
      }).then((result) => {
        if (result.value) {
          let totalItems = ids.length;
          let i = 1;
          _.forEach(ids, (id) => {
            this.delete(id, i >= totalItems)
            i++;
          })
        }
      })
    },
    deleteItem(id) {
      this.$swal({
        title: 'حذف',
        text: "آیا مطمئن هستید می خواهید این مورد را حذف کنید؟",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        cancelButtonText: 'لغو',
        confirmButtonText: 'حذف کن'
      }).then((result) => {
        if (result.value) {
          this.delete(id)
        }
      })
    },
    setOptions(val) {
      this.options = val
      this.loadData();
    }
  }
}
