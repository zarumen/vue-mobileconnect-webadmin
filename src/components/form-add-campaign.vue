<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addCampaignDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    const defaultcForm = Object.freeze({
      campaignCode: '',
      campaignHeader: '',
      campaignDescription: '',
      keyword: '',
      shortcode: '',
    })
    const defaultvForm = Object.freeze({
      campaignNotAvailableMsg: '',
      failMsg: '',
      limitReward: '',
      validateBoundaries: '',
      validateBoundariesLessErrMsg: '',
      validateBoundariesOverErrMsg: '',
      validateMsgAfterEnd: '',
      validateMsgBeforeStart: '',
      validateMsgPausedService: '',
    })

    return {
      // Default Values
      campaignForm: Object.assign({}, defaultcForm),
      validateForm: Object.assign({}, defaultvForm),
      cActive: 'Active',
      brand: null,
      // Stepper Setups
      step: 1,
      stepName: {
        one: 'Campaign General Descriptions',
        two: 'Campaign Settings',
        three: 'Campaign Parser Configs',
        four: 'Campaign Reply Service Configs',
        five: 'Campaign Reward Configs'
      },
      validateTypeList: [
        {value: 'regex', condition: false},
        {value: 'coupon', condition: true},
      ],
      validateType: true,
      valid: null,
      // ---------**-------------------------------------
      // Test Value
      // ---------**------------------------------------- 
      date: null,
      date2: null,
      time: '00:00',
      time2: '00:00',
      menu: false,
      menu3: false,
      menu4: false,
      menu6: false,
      switch1: false,
      switch2: false,
      loading1: false,
      cardOpen: false,
      itemstest: [
          { icon: 'code', iconClass: 'blue white--text', title: 'Invalid Format Message 1', subtitle: 'regex 1' },
          { icon: 'code', iconClass: 'blue white--text', title: 'Invalid Format Message 2', subtitle: 'regex 2' }
        ]
    }
  },
  computed: {
    ...mapState('organizations', {
      brandList: 'brandList'
    }),
  },
  methods:{
    ...mapActions('campaigns', [
      'createCampaign'
    ]),
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
    saveCampaign() {
      
      // prepare campaign Object and campaignValidation Object

      const campaignNew = this.campaignForm
      const startDate = this.date + "T" + this.time
      const endDate = this.date2 + "T" + this.time2
      const campaignValidationNew = this.validateForm

      if(this.brand !== null) {

        // --------------------- campaign Object ----------------------------------------
        campaignNew['campaignAvailable'] = true

        campaignNew['organizationAuth'] = this.brand.organizationAuth
        campaignNew['organizationLevel1'] = this.brand.organizationLevel1
        campaignNew['organizationLevel1Name'] = this.brand.organizationLevel1Name
        campaignNew['organizationLevel2'] = this.brand.organizationLevel2
        campaignNew['organizationLevel2Name'] = this.brand.organizationLevel2Name
        campaignNew['organizationLevel3'] = this.brand.organizationLevel3
        campaignNew['organizationLevel3Name'] = this.brand.organizationLevel3Name

        // set Date in here
        campaignNew['campaignDateStart'] = new Date(startDate)
        campaignNew['campaignDateEnd'] = new Date(endDate)
        campaignNew['campaignActive'] = this.cActive

        // --------------------- campaignValidation Object ----------------------------------------

        campaignValidationNew['rewardHasSequence'] = this.switch2
        campaignValidationNew['campaignAvailable'] = true

        campaignValidationNew['campaignDateStart'] = new Date(startDate)
        campaignValidationNew['campaignDateEnd'] = new Date(endDate)
        campaignValidationNew['campaignActive'] = this.cActive

        this.createCampaign({
          campaignObject: campaignNew,
          validationObject: campaignValidationNew
        })
        this.closeDialog()
      }

      
    }
  },
}
</script>

