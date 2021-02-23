<template>
  <div>
    <v-subheader>{{label}}</v-subheader>
    <v-alert v-if="help" width="100%" type="info" dense>
      <small>{{ help }}</small>
    </v-alert>
    <v-divider/>
    <v-card elevation="0" tile>
      <div class="px-2">
        <div>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            class="elevation-0"
          >
            <template v-slot:footer>
              <v-row>
                <v-col cols="11" align-self="center">
                  <v-row class="pt-5" v-if="_.has(field,'meta')">
                    <v-col @keypress.enter="save"
                           v-for="subField in field.meta"
                           v-if="_.get(subField,type,undefined)!==false"
                           :key="subField.value"
                           :cols="_.get(subField,'cols',12)"
                           :sm="_.get(subField,'sm',undefined)"
                           :md="_.get(subField,'md',undefined)"
                           :lg="_.get(subField,'lg',undefined)"
                    >
                      <v-scroll-y-reverse-transition class="font-11 linearCRUDFields">
                        <CommonTypesField
                          v-show="showNewRow"
                          :formData="editedItem"
                          :field="subField"
                          :type="subField.type"
                          v-model="editedItem[subField.value]"
                        ></CommonTypesField>
                      </v-scroll-y-reverse-transition>
                    </v-col>
                  </v-row>
                  <v-row v-else>
                    <v-col cols="6">
                      <v-text-field autofocus v-model="editedItem.name" :label="$t('name')"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                      <v-text-field @keydown.enter="save" v-model="editedItem.value"
                                    :label="$t('value')"></v-text-field>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col cols="1" align-self="center">
                  <v-btn fab small color="success darken-1" @click="save">
                    <v-icon class="mx-1">fa-plus</v-icon>
                  </v-btn>
                  <v-btn class="mt-1" v-if="false && item==(addItems.length-1) || addItems.length < 1" fab small
                         color="primary darken-4"
                         @click="addNewRow">
                    <v-icon small class="mx-1">fa-plus</v-icon>
                  </v-btn>
                  <v-btn class="mt-1" v-if="false &&  item==(addItems.length-1) && addItems.length>1" fab small
                         color="error darken-4"
                         @click="removeLast">
                    <v-icon small class="mx-1">fa-remove</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </template>
            <template v-slot:top>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-text-field class="mx-3" v-model="search" dense :label="$t('search')" outlined
                                  append-icon="search"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </template>
            <!-- value = name of field !-->
            <template v-for="field in headers" #[getField(field)]="{header,value,item}">
              <small>
                <common-types-show v-model="value" :field="header" :type="header.type"/>
              </small>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-icon
                small
                class="mr-2"
                @click="editItem(item)"
              >
                mdi-pencil
              </v-icon>
              <v-icon
                small
                @click="deleteItem(item)"
              >
                mdi-delete
              </v-icon>
            </template>
            <template v-slot:no-data>
              <small>{{$t("empty")}}}</small>
            </template>
          </v-data-table>
        </div>
      </div>
    </v-card>
  </div>
</template>
<i18n>
  {
  "en":{
  "operation":"Operation",
  "search":"search",
  "close":"close",
  "new":"close",
  "confirmation":"are you sure?",
  "edit":"close",
  "reload":"reload",
  "value":"value",
  "save":"save",
  "empty":"empty",
  "name":"name",
  "new":"new item",
  "close":"close"
  },
  "fa":{
  "operation":"عملیات",
  "search":"جست و جو",
  "close":"لغو",
  "new":"جدید",
  "confirmation":"آیا مطمئن هستید که می خواهید این مورد را حذف کنید؟",
  "empty":"هنوز موردی اضافه نشده است",
  "edit":"ویرایش",
  "reload":"بازنشانی",
  "value":"مقدار",
  "save":"ذخیره",
  "name":"نام",
  "new":"گزینه جدید",
  "close":"بستن"
  }
  }
</i18n>
<script>

  export default {
    props: ['label', 'value', 'field'],
    data() {
      return {
        showNewRow: true,
        dialog: false,
        search: '',
        mainDialog: false,
        items: [],
        editedIndex: -1,
        addItems: [0],
        editedItem: {},
        defaultItem: {},
      }
    },
    mounted() {
      this.items = _.isArray(this.value) ? this.value : [];
    },
    computed:
      {
        defaultHeaders() {
          return [
            {
              text: this.$t('name'),
              align: 'start',
              sortable: false,
              value: 'name',
            },
            {text: this.$t('value'), value: 'value', align: 'center'},
            {text: this.$t('operation'), value: 'actions', align: 'left', sortable: false},
          ]
        },
        headers() {
          return _.has(this.field, 'meta') ? [...this.field.meta, {
            text: $t("operation"),
            value: 'actions',
            align: 'left',
            sortable: false
          }] : this.defaultHeaders;
        },
        formTitle() {
          return this.editedIndex === -1 ? this.$t('new') : this.$t('edit')
        },
        type() {
          return this.editedIndex === -1 ? 'create' : 'edit'
        },
        help() {
          return _.get(this.field, 'help', null);
        },
      },
    watch: {
      dialog(val) {
        val || this.close()
      },
      items: {
        handler(val) {
          this.$emit('input', val)
        },
        deep: true
      }
    },
    created() {
      this.initialize()
    },
    methods: {
      getField(header) {
        return 'item.' + header.value;
      },
      addNewRow() {
        this.addItems.push(this.addItems.length);
      },
      removeLast() {
        this.addItems.pop();
      },
      initialize() {
        this.items = _.get(this, 'value', []) || []
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = item;
      },
      deleteItem(item) {
        const index = this.items.indexOf(item)
        confirm(this.$t('confirmation')) && this.items.splice(index, 1)
      },
      close() {
        this.editedItem = {};
        this.editedIndex = -1;
        this.showNewRow = false;
        setTimeout(() => {
          this.showNewRow = true;
        }, 1000);
      },
      save() {
        if (this.editedIndex > -1) {
          this.items[this.editedIndex] = this.editedItem;
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      },
    }
  }
</script>
<style>
  .linearCRUDFields {
    font-size: 10px !important;
  }
</style>
