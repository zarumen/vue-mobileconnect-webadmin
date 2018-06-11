<script>
import Layout from '@layouts/main'
import FormAddUser from '@components/form-add-user'

export default {
  page: {
    title: 'Users',
    meta: [{ name: 'description', content: 'Users' }],
  },
  components: { Layout, FormAddUser },
  data() {
    return {
      addUserDialog: '',
    }
  },
}
</script>

<template>
  <Layout>
    <!-- FAB panel -->
    <v-btn
      fab
      bottom
      right
      color="indigo"
      dark
      fixed
      @click.stop="addUserDialog = !addUserDialog"
    >
      <v-icon>add</v-icon>
    </v-btn>
    <FormAddUser 
      :add-user-dialog="addUserDialog" 
      @emitCloseUserDialog="addUserDialog=arguments[0]"
    />
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

