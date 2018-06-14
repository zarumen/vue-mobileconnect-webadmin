<script>
import { mapState } from 'vuex'

export default {
  props: {
    addCampaignDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    const defaultForm = Object.freeze({})

    return {
      // Default Values
      form: Object.assign({}, defaultForm),
      brand: null,
      step: 1,

    }
  },
  computed: {
    ...mapState('organizations', {
      brandList: 'brandList'
    }),
  },
  methods:{
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
  },
}
</script>

<template>
  <v-layout 
    row 
    justify-center
  >
    <v-dialog 
      v-model="addCampaignDialog" 
      fullscreen 
      hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar 
          dark 
          color="green"
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
              @click.native="closeDialog()"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!-- Content is here -->
        <v-stepper 
          v-model="step" 
          vertical
        >
          <v-stepper-step 
            :complete="step > 1" 
            step="1"
          >
            Select an app
            <small>Summarize if needed</small>
          </v-stepper-step>
          <v-stepper-content step="1">
            <v-card 
              color="grey lighten-1" 
              class="mb-5" 
              height="200px"
            >
              <p> Step : 1</p>
              <v-flex xs4>
                <v-select
                  v-model="brand"
                  :hint="`${brand}`"
                  :items="brandList"
                  :key="brandList.id"
                  item-text="displayName"
                  prepend-icon="shopping_basket"
                  label="Brand Name"
                  persistent-hint
                  max-height="auto"
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
            </v-card>
            <v-btn 
              color="blue" 
              @click.native="step = 2"
            >
              Continue
            </v-btn>
            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>
          <v-stepper-step 
            :complete="step > 2" 
            step="2"
          >
            Configure analytics for this app
          </v-stepper-step>
          <v-stepper-content step="2">
            <v-card 
              color="grey lighten-1" 
              class="mb-5" 
              height="200px"
            >
              <p> Step : 2</p>
            </v-card>
            <v-btn 
              color="blue" 
              @click.native="step = 3"
            >
              Continue
            </v-btn>
            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>
          <v-stepper-step 
            :complete="step > 3" 
            step="3"
          >
            Select an ad format and name ad unit
          </v-stepper-step>
          <v-stepper-content step="3">
            <v-card 
              color="grey lighten-1" 
              class="mb-5" 
              height="200px"
            >
              <p> Step : 3</p>
            </v-card>
            <v-btn 
              color="blue" 
              @click.native="step = 4"
            >
              Continue
            </v-btn>
            <v-btn flat>Cancel</v-btn>
          </v-stepper-content>
          <v-stepper-step step="4">View setup instructions</v-stepper-step>
          <v-stepper-content step="4">
            <v-card 
              color="grey lighten-1" 
              class="mb-5" 
              height="200px"
            >
              <p> Step : 4</p>
            </v-card>
            <v-btn 
              color="blue" 
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
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
