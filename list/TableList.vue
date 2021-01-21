<template>
  <div>
    <v-data-table
      :search="search"
      show-select
      :headers="headers"
      :items="items"
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
      </template>
    </v-data-table>
  </div>
</template>


<script>
  export default {
    props: ['items', 'search', 'loading', 'name', 'headers', 'resource'],
    data() {
      return {
        selected: [],
        options: {},
        updateRowValue: [],
      }
    },
    computed: {
      totalItems() {
        return this.items.length || 0
      }
    },
    watch: {
      selected(val) {
        this.$emit('selected', this.selected)
      }
    },
    mounted() {
    },
    methods: {
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
