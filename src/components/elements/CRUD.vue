<template>
  <span>
  <v-subheader>{{label}}</v-subheader>
  <v-dialog v-model="mainDialog" persistent max-width="1000px">
    <template v-slot:activator="{ on }">
      <v-btn color="primary" dark v-on="on">{{label}}</v-btn>
    </template>
    <v-card elevation="0" tile>
      <div class="pa-2">
        <div>
          <v-data-table
            :headers="headers"
            :items="items"
            :search="search"
            class="elevation-0"
          >
            <template v-slot:top>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <v-toolbar flat color="white">
                      <v-toolbar-title>{{label}}</v-toolbar-title>
                      <v-spacer
                        class="mx-4"
                        inset
                        vertical
                      ></v-spacer>
                      <v-dialog v-model="dialog" max-width="867px">
                        <template v-slot:activator="{ on }">
                          <v-btn color="success" dark class="mb-2" v-on="on">
                            <v-icon class="mx-1">add</v-icon>
                            گزینه جدید
                          </v-btn>
                        </template>
                        <v-card elevation="0" tile>
                          <v-card-title>
                            <v-alert v-if="help" width="100%" type="info" dense>
                              <small>{{ help }}</small>
                            </v-alert>
                          </v-card-title>
                          <v-card-text>
                            <v-container v-if="_.has(field,'meta')">
                              <v-row>
                                  <v-col @keypress.enter="save"
                                         v-for="subField in field.meta"
                                         v-if="_.get(subField,type,undefined)!==false"
                                         :key="subField.value"
                                         :sm="_.get(subField,'sm',12)"
                                         :md="_.get(subField,'md',12)"
                                         :lg="_.get(subField,'lg',12)"
                                  >
                                    <common-types-field
                                      :name="subField.value"
                                      :formData.sync="editedItem"
                                      :field="subField"
                                      :type="subField.type"
                                      v-model="editedItem[subField.value]"
                                    ></common-types-field>
                                  </v-col>
                                </v-row>
                            </v-container>
                            <v-container v-else>
                              <v-row>
                                <v-col cols="12" lg="6">
                                  <v-text-field autofocus v-model="editedItem.name" label="نام"></v-text-field>
                                </v-col>
                                <v-col cols="12" lg="6">
                                  <v-text-field @keydown.enter="save" v-model="editedItem.value"
                                                label="مقدار"></v-text-field>
                                </v-col>
                              </v-row>
                            </v-container>
                          </v-card-text>
                          <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="error darken-1" text @click="close">
                              <v-icon class="mx-1">close</v-icon>
                              لغو
                            </v-btn>
                            <v-btn color="success darken-1" @click="save">
                              <v-icon class="mx-1">save</v-icon>
                              ذخیره
                            </v-btn>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>
                    </v-toolbar>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field class="mx-3" v-model="search" dense label="جستجو" outlined
                                  append-icon="search"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
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
              <v-btn color="primary" @click="initialize"><v-icon class="mx-1">refresh</v-icon>بازنشانی</v-btn>
            </template>
          </v-data-table>
        </div>
      </div>
      <v-card-actions>
        <v-btn color="red darken-1" dark @click="mainDialog = false">
          <v-icon class="mx-1">close</v-icon>
          بستن
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
  </span>
</template>


<script>

  export default {
    props: ['label', 'value', 'field'],
    data() {
      return {
        dialog: false,
        search: '',
        mainDialog: false,
        defaultHeaders: [
          {
            text: 'نام',
            align: 'start',
            sortable: false,
            value: 'name',
          },
          {text: 'مقدار', value: 'value', align: 'center'},
          {text: 'عملیات', value: 'actions', align: 'left', sortable: false},
        ],
        items: [],
        editedIndex: -1,
        editedItem: {},
        defaultItem: {},
      }
    },
    mounted() {
      this.items = _.isArray(this.value) ? this.value : [];
    },
    computed:
      {
        headers() {
          return _.has(this.field, 'meta') ? [...this.field.meta, {
            text: 'عملیات',
            value: 'actions',
            align: 'left',
            sortable: false
          }] : this.defaultHeaders;
        },
        formTitle() {
          return this.editedIndex === -1 ? 'جدید' : 'ویرایش'
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
      initialize() {
        this.items = _.get(this, 'value', []) || []
      },
      editItem(item) {
        this.editedIndex = this.items.indexOf(item)
        this.editedItem = item;
        this.dialog = true
      },
      deleteItem(item) {
        const index = this.items.indexOf(item)
        confirm('آیا مطمئن هستید که می خواهید این مورد را حذف کنید؟') && this.items.splice(index, 1)
      },
      close() {
        this.dialog = false
        this.editedItem = this.defaultItem;
        this.editedIndex = -1
      },
      save() {
        if (this.editedIndex > -1) {
          this.items[this.editedIndex] = this.editedItem;
        } else {
          this.items.push(this.editedItem)
        }
        this.close()
      },
    },
  }
</script>
