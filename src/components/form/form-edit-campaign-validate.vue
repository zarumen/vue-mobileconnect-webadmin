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
  data: () => ({
    valid: false
  }),
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
    value: {
      get () {
        return this.campaignValidate[this.fieldName]
      },
      set (val) {
        const updateObj = {}
        updateObj[this.fieldName] = val
        this.updateCampaignValidate(updateObj)
      }
    }
  },
  methods: {
    ...mapActions('campaigns', [
      'updateCampaignValidate',
      'editCampaignValidate'
    ]),
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
