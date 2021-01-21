<template>
  <div>
    <v-breadcrumbs :items="items"></v-breadcrumbs>
  </div>
</template>
<script>
  import MENU from '~/assets/js/menu'

  export default {
    props: ['value'],
    data() {
      return {
        menu: [],
        items: []
      }
    },
    computed: {
      path() {
        return this.$route.path;
      }
    },
    watch: {
      path(search) {
        this.handle();
      }
    },
    mounted() {
      this.handle();
    },
    methods: {
      handle() {
        this.menu = _.get(MENU, 'ADMIN_DRAWER', []);
        this.search(this.path);
      },
      search(search) {
        let menu = (this.menu);
        this.items = [];
        _.forEach(menu, (obj) => {
            let menuTitle = _.get(obj, 'link', '');
            if (menuTitle == search) {
              this.items = [{text: obj.title, to: obj.link}];
            } else {
              if (_.has(obj, 'items')) {
                _.forEach(obj.items, (subObj) => {
                  let menuTitle = _.get(subObj, 'link', '');
                  if (menuTitle == search) {
                    this.items = [{text: obj.title, to: obj.link}, {text: subObj.title, to: subObj.link}];
                  }
                })
              }
            }
          }
        );
      }
    }
  }
</script>
