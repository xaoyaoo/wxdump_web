<template>
  <div id="message_video_r">
    <div class="wp" ref="img">
      <img
        :src="url"
        alt=""
      />
      <div class="top"></div>
      <div class="cen"></div>
      <div class="bottom"></div>
    </div>
    <div class="meta">
      <span class="icon-play"></span>
      <span class="len">{{data.len}}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      url: '#'
    }
  },
  mounted() {
    let newImg = new Image()
    newImg.src = this.data.img
    newImg.onload = () => {
      this.url = newImg.src
      let width = newImg.width
      let height = newImg.height
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
  }
}
</script>

<style scoped lang="scss">
#message_video_r {
  cursor: pointer;
  position: relative;
  min-width: 80px;
  min-height: 80px;
  .wp {
    position: relative;
    overflow: hidden;
  }
  img {
    width: 100%;
    height: 100%;
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
  }
  .top {
    position: absolute;
    right: 0;
    top: 0;
    width: 0;
    height: 18px;
    border: 5px solid;
    border-color: #f5f5f5;
    border-left-color: transparent;
    border-bottom-color: transparent;
  }
  .cen {
    position: absolute;
    right: 0;
    top: 19px;
    width: 0;
    height: 100%;
    border: 5px solid;
    border-color: #f5f5f5;
    border-left-color: transparent;
    border-top-color: transparent;
    border-bottom-color: transparent;
  }

  .bottom {
    position: absolute;
    right: 0;
    bottom: 0;
    width: 0;
    border: 5px solid;
    border-color: #f5f5f5;
    border-left-color: transparent;
    border-top-color: transparent;
  }

  .meta {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon-play {
      color: #fff;
      font-size: 30px;
    }
    .len {
      position: absolute;
      right: 14px;
      bottom: 8px;
      color: #fff;
      font-size: 12px;
    }
  }
}
</style>