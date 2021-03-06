<script>
import { mapState, mapGetters, mapActions } from 'vuex'
import FormAddOperatorConfig from '@components/form/form-add-operator-config'

export default {
  components: { FormAddOperatorConfig },
  props: {
    addShortcodeDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data () {
    // form default object
    const defaultscForm = Object.freeze({
      shortcode: ''
    })
    return {
      scform: Object.assign({}, defaultscForm),
      addOperatorConfig: '',
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'red', 'light-green', 'deep-purple', 'blue', 'pink', 'lime'],
      editing: null,
      index: -1,
      items: [
        { header: 'Select a SenderName or create one' },
        {
          text: 'DEFAULT',
          color: 'blue'
        },
        {
          text: 'TEST',
          color: 'red'
        }
      ],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0,
      snackbar: false,
      timeout: 6000,
      textError: 'Error!',
      select: { id: 1, value: '1 Operator' },
      levelItems: [
        { id: 1, value: '1 Operator' },
        { id: 2, value: '2 Operators' },
        { id: 3, value: '3 Operators' },
        { id: 4, value: '4 Operators' }
      ],
      // /////////////////////
      // Form Validator
      // /////////////////////
      valid: true,
      firstRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      secondRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ]
    }
  },
  computed: {
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
    ...mapGetters('organizations', [
      'hadList'
    ]),
    shortcodeArray () {
      const shortcodes = this.shortcodeList
      return shortcodes.map(sc => sc.shortcode)
    },
    arraySenderName () {
      return this.model.map(md => md.text)
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
  created () {
    if (!this.hadList) { this.getOrganizationsList() }
  },
  methods: {
    ...mapActions('organizations', [
      'getOrganizationsList'
    ]),
    ...mapActions('shortcodes', [
      'createShortcode'
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
    closeDialog () {
      this.$emit('emitCloseShortcodeDialog', false)
    },
    clearForm () {
      this.scform = Object.assign({}, this.defaultscForm)
      this.$refs.uform.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveShortcode () {
      const shortcodeNew = this.scform
      const shortcodeInfoNew = {
        sendername: this.arraySenderName,
        operatorName: [],
        shortcodeType: []
      }
      // add shortcode new Attribute
      this.createShortcode({
        shortcode: shortcodeNew,
        info: shortcodeInfoNew
      })

      this.closeDialog()
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
      v-model="addShortcodeDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="scform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Create New Shortcode
          </v-card-title>
          <v-card-text>
            <v-container
              grid-list-sm
              class="pa-4"
            >
              <v-row
                wrap
              >
                <v-col cols="8">
                  <v-text-field
                    v-model="scform.shortcode"
                    v-mask="`#######`"
                    :hint="`${scform.shortcode}`"
                    prepend-icon="filter_6"
                    label="Shortcode"
                    persistent-hint
                    solo
                  />
                </v-col>
                <!-- <v-col
                  xs8
                  align="center"
                >
                  <p>Please Select Number of Operators:</p>
                  <v-select
                    v-model="select"
                    :hint="`${select.id}: ${select.value}`"
                    :items="levelItems"
                    item-text="value"
                    item-value="id"
                    label="Number of Operators"
                    persistent-hint
                    return-object
                    single-line
                    solo
                  />
                </v-col> -->
                <v-col cols="12">
                  <p>Please Enter Your SenderName (Allow entering multiple values):</p>
                  <v-combobox
                    v-model="model"
                    :filter="filter"
                    :hide-no-data="!search"
                    :items="items"
                    :search-input.sync="search"
                    :rules="secondRules"
                    hide-selected
                    label="Search or Create New SenderName"
                    prepend-icon="how_to_reg"
                    multiple
                    small-chips
                    solo
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
                      slot-scope="{ ind, item }"
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
                          @keyup.enter="edit(ind, item)"
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
                          color="primary"
                          icon
                          @click.stop.prevent="edit(ind, item)"
                        >
                          <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                        </base-button>
                      </v-list-item-action>
                    </template>
                  </v-combobox>
                </v-col>
                <!-- <v-col
                  cols="12"
                >
                  <v-list two-line>
                    <v-list-item
                      v-for="item in 3"
                      :key="item.key"
                      avatar
                    >
                      <v-list-item-avatar>
                        <v-icon class="blue white--text">
                          code
                        </v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>title</v-list-item-title>
                        <v-list-item-subtitle>{{ item }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-col>
                <p />
                <base-button
                  color="primary"
                  rounded
                  @click.native="addOperatorConfig = !addOperatorConfig"
                >
                  <v-icon dark>
                    add
                  </v-icon>
                  Add Parser
                </base-button> -->
              </v-row>
            </v-container>
          </v-card-text>
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
              @click="saveShortcode()"
            >
              SAVE
            </base-button>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <form-add-operator-config
      :add-operator-config="addOperatorConfig"
      @emitCloseOpConfigDialog="addOperatorConfig=arguments[0]"
    />
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