<template>
  <v-layout 
    row
    wrap 
    justify-center
  >
    <v-dialog 
      v-model="addCampaignDialog" 
      fullscreen 
      hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-form
          ref="campaignForm"
          v-model="valid"
          lazy-validation
        >
          <v-toolbar
            dark 
            color="indigo"
          >
            <v-btn 
              icon 
              dark 
              @click.native="closeDialog()"
            >
              <v-icon>
                close
              </v-icon>
            </v-btn>
            <v-toolbar-title>
              Add New Campaign
            </v-toolbar-title>
            <v-spacer/>
            <v-toolbar-items>
              <v-btn 
                dark 
                flat 
                @click.native="saveCampaign()"
              >
                Save
              </v-btn>
            </v-toolbar-items>
          </v-toolbar>
          <!-- Content is here -->
          <v-stepper 
            v-model="step"
            light
            vertical
          >
            <v-stepper-step 
              :complete="step > 1" 
              editable
              step="1"
            >
              {{ stepName.one }}
              <small>v.0.10 patch note: สามารถ Add campaign กรอกข้อมูลเบื้องต้นได้ </small>
              <small>road map: ตอนนี้กำลังทำ function: add parser(เงื่อนไขการตัด), add reward (เพิ่มรางวัล) และคำอธิบายในการกรอก </small>
            </v-stepper-step>
            <v-stepper-content step="1">
              <v-card
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs12
                    md4
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignCode"
                      prepend-icon="fiber_new"
                      label="Campaign Code"
                    />
                  </v-flex>
                  <v-flex 
                    xs12
                    md8
                  > 
                    <v-text-field 
                      v-model="campaignForm.campaignHeader"
                      prepend-icon="shop"
                      label="Campaign Name"
                    />
                  </v-flex>                
                  <v-flex 
                    xs12
                    md8
                  >
                    <v-text-field
                      v-model="campaignForm.campaignDescription"
                      prepend-icon="shop_two"
                      label="Campaign Description"
                      multi-line
                    />
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 2"
              >
                Continue
              </v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-step 
              :complete="step > 2" 
              editable
              step="2"
            >
              {{ stepName.two }}
            </v-stepper-step>
            <v-stepper-content step="2">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  >
                    <v-subheader><small>Campaign Owner Details:</small></v-subheader>
                    <v-select
                      v-model="brand"
                      :hint="`${brand}`"
                      :items="brandList"
                      :key="brandList.key"
                      item-text="displayName"
                      prepend-icon="shopping_basket"
                      label="Campaign Owners: Brand"
                      persistent-hint
                      autocomplete
                    >
                      <template 
                        slot="item" 
                        slot-scope="data"
                      >
                        <template v-if="typeof data.item !== 'object'">
                          <v-list-tile-content v-text="data.item"/>
                        </template>
                        <template v-else>
                          <v-list-tile-content>
                            <v-list-tile-title v-html="data.item.displayName"/>
                            <v-list-tile-sub-title v-html="`${data.item.organizationLevel1Name} > ${data.item.organizationLevel2Name}`"/>
                          </v-list-tile-content>
                        </template>
                        <template 
                          slot="selection" 
                          slot-scope="data"
                        >
                          <v-chip
                            :selected="data.selected"
                            :key="JSON.stringify(data.item)"
                            close
                            @input="data.parent.selectItem(data.item)"
                          >
                            {{ data.item.displayName }}
                          </v-chip>
                        </template>
                      </template>
                    </v-select>
                  </v-flex>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="campaignForm.keyword"
                      prepend-icon="text_fields"
                      mask="NNNNNN"
                      label="Keyword"
                    />
                  </v-flex>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="campaignForm.shortcode"
                      prepend-icon="looks_6"
                      mask="########"
                      label="Shortcode"
                    />
                  </v-flex>
                  <v-subheader>
                    <small>Campaign Start Status:</small>
                  </v-subheader>
                  <v-radio-group 
                    v-model="cActive"
                    prepend-icon="slideshow"
                    row
                  >
                    <v-radio
                      color="blue darken-3" 
                      label="Active" 
                      value="Active" 
                    />
                    <v-radio 
                      color="red" 
                      label="InActive" 
                      value="InActive"
                    />
                    <v-radio 
                      color="blue lighten-2" 
                      label="Paused" 
                      value="Paused"
                    />
                  </v-radio-group>
                  <!-- START DATE PICKER -->
                  <v-flex>
                    <v-subheader>Start Date :</v-subheader>
                  </v-flex>
                  <v-layout
                    row 
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu"
                        :close-on-content-click="false"
                        v-model="menu"
                        :nudge-right="40"
                        :return-value.sync="date"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date"
                          no-title 
                          scrollable
                          color="blue"
                        >
                          <v-spacer/>
                          <v-btn 
                            flat
                            color="blue" 
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            flat 
                            color="blue" 
                            @click="$refs.menu.save(date)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu3"
                        :close-on-content-click="false"
                        v-model="menu3"
                        :nudge-right="40"
                        :return-value.sync="time"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time"
                          type="month"
                          width="320"
                          color="blue"
                        />
                        <v-spacer/>
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          flat
                          color="blue"
                          @click="menu3 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          flat 
                          color="blue" 
                          @click="$refs.menu3.save(time)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>
                  </v-layout>
                  <!-- END DATE PICKER -->
                  <v-flex>
                    <v-subheader>End Date</v-subheader>
                  </v-flex>
                  <v-layout
                    row
                    wrap
                  >
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu4"
                        :close-on-content-click="false"
                        v-model="menu4"
                        :nudge-right="40"
                        :return-value.sync="date2"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="date2"
                          label="Date Picker"
                          prepend-icon="event"
                          readonly
                        />
                        <v-date-picker 
                          v-model="date2"
                          no-title 
                          scrollable
                          color="blue"
                        >
                          <v-spacer/>
                          <v-btn 
                            flat 
                            color="blue" 
                            @click="menu = false"
                          >
                            Cancel
                          </v-btn>
                          <v-btn 
                            flat 
                            color="blue" 
                            @click="$refs.menu4.save(date2)"
                          >
                            OK
                          </v-btn>
                        </v-date-picker>
                      </v-menu>
                    </v-flex>
                    <v-flex 
                      xs4 
                      md4
                    >
                      <v-menu
                        ref="menu6"
                        :close-on-content-click="false"
                        v-model="menu6"
                        :nudge-right="40"
                        :return-value.sync="time2"
                        lazy
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px"
                      >
                        <v-text-field
                          slot="activator"
                          v-model="time2"
                          label="Time Picker"
                          prepend-icon="access_time"
                          readonly
                        />
                        <v-time-picker
                          v-model="time2"
                          type="month"
                          width="320"
                          color="blue"
                        />
                        <v-spacer/>
                        <v-btn
                          flat
                          disabled
                        />
                        <v-btn 
                          flat
                          color="blue"
                          @click="menu6 = false"
                        >
                          Cancel
                        </v-btn>
                        <v-btn 
                          flat 
                          color="blue" 
                          @click="$refs.menu6.save(time2)"
                        >
                          OK
                        </v-btn>
                      </v-menu>
                    </v-flex>
                    
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 3"
              >
                Continue
              </v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-step 
              :complete="step > 3"
              editable
              step="3"
            >
              {{ stepName.three }}
            </v-stepper-step>
            <v-stepper-content step="3">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs8
                    sm6 
                    md3
                  > 
                    <v-text-field 
                      v-model="validateForm.validateBoundaries"
                      solo-inverted 
                      label="Delimiter"
                    />
                  </v-flex>
                  <v-subheader class="red">Context Parser: (In Parser Object) still not working</v-subheader>
                  <v-flex
                    xs8
                    md8
                  > 
                    <v-list two-line>
                      <!-- <v-subheader inset>List of Context Parsers</v-subheader> -->
                      <v-list-tile 
                        v-for="item in itemstest" 
                        :key="item.key" 
                        avatar
                      >
                        <v-list-tile-avatar>
                          <v-icon :class="[item.iconClass]">{{ item.icon }}</v-icon>
                        </v-list-tile-avatar>
                        <v-list-tile-content>
                          <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                          <v-list-tile-sub-title>{{ item.subtitle }}</v-list-tile-sub-title>
                        </v-list-tile-content>
                        <v-list-tile-action>
                          <v-btn
                            icon
                            ripple
                          >
                            <v-icon color="grey lighten-1">info</v-icon>
                          </v-btn>
                        </v-list-tile-action>
                      </v-list-tile>
                    </v-list>
                  </v-flex>
                  <p/>
                  <v-btn 
                    color="blue" 
                    class="white--text"
                    round
                    @click.native="cardOpen = !cardOpen"
                  >
                    <v-icon dark>add</v-icon>
                    Add Parser
                  </v-btn>
                  <p/>
                  <v-flex 
                    xs8
                    sm6 
                    md5
                  >
                    <v-card v-if="cardOpen">
                      <v-subheader>Add Context Parser</v-subheader>
                      <v-card-text>
                        <v-text-field
                          solo-inverted 
                          label="Remove Character"
                        />
                        <v-text-field 
                          prepend-icon="message"
                          label="Invalid Format Message"
                        />
                        <v-select 
                          v-model="validateType"
                          :items="validateTypeList"
                          :hint="`${validateType}`"
                          item-text="value"
                          item-value="condition"
                          label="Condition Type"
                          prepend-icon="assignment"
                          persistent-hint
                        />
                        <v-text-field 
                          :disabled="validateType"
                          solo-inverted 
                          label="Condition (Regular Expression)"
                        />
                      </v-card-text> 
                      <v-card-actions>
                        <v-spacer/>
                        <v-btn 
                          color="blue" 
                          class="white--text"
                        >
                          Save
                        </v-btn>
                        <v-btn 
                          flat
                        >
                          Cancel
                        </v-btn>
                      </v-card-actions>
                    </v-card>
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 4"
              >
                Continue
              </v-btn>
              <v-btn flat>Cancel</v-btn>
            </v-stepper-content>
            <v-stepper-step
              :complete="step > 4" 
              editable
              step="4"
            >
              {{ stepName.four }}
            </v-stepper-step>
            <v-stepper-content step="4">
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-flex 
                    xs12
                    md6
                  > 
                    <v-text-field 
                      v-model="validateForm.campaignNotAvailableMsg"
                      prepend-icon="chat"
                      label="Empty Message"
                    />
                    <v-text-field 
                      v-model="validateForm.validateBoundariesLessErrMsg"
                      prepend-icon="chat"
                      label="Less Content Message"
                    />
                    <v-text-field 
                      v-model="validateForm.validateBoundariesOverErrMsg"
                      prepend-icon="chat"
                      label="Over Content Message"
                    />
                    <v-text-field 
                      v-model="validateForm.validateMsgBeforeStart"
                      prepend-icon="chat"
                      label="Before Service Active Message"
                    />
                    <v-text-field 
                      v-model="validateForm.validateMsgAfterEnd"
                      prepend-icon="chat"
                      label="After Service Active Message"
                    />
                    <v-text-field 
                      v-model="validateForm.validateMsgPausedService"
                      prepend-icon="chat"
                      label="Pause Service Message"
                    />
                  </v-flex>
                </v-card-text>
              </v-card>
              <v-btn 
                color="blue" 
                class="white--text"
                @click.native="step = 5"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
              >
                Cancel
              </v-btn>
            </v-stepper-content>
            <v-stepper-step step="5">{{ stepName.five }}</v-stepper-step>
            <v-stepper-content
              :complete="step > 5"
              editable
              step="5" 
            >
              <v-card 
                color="grey lighten-4" 
                class="mb-5"
              >
                <v-card-text>
                  <v-layout>
                    <v-flex 
                      xs6
                    > 
                      <v-flex>
                        <v-subheader>Reward Validation:</v-subheader>
                        <v-switch
                          v-model="switch2"
                          color="blue"
                          label="is Sequential Reward"
                        />
                        <v-text-field 
                          v-model="validateForm.limitReward"
                          prepend-icon="phonelink_off"
                          label="Limit Rewards"
                        />
                        <v-text-field 
                          v-model="validateForm.failMsg"
                          prepend-icon="chat_bubble"
                          label="Fail Message"
                        />
                      </v-flex>
                      <!--     In Reward: [Array]        -->
                      <!-- <v-flex 
                        xs6
                      > 
                        <v-subheader>Reward Validation Details:</v-subheader>
                      </v-flex> -->
                      <v-btn 
                        color="blue" 
                        class="white--text"
                        round
                        @click.native="cardOpen = !cardOpen"
                      >
                        <v-icon dark>add</v-icon>
                        Add Reward
                      </v-btn>
                      <v-card v-if="cardOpen">
                        <v-card-title>
                          <v-subheader class="red">Add Reward Validation Details: still not working</v-subheader>
                        </v-card-title>
                        <v-card-actions>
                          <p/>
                          <v-switch
                            v-model="switch1"
                            color="blue"
                            label="is Coupon"
                          />
                          <v-spacer/>
                          <v-btn
                            :disabled="!switch1"
                            color="blue-grey"
                            class="white--text"
                            round
                          >
                            Generated
                          </v-btn>
                          <v-btn
                            :loading="loading1"
                            :disabled="!switch1"
                            color="blue-grey"
                            class="white--text"
                            round
                            @click.native="loader = 'loading1'"
                          >
                            <v-icon 
                              left 
                              dark
                            >
                              cloud_upload
                            </v-icon>
                            Upload
                          </v-btn>
                          <p/>
                        </v-card-actions>
                        <v-card-text>
                          <v-text-field
                            prepend-icon="phonelink"
                            label="Reward Name"
                          />
                          <v-text-field 
                            prepend-icon="phonelink_setup"
                            label="Reward Condition Type"
                          />
                          <v-text-field 
                            prepend-icon="phonelink_lock"
                            label="Reward Condition Value"
                          />
                          <v-text-field 
                            prepend-icon="chat_bubble_outline"
                            label="Success Message"
                          />
                        </v-card-text>
                        <v-card-actions>
                          <v-spacer/>
                          <v-btn 
                            color="blue" 
                            class="white--text"
                          >
                            Save
                          </v-btn>
                          <v-btn 
                            flat
                          >
                            Cancel
                          </v-btn>
                        </v-card-actions>
                      </v-card>
                    </v-flex>
                  </v-layout>
                </v-card-text>
              </v-card>
              <v-btn
                color="blue" 
                class="white--text"
                @click.native="step = 1"
              >
                Continue
              </v-btn>
              <v-btn 
                flat
                @click.native="closeDialog()"
              >
                Cancel
              </v-btn>
            </v-stepper-content>
          </v-stepper>
        </v-form>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

