<script>
import { shortcodeComputed, shortcodeMethods } from '@state/helpers'
import FormAddKeywordReserved from '@components/form/form-add-keyword-reserved'
import FormAddKeywordByShortcode from '@components/form/form-add-keyword-by-shortcode'
import FormAddShortcode from '@components/form/form-add-shortcode'
import FormAddOperatorConfig from '@components/form/form-add-operator-config'
import FormEditOperatorConfig from '@components/form/form-edit-operator-config'
import FormEditSendername from '@components/form/form-edit-sendername'

export default {
  components: { FormAddKeywordByShortcode, FormAddKeywordReserved, FormAddShortcode, FormAddOperatorConfig, FormEditOperatorConfig, FormEditSendername },
  data: () => ({
    addKeywordByShortcodeDialog: '',
    addKeywordReservedDialog: '',
    addShortcodeDialog: '',
    addOperatorConfigDialog: '',
    editOperatorConfigDialog: '',
    editSenderNameDialog: '',
    tabs: 0,
    dialog: false,
    deletedDialog: false,
    fab: false,
    colorOperator: [
      'green',
      'orange darken-2',
      'blue',
      'red darken-2'
    ],
    num: 1,
    quickSearchFilterSC: '',
    quickSearchFilterKW: '',
    quickSearchFilterKWR: '',
    selectedOperator: '',
    selectedShortcode: '',
    selectedShortcodeObject: '',
    selectedKeywordActive: '',
    selectedKeywordReserved: '',
    selectedCampaignId: '',
  }),
  computed: {
    ...shortcodeComputed,
    operatorsArray () {
      let array = []
      if (!this.operators) return
      this.operators.map(v => {

        v= {
          operator: v,
          color: this.colorOperator[this.num - 1]
        }

        array.push(v)

        // eslint-disable-next-line
        this.num++
      })

      return array
    },
    filteredList () {

      if(this.shortcodeList) {
        return this.shortcodeList.filter(post => {
          return post.shortcode.includes(this.quickSearchFilterSC)
        })
      }
      
      return null
    },
    filteredKeywordList () {

      let reg = /^([A-Z]|[a-z])\w+/
      if(reg.test(this.quickSearchFilterKW)) {

        return this.keywordList.filter(one => {

          return one.keywords.some(k => k.includes(this.quickSearchFilterKW))
        })
      } else {
        return this.keywordList.filter(post => {
          
          return post.shortcode.includes(this.quickSearchFilterKW)
        })
      }
    },
    filteredKeywordReservedList () {

      if(this.keywordReservedList) {
        return this.keywordReservedList.filter(post => {
          return post.shortcode.includes(this.quickSearchFilterKWR)
        })
      }

      return null
    }
  },
  watch: {
    // เช็ค List เพื่อ updated หน้า auto
  },
  created() {
    if(!this.hadShortcodesList)
      this.getAllShortcodes()
  },
  methods: {
    ...shortcodeMethods,
    reloadShortcodes () {
      return this.getShortcodesFromFirestore()
    },
    reloadKeywords () {
      return this.getKeywordsActiveFromFirestore()
    },
    refreshReservedList () {
      return this.getKeywordsReservedFromFirestore()
    },
    mutateDeleteKeywordReservedList (sc, keyword) {

      let kReservedList = this.getShortcodesReservedList

      let deletedKeywordListObj = kReservedList.find(rc => rc.shortcode === sc)

      let i = kReservedList.indexOf(deletedKeywordListObj)

      let resultArray = deletedKeywordListObj.keywordsArray.filter(t => t !== keyword)

      this.setElementKeywordReservedList({
        position: i,
        payload: resultArray
      })

    },
    checkedOperatorNameColor (ops, item) {
      let data = []
      if (item) {
        data = [...item.operatorName]
      }
      let checked = data.includes(ops)

      return (checked) ? 'secondary' : 'default'
    },
    onConfirm () {
      // NOT FINISHED YET!
      this.deleteKeywordReserved({
        shortcode: this.selectedShortcode,
        keyword: this.selectedKeywordReserved
      })
      .then(() => {
        this.mutateDeleteKeywordReservedList(this.selectedShortcode, this.selectedKeywordReserved)
      })
      this.deletedDialog = false
    },
    onCancel () {
      this.deletedDialog = false
    },
    onClicked (i) {
      console.log(`click in :${JSON.stringify(i)}`)
    },
    clickedOperator (operator, i) {

      this.selectedOperator = operator
      this.selectedShortcode = i.shortcode
      
      let data = []
      if (i) {
        data = [...i.operatorName]
      } 

      let checkedOperator = data.includes(operator)

      if (checkedOperator) {
        // edit operator config
        this.editOperatorConfigDialog = !this.editOperatorConfigDialog
        return console.log(`have ops: ${this.selectedOperator} in ${this.selectedShortcode}`)
      } else {
        // create operator config
        this.addOperatorConfigDialog = !this.addOperatorConfigDialog
        return console.log(`haven't ops: ${this.selectedOperator} in ${this.selectedShortcode}`)
      }
    },
    clickedSenderName (object) {
      this.selectedShortcodeObject = object

      if(object.sendername) {
        this.editSenderNameDialog = !this.editSenderNameDialog
        return console.log(`to edit sendername dialog`)
      }

      return console.log(`don't have sendername property!!`)
    },
    clickedKeywordReserved (keyword, shortcode) {

      this.selectedShortcode = shortcode
      this.selectedKeywordReserved = keyword

      this.deletedDialog = !this.deletedDialog

    },
    openBaseDialogDetails (keyword, campaignId) {

      this.selectedCampaignId = campaignId
      this.selectedKeywordActive = keyword

      this.dialog = !this.dialog
    }
  }
}
</script>

