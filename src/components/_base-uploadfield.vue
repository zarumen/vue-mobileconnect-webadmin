<script>
export default {
  props: {
    value: {
      type: [Array, String],
      default: ''
    },
    accept: {
      type: String,
      default: "*"
    },
    label: {
      type: String,
      default: "Choose a Files..."
    },
    required: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
        filename: '',
        fileUrl: ''
    };
  },
  watch: {
    value(v){
        this.filename = v;
    }
  },
  mounted() {
    this.filename = this.value;
  },

  methods: {
    onFocus () {
      this.$refs.fileInput.click();
    },
    onFileChange ($event) {
      const files = $event.target.files || $event.dataTransfer.files;

      if (files.length > 0) {
        this.filename = files[0].name
        console.log(this.filename)
				if(this.filename.lastIndexOf('.') <= 0) {
					return
				}
				const fr = new FileReader ()
				fr.readAsDataURL(files[0])
				fr.addEventListener('load', () => {
					this.fileUrl = fr.result
          this.filename = files[0].name

          // up event to Parent Component
          this.$emit('input', this.filename);
          this.$emit('formData', this.fileUrl);

				})
      }
    }
  }
}
</script>

<template>
  <div>
    <v-text-field
      ref="fileTextField"
      v-model="filename"
      color="deep-purple"
      prepend-icon="attach_file"
      suffix="BROWSE"
      single-line
      :label="label"
      :required="required"
      :disabled="disabled"
      outline
      @click.stop="onFocus"
    />
    <input
      ref="fileInput"
      type="file"
      style="display: none"
      :accept="accept"
      :multiple="false"
      :disabled="disabled"
      @change="onFileChange"
    >
  </div>
</template>

