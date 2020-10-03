<script>
import { mapActions, mapGetters } from 'vuex'

export default {
  props: {
    editCampaignDialog: {
      type: [String, Boolean],
      default: ''
    },
    fieldName: {
      type: String,
      default: ''
    },
    fieldType: {
      type: String,
      default: 'string'
    }
  },
  data () {
    const defaultussdForm = Object.freeze({
      ACCOUNT: '',
      SENDERNAME: '',
      LANGUAGE: 'T',
      PASSWORD: '',
      URL: '',
      OPERATORS: {
        ais: {
          failure: false,
          success: false
        },
        ussdAisBais: {
          failure: false,
          success: false
        },
        ussdAisBdtac: {
          failure: false,
          success: false
        },
        ussdAisBtrue: {
          failure: false,
          success: false
        },
        dtac: {
          failure: false,
          success: false
        },
        ussddtac: {
          failure: false,
          success: false
        },
        true: {
          failure: false,
          success: false
        },
        ussdtrue: {
          failure: false,
          success: false
        },
        testweb: {
          failure: false,
          success: false
        }
      }
    })

    return {
      valid: false,
      // ---------**-------------------------------------
      // Operators Bulk Configs
      // ---------**-------------------------------------
      ussdForm: Object.assign({}, defaultussdForm),
      showPass: false,
      optionBulk: false,
      optionAis: false,
      optionUssdAisBais: false,
      optionUssdAisBdtac: false,
      optionUssdAisBtrue: false,
      optionTrue: false,
      optionDtac: false,
      optionUssdDtac: false,
      optionTestweb: false,
      optionUssdTrue: false
    }
  },
  computed: {
    ...mapGetters('campaigns', [
      'getOneCampaignValidate'
    ]),
    campaignId () {
      return this.$route.params.campaignId
    },
    campaignValidate () {
      return this.getOneCampaignValidate
    },
    formString () {
      return this.fieldType === 'string'
    },
    formNumber () {
      return this.fieldType === 'number'
    },
    formBoolean () {
      return this.fieldType === 'boolean'
    },
    formBulk () {
      return this.fieldType === 'bulk'
    },
    value: {
      get () {
        if (this.formBulk) {
          return this.campaignValidate[this.fieldName] || this.ussdForm
        }
        return this.campaignValidate[this.fieldName]
      },
      set (val) {
        const updateObj = {}
        updateObj[this.fieldName] = val
        this.updateCampaignValidate(updateObj)
      }
    }
  },
  mounted () {
    if (this.formBulk) {
      this.activationButtonOperators(this.value.OPERATORS)
    }
  },
  methods: {
    ...mapActions('campaigns', [
      'updateCampaignValidate',
      'editCampaignValidate'
    ]),
    activatedOperators (option) {
      return (option) ? 'Open' : 'Close'
    },
    activationButtonOperators (obj) {
      for (const oper in obj) {
        switch (oper) {
          case 'ais':
            this.optionAis = true
            break
          case 'ussdAisBais':
            this.optionUssdAisBais = true
            break
          case 'ussdAisBdtac':
            this.optionUssdAisBdtac = true
            break
          case 'ussdAisBtrue':
            this.optionUssdAisBtrue = true
            break
          case 'dtac':
            this.optionDtac = true
            break
          case 'ussdDtac':
            this.optionUssdDtac = true
            break
          case 'true':
            this.optionTrue = true
            break
          case 'ussdTrue':
            this.optionUssdTrue = true
            break
          case 'testweb':
            this.optionTestweb = true
            break
          default:
            // code block
        }
      }
    },
    closeDialog () {
      this.$emit('emitCloseEditDialog', false)
    },
    saveEditCampaignValidate () {
      const updateObj = {}
      updateObj[this.fieldName] = this.value
      console.log(updateObj)
      this.editCampaignValidate({
        campaignId: this.campaignId,
        validateObj: updateObj
      })
      this.closeDialog()
    }
  }
}
</script>

