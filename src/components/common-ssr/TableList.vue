<template>
  <div>
    <v-data-table
      :options.sync="doOptions"
      :show-select="showSelect!==false"
      :headers="getHeaders"
      :items="_.isArray(items) ? items : []"
      :disable-sort="hasSort===false"
      :server-items-length="length"
      :loading="loading"
      :hide-default-footer="_.get(options, 'customPagination', false)"
      :item-key="itemKey"
      :show-expand="_.some(getTableFields,{expand:true})"
      v-model="selected"
      class="elevation-1"
      :footer-props="{
      showFirstLastPage: true,
      showCurrentPage: true,
    }"
    >
      <template v-if="false" #header.id="{header}">
        {{header.text}}
        <v-menu offset-y :close-on-click="false" :close-on-content-click="false" :open-on-hover="true">
          <template v-slot:activator="{on}">
            <v-btn icon x-small v-on="on">
              <v-icon>fa-filter</v-icon>
            </v-btn>
          </template>
          <v-list dense>
            <v-list-item dense>
              <v-list-item-title>فیلتر</v-list-item-title>
              <v-list-item-action>
                <v-checkbox dense></v-checkbox>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>
      <template v-slot:footer.page-text="{text}">
        <v-row class="d-flex flex-row align-center justify-center">
          <span>برو به صفحه: </span>
          <v-select
            style="max-width:100px"
            :items="length > 1 ? $Helper.range(1,totalPages) : [1]"
            class="font-11 px-2"
            v-model="_.get(doOptions,'page',1)"
          />
        </v-row>
      </template>

      <!-- value = name of field !-->
      <template v-for="field in getTableFields" #[getField(field)]="{header,value,item}">
        <small>
          <common-types-show v-model="value" :field="header" :item="item" :fields="fields" :type="header.type"/>
        </small>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row class="rtl">
            <v-col v-for="field in fields" :key="field.value" v-if="_.get(field,'expand',undefined)===true">
              <common-types-expand
                @toggle="update"
                :type="_.get(field,'type',undefined)"
                :field="field"
                :item="item"
                :value="item[_.get(field,'value',undefined)]"
              />
            </v-col>
          </v-row>
          <v-row v-if="_.findKey(fields,{value:'actions',expand:true})">
            <v-col>
              <span>عملیات:</span>

              <template>
                <v-tooltip bottom v-if="hasBtn('next')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" small v-if="hasBtn('next',false)" fab icon x-small
                           :to="`/admin/${name}/${item.id}`">
                      <Icons8
                        small
                        color="success"
                        class="mx-1"
                      >
                        approval
                      </Icons8>
                    </v-btn>
                  </template>
                  <span>{{tooltipBtn('next','مرحله بعد')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="hasBtn('show')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" small v-if="hasBtn('show')" fab icon :to="`/admin/${name}/${item.id}`">
                      <v-icon
                        small
                        color="success"
                        class="mx-1"
                      >
                        mdi-eye
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{tooltipBtn('show','نمایش کامل در صفحه جدید')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="hasBtn('edit')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" small v-if="hasBtn('edit')" fab icon :to="`/admin/${name}/edit/${item.id}`">
                      <v-icon
                        small
                        color="warning"
                        class="mx-2"
                      >
                        mdi-pencil
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{tooltipBtn('edit','ویرایش')}}</span>
                </v-tooltip>
                <v-tooltip bottom v-if="hasBtn('delete')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" small v-if="hasBtn('delete')" fab icon @click="deleteItem(item.id)">
                      <v-icon
                        small
                        class="mx-2"
                        color="error"
                      >
                        mdi-delete
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{tooltipBtn('delete','حذف')}}</span>
                </v-tooltip>

                <v-tooltip bottom v-if="hasBtn('pop')">
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn v-on="on" small fab icon @click="popUp(item)">
                      <v-icon
                        small
                        class="mx-2"
                        color="primary"
                      >
                        mdi-launch
                      </v-icon>
                    </v-btn>
                  </template>
                  <span>{{tooltipBtn('pop','مشاهده جزئیات در پاپ آپ')}}</span>
                </v-tooltip>

              </template>
            </v-col>
          </v-row>
        </td>
      </template>

      <template v-slot:item.actions="{ item }">
        <div style="width: 150px">
          <v-tooltip bottom v-if="hasBtn('next')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" x-small v-if="hasBtn('next',false)" fab icon x-small :to="`/admin/${name}/${item.id}`">
                <Icons8
                  small
                  color="success"
                  class="mx-1"
                >
                  approval
                </Icons8>
              </v-btn>
            </template>
            <span>{{tooltipBtn('next','مرحله بعد')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasBtn('show')">
            <template v-slot:activator="{ on, attrs }">

              <v-btn v-on="on" x-small v-if="hasBtn('show')" fab icon :to="`/admin/${name}/${item.id}`">
                <v-icon
                  small
                  color="success"
                  class="mx-1"
                >
                  mdi-eye
                </v-icon>
              </v-btn>
            </template>
            <span>{{tooltipBtn('show','نمایش کامل در صفحه جدید')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasBtn('edit')">
            <template v-slot:activator="{ on, attrs }">

              <v-btn v-on="on" x-small v-if="hasBtn('edit')" fab icon :to="`/admin/${name}/edit/${item.id}`">
                <v-icon
                  small
                  color="warning"
                  class="mx-2"
                >
                  mdi-pencil
                </v-icon>
              </v-btn>
            </template>
            <span>{{tooltipBtn('edit','ویرایش')}}</span>
          </v-tooltip>
          <v-tooltip bottom v-if="hasBtn('delete')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" x-small v-if="hasBtn('delete')" fab icon @click="deleteItem(item.id)">
                <v-icon
                  small
                  class="mx-2"
                  color="error"
                >
                  mdi-delete
                </v-icon>
              </v-btn>
            </template>
            <span>{{tooltipBtn('delete','حذف')}}</span>
          </v-tooltip>

          <v-tooltip bottom v-if="hasBtn('pop')">
            <template v-slot:activator="{ on, attrs }">
              <v-btn v-on="on" x-small v-if="hasBtn('pop')" fab icon @click="popUp(item)">
                <v-icon
                  small
                  class="mx-2"
                  color="primary"
                >
                  mdi-launch
                </v-icon>
              </v-btn>
            </template>
            <span>{{tooltipBtn('pop','مشاهده جزئیات در پاپ آپ')}}</span>
          </v-tooltip>
          <component @reload="reload" :is="nameBtn('custom')" :item="item"/>
        </div>
      </template>
    </v-data-table>
    <v-dialog
      v-model="popupStatus"
      eager
      :width="_.get(main,'popWidth',700)"
    >
      <pop-up @update="update" @reload="reload" :main="main" :id="_.get(poppedItem,'id',undefined)" :fields="fields"
              @closeIt="popupStatus=false" v-if="popupStatus"
              v-model="poppedItem"/>
    </v-dialog>
  </div>
</template>

<script>
  import PopUp from "./PopUp";
  import CommonTypesShow from "./CommonTypesShow";
  import CommonTypesExpand from "./CommonTypesExpand";

  export default {
    name: 'TableList',
    components: {CommonTypesExpand, CommonTypesShow, PopUp},
    props: ['items', 'search', 'main', 'hasSort', 'hasFilter', 'hasSearch', 'itemKey', 'length', 'showSelect', 'options', 'loading', 'name', 'fields', 'resource'],
    data() {
      return {
        showMenu: false,
        popupStatus: false,
        poppedItem: {},
        selected: [],
        updateRowValue: [],
      }
    },
    computed: {
      getHeaders() {
        let items = [];
        try {
          for (let item of this.fields) {
            if (item.header === undefined || item.header === true) items.push(item)
          }
        } catch (e) {
          console.error({e})
        }
        return items;
      },
      getTableFields() {
        let items = [];
        try {
          for (let item of this.fields) {
            if (item.header === undefined || item.expand === true || item.header === true) items.push(item)
          }
        } catch (e) {
          console.error({e})
        }
        return items;
      },
      totalPages() {
        return (1 + parseInt(this.length / _.get(this.options, 'itemsPerPage', 1)));
      },
      doOptions: {
        get() {
          return this.options
        },
        set(val) {
          return this.$emit('options', val)
        }
      },
      totalItems() {
        return this.items.length || 0
      }
    },
    watch: {
      selected(val) {
        this.$emit('selected', val)
      }
    },
    mounted() {
    },
    methods: {
      tooltipBtn(name, defaultValue) {
        let index = _.deepFindKey(this.fields, `buttons`);
        if (index < 0) return defaultValue;
        let item = this.fields[index];
        // console.log({item})
        return _.get(item, `tooltips.${name}`, defaultValue);
      },
      hasBtn(name, defaultValue = true) {
        let index = _.deepFindKey(this.fields, `buttons`);
        if (index < 0) return defaultValue;
        let item = this.fields[index];
        return _.get(item, `buttons.${name}`, defaultValue);
      },
      nameBtn(name) {
        let index = _.deepFindKey(this.fields, `buttons`);
        if (!_.has(this.fields, index)) return null;
        let actions = this.fields[index];
        let custom = actions[name];
        // console.log({name, index, actions, custom});
        return _.get(custom, `component`, undefined);
      },
      getField(header) {
        return 'item.' + header.value;
      },
      popUp(item) {
        this.loader = false;
        this.poppedItem = item;
        this.$axios.$get(this.resource + '/' + _.get(item, 'id', undefined)).then(res => {
          if (res) {
            this.poppedItem = res;
          }
        }).finally(() => {
          this.popupStatus = true;
          this.loader = false;
        })
      },
      deleteItem(id) {
        this.$emit('deleteItem', id);
      },
      update(id, property, newValue) {
        this.$emit('update', id, property, newValue);
        if (this.popupStatus) {
          let item = this.items.find(item => id);
          // console.log('find by id', {item});
          if (this.poppedItem.id == id) {
            this.popUp(item);
          } else {
            this.popupStatus = false;
          }
        }
      },
      updateRow(id) {
        this.$emit('updateRow', id, this.updateRowValue[id]);
      },
      reload(input) {
        this.$emit('reload', input);
      }
    },
  }
</script>
