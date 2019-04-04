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
      items: [
        "MO", "MT"
      ],
      valid: true,
      iconValue: true,
    }
  },
  computed: {
    ...mapGetters('shortcodes', [
      'hadOperatorConfig',
      'getOneOpsConfig'
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
        this.setOperatorConfig({ url: value })
      }
    },
    type: {
      get () {
        return this.getOneOpsConfig.type
      },
      set (value) {
        this.setOperatorConfig({ type: value })
      }
    },
    username: {
      get () {
        return this.getOneOpsConfig.username
      },
      set (value) {
        this.setOperatorConfig({ username: value })
      }
    },
    password: {
      get () {
        return this.getOneOpsConfig.password
      },
      set (value) {
        this.setOperatorConfig({ password: value })
      }
    },
  },
  watch: {   
    operator: {
      handler(operator) {
        if(this.operator) {
          this.getOperatorConfig({
            operator: this.operator,
            shortcode: this.shortcode
          })
        }
      },
      immediate: true
    },
    shortcode: {
      handler(shortcode) {
        if(this.shortcode) {
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
    ]),
    ...mapMutations('shortcodes', [
      'setOperatorConfig'
    ]),
    mutateOppForm (val) {
      this.mutateOperatorConfig(val)
    },
    closeDialog () {
      this.$emit('emitCloseOpConfigEDialog', false)
    },
    // clearOppForm () {
    //   this.oppForm = Object.assign({}, this.defaultOppEditForm)
    //   this.$refs.oppForm.reset()
    //   this.opsRadio = this.operator
    // },
    editOpConfig () {
      // TODO:  added shortcode here!
      let data = {
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
    },
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
          <v-card-title class="light-green lighten-4 py-4 title">
            Edit Operator Config
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
              </v-flex>
              <v-flex
                xs8
                md6
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
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <!-- <v-btn
              class="v-btn--simple"
              round 
              color="secondary" 
              @click="clearOppForm()"
            >
              Clear
            </v-btn> -->
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
              @click="editOpConfig()"
            >
              SAVE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

