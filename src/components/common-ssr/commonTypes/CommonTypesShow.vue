<template>
  <span v-if="_.includes(['textarea'],type)" v-html="$Helper.nl2br(data)"></span>
  <span v-else-if="_.includes(['textarea'],type)" v-html="$Helper.numberFormat(data)"></span>
  <span v-else-if="_.includes(['label'],type)"></span>
  <span v-else-if="_.includes(['rich'],type)" v-html="data"/>
  <pre v-else-if="_.includes(['json'],type)" v-html="data"/>
  <span v-else-if="_.includes(['media'],type)" class="pa-1">
    <audio class="full" v-if="_.get(data,'url','') && _.startsWith(_.get(data,'mime',''),'audio')" controls>
       <source :src="baseURL + _.get(data,'url','')">
    </audio>
    <video class="full" v-else-if="_.get(data,'url','') && _.startsWith(_.get(data,'mime',''),'video')" controls>
       <source :src="baseURL + _.get(data,'url','')">
    </video>
    <v-img v-else-if="_.get(data,'url','') && _.startsWith(_.get(data,'mime',''),'image')" contain
           :src="baseURL + _.get(data,'url','')"/>
    <v-btn small v-else :to="baseURL + _.get(data,'url','')">
           {{ _.get(data,'name','') }}
    </v-btn>
  </span>
  <span v-else-if="_.includes(['audio'],type)" class="pa-2">
    <audio class="full" v-if="_.get(data,'url','')" controls>
       <source :src="baseURL + _.get(data,'url','')">
    </audio>
    <audio v-else-if="_.isArray(data)" v-for="aItem in data" controls>
       <source :src="baseURL + _.get(aItem,'url','')">
    </audio>
  </span>
  <span v-else-if="_.includes(['video'],type)" class="pa-2">
    <video v-if="!_.isArray(data)" class="full" controls>
       <source v-if="_.get(data,'url','')" :src="baseURL + _.get(data,'url','')">
    </video>
    <video v-else-if="_.isArray(data)" v-for="vItem in data" class="full" controls>
       <source :src="baseURL + _.get(vItem,'url','')">
    </video>
  </span>
  <span v-else-if="_.includes(['image'],type)" class="pa-2">
    <v-dialog max-width="90%" v-model="modalImg">
      <v-card>
        <v-card-title>
          <span>
            <v-icon>photo</v-icon>
            {{$t('view')}}
            </span>
          <v-spacer/>
          <v-btn fab color="error" @click="modalImg=false" small><v-icon x-small>close</v-icon></v-btn>
        </v-card-title>
        <v-btn class="mx-1" icon @click="rotatePhoto(-90)"><v-icon>rotate_left</v-icon></v-btn>
        <v-btn class="mx-1" icon @click="rotatePhoto(90)"><v-icon>rotate_right</v-icon></v-btn>
        <v-btn icon class="mx-2" link color="success" download="image.png" :href="data"><v-icon>cloud_download</v-icon></v-btn>
        <v-card-text class="pa-5 text-center positionRelative">
            <a :href="data" target="_blank">
              <v-img
                :style="`transform: rotate(${rotation}deg);`"
                eager
                class="originCenter"
                :alt="_.get(field,'text',$t('image'))"
                :sizes="`${_.get(field,'sizes','150')}`"
                :src="data"
                width="100%"
                contain
              />
              </a>
          </v-card-text>
        </v-card>
    </v-dialog>
    <v-img
      v-if="_.isString(data)"
      @click="openModal"
      style="cursor: pointer !important;"
      eager
      :alt="_.get(field,'text',$t('image'))"
      :sizes="_.get(field,'sizes','150')"
      :max-height="_.get(field,'height','100')"
      :max-width="_.get(field,'width','100')"
      :src="data"
      contain
    />
    <span v-else>{{$t("no_image")}}</span>
  </span>
  <span v-else-if="_.includes(['bool'],type)">
    <v-icon dense color="success" v-if="data===true">check</v-icon>
    <v-icon dense color="error" v-else-if="data===false">close</v-icon>
        <v-icon dense color="warning" v-else-if="data===0">info</v-icon>
    <v-icon dense color="success" v-else-if="data===1">check</v-icon>
        <v-icon dense color="warning" v-else>info</v-icon>
  </span>
  <span v-else-if="_.includes(['boolEdit'],type)">
    <BoolBtn :field="field" v-model="data" @update="update"/>
  </span>
  <span v-else-if="_.includes(['price'],type)">
    {{$Helper.numberFormat(data)}} {{$t("$")}}
  </span>
  <span v-else-if="_.includes(['combobox'],type)">
    {{data}}
  </span>
  <span v-else-if="_.includes(['number'],type)">
    {{$Helper.numberFormat(data)}}
  </span>
  <span v-else-if="_.includes(['enum'],type)">
    {{enumValue}}
  </span>
  <span v-else-if="_.includes(['select'],type)">
    {{selectValue}}
  </span>
  <span v-else-if="_.includes(['icons'],type)">
    <v-icon :class="data" />
  </span>
  <span v-else-if="_.includes(['date'],type)">
    {{showDate(data)}}
  </span>
  <span v-else-if="_.includes(['dateTime'],type)">
    {{showDate(data,'YYYY-M-D hh:mm')}}
  </span>
  <span v-else-if="_.includes(['jdate','jDateTime'],type)">
    {{data}}
  </span>
  <span v-else-if="_.includes(['linearCrud','crud'],type)">
    <v-data-table
      dense
      disable-filtering
      disable-pagination
      disable-sort
      hide-default-footer
      :items-per-page="1000"
      :headers="_.get(field,'meta',[])"
      :items="data"
      :no-data-text="$t('empty')"
      :no-results-text="$t('no_result')"
    >
      <template v-for="subField in _.get(field,'meta',[])" #[getField(subField)]="{header,value,item}">
        <small>
          <common-types-show v-model="value" :field="header" :type="header.type"/>
        </small>
      </template>
    </v-data-table>
  </span>
  <span v-else-if="_.includes(['custom'],type)">
    <component
      @reload="reload"
      @update="update"
      :item="item"
      :is="_.get(field,'meta.component',undefined)"
      v-model="data"
      :main="main"
      :place="place || 'show'"
      :field="field"></component>
  </span>
  <span v-else>
    {{data}}
  </span>
