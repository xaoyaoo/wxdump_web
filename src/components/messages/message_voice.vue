<template>
  <div id="message_voice">
    <div class="len" v-if="_direction == 'right'">{{this.data}}"</div>
    <div class="content" ref="content" :class="_direction">
      <div class="body">
        <span v-if="_direction=='right'" class="icon-voice_r"></span>
        <span v-else class="icon-voice_l"></span>
      </div>
      <div class="arrows" :class="_direction">
      </div>
    </div>
    <div class="len" v-if="_direction == 'left'">{{this.data}}"</div>
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
#message_voice {
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
      .icon-voice_r {
        width: 100%;
        text-align: right;
        font-size: 16px;
        color: #8f8f8f;
      }
      .icon-voice_l {
        width: 100%;
        text-align: left;
        font-size: 18px;
        color: #8f8f8f;
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

  .len {
    margin: 0 10px;
    color: #8f8f8f;
    font-size: 13px;
  }
}
</style>