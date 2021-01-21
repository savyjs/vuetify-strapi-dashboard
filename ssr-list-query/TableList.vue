<template>
  <div>
    <v-data-table
      :options.sync="doOptions"
      show-select
      :headers="headers"
      :items="items"
      :server-items-length="length"
      :loading="loading"
      item-key="id"
      show-expand
      v-model="selected"
      class="elevation-1"
    >
      <template v-slot:item.created_at="{ item }">
        {{$Helper.toJalaali(item.created_at)}}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col>
              <v-btn v-if="item.boolean" @click="toggle(item.id)" small color="success">
                <v-icon class="mx-1">check</v-icon>
                فعالسازی
              </v-btn>
              <v-btn v-else @click="toggle(item.id)" small color="error">
                <v-icon class="mx-1">close</v-icon>
                غیر فعال کردن
              </v-btn>
            </v-col>
            <v-spacer/>
            <v-col>
              <v-text-field dense v-model="updateRowValue[item.id]" @keydown.enter="updateRow(item.id)"
                            label="مقدار شارژ"
                            outlined/>
              <v-btn @click="updateRow(item.id)" small color="success">
                <v-icon class="mx-1">add</v-icon>
                افزودن
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </template>
      <template v-slot:item.boolean="{ item }">
        <v-icon dense color="success" v-if="item.boolean==true">check</v-icon>
        <v-icon dense color="warning" v-if="item.boolean==null">info</v-icon>
        <v-icon dense color="error" v-if="item.boolean==false">close</v-icon>
      </template>

      <template v-slot:item.actions="{ item }">

        <v-btn fab icon :to="`/admin/${name}/${item.id}`">
          <v-icon
            small
            color="success"
            class="mx-1"
          >
            mdi-eye
          </v-icon>
        </v-btn>
        <v-btn fab icon :to="`/admin/${name}/edit/${item.id}`">
          <v-icon
            small
            color="warning"
            class="mx-2"
          >
            mdi-pencil
          </v-icon>
        </v-btn>
        <v-btn fab icon @click="deleteItem(item.id)">
          <v-icon
            small
            class="mx-2"
            color="error"
          >
            mdi-delete
          </v-icon>
        </v-btn>
        <v-btn fab icon @click="popUp(item)">
          <v-icon
            small
            class="mx-2"
            color="primary"
          >
            mdi-launch
          </v-icon>
        </v-btn>
      </template>
    </v-data-table>
    <v-dialog
      v-model="popupStatus"
      hide-overlay
      persistent
      eager
      width="600"
    >
      <pop-up @close="popupStatus=false" v-model="poppedItem"/>
    </v-dialog>
  </div>
</template>


<script>


  import PopUp from "../ssr-list/PopUp";
  export default {
    components: {PopUp},
    props: ['items', 'search', 'length', 'options', 'loading', 'name', 'headers', 'resource'],
    data() {
      return {
        popupStatus: false,
        poppedItem: {},
        selected: [],
        updateRowValue: [],
        lastOptions: {},
      }
    },
    computed: {
      doOptions: {
        get() {
          let options = this.options;
          console.log('1-inside-Table', this.options);
          if (options && (_.has(options, 'page') || _.has(options, 'itemsPerPage') || _.has(options, 'sortBy'))) {
            this.lastOptions = options;
            // console.log('2-inside-Table', this.options);
            return options;
          } else {
            // console.log('3-inside-Table', this.options);
            return this.lastOptions;
          }
        },
        set(val) {
          //console.log('4-inside-Table', val);
          if (_.has(val, 'page') || _.has(val, 'itemsPerPage') || _.has(val, 'sortBy')) {
            return this.$emit('options', val)
          }
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
      popUp(item) {
        this.poppedItem = item;
        this.popupStatus = true;
      },
      deleteItem(id) {
        this.$emit('deleteItem', id);
      },
      toggle(id, newStatus) {
        this.$emit('toggle', id, newStatus);
      },
      updateRow(id) {
        alert(this.updateRowValue[id]);
        this.$emit('updateRow', id, this.updateRowValue[id]);
      }
    },
  }
</script>
