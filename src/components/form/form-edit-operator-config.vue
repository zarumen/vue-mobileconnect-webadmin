<script>
import { mapActions, mapGetters, mapMutations } from 'vuex'
export default {
  props: {
    editOperatorConfigDialog: {
      type: [String, Boolean],
      default: ''
    },
    shortcode: {
      type: [String],
      default: ''
    },
    operator: {
      type: [String],
      default: ''
    }
  },
  data () {
    return {
      dialog: false,
      items: [
        'MO', 'MT'
      ],
      valid: true,
      iconValue: true
    }
  },
  computed: {
    ...mapGetters('shortcodes', [
      'hadOperatorConfig',
      'getOneOpsConfig',
      'getShortcodesList'
    ]),
    opsRadio () {
      // set Radio Button
      if (this.operator !== '') {
        return this.operator
      }
      return null
    },
    // OppForm Mutation in Vuex 'shortcodes/state.operatorConfig'
    url: {
      get () {
        return this.getOneOpsConfig.url
      },
      set (value) {
        this.setElementOperatorConfig({ url: value })
      }
    },
    type: {
      get () {
        return this.getOneOpsConfig.type
      },
      set (value) {
        this.setElementOperatorConfig({ type: value })
      }
    },
    username: {
      get () {
        return this.getOneOpsConfig.username
      },
      set (value) {
        this.setElementOperatorConfig({ username: value })
      }
    },
    password: {
      get () {
        return this.getOneOpsConfig.password
      },
      set (value) {
        this.setElementOperatorConfig({ password: value })
      }
    }
  },
  watch: {
    operator: {
      handler (operator) {
        if (this.operator) {
          this.getOperatorConfig({
            operator: this.operator,
            shortcode: this.shortcode
          })
        }
      },
      immediate: true
    },
    shortcode: {
      handler (shortcode) {
        if (this.shortcode) {
          this.getOperatorConfig({
            operator: this.operator,
            shortcode: this.shortcode
          })
        }
      },
      immediate: true
    }
  },
  mounted () {

  },
  methods: {
    ...mapActions('shortcodes', [
      'editOperatorConfig',
      'getOperatorConfig',
      'deleteOperatorConfig'
    ]),
    ...mapMutations('shortcodes', [
      'setOperatorConfig',
      'setElementOperatorConfig',
      'setElementShortcodesList'
    ]),
    mutateOppForm (val) {
      this.mutateOperatorConfig(val)
    },
    mutateShortcodeList (sc, op) {
      const scList = this.getShortcodesList
      const deletedShortcodeListObj = scList.find(rc => rc.shortcode === sc)
      // get position of mutate shortcodesList Object
      const i = this.getShortcodesList.indexOf(deletedShortcodeListObj)

      // deleted operator from operatorName in Obj
      // operator array remaining such as ["ais", "dtac"]
      const result = deletedShortcodeListObj.operatorName.filter(re => re !== op)

      this.setElementShortcodesList({
        position: i,
        payload: result
      })
    },
    closeDialog () {
      this.$emit('emitCloseOpConfigEDialog', false)
    },
    clearOpp () {
      // delete operator config

      this.deleteOperatorConfig({
        shortcode: this.shortcode,
        operator: this.operator
      })
        .then(() => {
          this.mutateShortcodeList(this.shortcode, this.operator)
        })

      this.closeDialog()
    },
    editOpConfig () {
      const data = {
        url: this.url,
        type: this.type,
        username: this.username,
        password: this.password
      }

      this.editOperatorConfig({
        shortcode: this.shortcode,
        operator: this.operator,
        config: data
      })

      this.closeDialog()
    },
    onCancel () {
      this.dialog = false
    },
    onConfirm () {
      this.clearOpp()
    }
  }
}
</script>

<template>
  <div>
    <v-dialog
      v-model="editOperatorConfigDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="oppForm"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Edit Operator Config
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
                <v-radio-group
                  v-model="opsRadio"
                  disabled
                  row
                >
                  <v-radio
                    color="green"
                    label="AIS"
                    value="ais"
                  />
                  <v-radio
                    color="orange"
                    label="CAT"
                    value="cat"
                  />
                  <v-radio
                    color="blue"
                    label="DTAC"
                    value="dtac"
                  />
                  <v-radio
                    color="red"
                    label="TRUE"
                    value="true"
                  />
                </v-radio-group>
              </v-col>
              <v-col
                cols="8"
                md="6"
              >
                <v-text-field
                  v-model="url"
                  label="Enter your Operator's URL"
                />
                <v-select
                  v-model="type"
                  :items="items"
                  label="Type of Shortcode"
                />
                <v-text-field
                  v-model="username"
                  label="Enter your username"
                />
                <v-text-field
                  v-model="password"
                  label="Enter your password"
                  hint="At least 8 characters"
                  min="8"
                  :append-icon="iconValue ? 'visibility' : 'visibility_off'"
                  :type="iconValue ? 'password' : 'text'"
                  @click:append="() => (iconValue = !iconValue)"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <base-button
              text
              color="primary"
              @click="dialog = !dialog"
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
              @click="editOpConfig()"
            >
              SAVE
            </base-button>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <BaseDialog
      :dialog="dialog"
      :dialog-title="`Confirm Deleted ${operator} Password Config`"
      :dialog-text="`You want to Delete ${operator} password in ${shortcode}?`"
      @onConfirm="onConfirm"
      @onCancel="onCancel"
    />
  </div>
</template>
