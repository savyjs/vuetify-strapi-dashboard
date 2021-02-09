const perPage = 10

export default {
  head: {},
  data: {
    searchBar: 0,
    search: '',
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

    // display form settings
    form: {
      searchBtn: true,
      searchIcon: 'search',
      searchText: 'جستجو',
      reportBtn: true,
      reportIcon: 'move_to_inbox',
      reportText: 'گزارش',
    },
  },
  getCommonComputed: {
    headers() {
      return this.fields
    }
  },
  getCommonMounted() {

  },
  getMethods: {
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
      // this.loadData();
    },
  }
}
