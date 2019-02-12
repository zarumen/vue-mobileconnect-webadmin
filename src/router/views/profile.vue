<script>
import Layout from '@layouts/main'
import fireauth from '@utils/fireauth.config'

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
  computed: {
    profileName() {
      return `${this.user.firstName} ${this.user.lastName}`
    }
  },
  created () {
    console.log(fireauth.currentUser)
  },
}
</script>

<template>
  <Layout>
    <v-content>
      <v-container
        fill-height
        fluid
        grid-list-xl
      >
        <v-layout
          justify-center
          wrap
        >
          <v-flex
            xs12
            md8
          >
            <base-card
              color="deep-purple"
              title="Profile"
            >
              <v-form>
                <v-container py-0>
                  <v-layout wrap>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        v-model="user.organizationLevel1Name"
                        label="Company"
                        disabled
                      />
                    </v-flex>
                    <!--                     <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        class="purple-input"
                        label="User Name"
                        disabled
                      />
                    </v-flex> -->
                    <v-flex
                      xs12
                      md8
                    >
                      <v-text-field
                        v-model="user.email"
                        label="Email Address"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="user.firstName"
                        label="First Name"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md6
                    >
                      <v-text-field
                        v-model="user.lastName"  
                        label="Last Name"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md12
                    >
                      <v-text-field
                        label="Adress"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        label="City"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        label="Country"
                        class="purple-input"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      md4
                    >
                      <v-text-field
                        class="purple-input"
                        label="Postal Code"
                        type="number"
                        disabled
                      />
                    </v-flex>
                    <v-flex
                      xs12
                      text-xs-right
                    >
                      <!--                       <v-btn
                        class="mx-0 font-weight-light"
                        color="primary"
                      >
                        Update Profile
                      </v-btn> -->
                    </v-flex>
                  </v-layout>
                </v-container>
              </v-form>
            </base-card>
          </v-flex>
          <v-flex
            xs12
            md4
          >
            <base-card class="v-card-profile">
              <v-avatar
                slot="offset"
                class="mx-auto d-block"
                size="150"
              >
                <img
                  src="https://cdn1.iconfinder.com/data/icons/user-pictures/101/malecostume-512.png"
                >
              </v-avatar>
              <v-card-text 
                class="text-xs-center" 
                style="width:200px"
              >
                <h6 class="category text-gray font-weight-thin mb-3">
                  {{ user.jobPosition }}
                </h6>
                <h4 class="card-title font-weight-light">
                  {{ profileName }}
                </h4>
                <v-btn
                  color="primary"
                  round
                  class="font-weight-light"
                >
                  Follow
                </v-btn>
              </v-card-text>
            </base-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </Layout>
</template>
