<template>
  <span>
  <v-file-input dense :loading="loader" :placeholder="placeholder || null " v-if="!url" filled :label="label"
                v-model="audio">
  </v-file-input>

    <v-banner single-line v-else>
      <audio v-if="" controls>
          <source :src="baseURL + url">
        </audio>
    فایل با موفقیت آپلود شد.
    <template v-slot:actions>
      <v-btn
        text
        icon
        @click="url=id=null"
        color="red accent-4"
      >
        <v-icon>delete</v-icon>
      </v-btn>
    </template>
  </v-banner>
    </span>
</template>
<script>

  export default {
    props: ['value', 'label', 'getId',  'getObj', 'placeholder'],
    data() {
      return {
        audio: null,
        uploaded: null,
        url: null,
        lazy: null,
        xs: null,
        obj: null,
        id: null,
        loader: false
      }
    },
    computed: {
      baseURL() {
        return process.env.API_URL;
      }
    },
    mounted() {
      if (this.value) {
        if (_.has(this.value, 'id')) {
          this.url = _.get(this.value, 'url', null)
          this.id = _.get(this.value, 'id', null)
        }
      }
    },
    watch: {
      url(val) {
        if (_.get(this, 'getId', false)) {
          this.$emit('input', this.id)
        } else {
          this.$emit('input', val)
        }
      },
      audio(val) {
        this.loader = true;
        let formData = new FormData();
        //formData.audio = val
        formData.append('files', val);
        this.strapi.upload(formData).then(result => {
          console.log({res})
          let res = _.get(result, 0, {});

          this.obj = {};
          if (_.has(res, 'url')) this.url = _.get(res, 'url', null)
          if (_.has(res, 'id')) this.id = _.get(res, 'id', null)

        }).catch(err => {
          console.log({err})
        }).finally(() => {
          this.loader = false;
        })
      }
    }
  }
</script>
