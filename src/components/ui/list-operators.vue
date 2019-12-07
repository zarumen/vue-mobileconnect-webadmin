<script>
import { operatorComputed, operatorMethods } from '@state/helpers'

export default {
  data: () => ({
    mutablePagination: '',
    expand: false,
    left: true,
    timeout: 2000,
    showed: true
  }),
  computed: {
    ...operatorComputed,
    page: {
      set (page) {
        this.$store.commit('shortcodes/setPage', { page })
      },
      get () {
        return this.pagination.page
      }
    },
    isNotEmpty () {
      // check data is not empty
      if (this.items !== undefined) { return (this.items && this.items.length > 0) }

      return null
    }
  },
  created () {
    if (!this.hadOperatorsList) { this.getAllOperators() }

    this.mutablePagination = this.pagination
  },
  methods: {
    ...operatorMethods,
    reloadOperators () {
      return this.getAllOperators()
    },
    toTitleCase (string) {
      return string.replace(/\w\S*/g, (text) => text.toUpperCase())
    },
    exitSnackbar () {
      this.$store.commit('shortcodes/setSnackbar', { snackbar: false })
      this.$store.commit('shortcodes/setNotice', { notice: '' })
    }
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
        <base-button
          color="primary"
          rounded
          circle
        >
          NEW OPERATOR
        </base-button>
        <base-button
          color="primary"
          circle
          icon
          @click.native="reloadOperators"
        >
          <v-icon>
            refresh
          </v-icon>
        </base-button>
      </v-card-title>
      <!-- Insert in Base-Table Component -->
      <v-container
        v-if="isNotEmpty"
        fluid
        grid-list-md
      >
        <v-data-iterator
          :items="items"
          item-key="displayName"
          :items-per-page="4"
          :single-expand="expand"
          hide-default-footer
        >
          <template v-slot:default="{ items, isExpanded, expand }">
            <v-row
              wrap
            >
              <v-col
                v-for="item in items"
                :key="item.displayName"
                cols="12"
                sm="6"
                md="4"
                lg="3"
              >
                <v-card>
                  <v-card-title
                    class="headline align-text-center"
                    avatar
                  >
                    {{ toTitleCase(item.operator) }}
                  </v-card-title>
                  <v-switch
                    color="primary"
                    :input-value="isExpanded(item)"
                    :label="isExpanded(item) ? 'Expanded' : 'Closed'"
                    class="pl-3 mt-0"
                    @change="(v) => expand(item, v)"
                  />
                  <v-divider />
                  <v-list
                    v-if="isExpanded(item)"
                    dense
                  >
                    <v-list-item>
                      <v-list-item-content>Company:</v-list-item-content>
                      <v-list-item-content class="opsname align-end">
                        {{ item.displayName }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>ISO Code:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.isoCode }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>Country:</v-list-item-content>
                      <v-list-item-content class="align-end">
                        {{ item.country }}
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-content>PLMN Number:</v-list-item-content>
                      <v-list-item-content
                        class="align-end"
                      >
                        <v-chip-group
                          active-class="primary--text"
                          column
                        >
                          <v-chip
                            v-for="pn in item.numberPLMN"
                            :key="pn.key"
                            x-small
                            v-text="pn"
                          />
                        </v-chip-group>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </template>
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
      <base-button
        dark
        text
        @click.native="exitSnackbar"
      >
        Close
      </base-button>
    </v-snackbar>
  </base-helper-offset>
</template>

<style lang="scss">
  .opsname {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
