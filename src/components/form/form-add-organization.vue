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
      // Default Values
      form: {
        company: null,
        department: null,
        brand: null
      },
      // Drop down Selector
      select: { id: 1, state: 'Company', value: 'OrganizationLevel1' },
      levelItems: [
        { id: 1, state: 'Company', value: 'OrganizationLevel1' },
        { id: 2, state: 'Department', value: 'OrganizationLevel2' },
        { id: 3, state: 'Brand', value: 'OrganizationLevel3' },
      ],
      snackbar: false,
      timeout: 6000,
      text: 'Hello, I\'m a snackbar'
    }
  },
  computed: {
    ...mapState('organizations', {
      companyList: 'companyList',
      departmentList: 'departmentList',
      brandList: 'brandList'
    }),
    mutateDepartmentList() {
      if(this.form.company) {
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
  watch: {
    
  },
  methods: {
    ...mapActions('organizations', [
        'addCompanyToOrganization', 
        'addDepartmentToOrganization',
        'addBrandToOrganization',
    ]),
    closeDialog() {
      this.$emit('emitCloseDialog', false)
    },
    save() {
      // Destructuring Initial Value in Form by v-model attribute
      const { 
        company: tCompany, 
        department: tDepartment, 
        brand: tBrand 
      } = this.form

      // /////  Prepare Object Organization before add to Database  ///////

      switch (this.select.id) {

        // /////////////////////
        // Company: Organization >> Level1
        // /////////////////////
        case 1:

          if (tCompany === null) {
            // case empty in field
            this.openSnackBar('Please insert "Company Name".')
          }
          if (typeof tCompany === 'object') {
            // case selected in field
            this.openSnackBar('This "Company Name" have already exist!')
          }
          if (typeof tCompany === 'string') {
            // Prepare Object organization
            let org = {
              displayName: tCompany,
              organizationLevel1Name: tCompany,
              organizationAuth: 'Level1',
              organizationDisable: false,
              picURL: 'undefine',
            }
            
            // add Object org to Action add Company in Vuex
            this.addCompanyToOrganization(org)
            this.closeDialog()
          }
          break;

        // /////////////////////
        // Department: Organization >> Level2
        // /////////////////////
        case 2:

        if (tDepartment === null) {
          // empty field in Department Name
          this.openSnackBar('Please insert "Department Name".')
        }
        if (tDepartment !== null && typeof tCompany === 'string') {
          // handle error check if Company is String (use old Company only)
          this.openSnackBar('Please select "Company Name" from Dropdown List!')
        }

        if (tDepartment !== null && typeof tCompany === 'object') {

          if(tCompany.organizationLevel1 === tDepartment.organizationLevel1) {
            // check if already item in database.
            this.openSnackBar("Cannot Create Item already exists!")
          }

          // Prepare Object organization
          let org = {
            organizationLevel1: tCompany.organizationLevel1,
            organizationLevel1Name: tCompany.organizationLevel1Name,
            organizationAuth: 'Level2',
            organizationDisable: false,
            picURL: 'undefine',
          }

          // check department is old item but not the same company
          if (tDepartment instanceof Object) {
            
            org['displayName'] = tDepartment.displayName
            org['organizationLevel2Name'] = tDepartment.organizationLevel2Name

          } else {

            org['displayName'] = tDepartment
            org['organizationLevel2Name'] = tDepartment

          }

          // add Object org to Action add Department in Vuex
          this.addDepartmentToOrganization(org)
          this.closeDialog()

        }
          break;

        // /////////////////////
        // Brand: Organization >> Level3
        // /////////////////////
        case 3:

          if (tCompany === null) {
            // empty field in Company Name
            this.openSnackBar('Please check "Company Name" is not Correct.')
          }
          if (typeof tCompany !== 'string') {
            // HANDLE error check if Company is String (use old Company only)
            this.openSnackBar('Please select "Company" from Dropdown List!')
          }

          if (tBrand === null) {
            // empty field in Brand Name
            this.openSnackBar('Please check "Brand Name" is not Correct.')
          }
          if (typeof tCompany === 'object' && tBrand !== null) {
            
            if (tCompany.organizationLevel1 !== tDepartment.organizationLevel1 || 
                  tBrand.organizationLevel2 === tDepartment.organizationLevel2 ||
                    tBrand.organizationLevel1 === tCompany.organizationLevel1) {
              // HANDLE IF USE COMPANY AND DEPARTMENT AND BRAND MISMATCH
              this.openSnackBar('COMPANY AND DEPARTMENT AND BRAND MISMATCH')

            } else if (tDepartment === null) {
              // HANDLE IF DEPARTMENT IS NULL
              let org = {
                  organizationLevel1: tCompany.organizationLevel1,
                  organizationLevel1Name: tCompany.organizationLevel1Name,
                  organizationAuth: 'Level3',
                  organizationDisable: false,
                  picURL: 'undefine',
                }
              if (typeof tBrand === 'object') {
                
                org['displayName'] = tBrand.displayName
                org['organizationLevel3Name'] = tBrand.organizationLevel3Name

              } else {

                org['displayName'] = tBrand
                org['organizationLevel3Name'] = tBrand

              }
              // add Object org to Action add Brand in Vuex
              this.addBrandToOrganization(org)
              this.closeDialog()

            } else {
              // Prepare Object organization
              let org = {
                  organizationLevel1: tCompany.organizationLevel1,
                  organizationLevel1Name: tCompany.organizationLevel1Name,
                  organizationLevel2: tDepartment.organizationLevel2,
                  organizationLevel2Name: tDepartment.organizationLevel2Name,
                  organizationAuth: 'Level3',
                  organizationDisable: false,
                  picURL: 'undefine',
                }

              if (typeof tBrand === 'object') {
                
                org['displayName'] = tBrand.displayName
                org['organizationLevel3Name'] = tBrand.organizationLevel3Name

              } else {

                org['displayName'] = tBrand
                org['organizationLevel3Name'] = tBrand

              }
              // add Object org to Action add Brand in Vuex
              this.addBrandToOrganization(org)
              this.closeDialog()
            }
          }
          break;

      }

    },
    mutateList(companyListId) {
      return this.departmentList.filter(org => org.organizationLevel1 === companyListId)
    },
    openSnackBar(insertText) {
      this.text = ''
      this.text = insertText
      this.snackbar = true
    }
  }
}
</script>

<template>
  <div>
    <v-dialog 
      v-model="addDialog" 
      persistent
      width="600px"
    >
      <v-card>
        <v-card-title class="light-green lighten-4 py-4 title">
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
                    <v-list-tile-content v-text="data.item" />
                  </template>
                  <template v-else>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ data.item.organizationLevel1Name }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                  <template 
                    slot="selection" 
                    slot-scope="idata"
                  >
                    <v-chip
                      :key="JSON.stringify(idata.item)"
                      :selected="idata.selected"
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
                    <v-list-tile-avatar 
                      color="primary"
                      class="green--text"
                    >
                      {{ data.item.displayName.slice(0, 2).toUpperCase() }}
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ data.item.organizationLevel2Name }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                  <template v-else>
                    <v-list-tile-avatar>
                      <img :src="data.item.picURL">
                    </v-list-tile-avatar>
                    <v-list-tile-content>
                      <v-list-tile-title>{{ data.item.displayName }}</v-list-tile-title>
                      <v-list-tile-sub-title>{{ data.item.organizationLevel2Name }}</v-list-tile-sub-title>
                    </v-list-tile-content>
                  </template>
                  <template
                    slot="selection" 
                    slot-scope="idata"
                  >
                    <v-chip
                      :key="JSON.stringify(idata.item)"
                      :selected="idata.selected"
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
            flat 
            color="indigo"
          >
            More
          </v-btn> -->
          <v-spacer />
          <v-btn 
            class="v-btn--simple"
            round 
            color="primary"  
            @click="closeDialog()"
          >
            Cancel
          </v-btn>
          <BaseButton 
            @click="save()"
          >
            Save
          </BaseButton>
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
        flat
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
