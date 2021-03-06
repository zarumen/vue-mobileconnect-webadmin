<script>
import { mapGetters, mapActions } from 'vuex'
import {
  userMethods,
  userComputed
} from '@state/helpers'

export default {
  page: {
    title: 'Users',
    meta: [{ name: 'description', content: 'Users' }]
  },
  components: {
    Layout: () => import('@layouts/main'),
    FormAddUser: () => import('@components/form/form-add-user'),
    FormEditUser: () => import('@components/form/form-edit-user')
  },
  data () {
    return {
      baseModule: 'users',
      addUserDialog: '',
      editUserDialog: '',
      dialog: '',
      dialogTitle: 'User Delete Dialog',
      dialogText: 'Do you want to delete this user?',
      headers: [
        {
          text: 'Level',
          align: 'start',
          value: 'organizationAuth'
        },
        { text: 'FirstName', value: 'firstName' },
        { text: 'NN', value: 'nickName' },
        { text: 'Company', value: 'organizationLevel1Name' },
        { text: 'Email', value: 'email' },
        { text: 'Mobile', value: 'mobileTelNumber' },
        { text: 'Actions', value: 'action', align: 'center', sortable: false }
      ],
      userId: '',
      userSelected: null,
      left: true,
      timeout: 2000,
      // NOT USE! now
      rightDrawer: false,
      query: '',
      userRemaining: null,
      quickSearchFilter: ''
    }
  },
  computed: {
    ...userComputed,
    ...mapGetters('organizations', [
      'hadList'
    ])
  },
  created () {
    if (!this.hadList) { this.getOrganizationsList() }

    if (!this.hadUserList) { this.getAllUsers() }
  },
  methods: {
    ...userMethods,
    ...mapActions('organizations', [
      'getOrganizationsList'
    ]),
    print () {
      window.print()
    },
    edit (item) {
      this.userSelected = item
      this.editUserDialog = !this.editUserDialog
    },
    remove (item) {
      this.userId = item.id
      this.dialog = true
    },
    onConfirm () {
      this.$store.dispatch('users/deleteUser', this.userId)
      this.$store.dispatch('users/closeSnackBar', 2000)
      this.dialog = false
    },
    onCancel () {
      this.userId = ''
      this.dialog = false
    },
    exitSnackbar () {
      this.$store.commit('users/setSnackbar', { snackbar: false })
      this.$store.commit('users/setNotice', { notice: '' })
    },
    reloadData () {
      this.getAllUsers()
    }
  }
}
</script>
<template>
  <Layout>
    <v-container fluid>
      <v-col cols="12">
        <base-helper-offset
          :offset="10"
        >
          <base-card>
            <!-- Controller Tools Panels -->
            <v-card-title>
              <span class="title">
                Users {{ userRemaining? "("+userRemaining.length+")": "" }}
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
              <base-button
                color="primary"
                circle
                icon
                @click.native="reloadData()"
              >
                <base-icon name="syncAlt" />
              </base-button>
              <base-button
                color="primary"
                circle
                icon
              >
                <v-icon>
                  print
                </v-icon>
              </base-button>
            </v-card-title>
            <br>
            <base-helper-offset
              :offset="10"
            >
              <!-- Insert in Base-Table Component -->
              <BaseTable
                v-if="loading===false"
                :headers="headers"
                :items="items"
                :search="quickSearchFilter"
                :pagination="pagination"
                :basemodule="baseModule"
                :action-btn="true"
                @updated-items="userRemaining = $event"
                @edit="edit"
                @remove="remove"
              />
            </base-helper-offset>
          </base-card>
        </base-helper-offset>
      </v-col>
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
        <base-button
          dark
          text
          @click.native="exitSnackbar"
        >
          Close
        </base-button>
      </v-snackbar>
    </v-container>
    <!-- FAB panel -->
    <base-button
      fab
      large
      bottom
      right
      color="primary"
      fixed
      @click.stop="addUserDialog = !addUserDialog"
    >
      <v-icon>add</v-icon>
    </base-button>
    <FormAddUser
      v-if="addUserDialog"
      :add-user-dialog="addUserDialog"
      @emitCloseUserDialog="addUserDialog=arguments[0]"
    />
    <FormEditUser
      v-if="editUserDialog"
      :edit-user-dialog="editUserDialog"
      :edit-user="userSelected"
      @emitCloseUserDialog="editUserDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
