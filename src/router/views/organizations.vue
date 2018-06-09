<script>
import Layout from '@layouts/main'
import FormAddOrganization from '@components/form-add-organization'
import { orgMethods, orgComputed } from '@state/helpers'

export default {
  page: {
    title: 'Organizations',
    meta: [{ name: 'description', content: 'Organizations' }],
  },
  components: { Layout, FormAddOrganization },
  data() {
    return {
      addDialog: '',
      dialog: '',
      dialogTitle: "Organization Delete Dialog",
      dialogText: "Do you want to delete this organization?",
      rightDrawer: false,
      right: true,
      search: '',
      loading: false,
      pagination: {
        page: 1,
        totalItems: 3,
        rowsPerPage: 10
      },
      headers: [
        {
          text: 'Level',
          left: true,
          value: 'organizationAuth'
        },
        { text: 'Organization Level1', value: 'organizationLevel1Name' },
        { text: 'Organization Level2', value: 'organizationLevel2Name' },
        { text: 'Organization Level3', value: 'organizationLevel3Name' },
      ],
      searchVm: {
        contains: {
          firstName: '',
          lastName: ''
        }
      },
      query: "",
      snackbarStatus: false,
      timeout: 2000,
      quickSearchFilter: "",
    }
  },
  computed: {
    ...orgComputed,
  },
  watch: {

  },
  created () {
    this.reloadData()
  },
  methods: {
    ...orgMethods,
    print () {
      window.print()
    },
    remove (item) {
      this.orderId = item.id
      this.dialog = true
    },
    onConfirm () {

    },
    onCancel () {
      this.orderId = ""
      this.dialog = false
    },
    closeSnackbar () {

    },
    reloadData () {
       this.$store.dispatch('organizations/getOrganizationsList')
    }
  },
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-flex xs12>
        <v-card>
          <!-- Controller Tools Panels -->
          <v-card-title>
            <span class="title">
              Organization {{ pagination? "("+pagination.totalItems+")": "" }}
              <v-text-field
                v-model="quickSearch"
                append-icon="search"
                label="Quick Search"
                single-line
                hide-details
              />
            </span>
            <v-spacer/>
            <v-btn 
              flat 
              icon 
              color="green"
            >
              <BaseIcon name="syncAlt"/>            
            </v-btn>
            <v-btn 
              flat 
              icon 
              color="indigo"
            >
              <v-icon>
                print
              </v-icon>
            </v-btn>
          </v-card-title>
          <!-- Insert in Base-Table Component -->
          <BaseTable
            v-if="loading===false"
            :headers="headers"
            :items="items"
            :pagination="pagination"
            @edit="edit"
            @remove="remove"
          />
        </v-card>
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
        :right="true" 
        :timeout="timeout" 
        :color="mode" 
        v-model="snackbar"
      >
        {{ notice }}
        <v-btn 
          dark 
          flat 
          @click.native="closeSnackbar"
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
      color="indigo"
      dark
      fixed
      @click.stop="addDialog = !addDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <FormAddOrganization :add-dialog="addDialog"/>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

