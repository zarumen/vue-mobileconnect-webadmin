<script>
import { mapState, mapGetters, mapActions } from 'vuex'

export default {
  props: {
    editUserDialog: {
      type: [String, Boolean],
      default: ''
    },
    editUser: {
      type: [Object],
      default: Object.assign({})
    }
  },
  data () {
    const defaultDropdown = Object.freeze({
      id: 1,
      state: 'User Level: Company',
      value: 'OrganizationLevel1'
    })
    return {
      // Default Values
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
      upperLetter: 'AAAAAAAAA',
      phone: '(###)-###-####',
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
    ...mapGetters('users', [
      'getOneEditedUser'
    ]),
    // ////////////////
    //  Form Binding Variables from Vuex
    // ////////////////
    email: {
      get () {
        return this.getOneEditedUser.email
      },
      set (value) {
        this.updateEditedUser({ email: value })
      }
    },
    firstName: {
      get () {
        return this.getOneEditedUser.firstName
      },
      set (value) {
        this.updateEditedUser({ firstName: value })
      }
    },
    lastName: {
      get () {
        return this.getOneEditedUser.lastName
      },
      set (value) {
        this.updateEditedUser({ lastName: value })
      }
    },
    nickName: {
      get () {
        return this.getOneEditedUser.nickName
      },
      set (value) {
        this.updateEditedUser({ nickName: value })
      }
    },
    age: {
      get () {
        return this.getOneEditedUser.age
      },
      set (value) {
        this.updateEditedUser({ age: value })
      }
    },
    gender: {
      get () {
        return this.getOneEditedUser.gender
      },
      set (value) {
        this.updateEditedUser({ gender: value })
      }
    },
    jobPosition: {
      get () {
        return this.getOneEditedUser.jobPosition
      },
      set (value) {
        this.updateEditedUser({ jobPosition: value })
      }
    },
    mobileTelNumber: {
      get () {
        return this.getOneEditedUser.mobileTelNumber
      },
      set (value) {
        this.updateEditedUser({ mobileTelNumber: value })
      }
    },
    officeTelNumber: {
      get () {
        return this.getOneEditedUser.officeTelNumber
      },
      set (value) {
        this.updateEditedUser({ officeTelNumber: value })
      }
    },
    addedNote: {
      get () {
        return this.getOneEditedUser.addedNote
      },
      set (value) {
        this.updateEditedUser({ addedNote: value })
      }
    },
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
  created () {
    const {
      email,
      organizationAuth,
      organizationLevel1,
      organizationLevel2,
      organizationLevel3
    } = this.editUser

    this.updateFirsttimeEditUserItems(email)

    if (organizationAuth === 'Level1') {
      this.select = this.levelItems[0]
      this.company = this.companyList.find(obj => obj.id === organizationLevel1)
    } else if (organizationAuth === 'Level2') {
      this.select = this.levelItems[1]
      this.department = this.departmentList.find(obj => obj.id === organizationLevel2)
    } else if (organizationAuth === 'Level3') {
      this.select = this.levelItems[2]
      this.brand = this.brandList.find(obj => obj.id === organizationLevel3)
    }
  },
  methods: {
    ...mapActions('users', [
      'updatedUserToDB',
      'updateFirsttimeEditUserItems',
      'updateEditedUser'
    ]),
    initEditUser (user) {
      // TODO: init User by find Org Obj and fill User Info to fields
    },
    closeDialog () {
      this.$emit('emitCloseUserDialog', false)
    },
    saveUser () {
      // Initial Value in Form by v-model attribute
      const editedThisUser = {}
      const tCompany = this.company
      const tDepartment = this.department
      const tBrand = this.brand
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
        editedThisUser.organizationAuth = tCompany.organizationAuth
        editedThisUser.organizationLevel1 = tCompany.organizationLevel1
        editedThisUser.organizationLevel1Name = tCompany.organizationLevel1Name

        this.updateEditedUser(editedThisUser)
        this.updatedUserToDB()
        this.closeDialog()
      }

      // /////////////////////
      // Department: Organization >> Level2
      // /////////////////////
      if (this.select.id === 2 &&
            tDepartment !== null) {
        editedThisUser.organizationAuth = tDepartment.organizationAuth
        editedThisUser.organizationLevel1 = tDepartment.organizationLevel1
        editedThisUser.organizationLevel1Name = tDepartment.organizationLevel1Name
        editedThisUser.organizationLevel2 = tDepartment.organizationLevel2
        editedThisUser.organizationLevel2Name = tDepartment.organizationLevel2Name

        this.updateEditedUser(editedThisUser)
        this.updatedUserToDB()
        this.closeDialog()
      }

      // /////////////////////
      // Brand: Organization >> Level3
      // /////////////////////
      if (this.select.id === 3 &&
            tBrand !== null) {
        editedThisUser.organizationAuth = tBrand.organizationAuth
        editedThisUser.organizationLevel1 = tBrand.organizationLevel1
        editedThisUser.organizationLevel1Name = tBrand.organizationLevel1Name
        editedThisUser.organizationLevel2 = tBrand.organizationLevel2
        editedThisUser.organizationLevel2Name = tBrand.organizationLevel2Name
        editedThisUser.organizationLevel3 = tBrand.organizationLevel3
        editedThisUser.organizationLevel3Name = tBrand.organizationLevel3Name

        this.updateEditedUser(editedThisUser)
        this.updatedUserToDB()
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
      v-model="editUserDialog"
      persistent
      width="800px"
    >
      <v-form
        ref="uform"
        v-model="valid"
        lazy-validation
      >
        <v-card>
          <v-card-title class="light-green lighten-4 py-4 text-h6">
            Edit User
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
                  <v-col cols="8">
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
                  </v-col>
                  <div class="flex-grow-1" />
                  <v-col class="mr-5">
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
                  </v-col>
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
                  v-model="email"
                  :rules="emailRules"
                  class="purple-input"
                  prepend-icon="email"
                  label="Email"
                  type="email"
                  disabled
                  required
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="firstName"
                  :rules="nameRules"
                  class="purple-input"
                  prepend-icon="person"
                  label="First Name"
                  required
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="lastName"
                  class="purple-input"
                  label="Last Name"
                />
              </v-col>
              <v-col cols="2">
                <v-text-field
                  v-model="nickName"
                  v-mask="upperLetter"
                  class="purple-input"
                  label="(Nick Name)"
                />
              </v-col>
              <v-col cols="3">
                <v-text-field
                  v-model="age"
                  class="purple-input"
                  prepend-icon="sentiment_satisfied_alt"
                  label="Age"
                />
              </v-col>
              <v-col cols="3">
                <v-select
                  v-model="gender"
                  :items="genderItems"
                  class="purple-input"
                  prepend-icon="wc"
                  label="Gender"
                />
              </v-col>
              <v-col cols="6">
                <v-text-field
                  v-model="jobPosition"
                  class="purple-input"
                  prepend-icon="work"
                  label="Position"
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="mobileTelNumber"
                  v-mask="phone"
                  class="purple-input"
                  prepend-icon="phone_iphone"
                  label="Mobile No."
                />
              </v-col>
              <v-col cols="5">
                <v-text-field
                  v-model="officeTelNumber"
                  v-mask="phone"
                  class="purple-input"
                  prepend-icon="phone"
                  label="Office Tel."
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="addedNote"
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
