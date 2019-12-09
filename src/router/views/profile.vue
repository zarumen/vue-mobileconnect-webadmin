<script>
import fireauth from '@utils/fireauth.config'
import { authComputed } from '@state/helpers'

export default {
  page () {
    return {
      title: `${this.user.firstName}'s Profile`,
      meta: [
        {
          name: 'description',
          content: `The user profile for ${this.user.firstName}.`
        }
      ]
    }
  },
  components: {
    Layout: () => import('@layouts/main')
  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      dialog: null
    }
  },
  computed: {
    ...authComputed,
    profileName: {
      get () {
        return `${this.user.firstName}`
      },
      set (value) {

      }
    },
    displayName () {
      return `${this.user.firstName} ${this.user.lastName}`
    },
    avatar () {
      // return avartar picture
      return this.getAvartar
    }
  },
  // async created () {
  //   const a = await getJwtToken

  //   console.log(a)
  // },
  methods: {
    updatedDisplayName (name) {
      const user = fireauth.currentUser

      user.updateProfile({
        displayName: name
      }).then(() => {
        // Update successful.
        console.log('User DisplayName Changed!')
        user.reload()
        this.dialog = !this.dialog
      }).catch((error) => {
        // An error happened.
        console.log(error)
      })
    },
    save () {
      this.updatedDisplayName(this.profileName)
    }
  }
}
</script>

<template>
  <Layout>
    <v-container
      fill-height
      fluid
      grid-list-xl
    >
      <v-layout
        justify="center"
      >
        <v-col
          cols="12"
          md="4"
        >
          <base-card class="v-card-profile">
            <v-avatar
              slot="offset"
              class="mx-auto d-block"
              size="150"
            >
              <v-img
                :src="avatar"
              />
            </v-avatar>
            <v-card-text
              class="text-center"
            >
              <h4 class="card-title font-weight-light">
                {{ displayName }}
              </h4>
              <h6 class="category text-gray font-weight-thin mb-3">
                {{ user.jobPosition }}
              </h6>
              <base-button
                color="primary"
                rounded
                class="font-weight-light"
                @click="dialog=!dialog"
              >
                Change Name
              </base-button>
            </v-card-text>
          </base-card>
        </v-col>
        <v-col
          cols="12"
          md="8"
        >
          <base-card
            color="deep-purple"
            title="Profile"
          >
            <v-form>
              <v-container py-0>
                <v-layout wrap>
                  <v-col
                    cols="12"
                    md="4"
                  >
                    <v-text-field
                      v-model="user.organizationLevel1Name"
                      label="Company"
                      disabled
                    />
                    <v-text-field
                      v-if="user.organizationAuth === `Level2`"
                      v-model="user.organizationLevel2Name"
                      label="Department"
                      disabled
                    />
                    <v-text-field
                      v-if="user.organizationAuth === `Level3`"
                      v-model="user.organizationLevel3Name"
                      label="Brand"
                      disabled
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="8"
                  >
                    <v-text-field
                      v-model="user.email"
                      label="Email Address"
                      class="purple-input"
                      disabled
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="user.firstName"
                      label="First Name"
                      class="purple-input"
                      disabled
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    md="6"
                  >
                    <v-text-field
                      v-model="user.lastName"
                      label="Last Name"
                      class="purple-input"
                      disabled
                    />
                  </v-col>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      v-model="user.mobileTelNumber"
                      label="Mobile Number"
                      class="purple-input"
                      disabled
                    />
                  </v-col>
                </v-layout>
              </v-container>
            </v-form>
          </base-card>
        </v-col>
      </v-layout>
    </v-container>
    <v-dialog
      v-model="dialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          Change Your Display Name
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="profileName"
            color="white"
            label="Name"
            disabled
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <base-button
            rounded
            color="primary"
            @click="dialog=false"
          >
            CANCEL
          </base-button>
          <base-button
            rounded
            color="primary"
            @click="save()"
          >
            SAVE
          </base-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Layout>
</template>
