<template>
  <v-card elevation="5">
    <v-card-title>
      <h3>
        <v-icon>flag</v-icon>
        {{_.get(main,'popTitle',$t("show"))}}
      </h3>
      <v-spacer/>
      <v-btn fab icon @click="$emit('closeIt',true)" small color="error">
        <v-icon>close</v-icon>
      </v-btn>
    </v-card-title>
    <v-card-text>
      <table class="oddTable">
        <tbody>
        <tr v-for="field in getHeaders"
            v-if="!_.includes(['label'],_.get(field,'type',undefined)) && hasPermission(field)">
          <td>
            <v-icon class="mx-1 font-15 pb-1">{{_.gt(field,'icon','perm_identity')}}</v-icon>
            {{_.get(field,'text','')}}
          </td>
          <td :class="_.get(field,'direction','') ? ('hasDirection ' + _.get(field,'direction','')) : undefined">
            <common-types-show
              :item="item"
              :id="id"
              :main="main"
              @update="update"
              @reload="reload"
              :value="_.get(item,_.get(field,'value',null),'-')"
              :type="_.get(field,'type',null)"
              :field="field"
              :fields="fields"
            />
          </td>
        </tr>
        <tr v-else>
          <b>
            <v-icon class="mx-1 font-15 pb-1">{{_.gt(field,'icon','perm_identity')}}</v-icon>
            {{_.get(field,'text','')}}
          </b>
        </tr>
        </tbody>
      </table>
    </v-card-text>
    <v-card-actions>
      <v-btn small color="error" @click="$emit('closeIt',true)">
        <v-icon>close</v-icon>
        {{$t("close")}}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<i18n>
  {
  "en":{
  "delete":"delete",
  "close":"close",
  "error":"some error occurred",
  "show":"preview item"
  },
  "fa":{
  "delete":"حذف",
  "close":"بستن",
  "error":"مشکلی در دریافت آیدی و یا مقدار فیلد رخ داد",
  "show":"مشاهده سریع"
  }
  }
</i18n>
<script>

  import _ from "lodash";

  export default {
    name: 'PopUp',
    props: ['value', 'fields', 'main', 'id'],
    data() {
      return {}
    },
    computed: {
      getHeaders() {
        // console.log(this.fields)
        let items = [];
        for (let item of this.fields) {
          if (item.pop === undefined || item.pop === true) items.push(item)
        }
        return items;
      },
      item() {
        return _.get(this, 'value', {});
      }
    },
    created() {
      this._ = _;
    },
    methods: {
      hasPermission(field) {
        if (_.has(field, 'permission') && !!_.get(field, 'permission', undefined)) return this.can(_.get(field, 'permission', null))
        return true;
      },
      reload() {

        this.$emit('reload', true);

      },
      update(id, property, val) {
        if (id && property) {
          this.$emit('update', id, property, val);
        } else {
          console.error({id, property, val})
          this.$notifError(this.$t("error"))
        }
      }
    }
  }
</script>
