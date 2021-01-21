<template>
  <v-container>
    <v-alert v-if="!canSeeThisPage" type="error">
      شما دسترسی لازم را ندارید!
    </v-alert>
  </v-container>
</template>
<script>
  import Vue from 'vue';
  import MENU from '~/assets/js/menu';

  const resource = 'users-permissions/roles';
  const usersPermissionsResource = 'users-permissions/permissions';
  export default {
    props: ['value'],
    data() {
      return {
        myPermissions: undefined
      }
    },
    computed: {
      items() {
        let items = this.value;
        return _.pickBy(_.map(items, (item) => {
          if (this.isAllowedMenu(item)) {
            let subMenu = [];
            if (_.has(item, 'items')) {
              _.map(item.items, (subitem) => {
                if (this.isAllowedMenu(subitem)) {
                  subMenu.push(subitem);
                }
              });
              item.items = subMenu;
            }
            return item;
          }
        }));
      },
      canSeeThisPage() {
        let path = this.$route.path;
        let menuItems = MENU.ADMIN_DRAWER;
        let menuItem = _.get(menuItems, _.deepFindKey(menuItems, {link: path}), undefined);
        let access = this.isAllowedMenu(menuItem);
        return access;
      },
    },
    watch: {
      myPermissions: {
        handler(val) {
          if (_.isArray(val)) {
            this.$emit('input', this.items);
          }
        },
        deep: true
      }
    },
    async mounted() {
      this.$store.commit('navigation/updateLoading', true);
      await this.initiate();
      const can = (id) => {
        let val = _.includes(this.myPermissions, id);
        //console.log({val, id});
        return val;
      }
      Vue.set(Vue.prototype, 'can', can);
      Vue.set(Vue.prototype, '$can', can);
      Vue.set(Vue.prototype, 'getRolePermissions', this.getRolePermissions);
      Vue.set(Vue.prototype, '$getRolePermissions', this.getRolePermissions);
      this.$store.commit('navigation/updateLoading', false);

    },
    created() {
      const can = (id) => {
        return _.includes(this.myPermissions, id);
      }
      Vue.set(Vue.prototype, 'can', can);
      Vue.set(Vue.prototype, '$can', can);
      Vue.set(Vue.prototype, 'getRolePermissions', this.getRolePermissions);
      Vue.set(Vue.prototype, '$getRolePermissions', this.getRolePermissions);
    },
    methods: {
      async getRolePermissions(roleId = undefined) {
        let response;
        let type;

        if (!roleId) {
          let res = await this.$axios.$get(usersPermissionsResource);
          let list = _.get(res, 'permissions', {});
          let map = {};
          await _.deepMapValues(list, (val, key) => {
            if (typeof val === "boolean") {
              let obj = {};
              if (key[1] === 'controllers') {
                let nameKey = (key[0] + '.' + key[1] + '.' + key[2] + '.' + key[3]).toLowerCase();
                // console.log({nameKey})
                _.set(map, nameKey + '.' + key[4], val);
                _.set(map, nameKey + '.policy', "");
              }
            }
          })
          return map;
        } else {
          console.log({roleId});
          let res = await this.$axios.$get(resource + '/' + roleId);
          let application = _.get(res, 'role.permissions.application.controllers', {})
          let users = _.get(res, 'role.permissions.users-permissions.controllers', {})
          let upload = _.get(res, 'role.permissions.upload.controllers', {})
          let contentManager = _.get(res, 'role.permissions.content-manager.controllers', {})
          let contentTypeBuilder = _.get(res, 'role.permissions.content-type-builder.controllers', {})
          let list = _.concat(application, users, upload, contentManager, contentTypeBuilder);
          let map = [];
          await _.deepMapValues(list, (val, key) => {
            if (val === true) {
              map.push(key[1] + '.' + key[2]);
            }
          })
          return map;

        }
      },
      isAllowedMenu(item) {
        if (_.has(item, 'permission') && _.isArray(this.myPermissions)) {
          let permission = _.get(item, 'permission', undefined);
          let access = _.includes(this.myPermissions, permission);
          return access;
        } else {
          return true;
        }
      },
      async initiate() {
        try {
          let user = await this.$auth.user;
          let role = await this.$auth.$storage.getState('role');
          let roleId = _.get(user, 'role.id', _.get(user, 'role', undefined))
          let rolePermissions = await this.$auth.$storage.getState('permissions');
          //console.log({roleId})

          if (roleId && (_.has(role, 'id') || !_.isArray(rolePermissions) || true)) {

            let user = this.$auth.user;
            let role = await this.$axios.$get(resource + '/' + roleId);

            await this.$auth.$storage.setState('role', role);
            this.myPermissions = await this.getRolePermissions(roleId);
            await this.$auth.$storage.setState('permissions', this.myPermissions);
            //console.log({role, roleId, rolePermissions}, this.myPermissions)

          }
        } catch (e) {
          this.$swal({
            type: 'error',
            title: 'خطا',
            text: 'مشکلی در گرفتن دسترسی کاربر رخ داد!'
          });
        }
        this.$store.commit('navigation/updateLoading', false);
      }
    }
  }
</script>
