<template>
  <div id="message_video_call">
    <div class="content" ref="content" :class="_direction">
      <div class="body">
        <span v-if="_direction=='right'" class="right">
          <span>通话时长 {{data.len}}</span>
          <span class="icon-video_0"></span>
        </span>
        <span v-else class="left">
          <span class="icon-video_0"></span>
          <span>通话时长 {{data.len}}</span>
        </span>
      </div>
      <div class="arrows" :class="_direction">
      </div>
    </div>
  </div>
</template>

<script>
import constant from '@/constant.js'
export default {
  props: ['data', 'direction'],
  data() {
    return {
      constant: constant
    }
  },
  computed: {
    _direction() {
      return this.direction == 2 ? 'left' : 'right'
    }
  },
  mounted() {
    this.$refs.content.style.width = this.data * 5 + 'px'
  }
}
</script>

<style scoped lang="scss">
#message_video_call {
  display: flex;
  align-items: center;
  .content {
    display: inline-block;
    position: relative;
    height: 35px;
    border-radius: 4px;
    background-color: #9eea6a;
    padding: 10px;
    font-size: 14px;
    font-weight: 500;
    min-width: 76px;
    max-width: 230px;

    .body {
      height: 100%;
      display: flex;
      flex-direction: column;
      .left,
      .right {
        display: flex;
        align-items: center;
        span:first-child {
          margin-right: 12px;
        }
      }
      .left {
        .icon-video_0 {
          color: #afafaf;
          font-size: 16px;
        }
      }
      .right {
        .icon-video_0 {
          color: #66b92e;
          font-size: 16px;
        }
      }
    }

    .arrows {
      position: absolute;
      top: 12px;
      width: 0;
      height: 0;
      border: 5px solid;
    }

    .left {
      left: -10px;
      border-color: transparent #9eea6a transparent transparent;
    }

    .right {
      right: -10px;
      border-color: transparent transparent transparent #9eea6a;
    }
  }

  > .left {
    background-color: white;
    > .left {
      border-color: transparent white transparent transparent;
    }
  }
}
</style>