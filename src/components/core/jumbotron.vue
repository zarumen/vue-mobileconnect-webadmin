<script>
export default {
  data: () => ({
    isBooted: false,
    picUrl: 'https://firebasestorage.googleapis.com/v0/b/mobile-connect-sms-webadmin/o/img%2Fmoblie-slider2.jpg?alt=media&token=01ceefff-f6f5-42b1-bfc7-6d7b9bfc11a6'
  }),
  computed: {
    isHome () {
      return this.$route.path === '/'
    }
  },
  mounted () {
    setTimeout(() => {
      this.isBooted = true
    }, 200)
  }
}
</script>

<template>
  <v-fade-transition mode="out-in">
    <v-img
      v-if="namespace"
      :key="$route.path"
      :height="isHome ? '80vh' : '30vh'"
      :src="picUrl"
      class="white--text"
      gradient="to top, rgba(13, 3, 29, .85), rgba(25, 25, 38, .85)"
    >
      <v-fade-transition mode="out-in">
        <v-container
          v-if="isBooted"
          :key="$route.path"
          fill-height
        >
          <v-row align="center">
            <v-fade-transition mode="out-in">
              <v-col
                :key="$route.path"
                :text-center="isHome"
              >
                <h1
                  class="text-h3"
                >
                  {{ title }}
                </h1>
                <div
                  v-if="subTitle"
                  class="subheading"
                >
                  {{ subTitle }}
                </div>
                <base-button
                  v-if="isHome"
                  color="primary px-4 mt-5"
                  dark
                >
                  {{ $t('Home.callToActionBtn') }}
                </base-button>
              </v-col>
            </v-fade-transition>
          </v-row>
        </v-container>
      </v-fade-transition>
    </v-img>
  </v-fade-transition>
</template>
