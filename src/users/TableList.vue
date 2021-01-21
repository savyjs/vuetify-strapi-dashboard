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
      :footer-props="{
      showFirstLastPage: true,
      showCurrentPage: true,

    }"
    >
      <template v-slot:footer.page-text="{text}">
        <v-row class="d-flex flex-row align-center justify-center">
          <span>برو به صفحه: </span>
          <v-select style="max-width:100px"
                    :items="length > 1 ? $Helper.range(1,totalPages) : [1]"
                    class="font-11 px-2"
                    v-model="options.page"
          />
        </v-row>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{$Helper.toJalaali(item.created_at)}}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <v-row>
            <v-col>
              <v-btn v-if="item.blocked" @click="toggleBlock(item.id,!item.blocked)" small color="success">
                <v-icon class="mx-1">check</v-icon>
                رفع بلاک
              </v-btn>
              <v-btn v-else @click="toggleBlock(item.id,!item.blocked)" small color="error">
                <v-icon class="mx-1">close</v-icon>
                بلاک کردن
              </v-btn>
            </v-col>
            <v-col>
              <v-btn v-if="!item.confirmed" @click="updateRow(item.id,'confirmed',!item.confirmed)" small
                     color="success">
                <v-icon class="mx-1">check</v-icon>
                فعال سازی حساب
              </v-btn>
              <v-btn v-else @click="updateRow(item.id,'confirmed',!item.confirmed)" small color="error">
                <v-icon class="mx-1">close</v-icon>
                مسدودسازی حساب
              </v-btn>
            </v-col>
          </v-row>
        </td>
      </template>
      <template v-slot:item.confirmed="{ item }">
        <v-icon dense color="success" v-if="item.confirmed==true">check</v-icon>
        <v-icon dense color="warning" v-if="item.confirmed==null">info</v-icon>
        <v-icon dense color="error" v-if="item.confirmed==false">close</v-icon>
      </template>

      <template v-slot:item.blocked="{ item }">
        <v-icon dense color="success" v-if="item.blocked==true">check</v-icon>
        <v-icon dense color="warning" v-if="item.blocked==null">info</v-icon>
        <v-icon dense color="error" v-if="item.blocked==false">close</v-icon>
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
      eager
      width="600"
    >
      <pop-up @closeIt="popupStatus=false" v-if="popupStatus" v-model="poppedItem"/>
    </v-dialog>
  </div>
</template>

<script>
  import PopUp from "./PopUp";

  export default {
    components: {PopUp},
    props: ['items', 'search', 'length', 'options', 'loading', 'name', 'headers', 'resource'],
    data() {
      return {
        popupStatus: false,
        poppedItem: {},
        selected: [],
        updateRowValue: [],
      }
    },
    computed: {
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
      popUp(item) {
        this.poppedItem = item;
        this.popupStatus = true;
      },
      deleteItem(id) {
        this.$emit('deleteItem', id);
      },
      toggleBlock(id, newStatus) {
        this.$emit('toggleBlock', id, newStatus);
      },
      updateRow(id, propertyName, newVal) {
        this.$emit('updateRow', id, propertyName, newVal);
      }
    },
  }
</script>
