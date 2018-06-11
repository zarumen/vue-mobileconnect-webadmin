<script>
import Layout from '@layouts/main'
import { authMethods } from '@state/helpers'
import appConfig from '@src/app.config'

export default {
  page: {
    title: 'Log in',
    meta: [{ name: 'description', content: `Log in to ${appConfig.title}` }],
  },
  components: { Layout },
  data() {
    return {
      username: '',
      ePass: true,
      password: '',
      authError: null,
      tryingToLogIn: false,
    }
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      return this.logIn({
        username: this.username,
        password: this.password,
      })
        .then(token => {
          this.tryingToLogIn = false

          // Redirect to the originally requested page, or to the home page
          this.$router.push(this.$route.query.redirectFrom || { name: 'home' })
        })
        .catch(error => {
          console.log(error)
          this.tryingToLogIn = false
          this.authError = error
        })
    },
  },
}
</script>

<template>
  <Layout>
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      >
        <v-card class="elevation-12">
          <v-card-text>
            <v-form
              :class="$style.form"
              @submit.prevent="tryToLogIn"
            >
              <v-text-field
                v-model="username"
                label="E-mail"
              />
              <v-text-field
                v-model="password"
                :append-icon="ePass ? 'visibility' : 'visibility_off'"
                :append-icon-cb="() => (ePass = !ePass)"
                :type="ePass ? 'password' : 'text'"
                label="Enter your password"
                hint="At least 6 characters"
                min="6"
                counter
              />
              <BaseButton
                :disabled="tryingToLogIn"
                type="submit"
              >
                <BaseIcon
                  v-if="tryingToLogIn"
                  name="sync"
                  spin
                />
                <span v-else>Log In</span>
              </BaseButton>
              <p v-if="authError">
                There was an error logging in to your account.
              </p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';

.form {
  text-align: center;
}
</style>
