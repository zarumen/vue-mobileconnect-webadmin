<script>
export default {
  props: {
    addCampaignDialog: {
      type: [String, Boolean],
      default: ''
    }
  },
  data() {
    return {

    }
  },
  methods:{
    closeDialog() {
      this.$emit('emitCloseCampaignDialog', false)
    },
  },
}
</script>

<template>
  <v-layout 
    row 
    justify-center
  >
    <v-dialog 
      v-model="addCampaignDialog" 
      fullscreen 
      hide-overlay 
      transition="dialog-bottom-transition">
      <v-card>
        <v-toolbar 
          dark 
          color="green"
        >
          <v-btn 
            icon 
            dark 
            @click.native="closeDialog()"
          >
            <v-icon>
              close
            </v-icon>
          </v-btn>
          <v-toolbar-title>
            Add New Campaign
          </v-toolbar-title>
          <v-spacer/>
          <v-toolbar-items>
            <v-btn 
              dark 
              flat 
              @click.native="closeDialog()"
            >
              Save
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!-- Content is here -->

      </v-card>
    </v-dialog>
  </v-layout>
</template>

<style lang="scss" module>
@import '@design';
</style>
