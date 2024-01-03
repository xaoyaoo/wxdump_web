<template>
  <div id="message_img_l">
    <div class="wp" ref="img">
      <img
        :src="url"
        alt=""
      />
      <div class="top"></div>
      <div class="cen"></div>
      <div class="bottom"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['src'],
  data() {
    return {
      url: '#'
    }
  },
  mounted() {
    let newImg = new Image()
    newImg.src = this.src
    newImg.onload = () => {
      this.url = newImg.src
      let width = newImg.width
      let height = newImg.height
      console.log(width, height)
      if (width > height && width > 120) {
        this.$refs.img.style.width = '120px'
        let h = height * (120 / width)
        if (h < 35) {
          h = 35
        }
        this.$refs.img.style.height = h + 'px'
      } else if (height > width && height > 100) {
        this.$refs.img.style.height = '100px'
        let w = width * (100 / height)
        if (w < 35) {
          w = 35
        }
        this.$refs.img.style.width = w + 'px'
      }
    }
  },
  methods: {
    load() {
      console.log('图片一家在')
    }
  }
}
</script>

<style scoped lang="scss">
#message_img_l {
  .wp {
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    border-top-right-radius: 5px;
    border-bottom-right-radius: 5px;
  }
  .top {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 18px;
    border: 5px solid;
    border-color: #f5f5f5;
    border-right-color: transparent;
    border-bottom-color: transparent;
  }
  .cen {
    position: absolute;
    left: 0;
    top: 19px;
    width: 0;
    height: 100%;
    border: 5px solid;
    border-color: #f5f5f5;
    border-right-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }

  .bottom {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 0;
    border: 5px solid;
    border-color: #f5f5f5;
    border-right-color: transparent;
    border-top-color: transparent;
  }
}
</style>