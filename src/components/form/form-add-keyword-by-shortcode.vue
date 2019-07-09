<script>
import { campTestId } from '@utils/campaign-test.js'
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addKeywordByShortcodeDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data: () => ({
    keyform: {
      shortcode: null,
    },
    activator: null,
    attach: null,
    colors: [
      'green', 'purple', 'indigo', 'cyan', 'teal', 'red',
      'light-green', 'deep-purple', 'blue', 'pink', 'lime'
    ],
    editing: null,
    index: -1,
    items: [
      { header: 'Select a Keyword or create one' },
      {
        text: 'DEFAULT',
        color: 'blue'
      },
      {
        text: 'NULL',
        color: 'red'
      }
    ],
    nonce: 1,
    menu: false,
    model: [
      {
        text: 'TEST',
        color: 'blue'
      }
    ],
    x: 0,
    search: null,
    y: 0,
    snackbar:false,
    timeout: 6000,
    textError: 'Error!',
    valid: true,
    firstRules: [
      v => !!v || 'Shortcode is required'
    ],
    secondRules: [
      v => !!v || 'Keywords is required'
    ], 
  }),
  computed: {
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
  },
  watch: {
    model (val, prev) {
      if (val.length === prev.length) return

      this.model = val.map(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }

          this.items.push(v)

          this.nonce++
        }

        return v
      })
    }
  },
  methods: {
    ...mapActions('shortcodes', [
        'createKeywordByShortcode',
    ]),
    edit (index, item) {
      if (!this.editing) {
        this.editing = item
        this.index = index
      } else {
        this.editing = null
        this.index = -1
      }
    },
    filter (item, queryText, itemText) {
      if (item.header) return false

      const hasValue = val => val != null ? val : ''

      const text = hasValue(itemText)
      const query = hasValue(queryText)

      return text.toString()
        .toLowerCase()
        .indexOf(query.toString().toLowerCase()) > -1
    },
    saveKeyword () {
      
      // validate field shortcode first
      if(!this.keyform.shortcode)
        this.openSnackBar("You cannot fill Data in Textfields!")

      // reformat Data Informations
      let x
      if(typeof this.keyform.shortcode === 'string')
        x = this.keyform.shortcode
      
      let { shortcode: { shortcode: y } } = this.keyform
      
      let object = this.model

      const changeToObject = (array, value) =>
        array.reduce((obj, item) => {
          obj[item.text] = value
          return obj
        }, {})

      const keywordObject = changeToObject(object, campTestId)
      const keywordReservedObject = changeToObject(object, false)

      const shortcodeResult = ((typeof x === 'string') ? x : y)

      // save Data to Firestore & close Dialog
      this.createKeywordByShortcode({
        shortcode: shortcodeResult,
        keywordsTestObj: keywordObject,
        keywordsResObj: keywordReservedObject,
      })
      this.closeDialog()

    },
    closeDialog () {
      this.$emit('emitCloseKeywordByShortcodeDialog', false)
    },
    clearForm () {

    },
    openSnackBar (insertText) {
      this.valid = !this.valid
      this.textError = ''
      this.textError = insertText
      this.snackbar = true
    }
  }
}
</script>

<template>
  <div>
    <v-dialog 
      v-model="addKeywordByShortcodeDialog"
      persistent
      width="800px"
    >
      <v-form 
        ref="keyform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 title">
            Add New Test Keywords
          </v-card-title>
          <v-container 
            grid-list-sm 
            class="pa-4"
          >
            <v-layout 
              row 
              wrap
            >
              <v-flex
                xs8
              >
                <p>Please Enter Your Shortcode:</p>
                <v-combobox
                  :key="shortcodeList.key"
                  v-model="keyform.shortcode"
                  :hint="`${keyform.shortcode}`"
                  :items="shortcodeList"
                  :rules="firstRules"
                  item-text="shortcode"
                  prepend-icon="filter_6"
                  label="Shortcode"
                  type="number"
                  chips
                  solo
                >
                  <template 
                    slot="item" 
                    slot-scope="data"
                  >
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content v-text="data.item" />
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-title>{{ data.item.shortcode }}</v-list-item-title>
                      </v-list-item-content>
                    </template>
                    <template 
                      slot="selection" 
                      slot-scope="idata"
                    >
                      <v-chip
                        :key="JSON.stringify(idata.item)"
                        :selected="idata.selected"
                        color="deep-purple"
                        close
                        @input="idata.parent.selectItem(idata.item)"
                      >
                        {{ idata.item.shortcode }}
                      </v-chip>
                    </template>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex xs12>
                <p>&nbsp;</p>
              </v-flex>
              <v-flex xs12>
                <p>Please Enter Your Keywords (Allow entering multiple values):</p>
                <v-combobox
                  v-model="model"
                  :filter="filter"
                  :hide-no-data="!search"
                  :items="items"
                  :search-input.sync="search"
                  :rules="secondRules"
                  hide-selected
                  label="Search or Create New Keyword"
                  multiple
                  small-chips
                  solo
                  disabled
                  required
                >
                  <template slot="no-data">
                    <v-list-item>
                      <span class="subheading">
                        Create
                      </span>
                      <v-chip
                        :color="`${colors[nonce - 1]} lighten-3`"
                        label
                        small
                      >
                        {{ search }}
                      </v-chip>
                    </v-list-item>
                  </template>
                  <template
                    v-if="item === Object(item)"
                    slot="selection"
                    slot-scope="{ item, parent, selected }"
                  >
                    <v-chip
                      :color="`${item.color} lighten-3`"
                      :selected="selected"
                      label
                      small
                    >
                      <span class="pr-2">
                        {{ item.text }}
                      </span>
                      <v-icon
                        small
                        @click="parent.selectItem(item)"
                      >
                        close
                      </v-icon>
                    </v-chip>
                  </template>
                  <template
                    slot="item"
                    slot-scope="{ index, item }"
                  >
                    <v-list-item-content>
                      <v-text-field
                        v-if="editing === item"
                        v-model="editing.text"
                        autofocus
                        text
                        background-color="transparent"
                        hide-details
                        solo
                        @keyup.enter="edit(index, item)"
                      />
                      <v-chip
                        v-else
                        :color="`${item.color} lighten-3`"
                        dark
                        label
                        small
                      >
                        {{ item.text }}
                      </v-chip>
                    </v-list-item-content>
                    <v-spacer />
                    <v-list-item-action @click.stop>
                      <v-btn
                        icon
                        @click.stop.prevent="edit(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </template>
                </v-combobox>
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <v-btn
              class="v-btn--simple"
              rounded 
              color="secondary" 
              @click="clearForm()"
            >
              Clear
            </v-btn>
            <v-btn
              class="v-btn--simple"
              rounded 
              color="primary" 
              @click="closeDialog()"
            >
              CANCEL
            </v-btn>
            <v-btn
              :disabled="!valid"
              rounded
              color="primary"
              @click="saveKeyword()"
            >
              SAVE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :bottom="true"
      vertical="vertical"
      color="error"
    > 
      {{ textError }}
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>
