export default {
  methods: {
    loadData() {
      console.log('load from crypto.js');
      let apiName = _.get(this, 'api', undefined)
      if (_.includes(['users', 'critics', 'fee', 'wages', 'orders', 'deposits', 'withdraws', 'tickets'], apiName)) {
        this.loading = true;
        let filters = this.filter || {};
        let search = this.search || null;
        let report = this.report || null;
        let sort = _.get(this.options, 'sortBy.0', 'id');
        let sortDESC = _.get(this.options, 'sortDesc.0', true) ? 'DESC' : 'ASC';
        let page = _.get(this.options, 'page', this.page);
        let perPage = _.get(this.options, 'itemsPerPage', this.perPage);

        let meta = {
          ...filters,
          query: search
        };
        if (perPage > 0) {
          meta.page = page
          meta.per_page = perPage
        }

        let data = null;
        let method = 'get';
        let url = this.resource;

        if (report) {
          method = 'post';
          data = report;
          url = this.resource + '/report'
        }

        this.$axios.$request({url, method, params: meta, data}).then(res => {
          let pascalCase = this.$Helper.pascalCase(apiName);
          this.list = _.get(res, `data.${apiName}`, _.get(res, `data.${pascalCase}`, _.get(res, `data`, [])));
          //console.log({pascalCase}, this.list);
          let length = _.has(res, `data.pagination_info.all_count`) ? _.get(res, `data.pagination_info.all_count`, _.get(res, `data.paginationInfo.all_count`, this.list.length || perPage)) : this.list.length || perPage;
          if (length) {
            this.length = length;
          }

          if (!_.has(data, 'pagination_info.per_page') && _.isArray(this.list) && (this.list.length > perPage)) {
            _.set(this.options, 'itemsPerPage', this.list.length);
            _.set(this.options, 'customPagination', true);
          }

        }).catch(error => {
          this.$notifWarning('داده ای یافت نشد');
          console.log({error});
        }).finally((res) => {
          this.loading = false;
        })
      } else {
        this.loading = true;

        let filters = this.filter || {};
        let search = this.search || {};
        let sort = _.get(this.options, 'sortBy.0', 'id');
        let sortDESC = _.get(this.options, 'sortDesc.0', true) ? 'DESC' : 'ASC';
        let page = _.get(this.options, 'page', this.page);
        let perPage = _.get(this.options, 'itemsPerPage', this.perPage);

        let meta = {
          ...filters,
          ...search
        };

        // check if this path exists
        this.$axios.$get(this.resource + '/count', {params: meta}).then(res => {
          this.length = res;
        });

        // strapi API
        let _sort = sort + ':' + sortDESC;
        meta._sort = _sort;
        if (perPage > 0) {
          meta._limit = perPage
          meta._start = (page - 1) * perPage
        }

        this.$axios.$get(this.resource, {params: meta}).then(res => {
          this.list = res || [];
          if (this.length < 1 && res.length > 0) {
            this.length = res.length;
          }
        }).catch(error => {
          this.$notifWarning('داده ای یافت نشد');
          console.log({error});
        }).finally((res) => {
          this.loading = false;
        })
      }
    },
    doExcel(val) {
      return this.doReport(val, true)
    },
    doReport(val, excel = false) {
      //console.log({val})
      if (val) {
        // Strapi API
        this.report = {...val, excel};
        this.loadData();
      }
    },
    doFilter(val) {
      // TODO: customize filter
      setTimeout(() => {
        this.loadData();
      }, 500)
    },
    doSearch(val) {
      this.searchText = val;
      this.search = '';

      if (val) {
        // Strapi API
        this.search = val;
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
        this.$notifSuccess('با موفقیت بروز شد.')
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
