<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addKeywordReservedDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data: () => ({
    keyform: {
      shortcode: null
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
        text: 'DEFAULT',
        color: 'blue'
      }
    ],
    x: 0,
    search: null,
    y: 0,
    snackbar: false,
    timeout: 6000,
    textError: 'Error!',
    valid: true,
    firstRules: [
      v => !!v || 'Shortcode is required'
    ],
    secondRules: [
      v => v.length > 0 || 'Keyword is required'
    ]
  }),
  computed: {
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
    keywordInKeywordList () {
      const sCheck = this.keyform.shortcode.shortcode

      if (sCheck) {
        const kws = this.keywordReservedList.find(sc => sc.shortcode === sCheck)

        return [...kws.keywordsFalseArray, ...kws.keywordsArray]
      }

      return []
    }
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
      'createKeywordsReserved'
    ]),
    checkDupKeyword (keywordArr) {
      if (keywordArr) {
        if (!this.keywordInKeywordList) return true
        // ถ้ามี keyword เข้ามาให้ เช็คว่า มี keyword ที่ใช้อยู่รึิเปล่า
        const checkArr = keywordArr.map(element => {
          // return เป็น Boolean Array ของ keywords [true, false, true]
          return this.keywordInKeywordList.includes(element.text)
        })
        // ถ้ามี แม้แต่ 1 ตัวที่เป็น true ให้โชว์ error ว่า มี keyword ซ้ำ
        if (checkArr.includes(true)) {
          // show Error
          return false
        }
        // doesn't show Error
        return true
      }
      // doesn't show Error
      return true
    },
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
      if (!this.keyform.shortcode) { this.openSnackBar('You cannot fill Data in Textfields!') }

      if (!this.checkDupKeyword(this.model)) {
        this.openSnackBar('KEYWORDS ซ้ำ+')
      } else {
      // reformat Data Informations
        let x
        if (typeof this.keyform.shortcode === 'string') { x = this.keyform.shortcode }

        const { shortcode: { shortcode: y } } = this.keyform

        const object = this.model

        const changeToObject = (array) =>
          array.reduce((obj, item) => {
            obj[item.text] = true
            return obj
          }, {})

        const keywordObject = changeToObject(object)

        const shortcodeResult = ((typeof x === 'string') ? x : y)

        // save Data to Firestore & close Dialog
        this.createKeywordsReserved({
          shortcode: shortcodeResult,
          keywords: keywordObject
        })
        this.closeDialog()
      }
    },
    closeDialog () {
      this.$emit('emitCloseKeywordDialog', false)
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
      v-model="addKeywordReservedDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="keyform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Add New Keywords
          </v-card-title>
          <v-container
            grid-list-sm
            class="pa-4"
          >
            <v-row
              wrap
            >
              <v-col
                cols="8"
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
                        :input-value="idata.selected"
                        color="deep-purple"
                        close
                        @input="idata.parent.selectItem(idata.item)"
                      >
                        {{ idata.item.shortcode }}
                      </v-chip>
                    </template>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="12">
                <p>&nbsp;</p>
              </v-col>
              <v-col cols="12">
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
                  prepend-icon="sort_by_alpha"
                  multiple
                  small-chips
                  solo
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
                      :input-value="selected"
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
                      <base-button
                        icon
                        @click.stop.prevent="edit(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                      </base-button>
                    </v-list-item-action>
                  </template>
                </v-combobox>
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <base-button
              text
              color="primary"
              @click="clearForm()"
            >
              Clear
            </base-button>
            <base-button
              text
              color="secondary darken-2"
              @click="closeDialog()"
            >
              CANCEL
            </base-button>
            <base-button
              :disabled="!valid"
              rounded
              color="secondary darken-2"
              @click="saveKeyword()"
            >
              SAVE
            </base-button>
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
      <base-button
        dark
        text
        @click="snackbar = false"
      >
        Close
      </base-button>
    </v-snackbar>
  </div>
</template>
