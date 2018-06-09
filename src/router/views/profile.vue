<script>
import Layout from '@layouts/main'

export default {
  page() {
    return {
      title: this.user.firstName,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.firstName}.`,
        },
      ],
    }
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
}
</script>

<template>
  <Layout>
    <v-content>
      <h1>
        <BaseIcon name="user"/>
        {{ user.firstName }} {{ user.lastName }}
        Profile
      </h1>
      <pre>{{ user }}</pre>
    </v-content>
  </Layout>
</template>
