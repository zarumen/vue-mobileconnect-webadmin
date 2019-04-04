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
  data ()  {
    // form default object
    const defaultscForm = Object.freeze({
      shortcode: '',
    })
    return {
      scform: Object.assign({}, defaultscForm),
      addOperatorConfig: '',
      activator: null,
      attach: null,
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'red','light-green', 'deep-purple', 'blue', 'pink', 'lime'],
      editing: null,
      index: -1,
      items: [
        { header: 'Select a Sender Name or create one' },
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
      snackbar:false,
      timeout: 6000,
      textError: 'Error!',
      select: { id: 1, value: '1 Operator' },
      levelItems: [
        { id: 1, value: '1 Operator' },
        { id: 2, value: '2 Operators' },
        { id: 3, value: '3 Operators' },
        { id: 4, value: '4 Operators' },
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
      ],
    }
  },
  computed: {
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
    ...mapGetters('organizations', [
      'hadList',
    ]),
    shortcodeArray () {
      let shortcodes = this.shortcodeList
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
    },
  },
  created () {
    
    if(!this.hadList)
      this.getOrganizationsList()
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
    closeDialog() {
      this.$emit('emitCloseShortcodeDialog', false)
    },
    clearForm() {
      this.scform = Object.assign({}, this.defaultscForm)
      this.$refs.uform.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveShortcode () {
      // TODO:  added shortcode here!

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

      this.closeDialog ()
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
          <v-card-title class="light-green lighten-4 py-4 title">
            Create New Shortcode
          </v-card-title>
          <v-card-text>
            <v-container 
              grid-list-sm 
              class="pa-4"
            >
              <v-layout 
                row
                wrap
              >
                <v-flex xs8>
                  <v-text-field
                    v-model="scform.shortcode"
                    :hint="`${scform.shortcode}`"
                    :mask="`#######`"
                    prepend-icon="filter_6"
                    label="Shortcode"
                    persistent-hint
                    solo
                  />
                </v-flex>
                <!-- <v-flex 
                  xs8 
                  align-center
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
                </v-flex> -->
                <v-flex xs12>
                  <p>Please Enter Your Sender Name (Allow entering multiple values):</p>
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
                  >
                    <template slot="no-data">
                      <v-list-tile>
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
                      </v-list-tile>
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
                      slot-scope="{ ind, item }"
                    >
                      <v-list-tile-content>
                        <v-text-field
                          v-if="editing === item"
                          v-model="editing.text"
                          autofocus
                          flat
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
                      </v-list-tile-content>
                      <v-spacer />
                      <v-list-tile-action @click.stop>
                        <v-btn
                          class="v-btn--simple"
                          color="primary"
                          icon
                          @click.stop.prevent="edit(ind, item)"
                        >
                          <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                        </v-btn>
                      </v-list-tile-action>
                    </template>
                  </v-combobox>
                </v-flex>
                <!-- <v-flex
                  xs12
                >
                  <v-list two-line>
                    <v-list-tile
                      v-for="item in 3"
                      :key="item.key"
                      avatar
                    >
                      <v-list-tile-avatar>
                        <v-icon class="blue white--text">
                          code
                        </v-icon>
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title>title</v-list-tile-title>
                        <v-list-tile-sub-title>{{ item }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </v-list>
                </v-flex>
                <p />
                <v-btn 
                  color="primary" 
                  round
                  @click.native="addOperatorConfig = !addOperatorConfig"
                >
                  <v-icon dark>
                    add
                  </v-icon>
                  Add Parser
                </v-btn> -->
              </v-layout>
            </v-container>
          </v-card-text>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <v-btn
              class="v-btn--simple"
              round 
              color="secondary" 
              @click="clearForm()"
            >
              Clear
            </v-btn>
            <v-btn
              class="v-btn--simple"
              round 
              color="primary" 
              @click="closeDialog()"
            >
              CANCEL
            </v-btn>
            <v-btn
              :disabled="!valid"
              round
              color="primary"
              @click="saveShortcode()"
            >
              SAVE
            </v-btn>
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
      <v-btn
        dark
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>