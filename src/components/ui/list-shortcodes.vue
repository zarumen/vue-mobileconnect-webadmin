<script>
import { shortcodeComputed, shortcodeMethods } from '@state/helpers'
import FormAddKeyword from '@components/form/form-add-keyword-reserved'
import FormAddShortcode from '@components/form/form-add-shortcode'

export default {
  components: { FormAddKeyword, FormAddShortcode },
  data: () => ({
    addKeywordDialog: '',
    addShortcodeDialog: '',
    tabs: 0,
    dialog: false
  }),
  computed: {
    ...shortcodeComputed,
  },
  watch: {
    // เช็ค List เพื่อ updated หน้า auto
  },
  created() {
    if(!this.hadShortcodesList)
      this.getAllShortcodes()
  },
  methods: {
    ...shortcodeMethods,
    reloadShortcodes () {
      return this.getShortcodesFromFirestore()
    },
    reloadKeywords () {
      return this.getKeywordsActiveFromFirestore()
    },
    refreshReservedList () {
      return this.getKeywordsReservedFromFirestore()
    },
    onConfirm () {
      // NOT FINISHED YET!
      
    },
    onCancel () {
      this.dialog = false
    },
    onClicked () {
      this.dialog = true
    }
  }
}
</script>

<template>
  <base-helper-offset :offset="10">
    <base-card
      class="card-tabs"
      color="light-green"
    >
      <v-flex
        slot="header"
      >
        <v-tabs
          v-model="tabs"
          color="transparent"
          slider-color="deep-purple"
        >
          <span
            class="subheading font-weight-light mr-3"
            style="align-self: center"
          >
            Shortcodes:
          </span>
          <v-tab class="mr-3">
            <v-icon class="mr-2">
              build
            </v-icon>
            List
          </v-tab>
          <v-tab class="mr-3">
            <v-icon class="mr-2">
              whatshot
            </v-icon>
            Keyword
          </v-tab>
          <v-tab>
            <v-icon class="mr-2">
              star
            </v-icon>
            Reserved
          </v-tab>
        </v-tabs>
      </v-flex>
      <v-card-title>
        <span class="title">
          ShortCode Totals 
          <v-text-field
            append-icon="search"
            label="Quick Search"
            class="purple-input"
            single-line
            hide-details
          />
        </span>
        <v-spacer />
        <span v-if="tabs === 0">
          <v-btn  
            class="v-btn--simple"
            color="light-green darken-2"
            round
          >
            +SHORTCODE            
          </v-btn>
          <v-btn 
            class="v-btn--simple"
            color="secondary"
            circle
            icon
            @click.native="reloadShortcodes"
          >
            <v-icon>
              refresh
            </v-icon>      
          </v-btn>
        </span>
        <v-btn
          v-if="tabs === 1" 
          class="v-btn--simple"
          color="secondary"
          circle
          icon
          @click.native="reloadKeywords"
        >
          <v-icon>
            refresh
          </v-icon>      
        </v-btn>
        <span v-if="tabs === 2">
          <v-btn
            class="v-btn--simple"
            color="deep-purple darken-2"
            round
            @click.stop="addKeywordDialog = !addKeywordDialog"
          >
            +KEYWORD         
          </v-btn>
          <v-btn 
            class="v-btn--simple"
            color="primary"
            circle
            icon
            @click.native="refreshReservedList"
          >
            <v-icon>
              refresh
            </v-icon>      
          </v-btn>
        </span>
      </v-card-title>

      <v-tabs-items v-model="tabs">
        <v-tab-item :value="0">
          <!-- shortcode list -->
          <v-list three-line>
            <template v-for="(item, index) in shortcodeList">
              <v-list-tile 
                :key="index"
                ripple
              >
                <v-list-tile-content>
                  <v-list-tile-title>Shortcode: {{ item.shortcode }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    Sender Name:
                    <v-chip
                      v-for="i in item.sendername" 
                      :key="i"
                      class="light-green lighten-1 white--text caption font-weight-thin"
                    >
                      {{ i }}
                    </v-chip>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
                <v-list-tile-action>
                  <v-btn 
                    icon 
                    ripple
                  >
                    <v-icon color="grey lighten-1">
                      edit
                    </v-icon>
                  </v-btn>
                </v-list-tile-action>
              </v-list-tile>
              <v-divider 
                v-if="index + 1 < shortcodeList.length" 
                :key="`divider-${index}`"
              />
            </template>
          </v-list>
        </v-tab-item>
        <v-tab-item :value="1">
          <!-- keyword list -->
          <v-list three-line>
            <template v-for="(item, index) in keywordList">
              <v-list-tile 
                :key="index"
                ripple
              >
                <v-list-tile-content>
                  <v-list-tile-title>Shortcode: {{ item.shortcode }}</v-list-tile-title>
                  <v-list-tile-sub-title>
                    Keywords:
                    <v-chip
                      v-for="k in item.keywords" 
                      :key="k"
                      class="light-green lighten-1 white--text caption font-weight-thin"
                    >
                      {{ k }}
                    </v-chip>
                  </v-list-tile-sub-title>
                </v-list-tile-content>
              </v-list-tile>
              <v-divider 
                v-if="index + 1 < keywordList.length" 
                :key="`divider-${index}`"
              />
            </template>
          </v-list>
        </v-tab-item>
        <v-tab-item :value="2">
          <!-- keyword reserved -->
          <v-list three-line>
            <v-list-tile 
              v-for="item in keywordReservedList"
              :key="item.shortcode"
            >
              <v-list-tile-content>
                <v-list-tile-title>{{ item.shortcode }}</v-list-tile-title>
                <v-list-tile-sub-title>
                  Keywords:
                  <v-chip
                    v-for="i in item.keywords" 
                    :key="i"
                    class="deep-purple lighten-1 white--text caption font-weight-thin"
                  >
                    {{ i }}
                  </v-chip>
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
        </v-tab-item>
      </v-tabs-items>
    </base-card>
    <!-- Pop up Panels -->
    <form-add-keyword
      :add-keyword-dialog="addKeywordDialog" 
      @emitCloseKeywordDialog="addKeywordDialog=arguments[0]"
    />
    <form-add-shortcode
      :add-keyword-dialog="addShortcodeDialog" 
      @emitCloseShortcodeDialog="addShortcodeDialog=arguments[0]"
    />
    <BaseDialog 
      :dialog="dialog" 
      :dialog-title="`Hey`" 
      :dialog-text="`Yo`"
      @onConfirm="onConfirm" 
      @onCancel="onCancel"
    />
  </base-helper-offset>
</template>

