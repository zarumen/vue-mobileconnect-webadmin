<script>
import Layout from '@layouts/main'
import { mapGetters, mapActions } from 'vuex'
import { campaignComputed } from '@state/helpers'
import firestoreApp from "@utils/firestore.config"
import axios from 'axios';

export default {
  page: {
    title: 'Reports',
    meta: [{ name: 'description', content: 'Campaigns Report Viewer' }],
  },
  components: { Layout },
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      baseModule: 'reportViewer',
      left: true,
      timeout: 2000,
      exportJobs: [],
      s3downloadlink: ''
    }
  },
  computed: {
    ...campaignComputed,
    ...mapGetters('campaigns', [
      'hadCampaignList',
    ]),
    authLevel () {
      // set Auth Level before send to Query
      if(this.user.organizationAuth === 'Level1')
        return this.user.organizationLevel1
      
      if(this.user.organizationAuth === 'Level2')
        return this.user.organizationLevel2
      
      if(this.user.organizationAuth === 'Level3')
        return this.user.organizationLevel3
    }
  },
  watch: {

  },
  created () {
    // query by auth user specific
    if(!this.hadCampaignList) {
      this.reloadData()
    }
  },
  methods: {
    ...mapActions('campaigns', [
      'getCampaignsByOrg',
    ]),
    print() {
      window.print()
    },
    exitSnackbar () {
      this.$store.commit('campaigns/setSnackbar', { snackbar: false })
      this.$store.commit('campaigns/setNotice', { notice: '' })
    },
    reloadData () {
      this.getCampaignsByOrg({
        auth: this.user.organizationAuth, 
        orgId: this.authLevel
      })
    },
    createExportJob(campaignId,filename,maxRow,type){
      // สั่งให้สร้าง Zip file ใหม่
      // 2Do: ทำ API Config สำหรับ Config Staging Version
      axios.post(`https://api.sms2mkt.com/2waysms/staging/jobs/${campaignId}/export`,
          {
                  "maxRow": maxRow,
                  "exportType": type,
                  "fileName": filename
          }
        ,{
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          // JSON responses are automatically parsed.
          this.parsedData = response.data
          console.log(this.parsedData.output)

          let exportJobObject = {"fileName": this.parsedData.output.S3FileName,"type": type }
          let result = [] 
          try{
              result = firestoreApp
                .collection('exportJobs').doc(campaignId).collection('jobs')
                .add(exportJobObject)

                this.getFirebaseExportJobsByCampaign(campaignId)
          } catch (error) { console.log(error)}
        })
        .catch(e => {
          this.errors.push(e)
        })
    },
    async getAWSExportJobsListByCampaign(campaignId){
      // 2Do: ทำ API Config สำหรับ Config Staging Version
      //JobsList[campainId][filename][key for path]
      
      return await axios.post(`https://api.sms2mkt.com/2waysms/staging/jobs/${campaignId}/list`,
          {
            "maxFile":100,
            "prefixFile": "",
            "startAfter": ""
          }
        ,{
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => {
          // JSON responses are automatically parsed.
          this.parsedData = response.data

          let joblist = []
          this.parsedData.output.File.Contents.forEach(function(item) {

            let filename = item.Key.substr(39,item.Key.length-39)

            joblist[filename] = []
            joblist[filename] = item.Key
          });

          return joblist
        })
        .catch(e => {
          console.log(e)
        })
    },
    getS3DownloadLink(campaignId,key){
      // 2Do: ทำ API Config สำหรับ Config Staging Version
      //JobsList[campainId][filename][key for path]
      
      axios.get(`https://api.sms2mkt.com/2waysms/staging/jobs/${campaignId}/download?downloadKey=${key}`)
        .then(response => {
          // JSON responses are automatically parsed.
          this.parsedData = response.data
          console.log(this.parsedData.output.link)

          window.location = this.parsedData.output.link

          //return  this.parsedData.output.link
        })
        .catch(e => {
          console.log(e)
        })
    },
    async getFirebaseExportJobsByCampaign(campaignId,awsjoblist) {
      // Get generated files list from firebase
      let tmp
      try {
      tmp = await firestoreApp
        .collection('exportJobs').doc(campaignId).collection('jobs')
        .get()

        } catch (error) { console.log(error)}

        this.exportJobs[campaignId] = []
        let jobtmp = []
        tmp.forEach(function(item) {
          let data = {}
          data = item.data()
          data['id'] = item.id
          if(awsjoblist[data.fileName]){
            data['key'] = awsjoblist[data.fileName]  
          }
          
          jobtmp.push(data);
        });

        this.exportJobs[campaignId].push(jobtmp)  
        this.$forceUpdate()

    },
    test(campaignId){
      this.getAWSExportJobsListByCampaign(campaignId).then((result)=>{
        console.log(result)
      })
    }
  },
}
</script>

