<template>
  <div id="message_text">
    <div class="content">
      <div class="body">
        <section>
          <span v-if="data.type==constant.TRANSFER_PUBLISH" class="icon-transition"></span>
          <span v-else class="icon-confirm"></span>
          <div>
            <div class="msg" v-if="data.type==constant.TRANSFER_PUBLISH">{{data.msg || '点击确认收钱'}}</div>
            <div class="msg" v-else>已收钱</div>
            <div class="num">￥{{data.num}}</div>
          </div>
        </section>
        <footer>
          <span>微信转账</span>
          <span class="icon-safe"></span>
        </footer>
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
  }
}
</script>

<style scoped lang="scss">
#message_text {
  border: 1px solid #efefef;
  border-radius: 4px;
  .content {
    cursor: pointer;
    display: inline-block;
    position: relative;
    height: 96px;
    width: 220px;
    border-radius: 4px;
    background-color: #fa9c3e;
    font-size: 14px;
    font-weight: 500;

    .body {
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .body > section {
      height: 72px;
      display: flex;
      align-items: center;
      padding: 0 18px;
      .icon-transition {
        height: 40px;
        width: 40px;
        border: 2px solid #fff;
        border-radius: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #fff;
        font-size: 20px;
        margin-right: 8px;
      }
      .icon-confirm {
        height: 40px;
        width: 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 40px;
        color: #fff;
        margin-right: 8px;
      }
      > div {
        .msg {
          font-size: 14px;
          color: #fff;
        }
        .num {
          font-size: 14px;
          color: #fff;
          margin-top: 8px;
        }
      }
    }

    .body > footer {
      flex: 1;
      background-color: white;
      display: flex;
      align-items: center;
      padding-left: 18px;
      padding-right: 12px;
      font-size: 11px;
      color: #a5a5a5;
      justify-content: space-between;
      .icon-safe {
        font-size: 18px;
        color: #e5e5e5;
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
      border-color: transparent #fa9c3e transparent transparent;
    }

    .right {
      right: -10px;
      border-color: transparent transparent transparent #fa9c3e;
    }
  }
}
</style>