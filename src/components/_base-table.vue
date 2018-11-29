<script>
import formatDate from '@utils/format-date'

export default {
  props: {
    headers: {
      type: Array,
      default: () => ({}),
    },
    items: {
      type: [Array, Object],
      default: () => ({}),
    },
    pagination: {
      type: [Object, String],
      default: '',
    },
    basemodule: {
      type: String,
      default: '',
    }
  },
  data () {
    return {
      search: ''
    }
  },
  computed: {
    isNotEmpty () {
      return this.items && this.items.length > 0;
    },
    page: {
      get () {
        return this.pagination.page
      },
      set (value) {
        this.$store.commit(`${this.basemodule}/updatePage`, value)
      }
    },
    paginationSort: {
      get () {
        return this.pagination.sortBy
      },
      set (value) {
        this.$store.commit(`${this.basemodule}/updateSortBy`, value)
      }
    },
    paginationDesc: {
      get () {
        return this.pagination.descending
      },
      set (value) {
        this.$store.commit(`${this.basemodule}/updateDescending`, value)
      }
    }
  },
  created () {
     console.log(this.basemodule)
  },
  methods: {
    renderData(item, header) {
      let val = ''
      if (header.value.includes('.')) {
        const vals = header.value.split('.')
        val = vals.reduce((acc, val) => acc[val], item)
      } else {
        val = item[header.value]
      }
      if (typeof val === 'boolean') {
        val = val ? 'Yes' : 'No'
      }
      if (typeof val === 'object') {
        // TODO: convert Date format before Render data
        let object = item[header.value]
        val = formatDate(object.seconds)
      }
      return val;
    },
    changeSorting(column) {
      if (this.paginationSort === column) {
        this.paginationDesc = !this.paginationDesc
      } else {
        this.paginationSort = column
        this.paginationDesc = false
      }
    },
  },
  
}
</script>

<template>
  <div>
    <v-data-table 
      :headers="headers" 
      :items="items" 
      :search="search" 
      :pagination.sync="pagination"
      class="elevation-1"
      hide-actions
    >
      <template 
        slot="headers" 
        slot-scope="props"
      >
        <tr>
          <th 
            v-for="(header, index) in props.headers" 
            :key="header.text"
            :class="[
              'column sortable', 
              paginationDesc ? 'desc' : 'asc',
              header.value === paginationSort ? 'active' : '',
              'subheading', 
              index === 0? 'text-xs-left': 'text-xs-center'
            ]" 
            @click="changeSorting(header.value)"
          >
            {{ header.text }}
            <v-icon small>arrow_upward</v-icon>
          </th>
          <th/>
        </tr>
      </template>
      <template 
        slot="items" 
        slot-scope="props"
        class="body-2" 
      >
        <td  
          v-for="(header, index) in headers"
          v-if="header.value!==''"
          :key="index"
          :class="[ index === 0? 'text-xs-left': 'text-xs-center', 'body-2']"
        >
          <small v-if="header.text!=='Widget'">{{ renderData(props.item, header) }}</small>
          <small v-else>
            <router-link 
              :to="{ path: 'campaignwidget/'+props.item.id, params: { mode: 'edit', campaignId: 'Z3Q4qZlSGixFHftPBNln' }}"
              color="indigo"
            >
              <v-icon>widgets</v-icon>
            </router-link>                      
          </small>
        </td>
        <td class="text-xs-right">
          <v-btn 
            v-if="basemodule != 'campaignwidgets'" 
            color="indigo" 
            flat
            icon
            @click.native="$emit('edit', props.item)"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            v-if="basemodule != 'campaignwidgets'" 
            color="indigo" 
            flat
            icon 
            @click.native="$emit('remove', props.item)"
          >
            <v-icon>delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <span >
          <p class="pt-2 blue--text subheading">   
            <v-icon 
              medium 
              class="blue--text" 
            >
              info
            </v-icon>
            Sorry, nothing to display here :(</p>
        </span>
      </template>
    </v-data-table>
    <!-- footer page running page number -->
    <v-flex
      v-if="isNotEmpty"
      class="text-xs-center pt-2"
    >
      <v-pagination
        v-model="page" 
        :length="pagination.pages"
        color="green"
        circle
      />
    </v-flex>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
