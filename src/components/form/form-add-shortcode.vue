<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addShortcodeDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data: () => ({
    sform: {
      shortcode: null,
    },
    activator: null,
    attach: null,
    colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'red','light-green', 'deep-purple', 'blue', 'pink', 'lime'],
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
    snackbar:false,
    timeout: 6000,
    textError: 'Error!',
    select: null,
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
  }),
  computed: {
    ...mapState('shortcodes', {
      shortcodeList: 'shortcodeList',
      keywordList: 'keywordList',
      keywordReservedList: 'keywordReservedList'
    }),
    shortcodeArray () {
      let shortcodes = this.shortcodeList
      return shortcodes.map(sc => sc.shortcode)
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
  methods: {
    ...mapActions('shortcodes', [
        'createShortcode'
    ]),
    closeDialog() {
      this.$emit('emitCloseShortcodeDialog', false)
    },
    clearForm() {
      this.uform = Object.assign({}, this.defaultForm)
      this.$refs.uform.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveShortcode () {
      // TODO:  added shortcode here!
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
        ref="sform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 title">
            Create New Shortcode
          </v-card-title>
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
                  v-model="sform.shortcode"
                  :hint="`${sform.shortcode}`"
                  :rules="firstRules"
                  :mask="`######`"
                  prepend-icon="filter_6"
                  label="Shortcode"
                  type="number"
                  persistent-hint
                  solo
                />
              </v-flex>
              <v-flex 
                xs8 
                align-center 
                justify-space-between
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
              </v-flex>
              <v-flex 
                v-if="enableLevel1"
                xs8
              >
                <v-combobox
                  :key="companyList.key"
                  v-model="company"
                  :hint="`${company}`"
                  :items="companyList"
                  item-text="displayName"
                  prepend-icon="business"
                  label="Company Name"
                  persistent-hint
                  required
                  chips
                />
              </v-flex>
              <v-flex
                v-if="enableLevel2"
                xs8
              >
                <v-combobox
                  :key="departmentList.id"
                  v-model="department"
                  :hint="`${department}`"
                  :items="departmentList"
                  item-text="displayName"
                  prepend-icon="business_center"
                  label="Department Name"
                  persistent-hint
                  chips
                >
                  <template 
                    slot="item" 
                    slot-scope="data"
                  >
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item" />
                    </template>
                    <template v-else>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ data.item.organizationLevel1Name }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                    <template 
                      slot="selection" 
                      slot-scope="data"
                    >
                      <v-chip
                        :key="JSON.stringify(data.item)"
                        :selected="data.selected"
                        close
                        @input="data.parent.selectItem(data.item)"
                      >
                        {{ data.item.displayName }}
                      </v-chip>
                    </template>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex
                v-if="enableLevel3"
                xs8
              >
                <v-combobox
                  :key="brandList.id"
                  v-model="brand"
                  :hint="`${brand}`"
                  :items="brandList"
                  item-text="displayName"
                  prepend-icon="shopping_basket"
                  label="Brand Name"
                  persistent-hint
                  chips
                >
                  <template 
                    slot="item" 
                    slot-scope="data"
                  >
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item" />
                    </template>
                    <template v-else>
                      <v-list-tile-content>
                        <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                        <v-list-tile-sub-title>{{ data.item.organizationLevel1Name }} > {{ data.item.organizationLevel2Name }}</v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                    <template 
                      slot="selection" 
                      slot-scope="data"
                    >
                      <v-chip
                        :key="JSON.stringify(data.item)"
                        :selected="data.selected"
                        close
                        @input="data.parent.selectItem(data.item)"
                      >
                        {{ data.item.displayName }}
                      </v-chip>
                    </template>
                  </template>
                </v-combobox>
              </v-flex>
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
                  label="Search or Create New SenderName"
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
                    slot-scope="{ index, item }"
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
                    </v-list-tile-content>
                    <v-spacer />
                    <v-list-tile-action @click.stop>
                      <v-btn
                        icon
                        @click.stop.prevent="edit(index, item)"
                      >
                        <v-icon>{{ editing !== item ? 'edit' : 'check' }}</v-icon>
                      </v-btn>
                    </v-list-tile-action>
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