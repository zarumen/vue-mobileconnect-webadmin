<script>
import Layout from '@layouts/main'

export default {
  page: {
    title: 'Regex',
    meta: [{ name: 'description', content: 'Regex' }],
  },
  components: { Layout }
}
</script>

<template>
  <Layout>
    <v-btn
      large
      class="mx-0 font-weight-light"
      color="success"
      href="https://materialdesignicons.com/"
      target="_blank"
      round
    >
      <v-icon left>code</v-icon>
      <span>See all icons</span>
    </v-btn>
    <div>
      <v-btn
        color="secondary"
        class="v-btn--simple"
        round
      >
        My Button
      </v-btn>
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

