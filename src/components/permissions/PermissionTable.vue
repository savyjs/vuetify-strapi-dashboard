<template>
  <div>
    <v-progress-linear :active="loading" indeterminate/>
    <v-expansion-panels accordion inset focusable multiple v-if="_.isPlainObject(storeGroups)">
      <template v-for="(bigGroup,bigKey) in storeGroups" v-if="!_.includes(deniedBigRoles,bigKey)">
        <v-expansion-panel
          v-for="(group,key) in bigGroup.controllers"
          :key="key"
          v-if="_.has(bigGroup,'controllers') && !_.includes(deniedRoles,key)"
        >
          <v-expansion-panel-header>
            {{ $t(tr(key)) }}
          </v-expansion-panel-header>
          <v-expansion-panel-content>
            <v-row>
              <template v-if="_.isPlainObject(group)" v-for="(value,title) in group">
                <v-col sm="6" lg="3">
                  <v-checkbox v-model="data[bigKey]['controllers'][key][(title)]['enabled']"
                              :label="$t(tr(title))"/>
                </v-col>
              </template>
            </v-row>
          </v-expansion-panel-content>
        </v-expansion-panel>
      </template>
    </v-expansion-panels>
    <v-alert v-else>
      {{$t('empty')}}
    </v-alert>
  </div>
</template>

<i18n>
{
  "en":{
    "empty":"empty",
    "clear":"clear",
    "filter":"filter"
  },
  "fa":{
    "empty":"خالی",
    "filter":"فیلتر",
    "clear":"پاک کردن"
  }
}
</i18n>
<script>

const _ = require('lodash')
export default {
  props: ['value', 'groups', 'permissionsConfig'],
  data() {
    return {
      deniedRoles: this.permissionsConfig.deniedRoles,
      deniedBigRoles: this.permissionsConfig.deniedBigRoles,
      translate: this.permissionsConfig.translate,
      storeGroups: {},
      data: {},
      loading: false,
      loaded: false,
    }
  },
  computed: {},
  watch: {
    data: {
      handler(val) {
        if (this.loaded) this.$emit('input', val);
      },
      deep: true
    },
    value: {
      handler(val) {
        if (!this.loaded) this.updateData(val);
      },
      deep: true
    }
  },
  created() {
    this._ = _;
  },
  methods: {
    tr(key) {
      return _.get(this.translate, key, key);
    },
    loadPermissions() {
      this.loading = true;
      this.getRolePermissions().then(res => {
        this.storeGroups = this.data = res;
        this.updateData(this.value);
      }).finally(() => {
        this.loading = false;
      })
    },
    updateData(value) {
      if (_.isPlainObject(value) && _.has(value, 'application')) {
        _.deepMapValues(value, (item, key) => {
          if (item === true) {
            let path = key.join('.');
            let current = _.get(this.data, path, undefined);
            _.set(this.data, path, true);
          }
        })
        this.loaded = true;
      } else {
        this.loaded = false;
      }
    }
  },
  mounted() {
    this.loadPermissions();
  },
}
</script>