<template>
  <div>
    <v-dialog
      v-model="editCampaignDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="campaignValidateForm"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Edit Campaign Validate : {{ campaignId }}
          </v-card-title>
          <!--                  STRING FORM                   -->
          <v-card-text
            v-if="formString"
            class="pt-4"
          >
            <v-text-field
              v-model="value"
              :label="fieldName"
              color="primary"
              counter
              filled
            />
          </v-card-text>
          <!--                  NUMBER FORM                   -->
          <v-card-text
            v-if="formNumber"
            class="pt-4"
          >
            <v-text-field
              v-model.number="value"
              :label="fieldName"
              color="primary"
              counter
              filled
            />
          </v-card-text>
          <!--                  BOOLEAN FORM                   -->
          <v-card-text
            v-if="formBoolean"
            class="pt-4"
          >
            <v-switch
              v-model="value"
              :label="fieldName"
              color="primary"
            />
          </v-card-text>
          <!--                  BULK-CONFIG FORM                   -->
          <v-card-text
            v-if="formBulk"
            class="pt-4"
          >
            <v-col
              cols="12"
            >
              <v-select
                v-model="value.LANGUAGE"
                :items="['T', 'E']"
                prepend-icon="language"
                label="Language"
              />
              <v-text-field
                v-model="value.URL"
                prepend-icon="http"
                label="Url"
              />
              <v-text-field
                v-model="value.ACCOUNT"
                prepend-icon="account_box"
                label="Bulk Account"
              />
              <v-text-field
                v-model="value.PASSWORD"
                :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                :type="showPass ? 'text' : 'password'"
                prepend-icon="vpn_key"
                label="Bulk Password"
                counter="0"
                @click:append="showPass = !showPass"
              />
              <v-text-field
                v-model="value.SENDERNAME"
                prepend-icon="contact_mail"
                label="Bulk Sendername"
              />
              <span><v-icon class="pr-2 my-2">call_split</v-icon>OPERATORS</span>
              <v-sheet class="pa-5">
                <v-switch
                  v-model="optionAis"
                  inset
                  :label="`AIS: ${activatedOperators(optionAis)}`"
                />
                <v-sheet
                  v-if="optionAis"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ais.success"
                    :label="`Success: ${value.OPERATORS.ais.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ais.failure"
                    :label="`Failure: ${value.OPERATORS.ais.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionUssdAisBais"
                  inset
                  :label="`USSD CHARGE B AIS: ${activatedOperators(optionUssdAisBais)}`"
                />
                <v-sheet
                  v-if="optionUssdAisBais"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBais.success"
                    :label="`Success: ${value.OPERATORS.ussdAisBais.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBais.failure"
                    :label="`Failure: ${value.OPERATORS.ussdAisBais.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionUssdAisBdtac"
                  inset
                  :label="`USSD CHARGE B DTAC: ${activatedOperators(optionUssdAisBdtac)}`"
                />
                <v-sheet
                  v-if="optionUssdAisBdtac"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBdtac.success"
                    :label="`Success: ${value.OPERATORS.ussdAisBdtac.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBdtac.failure"
                    :label="`Failure: ${value.OPERATORS.ussdAisBdtac.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionUssdAisBtrue"
                  inset
                  :label="`USSD CHARGE B TRUE: ${activatedOperators(optionUssdAisBtrue)}`"
                />
                <v-sheet
                  v-if="optionUssdAisBtrue"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBtrue.success"
                    :label="`Success: ${value.OPERATORS.ussdAisBtrue.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ussdAisBtrue.failure"
                    :label="`Failure: ${value.OPERATORS.ussdAisBtrue.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionDtac"
                  inset
                  :label="`DTAC: ${activatedOperators(optionDtac)}`"
                />
                <v-sheet
                  v-if="optionDtac"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.dtac.success"
                    :label="`Success: ${value.OPERATORS.dtac.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.dtac.failure"
                    :label="`Failure: ${(value.OPERATORS.dtac.failure)}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionUssdDtac"
                  inset
                  :label="`USSD DTAC: ${activatedOperators(optionUssdDtac)}`"
                />
                <v-sheet
                  v-if="optionUssdDtac"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ussddtac.success"
                    :label="`Success: ${value.OPERATORS.ussddtac.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ussddtac.failure"
                    :label="`Failure: ${(value.OPERATORS.ussddtac.failure)}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionTrue"
                  inset
                  :label="`TRUE: ${activatedOperators(optionTrue)}`"
                />
                <v-sheet
                  v-if="optionTrue"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.true.success"
                    :label="`Success: ${value.OPERATORS.true.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.true.failure"
                    :label="`Failure: ${value.OPERATORS.true.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionUssdTrue"
                  inset
                  :label="`USSD TRUE: ${activatedOperators(optionUssdTrue)}`"
                />
                <v-sheet
                  v-if="optionUssdTrue"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.ussdtrue.success"
                    :label="`Success: ${value.OPERATORS.ussdtrue.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.ussdtrue.failure"
                    :label="`Failure: ${value.OPERATORS.ussdtrue.failure}`"
                  />
                </v-sheet>
                <v-switch
                  v-model="optionTestweb"
                  inset
                  :label="`TESTWEB: ${activatedOperators(optionTestweb)}`"
                />
                <v-sheet
                  v-if="optionTestweb"
                  class="pa-3"
                >
                  <v-switch
                    v-model="value.OPERATORS.testweb.success"
                    :label="`Success: ${value.OPERATORS.testweb.success}`"
                  />
                  <v-switch
                    v-model="value.OPERATORS.testweb.failure"
                    :label="`Failure: ${value.OPERATORS.testweb.failure}`"
                  />
                </v-sheet>
              </v-sheet>
            </v-col>
          </v-card-text>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
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
              @click="saveEditCampaignValidate()"
            >
              SAVE
            </base-button>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>
