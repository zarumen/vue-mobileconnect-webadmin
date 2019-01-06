<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addUserDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    const defaultForm = Object.freeze({
      email: '',
      firstName: '',
      lastName: '',
      nickName: '',
      age: '',
      gender: '',
      jobPosition: '',
      mobileTelNumber: '',
      officeTelNumber: '',
      addedNote: '',
    })
    const defaultDropdown = Object.freeze({
      id: 1, 
      state: 'User Level: Company', 
      value: 'OrganizationLevel1'
    })
    return {
      // Default Values
      uform: Object.assign({}, defaultForm),
      company: null,
      department: null,
      brand: null,
      // Drop down Selector
      select: Object.assign({}, defaultDropdown),
      levelItems: [
        { id: 1, state: 'User Level: Company', value: 'OrganizationLevel1' },
        { id: 2, state: 'User Level: Department', value: 'OrganizationLevel2' },
        { id: 3, state: 'User Level: Brand', value: 'OrganizationLevel3' },
      ],
      genderItems: [
        'Male',
        'Female'
      ],
      avartar : {
        male: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png',
        female: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png',
        admin: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-512.png',
        anonymous: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
      },
      snackbar:false,
      timeout: 6000,
      textError: 'Error!',
      // /////////////////////
      // Form Validator
      // /////////////////////
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@\w+([.-]?\\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 10) || 'Name must be less than 10 characters'
      ], 
    }
  },
  computed: {
    ...mapState('organizations', {
      companyList: 'companyList',
      departmentList: 'departmentList',
      brandList: 'brandList'
    }),
    // ////////////////
    //  Organization Dropdown Controller
    // ////////////////
    enableLevel1() {
      if (!!this.select.value && this.select.id === 1) 
        return true
      
      return false
    },
    enableLevel2 () {
      if (!!this.select.value && this.select.id === 2) 
        return true
      
      return false
    },
    enableLevel3 () {
      if (!!this.select.value && this.select.id === 3) 
        return true
      
      return false
    },
  },
  methods: {
    ...mapActions('users', [
        'createUser'
    ]),
    closeDialog() {
      this.$emit('emitCloseUserDialog', false)
    },
    clearForm() {
      this.uform = Object.assign({}, this.defaultForm)
      this.$refs.uform.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveUser() {
      // Initial Value in Form by v-model attribute

      let newUser = this.uform
      let tCompany = this.company
      let tDepartment = this.department
      let tBrand = this.brand 
      newUser['isAdmin'] = false
      // /////  Prepare Object Organization before add to Database  ////////

      // ///// Validator Check First!
      if (this.select.id === 1 && tCompany === null)
        this.openSnackBar('Please check "Company Name" is not Correct.')

      if (this.select.id === 2 && tDepartment === null)
        this.openSnackBar('Please check "Department Name" is not Correct.')

      if (this.select.id === 3 && tBrand === null)
        this.openSnackBar('Please check "Brand Name" is not Correct.')

      

      // /////////////////////
      // Company: Organization >> Level1
      // /////////////////////
      if (this.select.id === 1 && 
            tCompany !== null) {
          
          newUser['organizationAuth'] = tCompany.organizationAuth
          newUser['organizationLevel1'] = tCompany.organizationLevel1
          newUser['organizationLevel1Name'] = tCompany.organizationLevel1Name

          this.createUser(newUser)
          this.closeDialog()

      }

      // /////////////////////
      // Department: Organization >> Level2
      // /////////////////////
      if (this.select.id === 2 && 
            tDepartment !== null) {
          
          newUser['organizationAuth'] = tDepartment.organizationAuth
          newUser['organizationLevel1'] = tDepartment.organizationLevel1
          newUser['organizationLevel1Name'] = tDepartment.organizationLevel1Name
          newUser['organizationLevel2'] = tDepartment.organizationLevel2
          newUser['organizationLevel2Name'] = tDepartment.organizationLevel2Name

          this.createUser(newUser)
          this.closeDialog()

      }

      // /////////////////////
      // Brand: Organization >> Level3
      // /////////////////////
      if (this.select.id === 3 && 
            tBrand !== null) {
          
          newUser['organizationAuth'] = tBrand.organizationAuth
          newUser['organizationLevel1'] = tBrand.organizationLevel1
          newUser['organizationLevel1Name'] = tBrand.organizationLevel1Name
          newUser['organizationLevel2'] = tBrand.organizationLevel2
          newUser['organizationLevel2Name'] = tBrand.organizationLevel2Name
          newUser['organizationLevel3'] = tBrand.organizationLevel3
          newUser['organizationLevel3Name'] = tBrand.organizationLevel3Name

          this.createUser(newUser)
          this.closeDialog()

      }
    },
    openSnackBar(insertText) {
      this.textError = ''
      this.textError = insertText
      this.snackbar = true
    }
  }
}
</script>

