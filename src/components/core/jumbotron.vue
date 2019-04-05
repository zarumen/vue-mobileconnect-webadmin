<script>
export default {
  data: () => ({
    isBooted: false
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
      :src="`http://www.mobileconnect.co.th/img/slider/revolution/moblie-slider2.jpg`"
      class="white--text"
      gradient="to top, rgba(13, 3, 29, .85), rgba(25, 25, 38, .85)"
    >
      <v-fade-transition mode="out-in">
        <v-container
          v-if="isBooted"
          :key="$route.path"
          fill-height
        >
          <v-layout align-center>
            <v-fade-transition mode="out-in">
              <v-flex
                :key="$route.path"
                :text-xs-center="isHome"
              >
                <h1
                  class="display-2"
                  v-html="title"
                />
                <div
                  v-if="subTitle"
                  class="subheading"
                  v-html="subTitle"
                />
                <v-btn
                  v-if="isHome"
                  color="primary px-4 mt-5"
                  dark
                >
                  {{ $t('Home.callToActionBtn') }}
                </v-btn>
              </v-flex>
            </v-fade-transition>
          </v-layout>
        </v-container>
      </v-fade-transition>
    </v-img>
  </v-fade-transition>
</template>
