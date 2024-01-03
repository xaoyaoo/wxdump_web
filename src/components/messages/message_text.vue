<template>
  <div id="message_text">
    <div class="content" :class="_direction">
      <!-- {{msg}} -->
      <div class="message" v-html="msg"></div>
      <div class="arrows" :class="_direction">
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['msg', 'direction'],
  computed: {
    _direction() {
      return this.direction == 2 ? 'left' : 'right'
    }
  }
}
</script>

<style scoped lang="scss">
#message_text {
  border: 1px solid #efefef;
  .content {
    display: inline-block;
    position: relative;
    border-radius: 4px;
    background-color: #9eea6a;
    padding: 8px 10px;
    font-size: 14px;
    font-weight: 500;
    max-width: 400px;
    .message {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      line-height: 1.5;
      img {
        margin: 0px 8px;
        width: 30px;
        height: 30px;
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
    background-color: #ffffff;
    .left {
      border-color: transparent #ffffff transparent transparent;
    }
  }
}
</style>