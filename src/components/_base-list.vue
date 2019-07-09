<script>
export default {
  
}
</script>

<template>
  <v-list three-line>
    <v-list-item @click="complete(0)">
      <v-list-item-actiosn>
        <v-checkbox
          :value="list[0]"
          color="green"
        />
      </v-list-item-actiosn>
      <v-list-item-title>
        Sign contract for "What are conference organized afraid of?"
      </v-list-item-title>
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
    </v-list-item>
    <v-divider />
    <v-list-item @click="complete(1)">
      <v-list-item-action>
        <v-checkbox
          :value="list[1]"
          color="green"
        />
      </v-list-item-action>
      <v-list-item-title>
        Lines From Great Russian Literature? Or E-mails From My Boss?
      </v-list-item-title>
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
    </v-list-item>
    <v-divider />
    <v-list-item @click="complete(2)">
      <v-list-item-action>
        <v-checkbox
          :value="list[2]"
          color="green"
        />
      </v-list-item-action>
      <v-list-item-title>
        Flooded: One year later, assessing what was lost and what was found when a ravaging rain swept through metro Detroit
      </v-list-item-title>
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
    </v-list-item>
  </v-list>
</template>

<style lang="scss" module>
@import '@design';
</style>