<template>
  <base-helper-offset :offset="10">
    <base-card
      class="card-tabs"
      color="light-green"
    >
      <v-flex
        slot="header"
      >
        <v-tabs
          v-model="tabs"
          color="transparent"
          slider-color="deep-purple"
        >
          <span
            class="subheading font-weight-light mr-3"
            style="align-self: center"
          >
            Shortcodes:
          </span>
          <v-tab class="mr-3">
            <v-icon class="mr-2">
              build
            </v-icon>
            List
          </v-tab>
          <v-tab class="mr-3">
            <v-icon class="mr-2">
              whatshot
            </v-icon>
            Keyword
          </v-tab>
          <v-tab>
            <v-icon class="mr-2">
              star
            </v-icon>
            Reserved
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-card-title>
        <span 
          v-if="tabs === 0" 
          class="title"
        >
          ShortCode Totals {{ filteredList? "("+filteredList.length+")": "" }}
          <v-text-field
            v-model="quickSearchFilterSC"
            append-icon="search"
            label="Quick Search"
            class="purple-input"
            single-line
            hide-details
          />
        </span>
        <span 
          v-if="tabs === 1" 
          class="title"
        >
          Keyword Totals {{ filteredKeywordList? "("+filteredKeywordList.length+")": "" }}
          <v-text-field
            v-model="quickSearchFilterKW"
            append-icon="search"
            label="Quick Search"
            class="purple-input"
            single-line
            hide-details
          />
        </span>
        <span 
          v-if="tabs === 2" 
          class="title"
        >
          Keyword Reserved Totals {{ filteredKeywordReservedList? "("+filteredKeywordReservedList.length+")": "" }}
          <v-text-field
            v-model="quickSearchFilterKWR"
            append-icon="search"
            label="Quick Search"
            class="purple-input"
            single-line
            hide-details
          />
        </span>
        <v-spacer />
        <span v-if="tabs === 0">
          <v-btn  
            class="v-btn--simple"
            color="light-green darken-2"
            round
            @click.stop="addShortcodeDialog = !addShortcodeDialog"
          >
            +SHORTCODE            
          </v-btn>
          <v-btn 
            class="v-btn--simple"
            color="secondary"
            circle
            icon
            @click.native="reloadShortcodes"
          >
            <v-icon>
              refresh
            </v-icon>
          </v-btn>
        </span>
        <span v-if="tabs === 1">
          <v-btn
            class="v-btn--simple"
            color="light-green darken-2"
            round
            @click.stop="addKeywordByShortcodeDialog = !addKeywordByShortcodeDialog"
          >
            #KEYWORD         
          </v-btn>
          <v-btn
            class="v-btn--simple"
            color="secondary"
            circle
            icon
            @click.native="reloadKeywords"
          >
            <v-icon>
              refresh
            </v-icon>      
          </v-btn>
        </span>
        <span v-if="tabs === 2">
          <v-btn
            class="v-btn--simple"
            color="deep-purple darken-2"
            round
            @click.stop="addKeywordReservedDialog = !addKeywordReservedDialog"
          >
            +KEY RESERVED         
          </v-btn>
          <v-btn 
            class="v-btn--simple"
            color="primary"
            circle
            icon
            @click.native="refreshReservedList"
          >
            <v-icon>
              refresh
            </v-icon>      
          </v-btn>
        </span>
      </v-card-title>

      <v-tabs-items v-model="tabs">
        <v-tab-item :value="0">
          <!-- shortcode list -->
          <v-list three-line>
            <template v-for="(item0, index) in filteredList">
              <v-list-tile 
                :key="index"
                ripple
                @click="onClicked(item0)"
              >
                <v-list-tile-avatar>
                  <v-icon small>
                    filter_6
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="pt-2 subheading font-weight-medium">
                    {{ item0.shortcode }}
                  </v-list-tile-title>
                  <v-list-tile-action-text>
                    &nbsp;Sender Name:
                  </v-list-tile-action-text>
                  <v-list-tile-sub-title class="body-2 font-weight-thin">
                    <span
                      v-for="i in item0.sendername"
                      :key="i"
                    >
                      <v-chip
                        small  
                        class="mb-2 light-green darken-2 white--text caption font-weight-thin"
                        @click.stop="clickedSenderName(item0)"
                      >
                        {{ i }}
                      </v-chip>
                      &nbsp;
                    </span>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-flex 
                    xs12 
                    class="py-2"
                  >
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('ais', item0)"
                      @click.stop="clickedOperator('ais', item0)"
                    >
                      AIS
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('cat', item0)"
                      @click.stop="clickedOperator('cat', item0)"
                    >
                      CAT
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('dtac', item0)"
                      @click.stop="clickedOperator('dtac', item0)"
                    >
                      DTAC
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('true', item0)"
                      @click.stop="clickedOperator('true', item0)"
                    >
                      TRUE
                    </v-btn>
                  </v-flex>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider
                v-if="index + 1 < filteredList.length" 
                :key="`divider-${index}`"
              />
            </template>
          </v-list>
        </v-tab-item>
        <v-tab-item :value="1">
          <!-- keyword list -->
          <v-list three-line>
            <template v-for="(item1, index) in filteredKeywordList">
              <v-list-tile 
                :key="index"
                ripple
              >
                <v-list-tile-avatar>
                  <v-icon small>
                    filter_6
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="pt-2 subheading font-weight-medium">
                    {{ item1.shortcode }}
                  </v-list-tile-title>
                  <v-list-tile-action-text>
                    &nbsp;Keywords Used:
                  </v-list-tile-action-text>
                  <v-list-tile-sub-title class="body-2 font-weight-thin">
                    <v-chip
                      v-for="k in item1.keywords" 
                      :key="k"
                      class="mb-2 light-green white--text caption font-weight-thin"
                      small
                      @click.stop="openBaseDialogDetails(k, item1.rawData[k])"
                    >
                      {{ k }}
                    </v-chip>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider 
                v-if="index + 1 < filteredKeywordList.length" 
                :key="`divider-${index}`"
              />
            </template>
          </v-list>
        </v-tab-item>
        <v-tab-item :value="2">
          <!-- keyword reserved -->
          <v-list three-line>
            <template v-for="(item2, index) in filteredKeywordReservedList">
              <v-list-tile 
                :key="item2.shortcode"
                ripple
                @click.stop="onClicked(item2)"
              >
                <v-list-tile-avatar>
                  <v-icon small>
                    filter_6
                  </v-icon>
                </v-list-tile-avatar>
                <v-list-tile-content>
                  <v-list-tile-title class="pt-2 subheading font-weight-medium">
                    {{ item2.shortcode }}
                  </v-list-tile-title>
                  <div>
                    <v-list-tile-action-text>
                      &nbsp;Keywords Reserved:
                    </v-list-tile-action-text>
                    <v-list-tile-sub-title class="body-2 font-weight-thin">
                      <!-- Keyword ที่กำลัง reserved -->
                      <v-chip
                        v-for="i in item2.keywordsArray" 
                        :key="i"
                        class="mb-2 deep-purple lighten-1 white--text caption font-weight-thin"
                        small
                        @click.stop="clickedKeywordReserved(i, item2.shortcode)"
                      >
                        {{ i }}
                      </v-chip>
                      <!-- Keywords ที่ถูกใช้ไปแล้ว (Actived) -->
                      <v-chip
                        v-for="i in item2.keywordsFalseArray" 
                        :key="i"
                        class="mb-2 grey lighten-1 white--text caption font-weight-thin"
                        small
                        @click.stop="onClicked(i)"
                      >
                        {{ i }}
                      </v-chip>
                    </v-list-tile-sub-title>
                  </div>
                  <!-- <div v-if="item2.keywordsFalseArray.length > 0">
                    <v-list-tile-action-text>
                      &nbsp;Keywords Reserved Used:
                    </v-list-tile-action-text>
                    <v-list-tile-sub-title class="body-2 font-weight-thin">
                      <v-chip
                        v-for="i in item2.keywordsFalseArray" 
                        :key="i"
                        class="mb-2 grey lighten-1 white--text caption font-weight-thin"
                        small
                      >
                        {{ i }}
                      </v-chip>
                    </v-list-tile-sub-title>
                  </div> -->
                </v-list-tile-content>
              </v-list-tile>
              <v-divider 
                v-if="index + 1 < filteredKeywordReservedList.length" 
                :key="`divider-${index}`"
              />
            </template>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </base-card>
    <!-- Pop up Panels -->
    <form-add-keyword-by-shortcode
      v-if="addKeywordByShortcodeDialog"
      :add-keyword-by-shortcode-dialog="addKeywordByShortcodeDialog" 
      @emitCloseKeywordByShortcodeDialog="addKeywordByShortcodeDialog=arguments[0]"
    />
    <form-add-keyword-reserved
      v-if="addKeywordReservedDialog"
      :add-keyword-reserved-dialog="addKeywordReservedDialog" 
      @emitCloseKeywordDialog="addKeywordReservedDialog=arguments[0]"
    />
    <form-add-shortcode
      v-if="addShortcodeDialog"
      :add-shortcode-dialog="addShortcodeDialog" 
      @emitCloseShortcodeDialog="addShortcodeDialog=arguments[0]"
    />
    <form-add-operator-config
      v-if="addOperatorConfigDialog"
      :add-operator-config-dialog="addOperatorConfigDialog"
      :operator="selectedOperator"
      :shortcode="selectedShortcode"
      @emitCloseOpConfigDialog="addOperatorConfigDialog=arguments[0]"
    />
    <form-edit-operator-config
      v-if="editOperatorConfigDialog"
      :edit-operator-config-dialog="editOperatorConfigDialog"
      :operator="selectedOperator"
      :shortcode="selectedShortcode"
      @emitCloseOpConfigEDialog="editOperatorConfigDialog=arguments[0]"
    />
    <form-edit-sendername
      v-if="editSenderNameDialog"
      :edit-sender-name-dialog="editSenderNameDialog"
      :shortcode-item="selectedShortcodeObject"
      @emitCloseEditSendernameDialog="editSenderNameDialog=arguments[0]"
    />
    <BaseDialog
      :dialog="deletedDialog" 
      :dialog-title="`Deleted Keyword Reserved Dialog`" 
      :dialog-text="`Do you want to Deleted ${selectedKeywordReserved} Keyword?`"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    />
    <!-- Details Campaign Keyword Dialog -->
    <v-dialog
      v-if="dialog"
      v-model="dialog"
      max-width="290"
      persistent
    >
      <v-card>
        <v-card-title class="headline">
          Keyword: {{ selectedKeywordActive }}
        </v-card-title>
        <v-divider />
        <v-card-text class="subheading">
          <strong class="subheading green--text">
            {{ selectedKeywordActive }}
          </strong> has use in campaignID <br>"{{ selectedCampaignId }}"
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn
            color="green darken-1"
            round
            flat
            @click="dialog = false"
          >
            Agree
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </base-helper-offset>
</template>

