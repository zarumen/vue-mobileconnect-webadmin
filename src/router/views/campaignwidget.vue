<script>


export default {
  page() {
    return {
      title: 'Campaign Widget',
      meta: [
        {
          name: 'description',
          content: `The user profile for .`,
        },
      ],
    }
  },
}
</script>

<template>
  <Layout>
    <v-content>
      <h1>
        Campaign ID: {{ $route.params.campaignId }}
      </h1>
    </v-content>
  </Layout>
</template>
