<script>
import Layout from '@layouts/main'
import FormAddOrganization from '@components/form/form-add-organization'
import { orgMethods, orgComputed } from '@state/helpers'

export default {
  page: {
    title: 'Organizations',
    meta: [{ name: 'description', content: 'Organizations' }],
  },
  components: { Layout, FormAddOrganization },
  data() {
    return {
      baseModule: 'organizations',
      addDialog: '',
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
      quickSearchFilter: ''
    }
  },
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
      // sending to editPage
      // this.$router.push({ name: 'organization-edit', params: { id: item.id } })
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
      :add-dialog="addDialog" 
      @emitCloseDialog="addDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

