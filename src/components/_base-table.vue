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
      currentItems: '',
      menuShow: false,
      keywordArraySelected: [],
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
    checkOrganizationCompany () {
      return this.headers.some(head => head.text === 'Company')
    },
    checkOrganizationDepartment () {
      return this.headers.some(head => head.text === 'Department')
    },
    checkOrganizationBrand () {
      return this.headers.some(head => head.text === 'Brand')
    },
    checkWidgets () {
      return this.headers.some(head => head.text === 'Widget')
    },
    checkUserViewer () {
      return this.headers.some(head => head.text === 'Views')
    },
    checkActionsBtn () {
      return this.headers.some(head => head.value === 'action')
    },
    checkKeywords () {
      return this.headers.some(head => head.text === 'Keyword')
    },
    checkCode () {
      return this.headers.some(head => head.value === 'campaignCode')
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
    checkShortcode () {
      return this.headers.some(head => head.value === 'shortcode')
    },
    checkCreateDate () {
      return this.headers.some(head => head.value === 'campaignCreateTime')
    },
    checkDate () {
      return this.headers.some(head => head.value === 'campaignDateStart' || head.value === 'campaignDateEnd')
    },
    checkEmail () {
      return this.headers.some(head => head.value === 'email')
    },
    checkUserFirstName () {
      return this.headers.some(head => head.value === 'firstName')
    },
    checkUserNickName () {
      return this.headers.some(head => head.value === 'nickName')
    },
    checkUserMobile () {
      return this.headers.some(head => head.value === 'mobileTelNumber')
    },
    checkSendMobile () {
      return this.headers.some(head => head.value === 'msisdn')
    },
    checkReplyMsg () {
      return this.headers.some(head => head.value === 'replyMessage')
    },
    checkStepMsg () {
      return this.headers.some(head => head.value === 'stepName')
    },
    checkStatusMsg () {
      return this.headers.some(head => head.value === 'messageStatus')
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
    getColorStatus (state) {
      if (state === 'success') return 'green'
      else return 'red'
    },
    boolIcon (boolean) {
      if (boolean === true) return 'check_circle'
      else return 'cancel'
    },
    boolIconRunning (boolean) {
      if (boolean === true) return 'play_circle_filled'
      else return 'pause_circle_filled'
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
    },
    selectedShow (array) {
      this.keywordArraySelected = array
      this.menuShow = true
    },
    closeSelectedShow () {
      this.keywordArraySelected = []
      this.menuShow = false
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
        v-if="checkEmail"
        v-slot:item.email="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.email }}
        </span>
      </template>
      <template
        v-if="checkUserFirstName"
        v-slot:item.firstName="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.firstName }}
        </span>
      </template>
      <template
        v-if="checkUserNickName"
        v-slot:item.nickName="{ item }"
      >
        <span class="text-truncate caption">
          {{ item.nickName }}
        </span>
      </template>
      <template
        v-if="checkUserMobile"
        v-slot:item.mobileTelNumber="{ item }"
      >
        <span class="text-truncate caption primary--text">
          {{ item.mobileTelNumber }}
        </span>
      </template>
      <template
        v-if="checkSendMobile"
        v-slot:item.msisdn="{ item }"
      >
        <span class="text-truncate caption primary--text">
          {{ item.msisdn }}
        </span>
      </template>
      <template
        v-if="checkOrganizationCompany"
        v-slot:item.organizationLevel1Name="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.organizationLevel1Name }}
        </span>
      </template>
      <template
        v-if="checkOrganizationDepartment"
        v-slot:item.organizationLevel2Name="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.organizationLevel2Name }}
        </span>
      </template>
      <template
        v-if="checkOrganizationBrand"
        v-slot:item.organizationLevel3Name="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.organizationLevel3Name }}
        </span>
      </template>
      <template
        v-if="checkCode"
        v-slot:item.campaignCode="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.campaignCode }}
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
        v-if="checkReplyMsg"
        v-slot:item.replyMessage="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.replyMessage }}
        </span>
      </template>
      <template
        v-if="checkStepMsg"
        v-slot:item.stepName="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.stepName }}
        </span>
      </template>
      <template
        v-if="checkShortcode"
        v-slot:item.shortcode="{ item }"
      >
        <span class="text-truncate overline">
          {{ item.shortcode }}
        </span>
      </template>
      <template
        v-if="checkKeywords"
        v-slot:item.keyword="{ item }"
      >
        <v-badge
          v-if="item.keyword"
          color="secondary"
          overlap
          @click.native="selectedShow(item.keyword)"
        >
          <template v-slot:badge>
            <span v-if="item.keyword.length > 1">{{ item.keyword.length }}</span>
          </template>
          <v-chip small>
            <span class="text-truncate overline">
              {{ item.keyword[0] }}
            </span>
          </v-chip>
        </v-badge>
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
          <span class="text-truncate">
            {{ item.organizationAuth }}
          </span>
        </v-chip>
      </template>
      <template
        v-if="checkRunnings"
        v-slot:item.campaignAvailable="{ item }"
      >
        <v-icon
          :color="boolColor(item.campaignAvailable)"
        >
          {{ boolIconRunning(item.campaignAvailable) }}
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
          <span class="text-truncate">
            {{ item.campaignState }}
          </span>
        </v-chip>
      </template>
      <template
        v-if="checkStatusMsg"
        v-slot:item.messageStatus="{ item }"
      >
        <v-chip 
          :color="getColorStatus(item.messageStatus)"
          x-small
          label
          dark
        >
          <span class="text-truncate">
            {{ item.messageStatus }}
          </span>
        </v-chip>
      </template>
      <template 
        v-if="checkActionsBtn"
        v-slot:item.action="{ item }"
      >
        <div v-if="actionBtn">
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
        </div>
        <div v-if="checkUserViewer">
          <router-link 
            :to="{ path: `campaignDetails/${item.id}` }"
          >
            <v-icon color="secondary">
              assessment
            </v-icon>
          </router-link>
        </div>
        <div v-if="checkWidgets">
          <router-link 
            :to="{ path: `campaignwidget/${item.id}` }"
          >
            <v-icon color="secondary">
              widgets
            </v-icon>
          </router-link>
        </div>
      </template>
      <template v-slot:no-data>
        <span class="primary--text">NO DATA PLEASE CLICK RELOAD!</span>
      </template>
    </v-data-table>
    <!-- footer page running page number -->
    <v-dialog
      v-model="menuShow"
      persistent
      max-width="290px"
      transition="dialog-transition"
    >
      <v-card>
        <v-card-actions>
          <span class="subtitle-1 blue-grey--text">
            All Keywords
          </span>
          <div class="flex-grow-1" />
          <v-icon
            @click="closeSelectedShow"
          >
            close
          </v-icon>
        </v-card-actions>
        <v-card-text>
          <v-chip-group
            column
            active-class="primary--text"
          >
            <v-chip 
              v-for="i in keywordArraySelected"
              :key="JSON.stringify(i)"
              x-small
              label
            >
              <span class="text-truncate">
                {{ i }}
              </span>
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </v-dialog>
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
