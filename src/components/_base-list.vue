<script>
export default {
  
}
</script>

<template>
  <v-list three-line>
    <v-list-tile @click="complete(0)">
      <v-list-tile-actiosn>
        <v-checkbox
          :value="list[0]"
          color="green"
        />
      </v-list-tile-actiosn>
      <v-list-tile-title>
        Sign contract for "What are conference organized afraid of?"
      </v-list-tile-title>
      <div class="d-flex">
        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="secondary"
            icon
          >
            <v-icon>create</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="danger"
            icon
          >
            <v-icon color="error">
              close
            </v-icon>
          </v-btn>
          <span>Close</span>
        </v-tooltip>
      </div>
    </v-list-tile>
    <v-divider />
    <v-list-tile @click="complete(1)">
      <v-list-tile-action>
        <v-checkbox
          :value="list[1]"
          color="green"
        />
      </v-list-tile-action>
      <v-list-tile-title>
        Lines From Great Russian Literature? Or E-mails From My Boss?
      </v-list-tile-title>
      <div class="d-flex">
        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="secondary"
            icon
          >
            <v-icon>create</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>

        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="danger"
            icon
          >
            <v-icon color="error">
              close
            </v-icon>
          </v-btn>
          <span>Close</span>
        </v-tooltip>
      </div>
    </v-list-tile>
    <v-divider />
    <v-list-tile @click="complete(2)">
      <v-list-tile-action>
        <v-checkbox
          :value="list[2]"
          color="green"
        />
      </v-list-tile-action>
      <v-list-tile-title>
        Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit
      </v-list-tile-title>
      <div class="d-flex">
        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="secondary"
            icon
          >
            <v-icon>create</v-icon>
          </v-btn>
          <span>Edit</span>
        </v-tooltip>
        <v-tooltip
          top
          content-class="top"
        >
          <v-btn
            slot="activator"
            class="v-btn--simple"
            color="danger"
            icon
          >
            <v-icon color="error">
              close
            </v-icon>
          </v-btn>
          <span>Close</span>
        </v-tooltip>
      </div>
    </v-list-tile>
  </v-list>
</template>

<style lang="scss" module>
@import '@design';
</style>
