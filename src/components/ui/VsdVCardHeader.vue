<template>
  <div :style="`margin-top: ${getMargin};padding-bottom: ${getPadding}`">
    <v-card
      :color="color || 'primary'"
      :style="`
      display: flex;
      align-items: center;
      position:absolute;
      left: ${getLeft};
      right:0;
      justify-items: ${getJustify};
      justify-content: ${getJustify};
      text-align: ${getAlign};
      margin-right:${getMarginRight};
      padding-right:${getPaddingRight};
      width:${getWidth};
      margin-left:${getMarginLeft};
      margin-top: ${getMarginTop};
      height: ${getHeight};
      `"
      :tile="tile"
      :dark="dark || true"
      :class="`${classes} elevation-${getEelevation}`"
      :loading="loading"
    >
      <slot/>
    </v-card>
  </div>
</template>

<script>
export default {
  name: 'VCardHeader',
  props: ['value', 'icon', 'height', 'color', 'marginTop', 'marginBottom', 'left', 'loading', 'paddingRight', 'align', 'justify', 'classes', 'dark', 'width', 'elevation', 'tile', 'marginRight', 'marginLeft'],
  data() {
    return {}
  },
  computed: {
    getLeft() {
      if (this.left !== undefined) {
        return this.getMarginLeft
      } else {
        return 'auto'
      }
    },
    getWidth() {
      if (this.icon !== undefined) {
        return '60px'
      } else if (this.width) {
        return this.width;
      } else {
        return '80%'
      }
    },
    getEelevation() {
      if (this.elevation !== undefined) {
        return this.elevation
      } else {
        return '10'
      }
    },
    getAlign() {
      if (this.icon !== undefined) {
        return 'center'
      } else if (this.align) {
        return this.align;
      } else {
        return 'right'
      }
    },
    getJustify() {
      if (this.icon !== undefined) {
        return 'center'
      } else if (this.justify) {
        return this.justify;
      } else {
        return 'start'
      }
    },
    getPadding() {
      if (this.icon !== undefined) {
        return '20px'
      } else {
        return '40px'
      }
    },
    getPaddingRight() {
      if (this.paddingRight !== undefined) {
        return this.paddingRight
      } else if (this.icon !== undefined) {
        return 0;
      } else {
        return '20px'
      }
    },
    getMargin() {
      if (this.marginTop) {
        return this.marginTop;
      } else if (this.icon !== undefined) {
        return '60px'
      } else {
        return '80px'
      }
    },
    getMarginTop() {
      if (this.height !== undefined) {
        return (-1 * parseInt(this.height) / 2) + 'px';
      }
      if (this.icon !== undefined) {
        return '-30px'
      } else {
        return '-40px'
      }
    },
    getMarginBottom() {
      if (this.marginBottom) {
        return this.marginBottom;
      } else if (this.icon !== undefined) {
        return '-30px'
      } else {
        return '-40px'
      }
    },
    getHeight() {
      if (this.height !== undefined) {
        return this.height;
      }
      if (this.icon !== undefined) {
        return '60px'
      } else {
        return '80px'
      }
    },
    getMarginRight() {
      if (this.marginRight) {
        return this.marginRight;
      } else if (this.icon !== undefined) {
        return '5%'
      } else {
        return '10%'
      }
    },
    getMarginLeft() {
      if (this.marginLeft) {
        return this.marginLeft;
      } else if (this.icon !== undefined) {
        return 'auto'
      } else {
        return '5%'
      }
    }
  }
}
</script>

<style scoped>

</style>
