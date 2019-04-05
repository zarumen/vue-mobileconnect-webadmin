<script>
import { shortcodeComputed, shortcodeMethods } from '@state/helpers'
import FormAddKeyword from '@components/form/form-add-keyword-reserved'
import FormAddShortcode from '@components/form/form-add-shortcode'
import FormAddOperatorConfig from '@components/form/form-add-operator-config'
import FormEditOperatorConfig from '@components/form/form-edit-operator-config'

export default {
  components: { FormAddKeyword, FormAddShortcode, FormAddOperatorConfig, FormEditOperatorConfig },
  data: () => ({
    addKeywordDialog: '',
    addShortcodeDialog: '',
    addOperatorConfigDialog: '',
    editOperatorConfigDialog: '',
    tabs: 0,
    dialog: false,
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
    selectedShortcode: ''
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
      
    },
    onCancel () {
      this.dialog = false
    },
    onClicked (i) {
      console.log(`click in :${JSON.stringify(i.operatorName)}`)
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
          Keyword Reserved Totals {{ keywordReservedList? "("+keywordReservedList.length+")": "" }}
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
        <v-btn
          v-if="tabs === 1" 
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
        <span v-if="tabs === 2">
          <v-btn
            class="v-btn--simple"
            color="deep-purple darken-2"
            round
            @click.stop="addKeywordDialog = !addKeywordDialog"
          >
            +KEYWORD         
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
            <template v-for="(item, index) in filteredList">
              <v-list-tile 
                :key="index"
                ripple
                @click="onClicked(item)"
              >
                <v-list-tile-content>
                  <v-list-tile-title class="pt-2 subheading font-weight-medium">
                    <v-icon small>
                      filter_6
                    </v-icon>
                    &nbsp;{{ item.shortcode }}
                  </v-list-tile-title>
                  <v-list-tile-sub-title class="body-2 font-weight-thin">
                    Sender Name:
                    <span
                      v-for="i in item.sendername"
                      :key="i"
                    >
                      <v-chip
                        small  
                        class="light-green lighten-1 white--text caption font-weight-thin"
                        @click.stop="onClicked(i)"
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
                      :color="checkedOperatorNameColor('ais', item)"
                      @click.stop="clickedOperator('ais', item)"
                    >
                      AIS
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('cat', item)"
                      @click.stop="clickedOperator('cat', item)"
                    >
                      CAT
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('dtac', item)"
                      @click.stop="clickedOperator('dtac', item)"
                    >
                      DTAC
                    </v-btn>
                    <v-btn
                      fab
                      class="v-btn--simple"
                      small
                      :color="checkedOperatorNameColor('true', item)"
                      @click.stop="clickedOperator('true', item)"
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
            <template v-for="(item, index) in filteredKeywordList">
              <v-list-tile 
                :key="index"
                ripple
              >
                <v-list-tile-content>
                  <v-list-tile-title>Shortcode: {{ item.shortcode }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    Keywords:
                    <v-chip
                      v-for="k in item.keywords" 
                      :key="k"
                      class="light-green lighten-1 white--text caption font-weight-thin"
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
            <v-list-tile 
              v-for="item in keywordReservedList"
              :key="item.shortcode"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.shortcode }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  Keywords:
                  <v-chip
                    v-for="i in item.keywords" 
                    :key="i"
                    class="deep-purple lighten-1 white--text caption font-weight-thin"
                  >
                    {{ i }}
                  </v-chip>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </base-card>
    <!-- Pop up Panels -->
    <form-add-keyword
      v-if="addKeywordDialog"
      :add-keyword-dialog="addKeywordDialog" 
      @emitCloseKeywordDialog="addKeywordDialog=arguments[0]"
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
    <BaseDialog 
      :dialog="dialog" 
      :dialog-title="`Hey`" 
      :dialog-text="`Yo`"
      @onConfirm="onConfirm" 
      @onCancel="onCancel"
    />
  </base-helper-offset>
</template>

