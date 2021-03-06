<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    editSenderNameDialog: {
      type: [String, Boolean],
      default: ''
    },
    shortcodeItem: {
      type: [Object],
      default: () => ({
        shortcode: '',
        sendername: []
      })
    }
  },
  data () {
    return {
      colors: ['green', 'purple', 'indigo', 'cyan', 'teal', 'red', 'light-green', 'deep-purple', 'blue', 'pink', 'lime'],
      editing: null,
      index: -1,
      items: [
        { header: 'Select a SenderName or create one' }
      ],
      nonce: 1,
      menu: false,
      model: [],
      x: 0,
      search: null,
      y: 0,
      // /////////////////////
      // Form Validator
      // /////////////////////
      valid: true,
      zRules: [
        v => !!v || 'This Field is required'
      ]
    }
  },
  computed: {
    ...mapGetters('shortcodes', [
      'getShortcodesList'
    ]),
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
    if (this.shortcodeItem) {
      const sendnameArray = this.shortcodeItem.sendername

      sendnameArray.forEach(v => {
        if (typeof v === 'string') {
          v = {
            text: v,
            color: this.colors[this.nonce - 1]
          }

          this.items.push(v)
          this.model.push(v)

          this.nonce++
        }

        return v
      })
    }
  },
  methods: {
    ...mapActions('shortcodes', [
      'editSenderName'
    ]),
    ...mapMutations('shortcodes', [
      'setSendernameInShortcodesList'
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
    mutateShortcodeList (sc, sendNameNew) {
      const scList = this.getShortcodesList
      const deletedShortcodeListObj = scList.find(rc => rc.shortcode === sc)
      // get position of mutate shortcodesList Object
      const i = this.getShortcodesList.indexOf(deletedShortcodeListObj)
      // update sendername with new sendername
      this.setSendernameInShortcodesList({
        position: i,
        payload: sendNameNew
      })
    },
    clearForm () {
      this.$refs.sendernameForm.reset()
    },
    closeDialog () {
      this.$emit('emitCloseEditSendernameDialog', false)
    },
    saveEditSendername () {
      // save data
      const arr = this.arraySenderName

      this.editSenderName({
        shortcode: this.shortcodeItem.shortcode,
        senderArray: arr
      })
        .then(() => {
          this.mutateShortcodeList(this.shortcodeItem.shortcode, arr)
        })

      this.closeDialog()
    }
  }
}
</script>

<template>
  <div>
    <v-dialog
      v-model="editSenderNameDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="sendernameForm"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Edit Sendername : {{ shortcodeItem.shortcode }}
          </v-card-title>
          <v-container
            grid-list-sm
            class="pa-4"
          >
            <v-row
              wrap
            >
              <v-col
                cols="12"
              >
                <p>Please Enter Your Sender Name (Allow entering multiple values):</p>
                <v-combobox
                  v-model="model"
                  :filter="filter"
                  :hide-no-data="!search"
                  :items="items"
                  :search-input.sync="search"
                  :rules="zRules"
                  hide-selected
                  label="Search or Create New SenderName"
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
              @click="saveEditSendername()"
            >
              SAVE
            </base-button>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
