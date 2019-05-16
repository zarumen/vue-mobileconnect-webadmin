<script>
import { fireStorageApp } from '@utils/firestorage.config'
import Layout from '@layouts/main'

var storageRef = fireStorageApp.ref()

export default {
  page: {
    title: 'Regex',
    meta: [{ name: 'description', content: 'Regex' }],
  },
  components: { Layout },
  data: () => ({
    imageName: '',
    imageUrl: '',
  }),
  methods: {
    pickFile () {
      this.$refs.image.click ()
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
          this.imageFile = files[0] // this is an image file that can be sent to server...
          this.imageName = files[0].name

          console.log('in the listener:',this.imageName)
          let ref = storageRef.child(`sunsmile/${this.imageName}`)

          ref.putString(this.imageUrl, 'data_url')
            .then((snapshot) => {
            console.log('Uploaded a data_url string!')
          })
				})
			} else {
				this.imageName = ''
				this.imageFile = ''
				this.imageUrl = ''
			}
    }
  }
}
</script>

<template>
  <Layout>
    <v-btn
      large
      class="mx-0 font-weight-light"
      color="success"
      href="https://materialdesignicons.com/"
      target="_blank"
      round
    >
      <v-icon left>
        code
      </v-icon>
      <span>See all icons</span>
    </v-btn>
    <div>
      <v-btn
        v-model="imageName"
        color="secondary"
        class="v-btn--simple"
        round
        @click="pickFile"
      >
        <v-icon left>
          attach_file
        </v-icon>
        Upload File
      </v-btn>
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
    </div>
    <div>
      <img
        v-if="imageUrl"
        :src="imageUrl"
        height="200"
      >
    </div>
  </Layout>
</template>

<style lang="scss" module>
@import '@design';
</style>

