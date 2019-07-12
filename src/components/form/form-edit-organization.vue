<script>
import { mapState } from 'vuex'

export default {
  props: {
    editOrgDialog: {
      type: [String, Boolean],
      default: ''
    },
    level: {
      type: [String],
      default: ''
    },
    orgLevelOne: {
      type: [String],
      default: ''
    },
    orgLevelTwo: {
      type: [String],
      default: ''
    },
    orgLevelThree: {
      type: [String],
      default: ''
    },
  },
  data: () => ({
    form: {
      company: null,
      department: null,
      brand: null
    },
    levelItems: [
      { id: 1, state: 'Company', value: 'OrganizationLevel1' },
      { id: 2, state: 'Department', value: 'OrganizationLevel2' },
      { id: 3, state: 'Brand', value: 'OrganizationLevel3' },
    ],
    snackbar: false,
    timeout: 6000,
    text: 'Hello, I\'m a snackbar'
  }),
  computed: {
    ...mapState('organizations', {
      companyList: 'companyList',
      departmentList: 'departmentList',
      brandList: 'brandList'
    }),
    mutateDepartmentList () {
      if(typeof this.form.company === 'object') {
        return this.mutateList(this.form.company.id)
      } else {
        return []
      }
    },
    // ////////////////
    //  Organization Dropdown Controller
    // ////////////////
    enableLevel1() {
      if (!!this.select.value && this.select.id === 1) 
        return true
      
      return false
    },
    enableLevel2() {
      if (!!this.select.value && this.select.id === 2) 
        return true
      
      return false
    },
    enableLevel3() {
      if (!!this.select.value && this.select.id === 3) 
        return true
      
      return false
    },
  },
  created () {
    if(this.level === 'Level1') {
      this.select = this.levelItems[0]
      this.form.company = this.findOrganizationObject(this.level, this.orgLevelOne)

    } else if (this.level === 'Level2') {
      this.select = this.levelItems[1]
      this.form.company = this.findOrganizationObject('Level1', this.orgLevelOne)
      this.form.department = this.findOrganizationObject(this.level, this.orgLevelTwo)

    } else if (this.level === 'Level3') {
      this.select = this.levelItems[2]
      this.form.company = this.findOrganizationObject('Level1', this.orgLevelOne)
      this.form.department = this.findOrganizationObject('Level2', this.orgLevelTwo)
      this.form.brand = this.findOrganizationObject(this.level, this.orgLevelThree)
    }
  },
  methods: {
    mutateList (companyListId) {
      return this.departmentList.filter(org => org.organizationLevel1 === companyListId)
    },
    findOrganizationObject (lvl, orgId) {

      if(lvl === 'Level1') {
        
        return this.companyList.find(obj => obj.id === orgId)

      } else if (lvl === 'Level2') {

        return this.departmentList.find(obj => obj.id === orgId)

      } else if (lvl === 'Level3') {

        return this.brandList.find(obj => obj.id === orgId)
      }
    },
    save () {

    },
    closeDialog () {
      this.$emit('emitCloseEditDialog', false)
    },
  }
}
</script>

<template>
  <div>
    <v-dialog 
      v-model="editOrgDialog" 
      persistent
      width="600px"
    >
      <v-card>
        <v-card-title class="light-green lighten-4 py-4 title">
          Edit Organization
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
                  :key="levelItems.id"
                  v-model="select"
                  :hint="`${select.value}: ${select.state}`"
                  :items="levelItems"
                  class="purple-input"
                  item-text="state"
                  item-value="value"
                  label="OrganizationLevel Field"
                  persistent-hint
                  return-object
                  single-line
                />
              </v-layout>
            </v-flex>
            <v-flex
              xs12
            >
              <v-combobox
                :key="JSON.stringify(companyList.id)"
                v-model="form.company"
                :hint="`${form.company}`"
                :items="companyList"
                item-text="displayName"
                prepend-icon="business"
                label="Company Name"
                class="purple-input"
                persistent-hint
                chips
              />
            </v-flex>
            <v-flex
              v-if="enableLevel2 || enableLevel3"
              xs12
            >
              <v-combobox
                :key="mutateDepartmentList.id"
                v-model="form.department"
                :hint="`${form.department}`"
                :items="mutateDepartmentList"
                class="purple-input"
                item-text="displayName"
                prepend-icon="business_center"
                label="Department Name"
                persistent-hint
                chips
              >
                <template 
                  slot="item" 
                  slot-scope="data"
                >
                  <template v-if="typeof data.item !== 'object'">
                    <v-list-item-content v-text="data.item" />
                  </template>
                  <template v-else>
                    <v-list-item-content>
                      <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                      <v-list-item-subtitle>{{ data.item.organizationLevel1Name }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                  <template 
                    slot="selection" 
                    slot-scope="idata"
                  >
                    <v-chip
                      :key="JSON.stringify(idata.item)"
                      :input-value="idata.selected"
                      color="primary"
                      text-color="white"
                      close
                      @input="idata.parent.selectItem(idata.item)"
                    >
                      <v-avatar>
                        <img :src="idata.item.picURL">
                      </v-avatar>
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ idata.item.displayName }}
                    </v-chip>
                  </template>
                </template>
              </v-combobox>
            </v-flex>
            <v-flex
              v-if="enableLevel3"
              xs12
            >
              <v-combobox
                :key="brandList.key"
                v-model="form.brand"
                :hint="`${form.brand}`"
                :items="brandList"
                class="purple-input"
                item-text="displayName"
                prepend-icon="shopping_basket"
                label="Brand Name"
                persistent-hint
                chips
              >
                <template 
                  slot="item" 
                  slot-scope="data"
                >
                  <template v-if="data.item.picURL === 'undefine'">
                    <v-list-item-avatar 
                      color="primary"
                      class="green--text"
                    >
                      {{ data.item.displayName.slice(0, 2).toUpperCase() }}
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                      <v-list-item-subtitle>{{ data.item.organizationLevel2Name }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                  <template v-else>
                    <v-list-item-avatar>
                      <img :src="data.item.picURL">
                    </v-list-item-avatar>
                    <v-list-item-content>
                      <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                      <v-list-item-subtitle>{{ data.item.organizationLevel2Name }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </template>
                  <template
                    slot="selection" 
                    slot-scope="idata"
                  >
                    <v-chip
                      :key="JSON.stringify(idata.item)"
                      :input-value="idata.selected"
                      color="primary"
                      text-color="white"
                      close
                      @input="idata.parent.selectItem(idata.item)"
                    >
                      <v-avatar>
                        <img :src="idata.item.picURL">
                      </v-avatar>
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ idata.item.displayName }}
                    </v-chip>
                  </template>
                </template>
              </v-combobox>
            </v-flex>
          </v-layout>
        </v-container>
        <v-card-actions>
          <!-- <v-btn 
            text 
            color="indigo"
          >
            More
          </v-btn> -->
          <v-spacer />
          <v-btn 
            class="v-btn--simple"
            rounded 
            color="primary"
            @click="closeDialog()"
          >
            Cancel
          </v-btn>
          <v-btn
            rounded
            color="primary"
            @click="save()"
          >
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :bottom="true"
      vertical="vertical"
      color="error"
    > 
      {{ text }}
      <v-btn
        dark
        text
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>