<script>
import { orgMethods, orgComputed } from '@state/helpers'

export default {
  page: {
    title: 'Organizations',
    meta: [{ name: 'description', content: 'Organizations' }],
  },
  components: { 
    Layout: () => import('@layouts/main'), 
    FormAddOrganization: () => import('@components/form/form-add-organization'), 
    FormEditOrganization: () => import('@components/form/form-edit-organization')
  },
  data: () => ({
    baseModule: 'organizations',
    addDialog: '',
    editOrgDialog: '',
    dialog: '',
    dialogTitle: "Organization Delete Dialog",
    dialogText: "Do you want to delete this organization?",
    headers: [
      {
        text: 'Level',
        left: true,
        value: 'organizationAuth'
      },
      { text: 'Company',left: true, value: 'organizationLevel1Name' },
      { text: 'Department', value: 'organizationLevel2Name' },
      { text: 'Brand', value: 'organizationLevel3Name' },
    ],
    organizationId: '',
    left: true,
    // NOT USE! now
    rightDrawer: false,
    query: "",
    timeout: 2000,
    quickSearchFilter: '',
    // set value to props FormEditOrganization
    selectedLevelOrg: '',
    selectedOrgLevel1: '',
    selectedOrgLevel2: '',
    selectedOrgLevel3: '',
  }),
  computed: {
    ...orgComputed,
  },
  watch: {
    
  },
  created () {
    // initial Data Table from OrganizationList query from firestore
    if (!this.hadList) {
      this.reloadData()
    }      
  },
  methods: {
    ...orgMethods,
    print () {
      window.print()
    },
    edit (item) {
      this.selectedLevelOrg = item.organizationAuth
      
      switch (this.selectedLevelOrg) {
        case 'Level1':
            this.selectedOrgLevel1 = item.organizationLevel1
          break
        case 'Level2':
            this.selectedOrgLevel1 = item.organizationLevel1
            this.selectedOrgLevel2 = item.organizationLevel2
          break
        case 'Level3':
            this.selectedOrgLevel1 = item.organizationLevel1
            this.selectedOrgLevel2 = item.organizationLevel2
            this.selectedOrgLevel3 = item.organizationLevel3
          break
      }

      this.editOrgDialog = !this.editOrgDialog
    },
    remove (item) {
      this.organizationId = item.id
      this.dialog = true
    },
    onConfirm () {
      // send organizationId to Store dispatch (organizations/deleteOrganization)
      this.$store.dispatch('organizations/deleteOrganization', this.organizationId)
      this.$store.dispatch('organizations/closeSnackBar', 2000)
      this.dialog = false
    },
    onCancel () {
      this.organizationId = ''
      this.dialog = false
    },
    exitSnackbar () {
      this.$store.commit('organizations/setSnackbar', { snackbar: false })
      this.$store.commit('organizations/setNotice', { notice: '' })
    },
    reloadData () {
      this.getOrganizationsList()
    },
  },
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-flex xs12>
        <base-helper-offset
          :offset="10"
        >
          <base-card>
            <!-- Controller Tools Panels -->
            <v-card-title class="title">
              <span>
                Organizations {{ pagination? "("+pagination.totalItems+")": "" }}
                <v-text-field
                  v-model="quickSearchFilter"
                  class="purple-input"
                  append-icon="search"
                  label="Quick Search"
                  single-line
                  hide-details
                />
              </span>
              <v-spacer />
              <v-btn 
                class="v-btn--simple"
                color="primary"
                circle
                icon
                @click.native="reloadData()"
              >
                <v-icon>
                  refresh
                </v-icon>      
              </v-btn>
              <v-btn 
                class="v-btn--simple"
                color="primary"
                circle
                icon
              >
                <v-icon>
                  print
                </v-icon>
              </v-btn>
            </v-card-title>
            <br>
            <!-- Insert in Base-Table Component -->
            <base-helper-offset
              :offset="10"
            >
              <BaseTable
                v-if="loading===false"
                :headers="headers"
                :items="items"
                :search="quickSearchFilter"
                :pagination="pagination"
                :basemodule="baseModule"
                :action-btn="true"
                @edit="edit"
                @remove="remove"
              />
            </base-helper-offset>
          </base-card>
        </base-helper-offset>
      </v-flex>
      <!-- Pop up Panels -->
      <BaseDialog 
        :dialog="dialog" 
        :dialog-title="dialogTitle" 
        :dialog-text="dialogText"
        @onConfirm="onConfirm" 
        @onCancel="onCancel"
      />
      <v-snackbar 
        v-if="loading===false" 
        v-model="snackbar" 
        :left="true" 
        :timeout="timeout" 
        :color="mode"
      >
        {{ notice }}
        <v-btn 
          dark 
          flat 
          @click.native="exitSnackbar"
        >
          Close
        </v-btn>
      </v-snackbar>
    </v-container>
    <!-- FAB panel -->
    <v-btn
      fab
      bottom
      right
      color="primary"
      fixed
      @click.stop="addDialog = !addDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <form-add-organization
      v-if="addDialog"
      :add-dialog="addDialog" 
      @emitCloseDialog="addDialog=arguments[0]"
    />
    <form-edit-organization
      v-if="editOrgDialog"
      :level="selectedLevelOrg"
      :org-level-one="selectedOrgLevel1"
      :org-level-two="selectedOrgLevel2"
      :org-level-three="selectedOrgLevel3"
      :edit-org-dialog="editOrgDialog" 
      @emitCloseEditDialog="editOrgDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

