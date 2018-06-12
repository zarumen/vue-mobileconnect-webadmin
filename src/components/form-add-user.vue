<script>
import { mapState } from 'vuex'

export default {
  props: {
    addUserDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {
      company: null,
      department: null,
      brand: null,
      select: { id: 1, state: 'User Level: Company', value: 'OrganizationLevel1' },
      levelItems: [
        { id: 1, state: 'User Level: Company', value: 'OrganizationLevel1' },
        { id: 2, state: 'User Level: Department', value: 'OrganizationLevel2' },
        { id: 3, state: 'User Level: Brand', value: 'OrganizationLevel3' },
      ],
      genderItems: [
        'Male',
        'Female'
      ],
    }
  },
  computed: {
    ...mapState('organizations', {
      companyList: 'companyList',
      departmentList: 'departmentList',
      brandList: 'brandList'
    }),
    enableLevel2() {
      if (!!this.select.value && this.select.value === 'OrganizationLevel2') 
        return true
      
      return false
    },
    enableLevel3() {
      if (!!this.select.value && this.select.value === 'OrganizationLevel3') 
        return true
      
      return false
    },
  },
  methods: {
    closeDialog() {
      this.$emit('emitCloseUserDialog', false)
    },
  }
}
</script>

<template>
  <v-dialog 
    v-model="addUserDialog"
    persistent
    width="800px"
  >
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Create New Organization
      </v-card-title>
      <v-container 
        grid-list-sm 
        class="pa-4"
      >
        <v-form>
          <v-layout 
            row 
            wrap
          >
            <v-flex 
              xs8 
              align-center 
              justify-space-between
            >
              <v-layout align-center>
                <v-avatar 
                  size="80px" 
                  class="mr-3"
                >
                  <img
                    src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    alt=""
                  >
                </v-avatar>
                <v-select
                  v-model="select"
                  :hint="`${select.id}: ${select.value}`"
                  :items="levelItems"
                  item-text="state"
                  item-value="value"
                  label="OrganizationLevel Field"
                  persistent-hint
                  return-object
                  single-line
                />
              </v-layout>
            </v-flex>
            <v-flex xs8>
              <v-select
                v-model="company"
                :hint="`${company}`"
                :items="companyList"
                :key="companyList.organizationLevel1"
                item-text="displayName"
                prepend-icon="business"
                label="Company Name"
                persistent-hint
                chips
                combobox
              />
            </v-flex>
            <v-flex
              v-if="enableLevel2 || enableLevel3"
              xs8
            >
              <v-select
                v-model="department"
                :hint="`${department}`"
                :items="departmentList"
                :key="departmentList.organizationLevel2"
                item-text="displayName"
                prepend-icon="business_center"
                label="Department Name"
                persistent-hint
                chips
                combobox
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
                      <v-list-tile-sub-title v-html="data.item.organizationLevel1Name"/>
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
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ data.item.displayName }}
                    </v-chip>
                  </template>
                </template>
              </v-select>
            </v-flex>
            <v-flex
              v-if="enableLevel3"
              xs8
            >
              <v-select
                v-model="brand"
                :hint="`${brand}`"
                :items="brandList"
                :key="brandList.organizationLevel3"
                item-text="displayName"
                prepend-icon="shopping_basket"
                label="Brand Name"
                persistent-hint
                chips
                max-height="auto"
                combobox
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
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ data.item.displayName }}
                    </v-chip>
                  </template>
                </template>
              </v-select>
            </v-flex>
            <v-flex xs8>
              <v-text-field
                prepend-icon="email"
                label="Email"
                type="email"
              />
            </v-flex>
            <v-flex xs5>
              <v-text-field
                prepend-icon="person"
                label="First Name"
              />
            </v-flex>
            <v-flex xs5>
              <v-text-field
                label="Last Name"
              />
            </v-flex>
            <v-flex xs2>
              <v-text-field
                label="(Nick Name)"
              />
            </v-flex>
            <!-- <v-flex xs4>
              <v-text-field
                label="(Nick Name)"
              />
            </v-flex> -->
            <v-flex xs3>
              <v-select
                :items="genderItems"
                prepend-icon="sentiment_satisfied_alt"
                label="Gender"
              />
            </v-flex>
            <v-flex xs6>
              <v-text-field
                prepend-icon="work"
                label="Position"
              />
            </v-flex>
            <v-flex xs5>
              <v-text-field
                prepend-icon="phone_iphone"
                label="Mobile No."
              />
            </v-flex>
            <v-flex xs5>
              <v-text-field
                prepend-icon="phone"
                label="Office Tel."
              />
            </v-flex>
            <v-flex xs12>
              <v-text-field
                prepend-icon="notes"
                multi-line
                label="Note:"
              >
                <!-- <div slot="label">
                  Add Note: <small>(optional)</small>
                </div> -->
              </v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-container>
      <v-card-actions>
        <!-- <v-btn 
          flat 
          color="indigo"
        >
          More
        </v-btn> -->
        <v-spacer/>
        <v-btn 
          flat 
          color="indigo" 
          @click="closeDialog()"
        >
          Cancel
        </v-btn>
        <BaseButton 
          flat
          color="indigo" 
          @click="addUserDialog = false"
        >
          Save
        </BaseButton>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>
