<script>
export default {
  props: {
    addUserDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {
      select: {},
      levelItems: [
        { state: 'User Level Company', value: 'OrganizationLevel1' },
        { state: 'User Level Department', value: 'OrganizationLevel2' },
        { state: 'User Level Brand', value: 'OrganizationLevel3' },
      ],
      genderItems: [
        'Male',
        'Female'
      ],
    }
  }
}
</script>

<template>
  <v-dialog 
    v-model="addUserDialog" 
    width="800px"
  >
    <v-card>
      <v-card-title class="grey lighten-4 py-4 title">
        Create New Organization
      </v-card-title>
      <v-container 
        grid-list-sm 
        class="pa-4"
      >
        <v-layout 
          row 
          wrap
        >
          <v-flex 
            xs8 
            align-center 
            justify-space-between
          >
            <v-layout align-center>
              <v-avatar 
                size="80px" 
                class="mr-3"
              >
                <img
                  src="//ssl.gstatic.com/s2/oz/images/sge/grey_silhouette.png"
                  alt=""
                >
              </v-avatar>
              <v-select
                v-model="select"
                :hint="`${select.value}: ${select.state}`"
                :items="levelItems"
                item-text="state"
                item-value="value"
                label="OrganizationLevel Field"
                persistent-hint
                return-object
                single-line
              />
            </v-layout>
          </v-flex>
          <v-flex xs12>
            <v-text-field
              label="Email"
              type="email"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="First Name"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              label="Last Name"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="(Nick Name)"
            />
          </v-flex>
          <v-flex xs4>
            <v-select
              :items="genderItems"
              label="Gender"
            />
          </v-flex>
          <v-flex xs4>
            <v-text-field
              label="Job Position"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              prepend-icon="phone_iphone"
              label="Mobile Number"
            />
          </v-flex>
          <v-flex xs6>
            <v-text-field
              prepend-icon="phone"
              label="Office Number"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              prepend-icon="business"
              label="Company Name"
            />
            <v-text-field
              prepend-icon="business_center"
              label="Department Name"
            />
            <v-text-field
              prepend-icon="shopping_basket"
              label="Brand Name"
            />
          </v-flex>
          <v-flex xs12>
            <v-text-field
              multi-line
              label="Add Note:"
            >
              <!-- <div slot="label">
                Add Note: <small>(optional)</small>
              </div> -->
            </v-text-field>
          </v-flex>
        </v-layout>
      </v-container>
      <v-card-actions>
        <!-- <v-btn 
          flat 
          color="indigo"
        >
          More
        </v-btn> -->
        <v-spacer/>
        <v-btn 
          flat 
          color="indigo" 
          @click="addUserDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn 
          flat
          color="indigo" 
          @click="addUserDialog = false"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>
