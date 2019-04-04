<script>
import { operatorComputed, operatorMethods } from '@state/helpers'

export default {
  data: () => ({
    mutablePagination: '',
    left: true,
    timeout: 2000,
    showed: true,
  }),
  computed: {
    ...operatorComputed,
    page: {
      set(page) {
        this.$store.commit('shortcodes/setPage', { page })
      },
      get() {
        return this.pagination.page
      }
    },
    isNotEmpty () {
      // check data is not empty
      if(this.items !== undefined)
        return (this.items && this.items.length > 0);

      return null
    },
  },
  created() {
    if(!this.hadOperatorsList)
      this.getAllOperators()
    
    this.mutablePagination = this.pagination
  },
  methods: {
    ...operatorMethods,
    reloadOperators () {
      return this.getAllOperators()
    },
    toTitleCase (string) {
      return string.replace(/\w\S*/g, (text) => text.charAt(0).toUpperCase() + text.substr(1).toLowerCase())
    },
    exitSnackbar () {
      this.$store.commit('shortcodes/setSnackbar', { snackbar: false })
      this.$store.commit('shortcodes/setNotice', { notice: '' })
    },
  }
}
</script>

<template>
  <base-helper-offset :offset="10">
    <base-card
      color="deep-purple"
      title="Operators Info"
      text="Operator's General Informations"
    >
      <!-- Controller Tools Panels -->
      <v-card-title>
        <span class="title">
          Operators {{ pagination? "("+pagination.totalItems+")": "" }}
          <!-- <v-text-field
            append-icon="search"
            label="Quick Search"
            single-line
            hide-details
          /> -->
        </span>
        <v-spacer />
        <v-btn
          color="primary"
          round
          circle
        >
          NEW OPERATOR            
        </v-btn>
        <v-btn 
          class="v-btn--simple"
          color="primary"
          circle
          icon
          @click.native="reloadOperators"
        >
          <v-icon>
            refresh
          </v-icon>
        </v-btn>
      </v-card-title>
      <!-- Insert in Base-Table Component -->
      <v-container
        v-if="isNotEmpty"
        fluid 
        grid-list-md
      >
        <v-data-iterator
          :items="items"
          :pagination.sync="mutablePagination"
          content-tag="v-layout"
          row
          wrap
        >
          <v-flex
            slot="item"
            slot-scope="props"
            xs12
            sm6
            md4
            lg3
          >
            <v-card>
              <v-card-title 
                class="headline" 
                avatar
              >
                {{ toTitleCase(props.item.operator) }}
              </v-card-title>
              <v-divider />
              <v-list 
                dense 
              >
                <v-list-tile>
                  <v-list-tile-content>Company:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    {{ props.item.displayName }}
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>ISO Code:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    {{ props.item.isoCode }}
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>Country:</v-list-tile-content>
                  <v-list-tile-content class="align-end">
                    {{ props.item.country }}
                  </v-list-tile-content>
                </v-list-tile>
                <v-list-tile>
                  <v-list-tile-content>PLMN Number:</v-list-tile-content>
                  <v-list-tile-content 
                    v-for="pn in props.item.numberPLMN" 
                    :key="pn.key" 
                    class="align-end"
                  >
                    <v-badge
                      small  
                      class="deep-purple lighten-1 white--text caption font-weight-thin"
                    >
                      {{ pn }}
                    </v-badge>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list>
            </v-card>
          </v-flex>
        </v-data-iterator>
      </v-container>
    </base-card>
    <!-- Pop up Panels -->
    <v-snackbar 
      v-if="loading===false" 
      v-model="snackbar" 
      :left="true" 
      :timeout="timeout" 
      :color="mode"
    >
      {{ notice }}
      <v-btn 
        dark 
        flat 
        @click.native="exitSnackbar"
      >
        Close
      </v-btn>
    </v-snackbar>
  </base-helper-offset>
</template>

