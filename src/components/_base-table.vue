<script>
import formatDate from '@utils/format-date'
import formatDateRelative from '@utils/format-date-relative'

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
    search: {
      type: String,
      default: '',
    },
    basemodule: {
      type: String,
      default: '',
    },
    actionBtn: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {

    }
  },
  computed: {
    isNotEmpty () {
      return this.items && this.items.length > 0;
    },
    mutablePagination: {
      get () {
        return this.pagination
      },
      set (value) {
        this.$store.dispatch(`${this.basemodule}/updatePagination`, value)
      }
    },
    page: {
      get () {
        return this.pagination.page
      },
      set (value) {
        this.$store.dispatch(`${this.basemodule}/updatePage`, value)
      }
    },
    pages: {
      get () {
        if(!this.search) {

          return this.pagination.pages
        }

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      },
      set (value) {
        this.$store.dispatch(`${this.basemodule}/updatePages`, value)
      }
    },
  },
  created () {

  },
  methods: {
    renderData (item, header) {
      let val = ''
      if (header.value.includes('.')) {
        const vals = header.value.split('.')
        val = vals.reduce((acc, val) => acc[val], item)
      } else {
        val = item[header.value]
      }
      if (typeof val === 'boolean') {
        
        if (header.text === 'Active') {

          val = val ? 'Active' : 'Non-Active'
        } else {

          val = val ? 'Yes' : 'No'
        }
      }
      if (typeof val === 'object' && val.constructor === Array) {
        let array = item[header.value]
        val = array
      }
      if (typeof val === 'object' && val.constructor === Object) {
        // convert Date format before Render data
        let object = item[header.value]

        if (header.text === 'Create Time') {
          // ถ้า เป็น create time ให้ใช้ relatives time
          val = formatDateRelative(object.seconds)

        } else {
          // format time ปกติ
          val = formatDate(object.seconds)
        }
      }
      return val;
    },
    nextPage (newValue) {
      return this.$store.dispatch(`${this.basemodule}/updatePage`, newValue)
    }
  },
  
}
</script>

<template>
  <div>
    <v-data-table 
      :headers="headers" 
      :items="items" 
      :search="search" 
      :options.sync="mutablePagination"
      class="elevation-1 pa-2"
      hide-default-footer
    >
      <!-- TODO: implement paginations (in pagination Utils) and render Function NEW! -->
      <template
        v-slot:header="{ header }"
      >
        <span
          class="subheading font-weight-light light-green--text text--darken-1"
          v-text="header.text"
        />
      </template>
      <template 
        v-slot:item="{ item }"
        class="body-2" 
      >
        <td  
          v-for="(header, index) in headers"
          :key="index"
        >
          <small v-if="header.text!=='Widget'">
            {{ renderData(props.item, header) }}
          </small>
          <small v-else>
            <router-link 
              :to="{ path: 'campaignwidget/'+props.item.id }"
            >
              <v-icon>widgets</v-icon>
            </router-link>                    
          </small>
        </td>
        <td
          class="text-xs-right"
        >
          <v-btn 
            v-if="actionBtn"
            class="v-btn--simple"
            color="secondary"
            circle
            icon
            @click.native="$emit('edit', props.item)"
          >
            <v-icon>edit</v-icon>
          </v-btn>
          <v-btn
            v-if="actionBtn"
            class="v-btn--simple" 
            color="danger" 
            circle
            icon
            @click.native="$emit('remove', props.item)"
          >
            <v-icon>close</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="no-data">
        <span>
          <p class="pt-2 blue--text subheading">   
            <v-icon 
              medium 
              class="blue--text" 
            >
              info
            </v-icon>
            Sorry, nothing to display here :(
          </p>
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
        :length="pages"
        next-icon="arrow_right"
        prev-icon="arrow_left"
        color="light-green"
        circle
        @input="nextPage"
      />
    </v-flex>
  </div>
</template>

<style lang="scss" module scoped>
@import '@design';

</style>
