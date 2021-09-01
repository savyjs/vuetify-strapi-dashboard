<template>
  <v-container>
    <v-alert v-show="$nuxt.isOffline" dense type="warning" outlined dismissible>
      <div class="full text-center">{{ $t("offline") }} <span class="mx-1">{{ loadingDots }}</span></div>
    </v-alert>
  </v-container>
</template>

<i18n>
{
  "en": {
    "offline": "can not connect to server"
  },
  "fa": {
    "offline": "دسترسی به سرور قطع شده است"
  }
}
</i18n>
<script>
import _ from 'lodash';
import Vue from 'vue';

_.mixin(require("lodash-deep"));
const resource = 'users-permissions/roles';
const usersPermissionsResource = 'users-permissions/permissions';
export default {
  data() {
    return {
      loadingDots: '',
      myPermissions: undefined
    }
  },
  computed: {
    canSeeThisPage() {
      let path = this.$route.path;
      let MENU = _.get(this, 'vsd.menu', {})
      let menuItems = MENU.ADMIN_DRAWER;
      let menuItem = _.get(menuItems, _.deepFindKey(menuItems, {link: path}), undefined);
      if (_.get(menuItem, 'link', '') == path) {
        return this.isAllowedMenu(menuItem);
      } else {
        return true;
      }
    },
  },
  watch: {
    myPermissions: {
      handler(val) {
      },
      deep: true
    },
    canSeeThisPage(val) {
      this.$emit('setAccess', val)
    }
  },
  async mounted() {
    window.setInterval(() => {
      if (this.loadingDots.length > 3)
        this.loadingDots = ".";
      else
        this.loadingDots += ".";
    }, 1000);

    // console.log('can see page:', this.$route.path, this.canSeeThisPage)
    this.$store.commit('navigation/updateLoading', true);
    await this.initiate();
    const can = (id) => {
      let val = _.includes(this.myPermissions, id);
      return val;
    }
    Vue.set(Vue.prototype, 'can', can);
    Vue.set(Vue.prototype, '$can', can);
    Vue.set(Vue.prototype, 'getRolePermissions', this.getRolePermissions);
    Vue.set(Vue.prototype, '$getRolePermissions', this.getRolePermissions);
    this.$store.commit('navigation/updateLoading', false);
  },
  created() {
    this._ = _;
    const can = (id) => {
      return _.includes(this.myPermissions, id);
    }
    Vue.set(Vue.prototype, 'can', can);
    Vue.set(Vue.prototype, '$can', can);
    Vue.set(Vue.prototype, 'getRolePermissions', this.getRolePermissions);
    Vue.set(Vue.prototype, '$getRolePermissions', this.getRolePermissions);
  },
  methods: {
    isAllowedMenu(item) {
      if (_.has(item, 'permission')) {
        let permission = _.get(item, 'permission', undefined);
        console.log({permission, item})
        return this.$can(permission);
      } else {
        return true;
      }
    },
    async getRolePermissions(roleId = undefined) {
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
    async initiate() {
      try {
        let user = await this.$auth.user;
        let role = await this.$auth.$storage.getState('role');
        let roleId = _.get(user, 'role.id', _.get(user, 'role', undefined))
        let rolePermissions = await this.$auth.$storage.getState('permissions');
        if (roleId && (_.has(role, 'id') || !_.isArray(rolePermissions) || true)) {
          let user = this.$auth.user;
          let role = await this.$axios.$get(resource + '/' + roleId);
          await this.$auth.$storage.setState('role', role);
          this.myPermissions = await this.getRolePermissions(roleId);
          await this.$auth.$storage.setState('permissions', this.myPermissions);
        }
      } catch (e) {
        console.warn({e})
        this.$swal({
          type: 'error',
          title: this.$t('error'),
          text: this.$t(_.get(e, 'response.data.message', 'can_not_get_user_accesses'))
        });
      } finally {
        try {
          this.$store.commit('navigation/updateLoading', false);
        } catch (e) {
          console.log({e})
        }
      }
    }
  }
}
</script>
