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
      search: '',
      mutablePagination: this.pagination
    }
  },
  computed: {
    isNotEmpty () {
      return this.items && this.items.length > 0;
    },
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
    nextPage (newValue) {
      return this.$store.dispatch(`${this.basemodule}/updatePage`, newValue)
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
      :pagination.sync="mutablePagination"
      sort-icon="keyboard_arrow_down"
      class="elevation-1"
      hide-actions
    >
      <template
        slot="headerCell"
        slot-scope="{ header }"
      >
        <span
          class="subheading font-weight-light text--darken-3"
          v-text="header.text"
        />
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
          <small v-if="header.text==='Widget'">
            <a :href="'/campaignwidget/'+props.item.id"><v-icon>widgets</v-icon></a>                      
          </small>
          <small v-if="header.text==='Report'">
            <a :href="'/report/transaction/'+props.item.id"><v-icon>description</v-icon></a>                      
          </small>
          <small v-else>{{ renderData(props.item, header) }}</small>
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
        v-model="mutablePagination.page" 
        :length="mutablePagination.pages"
        next-icon="arrow_right"
        prev-icon="arrow_left"
        color="green"
        circle
        @input="nextPage"
      />
    </v-flex>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
