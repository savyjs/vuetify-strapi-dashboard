<template>
  <div>
    <client-only>
      <lottie-player :options="getOptions" :src="animationJSON"/>
    </client-only>
  </div>
</template>
<script>

  export default {
    props: ['path', 'speed', 'width', 'loop', 'options'],
    data() {
      return {}
    },
    computed: {
      getOptions() {
        return {
          src: this.animationJSON,
          autoplay: true,
          speed: _.get(this, 'speed', 1),
          loop: _.get(this, 'loop', true),
          width: _.get(this, 'width', '150px'),
          ..._.get(this, 'options', {})
        }
      },
      animationData() {
        return `~/assets/lottie/${this.path}`;
      },
      animationJSON() {
        return `/lottie/${this.path}`;
      }
    }
  }
</script>
