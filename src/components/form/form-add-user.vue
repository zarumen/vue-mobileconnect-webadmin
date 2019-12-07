<script>
import { mapState, mapActions } from 'vuex'

export default {
  props: {
    addUserDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data () {
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
      addedNote: ''
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
        { id: 1, state: 'User Level 1 (Company)', value: 'OrganizationLevel1' },
        { id: 2, state: 'User Level 2 (Department)', value: 'OrganizationLevel2' },
        { id: 3, state: 'User Level 3 (Brand)', value: 'OrganizationLevel3' }
      ],
      genderItems: [
        'Male',
        'Female'
      ],
      avartar: {
        male: 'https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png',
        female: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/female1-512.png',
        admin: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/supportfemale-512.png',
        anonymous: 'https://cdn1.iconfinder.com/data/icons/user-pictures/100/unknown-512.png'
      },
      snackbar: false,
      timeout: 6000,
      textError: 'Error!',
      // /////////////////////
      // Form Validator
      // /////////////////////
      valid: true,
      emailRules: [
        v => !!v || 'E-mail is required',
        v => /^\w+([.-]?\w+)*@(-?\w)+([.-]?\\w+)*(\.\w{2,3})+$/.test(v) || 'E-mail must be valid'
      ],
      nameRules: [
        v => !!v || 'Name is required',
        v => (v && v.length <= 20) || 'Name must be less than 20 characters'
      ]
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
    enableLevel1 () {
      if (!!this.select.value && this.select.id === 1) { return true }

      return false
    },
    enableLevel2 () {
      if (!!this.select.value && this.select.id === 2) { return true }

      return false
    },
    enableLevel3 () {
      if (!!this.select.value && this.select.id === 3) { return true }

      return false
    }
  },
  methods: {
    ...mapActions('users', [
      'createUser'
    ]),
    closeDialog () {
      this.$emit('emitCloseUserDialog', false)
    },
    clearForm () {
      this.uform = Object.assign({}, this.defaultForm)
      this.$refs.uform.reset()
      this.select = Object.assign({}, this.defaultDropdown)
    },
    saveUser () {
      // Initial Value in Form by v-model attribute

      const newUser = this.uform
      const tCompany = this.company
      const tDepartment = this.department
      const tBrand = this.brand
      newUser.isAdmin = false
      // /////  Prepare Object Organization before add to Database  ////////

      // ///// Validator Check First!
      if (this.select.id === 1 && tCompany === null) { this.openSnackBar('Please check "Company Name" is not Correct.') }

      if (this.select.id === 2 && tDepartment === null) { this.openSnackBar('Please check "Department Name" is not Correct.') }

      if (this.select.id === 3 && tBrand === null) { this.openSnackBar('Please check "Brand Name" is not Correct.') }

      // /////////////////////
      // Company: Organization >> Level1
      // /////////////////////
      if (this.select.id === 1 &&
            tCompany !== null) {
        newUser.organizationAuth = tCompany.organizationAuth
        newUser.organizationLevel1 = tCompany.organizationLevel1
        newUser.organizationLevel1Name = tCompany.organizationLevel1Name

        this.createUser(newUser)
        this.closeDialog()
      }

      // /////////////////////
      // Department: Organization >> Level2
      // /////////////////////
      if (this.select.id === 2 &&
            tDepartment !== null) {
        newUser.organizationAuth = tDepartment.organizationAuth
        newUser.organizationLevel1 = tDepartment.organizationLevel1
        newUser.organizationLevel1Name = tDepartment.organizationLevel1Name
        newUser.organizationLevel2 = tDepartment.organizationLevel2
        newUser.organizationLevel2Name = tDepartment.organizationLevel2Name

        this.createUser(newUser)
        this.closeDialog()
      }

      // /////////////////////
      // Brand: Organization >> Level3
      // /////////////////////
      if (this.select.id === 3 &&
            tBrand !== null) {
        newUser.organizationAuth = tBrand.organizationAuth
        newUser.organizationLevel1 = tBrand.organizationLevel1
        newUser.organizationLevel1Name = tBrand.organizationLevel1Name
        newUser.organizationLevel2 = tBrand.organizationLevel2
        newUser.organizationLevel2Name = tBrand.organizationLevel2Name
        newUser.organizationLevel3 = tBrand.organizationLevel3
        newUser.organizationLevel3Name = tBrand.organizationLevel3Name

        this.createUser(newUser)
        this.closeDialog()
      }
    },
    openSnackBar (insertText) {
      this.valid = !this.valid
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
            <v-row>
              <v-col
                cols="12"
              >
                <v-row
                  class="mx-0"
                  justify="center"
                >
                  <v-cols cols="8">
                    <v-select
                      v-model="select"
                      :items="levelItems"
                      item-text="state"
                      item-value="value"
                      label="OrganizationLevel Field"
                      prepend-icon="perm_contact_calendar"
                      class="purple-input"
                      return-object
                      single-line
                    />
                  </v-cols>
                  <div class="flex-grow-1" />
                  <v-cols class="mr-5">
                    <v-avatar
                      size="80px"
                      class="mr-3"
                    >
                      <img
                        v-if="gender === ''"
                        src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                      >
                      <img
                        v-else-if="gender === 'Male'"
                        :src="avartar.male"
                      >
                      <img
                        v-else
                        :src="avartar.female"
                      >
                    </v-avatar>
                  </v-cols>
                </v-row>
              </v-col>
              <v-col
                v-if="enableLevel1"
                cols="8"
              >
                <v-combobox
                  :key="companyList.key"
                  v-model="company"
                  :items="companyList"
                  item-text="displayName"
                  prepend-icon="business"
                  label="Company Name"
                  class="purple-input"
                  required
                  chips
                >
                  <template v-slot:selection="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar
                        v-if="data.item.picURL !== 'undefine'"
                        left
                      >
                        <img :src="data.item.picURL">
                      </v-avatar>
                      <v-avatar
                        v-else
                        class="white primary--text"
                        left
                      >
                        {{ data.item.displayName.slice(0, 1).toUpperCase() }}
                      </v-avatar>
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ data.item.displayName }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
              <v-col
                v-if="enableLevel2"
                cols="8"
              >
                <v-combobox
                  :key="departmentList.id"
                  v-model="department"
                  :items="departmentList"
                  item-text="displayName"
                  prepend-icon="business_center"
                  label="Department Name"
                  class="purple-input"
                  chips
                >
                  <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content v-text="data.item" />
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                        <v-list-item-subtitle>{{ data.item.organizationLevel1Name }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar
                        v-if="data.item.picURL !== 'undefine'"
                        left
                      >
                        <img :src="data.item.picURL">
                      </v-avatar>
                      <v-avatar
                        v-else
                        class="white primary--text"
                        left
                      >
                        {{ data.item.displayName.slice(0, 1).toUpperCase() }}
                      </v-avatar>
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ data.item.displayName }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
              <v-col
                v-if="enableLevel3"
                cols="8"
              >
                <v-combobox
                  :key="brandList.id"
                  v-model="brand"
                  :items="brandList"
                  item-text="displayName"
                  prepend-icon="shopping_basket"
                  label="Brand Name"
                  class="purple-input"
                  chips
                >
                  <template v-slot:item="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-item-content v-text="data.item" />
                    </template>
                    <template v-else>
                      <v-list-item-content>
                        <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                        <v-list-item-subtitle>{{ data.item.organizationLevel1Name }} > {{ data.item.organizationLevel2Name }}</v-list-item-subtitle>
                      </v-list-item-content>
                    </template>
                  </template>
                  <template v-slot:selection="data">
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar
                        v-if="data.item.picURL !== 'undefine'"
                        left
                      >
                        <img :src="data.item.picURL">
                      </v-avatar>
                      <v-avatar
                        v-else
                        class="white primary--text"
                        left
                      >
                        {{ data.item.displayName.slice(0, 1).toUpperCase() }}
                      </v-avatar>
                      <!-- @input="data.parent.selectItem(data.item)" -->
                      {{ data.item.displayName }}
                    </v-chip>
                  </template>
                </v-combobox>
              </v-col>
              <v-col cols="8">
                <v-text-field
                  v-model="uform.email"
                  :rules="emailRules"
                  class="purple-input"
                  prepend-icon="email"
                  label="Email"
                  type="email"
                  required
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="uform.firstName"
                  :rules="nameRules"
                  class="purple-input"
                  prepend-icon="person"
                  label="First Name"
                  required
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="uform.lastName"
                  class="purple-input"
                  label="Last Name"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="uform.nickName"
                  class="purple-input"
                  mask="NNNNNNNNNN"
                  label="(Nick Name)"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="uform.age"
                  class="purple-input"
                  prepend-icon="sentiment_satisfied_alt"
                  label="Age"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="uform.gender"
                  :items="genderItems"
                  class="purple-input"
                  prepend-icon="wc"
                  label="Gender"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="uform.jobPosition"
                  class="purple-input"
                  prepend-icon="work"
                  label="Position"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="uform.mobileTelNumber"
                  class="purple-input"
                  prepend-icon="phone_iphone"
                  mask="phone"
                  label="Mobile No."
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="uform.officeTelNumber"
                  class="purple-input"
                  prepend-icon="phone"
                  mask="phone"
                  label="Office Tel."
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="uform.addedNote"
                  class="purple-input"
                  prepend-icon="notes"
                  label="Note:"
                />
              </v-col>
            </v-row>
          </v-container>
          <v-card-actions>
            <!-- Button Action in below card-->
            <v-spacer />
            <base-button
              text
              color="primary"
              @click="clearForm()"
            >
              Clear
            </base-button>
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
              @click="saveUser()"
            >
              SAVE
            </base-button>
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
      <base-button
        dark
        text
        @click="snackbar = false"
      >
        Close
      </base-button>
    </v-snackbar>
  </div>
</template>

<style lang="scss" module>
@import '@design';
</style>
