<script>
import { mapActions } from 'vuex'
export default {
  props: {
    addOperatorConfigDialog: {
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
    // oppForm: {
    //   type: [Object],
    //   default: Object.assign({}, defaultOppForm)
    // }
  },
  data () {
    const defaultOppForm = Object.freeze({
      url: '',
      type: '',
      username: '',
      password: ''
    })
    return {
      oppForm: Object.assign({}, defaultOppForm),
      items: [
        "MO", "MT"
      ],
      valid: true,
      iconValue: true,
      opsDisabled: false
    }
  },
  computed: {
    opsRadio () {

      if (this.operator) {

        return this.changedTrickRadio(this.opsDisabled, this.operator)
      }
      return null
    },
  },
  methods: {
    ...mapActions('shortcodes', [
        'createOperatorConfig'
    ]),
    closeDialog () {
      this.$emit('emitCloseOpConfigDialog', false)
    },
    clearOppForm () {
      this.oppForm = Object.assign({}, this.defaultOppForm)
      this.$refs.oppForm.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveOpConfig () {

      if(this.$refs.oppForm.validate()) {
        let data = this.oppForm

        this.createOperatorConfig({
          shortcode: this.shortcode,
          operator: this.operator,
          config: data
        })

        this.closeDialog()
      }
    },
    changedTrickRadio (bool, operator) {

      bool = !bool

      return operator
    }
  }
}
</script>

<template>
  <div>
    <v-dialog 
      v-model="addOperatorConfigDialog"
      persistent
      width="800px"
    >
      <v-form 
        ref="oppForm"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 title">
            Operator Config
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
                xs12
              >
                <v-radio-group 
                  v-model="opsRadio"
                  :disabled="opsDisabled"
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
              </v-flex>
              <v-flex
                xs8
                md6
              >
                <v-text-field
                  v-model="oppForm.url"
                  label="Enter your Operator's URL"
                  value="value"
                  single-line
                />
                <v-select
                  v-model="oppForm.type"
                  :items="items"
                  label="Type of Shortcode"
                />
                <v-text-field
                  v-model="oppForm.username"
                  label="Enter your username"
                  single-line
                />
                <v-text-field
                  v-model="oppForm.password"
                  label="Enter your password"
                  hint="At least 8 characters"
                  min="8"
                  :append-icon="iconValue ? 'visibility' : 'visibility_off'"
                  value="Password"
                  :type="iconValue ? 'password' : 'text'"
                  @click:append="() => (iconValue = !iconValue)"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <base-button
              text 
              color="primary" 
              @click="clearOppForm()"
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
              @click="saveOpConfig()"
            >
              SAVE
            </base-button>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
