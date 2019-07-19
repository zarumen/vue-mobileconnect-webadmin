<script>
import { fireStorageApp } from '@utils/firestorage.config'

var storageRef = fireStorageApp.ref()

export default {
  page: {
    title: 'Regex',
    meta: [{ name: 'description', content: 'Regex' }],
  },
  components: { 
    Layout: () => import('@layouts/main')
  },
  data: () => ({
    couponGenDialog: '',
    digits: 0,
    totals: 0,
    result: [],
    imageName: '',
    imageUrl: '',
    fileXLSName: [],
    fileXLSUrl: [],
    xlsFileType: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
  }),
  methods: {
    pickFile () {
      this.$refs.image.click ()
    },
    pickXLSFile () {
      this.$refs.xls.click ()
    },
    onFilePicked (e) {
      const files = e.target.files
      console.log(files)
      if(files.length > 0) {
        this.imageName = files[0].name
        console.log(this.imageName)
				if(this.imageName.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.imageUrl = fr.result
          this.imageFile.push(files[0]) // this is an image file that can be sent to server...
          this.imageName.push(files[0].name)

          console.log('in the listener:',this.imageName)
          
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
    },
    onXlsPicked (e) {
      const xfiles = e.target.files
      console.log(xfiles)
      this.fileXLSName = xfiles[0].name
      if (this.fileXLSName.lastIndexOf('.') <= 0) {
        return
      }

      const fileReader = new FileReader()
      fileReader.readAsDataURL(xfiles[0])
      fileReader.addEventListener('load', () => {
        this.fileXLSUrl = fileReader.result
        console.log(this.fileXLSUrl)
      })
    },
    updatedarrayName (e) {
      this.fileXLSName.push(e)
    },
    updatearrayUrl (e) {
      this.fileXLSUrl.push(e)
    },
    sendToStorage () {
      this.fileXLSName.forEach((file, index) => {

        let ref = storageRef.child(`sunsmile/${index}-${file}`)

        ref.putString(this.fileXLSUrl[index], 'data_url')
          .then((snapshot) => {
          console.log('Uploaded a data_url string!')
        })

      })
    },
    dec2hex (dec) {
      return ('0' + dec.toString(36)).substr(-2)
    },
    clickedGen () {
      for(let i = 0; i < this.totals; i++){
        this.result.push(this.generateId(this.digits))
      }

      let csvContent = 'data:text/csv;charset=utf-8,'

      this.result.forEach((rowArray) => {
          csvContent += rowArray + "\r\n";
      })

      let encodedUri = encodeURI(csvContent)

      this.fileXLSName.push('file_generated.csv')
      this.fileXLSUrl.push(encodedUri)

      this.couponGenDialog = !this.couponGenDialog

      return encodedUri
    },
		// generateId :: Integer -> String
    generateId (len) {
      let arr = new Uint8Array((len || 40) / 2)
      window.crypto.getRandomValues(arr)
      return Array.from(arr, this.dec2hex).join('')
    }
  }
}
</script>

<template>
  <Layout>
    <base-button
      large
      class="mx-0 font-weight-light"
      color="success"
      href="https://materialdesignicons.com/"
      target="_blank"
      rounded
    >
      <v-icon left>
        code
      </v-icon>
      <span>See all icons</span>
    </base-button>
    <div>
      <base-button
        v-model="imageName"
        color="secondary"
        rounded
        @click="pickFile"
      >
        <v-icon left>
          attach_file
        </v-icon>
        Upload Image
      </base-button>
      <v-text-field
        v-model="imageName"
        label="Select Image"
        disabled
        prepend-icon="image"
      />
      <input
        ref="image"
        type="file"
        style="display: none"
        accept="image/*"
        @change="onFilePicked"
      >
      <img
        v-if="imageUrl"
        :src="imageUrl"
        height="200"
      >
    </div>
    <div>
      <base-button
        color="primary"
        class="white--text"
        rounded
        small
        @click.native="pickXLSFile"
      >
        <v-icon 
          left 
          dark
        >
          attachment
        </v-icon>
        Add File
      </base-button>
      <input
        ref="xls"
        type="file"
        style="display: none"
        :accept="xlsFileType"
        @change="onXlsPicked"
      >
      {{ fileXLSName }}
    </div>
    <div>
      <base-button
        color="primary"
        rounded
        fab
        @click="sendToStorage"
      >
        <v-icon 
          dark
        >
          cloud_upload
        </v-icon>
      </base-button>
    </div>
    <div>
      <BaseUploadfield
        :accept="xlsFileType"
        :disabled="false"
        :label="`Coupon File Upload`"
        @input="updatedarrayName"
        @formData="updatearrayUrl"
      />
    </div>
    <base-button
      color="blue-grey"
      class="white--text"
      rounded
      @click="couponGenDialog = !couponGenDialog"
    >
      Generated
    </base-button>
    <v-dialog
      v-model="couponGenDialog"
      max-width="500px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">
            Create Coupons
          </span>
        </v-card-title>

        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="digits"
                  label="Digits"
                />
              </v-flex>
              <v-flex
                xs12
                sm6
                md4
              >
                <v-text-field
                  v-model="totals"
                  label="Totals"
                />
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <base-button
            color="primary"
            rounded
            @click="couponGenDialog = !couponGenDialog"
          >
            Cancel
          </base-button>
          <base-button
            class=""
            color="primary"
            rounded
            @click="clickedGen"
          >
            Generated
          </base-button>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