<template>
  <div>
    <v-dialog 
      v-model="addUserDialog"
      persistent
      width="800px"
    >
      <v-form 
        ref="uform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 title">
            Create New User
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
                      v-if="uform.gender === ''"
                      src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                    >
                    <img
                      v-else-if="uform.gender === 'Male'"
                      :src="avartar.male"
                    >
                    <img
                      v-else
                      :src="avartar.female"
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
              <v-flex 
                v-if="enableLevel1"
                xs8
              >
                <v-combobox
                  v-model="company"
                  :hint="`${company}`"
                  :items="companyList"
                  :key="companyList.key"
                  item-text="displayName"
                  prepend-icon="business"
                  label="Company Name"
                  persistent-hint
                  required
                  chips
                />
              </v-flex>
              <v-flex
                v-if="enableLevel2"
                xs8
              >
                <v-combobox
                  v-model="department"
                  :hint="`${department}`"
                  :items="departmentList"
                  :key="departmentList.id"
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
                        {{ data.item.displayName }}
                      </v-chip>
                    </template>
                  </template>
                </v-combobox>
              </v-flex>
              <v-flex
                v-if="enableLevel3"
                xs8
              >
                <v-combobox
                  v-model="brand"
                  :hint="`${brand}`"
                  :items="brandList"
                  :key="brandList.id"
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
                </v-combobox>
              </v-flex>
              <v-flex xs8>
                <v-text-field
                  v-model="uform.email"
                  :rules="emailRules"
                  class="purple-input"
                  prepend-icon="email"
                  label="Email"
                  type="email"
                  required
                />
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  v-model="uform.firstName"
                  :rules="nameRules"
                  class="purple-input"
                  prepend-icon="person"
                  label="First Name"
                  required
                />
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  v-model="uform.lastName"
                  class="purple-input"
                  label="Last Name"
                />
              </v-flex>
              <v-flex xs2>
                <v-text-field
                  v-model="uform.nickName"
                  class="purple-input"
                  mask="NNNNNNNNNN"
                  label="(Nick Name)"
                />
              </v-flex>
              <v-flex xs3>
                <v-text-field
                  v-model="uform.age"
                  class="purple-input"
                  prepend-icon="sentiment_satisfied_alt"
                  label="Age"
                />
              </v-flex>
              <v-flex xs3>
                <v-select
                  v-model="uform.gender"
                  :items="genderItems"
                  class="purple-input"
                  prepend-icon="wc"
                  label="Gender"
                />
              </v-flex>
              <v-flex xs6>
                <v-text-field
                  v-model="uform.jobPosition"
                  class="purple-input"
                  prepend-icon="work"
                  label="Position"
                />
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  v-model="uform.mobileTelNumber"
                  class="purple-input"
                  prepend-icon="phone_iphone"
                  mask="phone"
                  label="Mobile No."
                />
              </v-flex>
              <v-flex xs5>
                <v-text-field
                  v-model="uform.officeTelNumber"
                  class="purple-input"
                  prepend-icon="phone"
                  mask="phone"
                  label="Office Tel."
                />
              </v-flex>
              <v-flex xs12>
                <v-textarea
                  v-model="uform.addedNote"
                  class="purple-input"
                  prepend-icon="notes"
                  label="Note:"
                />
              </v-flex>
            </v-layout>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer/>
            <v-btn
              class="v-btn--simple"
              round 
              color="secondary" 
              @click="clearForm()"
            >
              Clear
            </v-btn>
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
              @click="saveUser()"
            >
              SAVE
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :bottom="true"
      vertical="vertical"
      color="error"
    > 
      {{ textError }}
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