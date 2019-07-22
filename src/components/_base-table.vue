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
      currentItems: ''
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
        return this.pagination.pages
      },
      set (value) {
        this.$store.dispatch(`${this.basemodule}/updatePages`, value)
      }
    },
    // CHECK ALL HEADER TO CUSTOMIZE!
    checkOrganizationAuth () {
      return this.headers.some(head => head.value === 'organizationAuth')
    },
    checkWidgets () {
      return this.headers.some(head => head.text === 'Widget')
    },
    checkKeywords () {
      return this.headers.some(head => head.text === 'Keyword')
    },
    checkHeader () {
      return this.headers.some(head => head.value === 'campaignName')
    },
    checkRunnings () {
      return this.headers.some(head => head.value === 'campaignAvailable')
    },
    checkActive () {
      return this.headers.some(head => head.value === 'campaignActive')
    },
    checkStatus () {
      return this.headers.some(head => head.value === 'campaignState')
    },
    checkCreateDate () {
      return this.headers.some(head => head.value === 'campaignCreateTime')
    },
    checkDate () {
      return this.headers.some(head => head.value === 'campaignDateStart' || head.value === 'campaignDateEnd')
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
    },
    getColor (auth) {
      if (auth === 'Level3') return 'lime'
      else if (auth === 'Level2') return 'light-green'
      else return 'green'
    },
    getColorState (state) {
      if (state === 'production') return 'green'
      else return 'orange'
    },
    boolIcon (boolean) {
      if (boolean === true) return 'check_circle'
      else return 'cancel'
    },
    boolColor (boolean) {
      if (boolean === true) return 'green'
      else return 'red'
    },
    updatedItems (event) {
      
      this.currentItems = event
      
      if(this.search) {

        return this.$emit('updated-items', this.currentItems)
      }

      return this.$emit('updated-items', this.items)
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
      :page.sync="page"
      :options.sync="mutablePagination"
      class="elevation-1 pa-2"
      multi-sort
      hide-default-footer
      @current-items="updatedItems"
      @page-count="pages = $event"
    >
      <!-- TODO: implement paginations (in pagination Utils) and render Function NEW! -->
      <template
        v-if="checkActive"
        v-slot:item.campaignActive="{ item }"
      >
        <v-icon
          :color="boolColor(item.campaignActive)"
        >
          {{ boolIcon(item.campaignActive) }}
        </v-icon>
      </template>
      <template
        v-if="checkCreateDate"
        v-slot:item.campaignCreateTime="{ item }"
      >
        <span class="text-truncate overline">
          {{ formatDateRelative(item.campaignCreateTime.seconds) }}
        </span>
      </template>
      <template
        v-if="checkDate"
        v-slot:item.campaignDateStart="{ item }"
      >
        <span class="text-truncate overline">
          {{ formatDate(item.campaignDateStart.seconds) }}
        </span>
      </template>
      <template
        v-if="checkDate"
        v-slot:item.campaignDateEnd="{ item }"
      >
        <span class="text-truncate overline">
          {{ formatDate(item.campaignDateEnd.seconds) }}
        </span>
      </template>
      <template
        v-if="checkHeader"
        v-slot:item.campaignName="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.campaignName }}
        </span>
      </template>
      <template
        v-if="checkKeywords"
        v-slot:item.keyword="{ item }"
      >
        <v-chip
          v-for="i in item.keyword"
          :key="i"
          :ripple="false"
          color="primary"
          label
          x-small
          dark
        >
          {{ i }}
        </v-chip>
      </template>
      <template
        v-if="checkOrganizationAuth"
        v-slot:item.organizationAuth="{ item }"
      >
        <v-chip 
          :color="getColor(item.organizationAuth)"
          small
          dark
        >
          {{ item.organizationAuth }}
        </v-chip>
      </template>
      <template
        v-if="checkRunnings"
        v-slot:item.campaignAvailable="{ item }"
      >
        <v-icon
          :color="boolColor(item.campaignAvailable)"
        >
          {{ boolIcon(item.campaignAvailable) }}
        </v-icon>
      </template>
      <template
        v-if="checkStatus"
        v-slot:item.campaignState="{ item }"
      >
        <v-chip 
          :color="getColorState(item.campaignState)"
          x-small
          label
          dark
        >
          {{ item.campaignState }}
        </v-chip>
      </template>
      <template
        v-if="checkWidgets"
        v-slot:item.id="{ item }"
      >
        <router-link 
          :to="{ path: `campaignwidget/${item.id}` }"
        >
          <v-icon color="secondary">
            widgets
          </v-icon>
        </router-link>
      </template>
      <template 
        v-if="actionBtn"
        v-slot:item.action="{ item }"
      >
        <base-button 
          color="secondary"
          circle
          icon
          x-small
          @click.native="$emit('edit', item)"
        >
          <v-icon>edit</v-icon>
        </base-button>
        <base-button
          color="error" 
          circle
          icon
          x-small
          @click.native="$emit('remove', item)"
        >
          <v-icon>close</v-icon>
        </base-button>
      </template>
    </v-data-table>
    <!-- footer page running page number -->
    <v-flex
      v-if="isNotEmpty"
      class="text-center pt-2"
    >
      <v-pagination
        v-model="page" 
        :length.sync="pages"
        next-icon="arrow_right"
        prev-icon="arrow_left"
        color="light-green"
        circle
        @input="nextPage"
      />
    </v-flex>
  </div>
</template>

<style lang="scss">

.v-data-table-header th {
  font-weight: 300;
  color: #8cc249 !important;
}

.v-data-table-header th.sortable.active {
  color: #699e37 !important;
}

.v-data-table__mobile-row__header {
  font-weight: 500;
  color: #8cc249 !important;
}

</style>
