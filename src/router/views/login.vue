<script>
import { authMethods } from '@state/helpers'
const appConfig = require('@/app.config')

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }]
  },
  components: {
    Layout: () => import('@layouts/main')
  },
  data: () => ({
    username: '',
    ePass: true,
    password: '',
    authError: null,
    tryingToLogIn: false
  }),
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn () {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        username: this.username,
        password: this.password
      })
        .then(user => {
          this.tryingToLogIn = false
          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirect || '/profile')
          console.log('push finished')
        })
        .catch(error => {
          console.log(error)
          this.tryingToLogIn = false
          this.authError = error
        })
    }
  }
}
</script>

<template>
  <Layout>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="8"
        sm="6"
        md="4"
      >
        <base-card
          color="deep-purple lighten-1"
          class="elevation-12"
        >
          <v-row
            slot="header"
            wrap
          >
            <v-col>
              <v-img
                class="mx-2"
                :src="require('@assets/images/logo.png')"
              />
            </v-col>
            <v-col
              class="title"
            >
              <h4 class="font-weight-medium white--text">
                Mobile Connect Web Admin
              </h4>
            </v-col>
          </v-row>
          <v-card-text>
            <v-form
              :class="$style.form"
              @submit.prevent="tryToLogIn"
            >
              <v-text-field
                v-model="username"
                class="purple-input"
                label="E-mail"
              />
              <v-text-field
                v-model="password"
                :append-icon="ePass ? 'visibility' : 'visibility_off'"
                :type="ePass ? 'password' : 'text'"
                label="Enter your password"
                hint="At least 6 characters"
                class="purple-input"
                min="6"
                counter
                @click:append="() => (ePass = !ePass)"
              />
              <base-button
                :disabled="tryingToLogIn"
                color="primary"
                type="submit"
                rounded
              >
                <base-icon
                  v-if="tryingToLogIn"
                  name="sync"
                  spin
                />
                <span v-else>
                  Log In
                </span>
              </base-button>
              <div v-if="!!authError">
                <p>There was an error logging in to your account.</p>
                <span class="red--text">
                  {{ authError.message }}
                </span>
              </div>
            </v-form>
          </v-card-text>
        </base-card>
      </v-col>
    </v-row>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
}
</style>
