<script>
import { mapState, mapActions } from 'vuex'

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
    }
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
      { id: 3, state: 'Brand', value: 'OrganizationLevel3' }
    ],
    select: Object.assign({}, {
      id: 1,
      state: 'User Level: Company',
      value: 'OrganizationLevel1'
    }),
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
      if (typeof this.form.company === 'object') {
        return this.mutateList(this.form.company.id)
      } else {
        return []
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
    },
    // conditions of Edit Items
    conditionEditDepartment () {
      if (this.select.id === 2) { return true }

      return false
    },
    conditionEditBrand () {
      if (this.select.id === 3) { return true }

      return false
    }
  },
  created () {
    if (this.level === 'Level1') {
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
    ...mapActions('organizations', [
      'editOrganizationLevelCompany'
    ]),
    mutateList (companyListId) {
      return this.departmentList.filter(org => org.organizationLevel1 === companyListId)
    },
    findOrganizationObject (lvl, orgId) {
      if (lvl === 'Level1') {
        return this.companyList.find(obj => obj.id === orgId)
      } else if (lvl === 'Level2') {
        return this.departmentList.find(obj => obj.id === orgId)
      } else if (lvl === 'Level3') {
        return this.brandList.find(obj => obj.id === orgId)
      }
    },
    save () {
      // TODO: save edited Organization by:
      // Level2 can change displayName and OrgNameLevel2
      // Level3 can change Object by switch Department in the same Company and change DisplayName and OrgNameLevel3
      switch (this.select.id) {
        case 3:
          // code block

          break
        case 2:
          // code block
          break
        default:
          // Level1 can change displayName and OrgName
          if (this.form.company == null) {
            this.openSnackBar('Please insert Company Name to This Form!')
          }
          if (typeof this.form.company === 'string') {
            this.editOrganizationLevelCompany({
              organizationId: `${this.orgLevelOne}`,
              payloadFixed: `${this.form.company}`,
              picURL: 'undefine'
            }).then((result) => {
              console.log(result)
              this.closeDialog()
            })
              .catch((err) => console.log(err))
          }

          if (typeof this.form.company === 'object') {
            const checkObj = this.findOrganizationObject('Level1', this.orgLevelOne)

            if (checkObj.displayName === this.form.company.displayName) {
              this.openSnackBar('You choose Company is the same!')
              break
            }

            if (checkObj.picURL === this.form.company.picURL) {
              this.openSnackBar('You cannot changed Picture!')
              break
            }

            const data = `${this.form.company.displayName}`

            this.editOrganizationLevelCompany({
              organizationId: `${this.orgLevelOne}`,
              payloadFixed: `${data}`,
              picURL: this.form.company.picURL
            })

            this.closeDialog()
          }
      }
    },
    closeDialog () {
      this.$emit('emitCloseEditDialog', false)
    },
    openSnackBar (insertText) {
      this.valid = !this.valid
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
      v-model="editOrgDialog"
      persistent
      width="600px"
    >
      <v-card>
        <v-card-title class="light-green lighten-4 py-4 text-h6">
          Edit Organization
        </v-card-title>
        <v-container
          class="pa-4"
        >
          <v-row
            wrap
          >
            <v-col
              cols="12"
              align="center"
              justify-space-between
            >
              <v-row align="start">
                <v-col cols="4">
                  <v-avatar
                    size="80px"
                  >
                    <img
                      src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                      alt=""
                    >
                  </v-avatar>
                </v-col>
                <v-col cols="8">
                  <v-select
                    :key="levelItems.id"
                    v-model="select"
                    :hint="`${select.value}: ${select.state}`"
                    :items="levelItems"
                    class="purple-input"
                    item-text="state"
                    item-value="value"
                    label="OrganizationLevel Field"
                    disabled
                    persistent-hint
                    return-object
                    single-line
                  />
                </v-col>
              </v-row>
            </v-col>
            <v-col
              cols="12"
            >
              <v-combobox
                :key="JSON.stringify(companyList.id)"
                v-model="form.company"
                :hint="`${form.company}`"
                :items="companyList"
                :disabled="conditionEditDepartment || conditionEditBrand"
                item-text="displayName"
                prepend-icon="business"
                label="Company Name"
                class="purple-input"
                chips
              >
                <template v-slot:selection="data">
                  <template v-if="typeof data.item === 'object'">
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
                  <template v-else>
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </template>
              </v-combobox>
            </v-col>
            <v-col
              v-if="enableLevel2 || enableLevel3"
              cols="12"
            >
              <v-combobox
                :key="mutateDepartmentList.id"
                v-model="form.department"
                :hint="`${form.department}`"
                :items="mutateDepartmentList"
                :disabled="conditionEditBrand"
                class="purple-input"
                item-text="displayName"
                prepend-icon="business_center"
                label="Department Name"
                chips
              >
                <template v-slot:item="data">
                  <v-list-item-content>
                    <v-list-item-title>{{ data.item.displayName }}</v-list-item-title>
                    <v-list-item-subtitle>{{ data.item.organizationLevel1Name }}</v-list-item-subtitle>
                  </v-list-item-content>
                </template>
                <template v-slot:selection="data">
                  <template v-if="typeof data.item === 'object'">
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
                  <template v-else>
                    <v-chip
                      :key="JSON.stringify(data.item)"
                      :input-value="data.selected"
                      color="primary"
                      @input="data.parent.selectItem(data.item)"
                    >
                      {{ data.item }}
                    </v-chip>
                  </template>
                </template>
              </v-combobox>
            </v-col>
            <v-col
              v-if="enableLevel3"
              cols="12"
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
                chips
              >
                <template v-slot:item="data">
                  <template v-if="data.item.picURL === 'undefine'">
                    <v-list-item-avatar
                      color="secondary"
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
          </v-row>
        </v-container>
        <v-card-actions>
          <!-- <base-button
            text
            color="indigo"
          >
            More
          </base-button> -->
          <v-spacer />
          <base-button
            text
            color="secondary darken-2"
            @click="closeDialog()"
          >
            Cancel
          </base-button>
          <base-button
            rounded
            color="secondary darken-2"
            @click="save()"
          >
            Save
          </base-button>
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
