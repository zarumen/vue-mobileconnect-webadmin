<script>
export default {
  props: {

  },
  data () {
    return {
      validateTypeList: [
        {value: 'regex', condition: false},
        {value: 'coupon', condition: true},
      ],
      validateType: true,
    }
  }
}
</script>

<template>
  <v-flex 
    xs6
    sm5 
  >
    <v-card>
      <v-subheader>Add Context Parser</v-subheader>
      <v-card-text>
        <v-text-field
          solo-inverted 
          label="Remove Character"
        />
        <v-text-field 
          prepend-icon="message"
          label="Invalid Format Message"
        />
        <v-select 
          v-model="validateType"
          :items="validateTypeList"
          :hint="`${validateType}`"
          item-text="value"
          item-value="condition"
          label="Condition Type"
          prepend-icon="assignment"
          persistent-hint
        />
        <v-text-field 
          :disabled="validateType"
          solo-inverted 
          label="Condition (Regular Expression)"
        />
      </v-card-text> 
      <v-card-actions>
        <v-spacer/>
        <v-btn 
          color="blue" 
          class="white--text"
        >
          Save
        </v-btn>
        <v-btn 
          flat
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-flex>
</template>

<style lang="scss" module>
@import '@design';
</style>