<template>
  <Layout>
    <v-container fluid>
      <v-flex xs12>
        <base-card
          color="light-green"
          title="Report All Campaign"
        >
          <!-- Controller Tools Panels -->
          <v-card-title>
            <span class="title">
              Campaigns {{ pagination? "("+pagination.totalItems+")": "" }}
              <v-text-field
                append-icon="search"
                label="Quick Search"
                single-line
                hide-details
              />
            </span>
            <v-spacer/>
            <v-btn 
              class="v-btn--simple"
              color="primary"
              circle
              icon
              @click.native="reloadData()"
            >
              <BaseIcon name="syncAlt"/>            
            </v-btn>
          </v-card-title>
          <!-- Insert in Base-Table Component -->
          <v-card-text>
            <v-list three-line>
              <v-list-group
                v-for="(item,index) in items"
                :key="index"
              >
                <v-list-tile 
                  slot="activator" 
                >
                  <v-list-tile-content 
                    @click="getAWSExportJobsListByCampaign(item.id).then((result)=>{
                              getFirebaseExportJobsByCampaign(item.id,result)
                            })"
                  >
                    <v-list-tile-title>
                      {{ item.campaignName }} : {{ item.campaignCode }}
                    </v-list-tile-title>
                    <v-list-tile-sub-title >
                      {{ item.id }}
                    </v-list-tile-sub-title>
                  </v-list-tile-content>      
                  <div class="d-flex">
                    <v-tooltip
                      top
                      content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="secondary"
                        icon
                        @click="createExportJob(item.id,item.campaignCode,100000,'XLSX')"
                      >
                        <v-icon>view_comfy</v-icon>
                      </v-btn>
                      <span>Excel</span>
                    </v-tooltip>
                    <!--                     <v-tooltip
                      top
                      content-class="top">
                      <v-btn
                        slot="activator"
                        class="v-btn--simple"
                        color="secondary"
                        icon
                        @click="test(item.id)"
                      >
                        <v-icon>settings_ethernet</v-icon>
                      </v-btn>
                      <span>Json</span>
                    </v-tooltip> -->
                  </div>
                </v-list-tile>
                <v-divider 
                  v-if="index + 1 < items.length" 
                  :key="`divider-${index}`"
                />
                <!--  subList -->
                <template v-if="exportJobs[item.id]">
                    <v-list-tile-content 
                      v-for="(job) in exportJobs[item.id][0]" 
                      :key="job.id"
                    >
                    <div class="d-flex">
                      <v-list-tile-sub-title>
                        Type: {{ job.type }}
                      </v-list-tile-sub-title >
                      <v-list-tile-sub-title class="d-flex">
                        {{ job.fileName }}
                      </v-list-tile-sub-title>
                      <v-tooltip
                        top
                        content-class="top">
                        <v-btn
                          slot="activator"
                          :disabled="!job.key"
                          class="v-btn--simple"
                          color="secondary"
                          icon
                          @click="getS3DownloadLink(item.id,job.key)"
                        >
                          <v-icon>widgets</v-icon>
                        </v-btn>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </v-list-tile-content>
                </template>
              </v-list-group>
            </v-list>
          </v-card-text>

        </base-card>
      </v-flex>
      <v-snackbar 
        v-if="loading===false" 
        :left="true" 
        :timeout="timeout" 
        :color="mode" 
        v-model="snackbar"
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
    </v-container>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

