<script>
import { mapState, mapActions } from 'vuex'
// import { orgMethods } from '@state/helpers'

export default {
  props: {
    addDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {
      company: null,
      department: null,
      brand: null,
      select: { id: 1, state: 'Company', value: 'OrganizationLevel1' },
      levelItems: [
        { id: 1, state: 'Company', value: 'OrganizationLevel1' },
        { id: 2, state: 'Department', value: 'OrganizationLevel2' },
        { id: 3, state: 'Brand', value: 'OrganizationLevel3' },
      ],
    }
  },
  computed: {
    ...mapState('organizations', {
      companyList: 'companyList',
      departmentList: 'departmentList',
      brandList: 'brandList'
    }),
    enableLevel1() {
      if (!!this.select.value && this.select.id === 1) 
        return true
      
      return false
    },
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
  watch: {
    
  },
  methods: {
    ...mapActions('organizations', [
        'addCompanyToOrganization', 
        'addDepartmentToOrganization',
        'addBrandToOrganization'
    ]),
    closeDialog() {
      this.$emit('emitCloseDialog', false)
    },
    save() {
      // Initial Value in Form by v-model attribute
      const tCompany = this.company
      const tDepartment = this.department
      const tBrand = this.brand
      
      // Prepare Object Organization before add to Database
      if (this.select.id === 1 && tCompany !== null ) {

        console.log(!(tCompany instanceof Object))
        // Prepare Object organization
        let org = {
          displayName: tCompany,
          organizationLevel1Name: tCompany,
          organizationAuth: 'Level1',
          organizationDisable: false,
          picURL: 'undefine',
        }

        this.addCompanyToOrganization(org)
        this.closeDialog()
      }

      if (this.select.id === 2 && tDepartment !== null) {
        if (tCompany instanceof String) {
          // handle error check if Company is String (use old Company only)
        } else {

          // Prepare Object organization
          let org = {
            displayName: tDepartment,
            organizationLevel1: tCompany.organizationLevel1,
            organizationLevel1Name: tCompany.organizationLevel1Name,
            organizationAuth: 'Level2',
            organizationDisable: false,
            picURL: 'undefine',
          }

          if (tDepartment instanceof Object) {

            org['organizationLevel2Name'] = tDepartment.organizationLevel2Name

          } else {

            org['organizationLevel2Name'] = tDepartment

          }

          this.addDepartmentToOrganization(org)
          this.closeDialog()
        }
      }
        

      if (this.select.id === 3 && tCompany !== null && tBrand !== null) {
        if (!(tCompany instanceof Object)) {
          // handle error check if Company is String (use old Company only)

        } else if (tDepartment === null) {
          // HANDLE IF DEPARTMENT IS NULL 

        } else if (tCompany.organizationLevel1 !== tDepartment.organizationLevel1) {
          // HANDLE IF USE COMPANY AND DEPARTMENT MISMATCH

        } else {

          // Prepare Object organization
          let org = {
            displayName: tBrand,
            organizationLevel1: tCompany.organizationLevel1,
            organizationLevel1Name: tCompany.organizationLevel1Name,
            organizationLevel2: tDepartment.organizationLevel2,
            organizationLevel2Name: tDepartment.organizationLevel2Name,
            organizationLevel3Name: tBrand,
            organizationAuth: 'Level3',
            organizationDisable: false,
            picURL: 'undefine',
          } 

          this.addBrandToOrganization(org)
          this.closeDialog()
        }
      }
        

      
    },

  }
}
</script>

<template>
  <v-dialog 
    v-model="addDialog" 
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
                :hint="`${select.value}: ${select.state}`"
                :items="levelItems"
                :key="levelItems.id"
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
            xs12
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
            xs12
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
                    <v-list-tile-sub-title v-html="data.item.organizationLevel2Name"/>
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
        </v-layout>
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
        <v-btn 
          flat
          color="indigo"
          @click="save()"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>