</template>

<i18n>
  {
  "en":{
  "view":"view",
  "report":"report",
  "image":"image",
  "no_image":"no image",
  "$":"$",
  "empty":"empty",
  "no_result":"no result"
  },
  "fa":{
  "view":"مشاهده",
  "report":"گزارش",
  "image":"تصویر",
  "no_image":"بدون تصویر",
  "$":"ریال",
  "empty":"خالی",
  "no_result":"بدون نتیجه"
  }
  }
</i18n>
<script>

  import _ from 'lodash'

  /**
   * @value: any - this property value
   * @type: String - this property type - image bool text rich ...
   * @item: Object - all properties of item
   * @field: Object - filed properties
   * */
  export default {
    name: 'CommonTypesShow',
    props: ['value', 'type', 'id', 'field', 'fields', 'item', 'main', 'place'],
    data() {
      return {
        rotation: 0,
        modalImg: false,
      }
    },
    computed: {
      baseURL() {
        return this.vsd.API_URL;
      },
      getId() {
        if (this.id) return this.id;
        let idPath = _.get(this.main, 'idPath', 'id');
        let value = _.get(this.item, idPath, undefined);
        return value;
      },
      data() {
        if (_.includes(['custom'], this.type)) return this.value;
        let data = _.has(this.field, 'meta.text') ? _.get(this.value, this.field.meta.text) : this.value;
        data = _.has(this.field, 'meta.path') ? _.get(this.value, this.field.meta.path) : this.value;
        if (_.includes(['image'], this.type)) {
          if (_.has(data, 'url')) {
            return this.$apiURL + _.get(data, 'url', '');
          } else if (_.get(this.field, 'meta.base64', false)) {
            return data || _.get(this.field, 'defaultValue', '');
          }
          return data;
        }

        if (_.includes(['linearCrud', 'crud'], this.type)) {
          data = (_.isArray(data)) ? data : [];
          return data;
        }
        data = _.has(data, 'title') ? data.title : data;
        if (_.includes(['text', 'number'], this.type)) {
          data = _.isArray(data) ? data.toString() : data;
        }
        data = data === undefined ? '' : data;
        data = (_.get(this.field, 'isPrice', false) && _.get(this.field, 'type', 'number') != 'price') ? (this.$Helper.numberFormat(data) + this.$t("$")) : data;

        return data;
      },
      enumValue() {
        let value = this.data;
        let list = _.get(this.field, 'meta', []);
        let index = _.findKey(list, {value});
        return _.get(list, `[${index}].text`, value)
      },
      selectValue() {
        let value = this.data;
        let isMulti = _.get(this.field, 'multiple', _.get(this.field, 'multi', false));
        let hasStore = _.get(this.field, 'store', undefined);
        if (hasStore || _.has(this.field, 'server')) {
          this.loadData();
        }
        let list = hasStore ? _.get(this.$store.state.commonSelect, _.get(this.field, 'store', _.get(this.$store.state.commonSelect, _.get(this.field, 'server', []))), []) : [];
        let valuePath = _.get(this.field, 'path', isMulti ? undefined : _.get(this.field, 'meta.text', 'name'));
        if (isMulti) {
          let items = valuePath ? _.get(value, valuePath, []) : value;
          let response = [];
          let textPath = _.get(this.field, 'meta.text', undefined);
          console.log({isMulti,valuePath,value,textPath,items})
          return _.map(items, (item, index) => {
            let text = _.get(item, textPath, item);
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
      }
    },
    created() {
      this._ = _;
    },
    methods: {
      showDate(data, format = 'YYYY/M/D') {
        return _.get(this, 'vsd.locale', undefined) === 'fa-ir' ? this.$Helper.toJalaali(data) : this.$Helper.toJalaali(data, format);
      },
      loadData() {
        if (_.has(this.field, 'store', undefined)) {
          let name = _.get(this.field, 'store', null);
          let response = this.$store.dispatch(`commonSelect/${name}`, name);
        } else if (_.has(this.field, 'server', undefined)) {
          this.$store.dispatch(`commonSelect/server`, this.field);
        }
      },
      rotatePhoto(deg) {
        this.rotation += deg;
      },
      getField(header) {
        return 'item.' + header.value;
      },
      update(value) {
        let name = _.get(this.field, 'emit', _.get(this.field, 'value', undefined));
        let id = this.getId;
        if (this.field.edit !== undefined && name) {
          this.$emit('update', id, name, value)
        }
      },
      reload() {
        this.$emit('reload', true)
      },
      openModal() {
        this.modalImg = true;
      }
    }
  }
</script>
<style>
  .positionRelative {
    position: relative;
  }

  .originCenter {
    transform-origin: center;
  }
</style>
