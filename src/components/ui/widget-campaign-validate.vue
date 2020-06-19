<script>
export default {
  components: {
    VueJsonPretty: () => import('vue-json-pretty'),
    FormEditCampaignValidate: () => import('@components/form/form-edit-campaign-validate')
  },
  props: {
    campaignValidateInfo: {
      type: Object,
      default: () => ({})
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  data: () => ({
    editCampaignDialog: false,
    selectedField: '',
    selectedValue: '',
    typeOfField: null
  }),
  computed: {
    checkTypeNull () {
      return !!this.typeOfField
    }
  },
  methods: {
    checkTypeRewardsLimit (rwLimit) {
      return (typeof rwLimit === 'number') ? 'indigo--text align-end' : 'secondary--text align-end'
    },
    booleanClass (bool) {
      return (bool) ? 'secondary--text align-end' : 'warning--text align-end'
    },
    clickToEdit (fieldName, fieldType, fieldValue) {
      this.typeOfField = fieldType
      this.selectedField = fieldName
      this.selectedValue = fieldValue
      if (this.checkTypeNull) {
        this.editCampaignDialog = !this.editCampaignDialog
      }
    }
  }
}
</script>

<template>
  <div>
    <v-list dense>
      <v-list-item>
        <v-list-item-content class="text-body-2 indigo--text">
          Bulk API Config Section:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (bulkConfig)
          </strong>
        </v-list-item-content>
      </v-list-item>
      <v-list-item
        v-if="campaignValidateInfo.bulkConfig"
      >
        <vue-json-pretty
          :data="campaignValidateInfo.bulkConfig"
          :deep="1"
          highlight-mouseover-node
          show-line
          show-double-quotes
        />
      </v-list-item>
      <v-list-item v-else>
        <v-list-item-content class="red--text">
          NOT-HAVE
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-body-2 indigo--text">
          Campaign Time Intervals Section:
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Campaign TEST Start Date:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (campaignDateTestStart)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          "{{ campaignValidateInfo.campaignDateTestStart }}"
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Campaign TEST End Date:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (campaignDateTestEnd)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          "{{ campaignValidateInfo.campaignDateTestEnd }}"
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Campaign Start Date:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (campaignDateStart)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          "{{ campaignValidateInfo.campaignDateStart }}"
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Campaign End Date:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (campaignDateEnd)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          "{{ campaignValidateInfo.campaignDateEnd }}"
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-body-2 indigo--text">
          Campaign Contexts Parser Section:
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Campaign LONG MESSAGE Feature:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'campaignLongMessage',
              'boolean',
              campaignValidateInfo.campaignLongMessage
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (campaignLongMessage)
          </strong>
        </v-list-item-content>
        <v-list-item-content :class="booleanClass(campaignValidateInfo.campaignLongMessage)">
          {{ campaignValidateInfo.campaignLongMessage }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Context Delimiter:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'contextDelimiter',
              'string',
              campaignValidateInfo.contextDelimiter
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (contextDelimiter)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          "{{ campaignValidateInfo.contextDelimiter }}"
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Context Sections:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (contextParser)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ (campaignValidateInfo.contextParser) ? campaignValidateInfo.contextParser.length : 0 }} Parts
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <vue-json-pretty
          :data="campaignValidateInfo.contextParser"
          :deep="2"
          highlight-mouseover-node
          show-line
          show-double-quotes
        />
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-body-2 indigo--text">
          Services Messages Section:
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Empty Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageCampaignTestNotRegister',
              'string',
              campaignValidateInfo.messageCampaignTestNotRegister
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageCampaignTestNotRegister)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageCampaignTestNotRegister }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Pause Service Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageCampaignNotAvailable',
              'string',
              campaignValidateInfo.messageCampaignNotAvailable
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageCampaignNotAvailable)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageCampaignNotAvailable }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Less Content Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageBoundariesLessError',
              'string',
              campaignValidateInfo.messageBoundariesLessError
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageBoundariesLessError)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageBoundariesLessError }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Over Content Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageBoundariesOverError',
              'string',
              campaignValidateInfo.messageBoundariesOverError
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageBoundariesOverError)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageBoundariesOverError }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Before Service Active:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageBeforeStart',
              'string',
              campaignValidateInfo.messageBeforeStart
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageBeforeStart)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageBeforeStart }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          After Service Active:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageAfterEnd',
              'string',
              campaignValidateInfo.messageAfterEnd
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageAfterEnd)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageAfterEnd }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Already Registered Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageRegisterFail',
              'string',
              campaignValidateInfo.messageRegisterFail
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageRegisterFail)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageRegisterFail }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Validate Verify Code Failed Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageValidateFail',
              'string',
              campaignValidateInfo.messageValidateFail
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageValidateFail)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageValidateFail }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Validate Verify Code with Mobile Number Failed Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageCheckMsisdnNotFound',
              'string',
              campaignValidateInfo.messageCheckMsisdnNotFound
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageCheckMsisdnNotFound)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageCheckMsisdnNotFound }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Default Reply of USSD (MTSuccess) Message:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'messageMTSuccessDefaultReply',
              'string',
              campaignValidateInfo.messageMTSuccessDefaultReply
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (messageMTSuccessDefaultReply)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          {{ campaignValidateInfo.messageMTSuccessDefaultReply }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content class="text-body-2 indigo--text">
          Rewards Section:
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Reward have Sequence:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'rewardsHaveSequence',
              'boolean',
              campaignValidateInfo.rewardsHaveSequence
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (rewardsHaveSequence)
          </strong>
        </v-list-item-content>
        <v-list-item-content :class="booleanClass(campaignValidateInfo.rewardsHaveSequence)">
          {{ campaignValidateInfo.rewardsHaveSequence }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item>
        <v-list-item-content>
          Reward All Limit:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
            @click="clickToEdit(
              'rewardsLimit',
              'number',
              campaignValidateInfo.rewardsLimit
            )"
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (rewardsLimit)
          </strong>
        </v-list-item-content>
        <v-list-item-content :class="checkTypeRewardsLimit(campaignValidateInfo.rewardsLimit)">
          {{ campaignValidateInfo.rewardsLimit }}
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="campaignValidateInfo.rewardsArray">
        <v-list-item-content>
          Reward Type:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (rewardsArray)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="secondary--text align-end">
          Array
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="campaignValidateInfo.rewardsArray">
        <vue-json-pretty
          :data="campaignValidateInfo.rewardsArray"
          highlight-mouseover-node
          show-line
          show-double-quotes
        />
      </v-list-item>
      <v-list-item v-if="campaignValidateInfo.rewardsObject">
        <v-list-item-content>
          Reward Type:
          <base-button
            v-if="editMode"
            color="primary"
            x-small
            text
          >
            edit
          </base-button>
          <strong
            v-else
            class="primary--text"
          >
            (rewardsObject)
          </strong>
        </v-list-item-content>
        <v-list-item-content class="indigo--text align-end">
          Object
        </v-list-item-content>
      </v-list-item>
      <v-list-item v-if="campaignValidateInfo.rewardsObject">
        <vue-json-pretty
          :data="campaignValidateInfo.rewardsObject"
          :deep="1"
          highlight-mouseover-node
          show-line
          show-double-quotes
        />
      </v-list-item>
    </v-list>
    <form-edit-campaign-validate
      :edit-campaign-dialog="editCampaignDialog"
      :field-name="selectedField"
      :field-type="typeOfField"
      @emitCloseEditDialog="editCampaignDialog=arguments[0]"
    />
  </div>
</template>
