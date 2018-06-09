<script>
export default {
  props: {
    addDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {
      select: {},
      levelItems: [
        { state: 'Company', value: 'OrganizationLevel1' },
        { state: 'Department', value: 'OrganizationLevel2' },
        { state: 'Brand', value: 'OrganizationLevel3' },
      ],
    }
  }
}
</script>

<template>
  <v-dialog 
    v-model="addDialog" 
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
          @click="addDialog = false"
        >
          Cancel
        </v-btn>
        <v-btn 
          flat
          color="indigo" 
          @click="addDialog = false"
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
