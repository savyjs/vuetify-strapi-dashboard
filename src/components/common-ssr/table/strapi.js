/**
 * you can copy this file for your custom API server and change it to fit your need.
 */
import qs from 'qs';

export default {
  methods: {
    loadData() {
      // console.log('hi from strapi');
      this.loading = true;
      let filters = this.filter || {};
      let search = this.search || {};
      let report = this.report || undefined;
      let sort = _.get(this.options, 'sortBy.0', 'id');
      let sortDESC = _.get(this.options, 'sortDesc.0', true) ? 'DESC' : 'ASC';
      let page = _.get(this.options, 'page', this.page);
      let perPage = _.get(this.options, 'itemsPerPage', this.perPage);

      let meta = {
        ...filters,
        ...search
      };
      let queryString = '';
      if (report) {
        let reportQuery = {};
        let whereClauses = [];
        let orClauses = [];
        _.forEach(_.get(report, 'names', []), (field, i) => {
          let val = report.values[i];
          let clause = {};
          let cond = 'and';
          let op = report.operators[i];
          let name = field + '_' + op;
          clause[name] = val;
          if (i) cond = report.conditions[i - 1];
          if (cond == 'or') {
            orClauses.push(clause)
          } else {
            whereClauses.push(clause)
          }
        })
        reportQuery._where = {};
        if (orClauses.length && !whereClauses.length) {
          reportQuery._where['_or'] = orClauses;
        } else if (orClauses.length) {
          reportQuery._where['_or'] = [...(orClauses.map(k => [k])), whereClauses]
        } else {
          reportQuery._where = whereClauses;
        }
        queryString = '?' + qs.stringify(reportQuery);
        console.log({reportQuery, queryString})
      }

      // check if this path exists
      this.$axios.$get(this.resource + '/count' + queryString, {params: meta}).then(res => {
        this.length = res;
      });

      // strapi API
      let _sort = sort + ':' + sortDESC;
      meta._sort = _sort;
      if (perPage > 0) {
        meta._limit = perPage
        meta._start = (page - 1) * perPage
      }

      this.$axios.$get(this.resource + queryString, {params: meta}).then(res => {
        this.list = res;
        if (this.length < 1 && res.length > 0) {
          this.length = res.length;
        }
      }).catch(error => {
        this.$notifWarning(error);
      }).finally((res) => {
        this.loading = false;
      })
    },
    doFilter(val) {
      // TODO: customize filter
      setTimeout(() => {
        this.loadData();
      }, 500)
    },
    doExcel(val) {
      setTimeout(() => {
        this.loadData()
      }, 500)
    },
    doReport(val, excel = false) {
      setTimeout(() => {
        this.loadData()
      }, 500)
    },
    doSearch(val) {
      this.searchText = val;
      this.filter = {};
      this.search = {};
      if (val) {
        // Strapi API
        _.forEach(this.fields, (field, i) => {
          if (_.get(field, 'searchable', true) && !!_.get(field, 'value', undefined)) {
            _.set(this.search, field.value + '_contains', val);
          }
        })
      }

      // search after 1 second's
      setTimeout(() => {
        if (this.searchText == val) {
          this.loadData();
        }
      }, 500)
    },
    update(id, property, val) {
      let data = {};
      data[property] = val;
      return this.$axios.$put(this.resource + '/' + id, data).then(res => {
        this.loadData();
        this.$notifSuccess(this.$t("success"))
      }).catch(err => {
        this.$notifError(err)
      })
    },
    toggle(id, val) {
      return this.$strapi.update()
    },
    delete(id, reload = true) {
      this.loading = true;
      return this.$axios.$delete(this.resource + '/' + id).then(res => {
        if (reload) {
          this.loadData();
        }
        return true;
      }).catch(err => {
        this.$Helper.showError(err, this.$swal, this.$router)
        return false;
      }).finally(() => {
        this.loading = false;
      })
    },
  }
}
