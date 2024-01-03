<template>
  <div id="message_file">
    <div class="content">
      <div class="body">
        <section>
          <div>
            <div class="name">{{data.name}}</div>
            <div class="size">{{data.size}}</div>
          </div>
          <img class="icon" :src="data.icon" alt="">
        </section>
        <footer>
          <span>微信电脑版</span>
        </footer>
      </div>
      <div class="arrows" :class="_direction">
      </div>
    </div>
  </div>
</template>

<script>
import constant from '../../constant'
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
  created() {
    switch (this.data.file_type) {
      case constant.FILE_TYPE_UNKNOWN:
        this.data.icon = require('../../assets/ic_file_unnkonwn.png')
        break
      case constant.FILE_TYPE_TEXT:
        this.data.icon = require('../../assets/ic_file_text.png')
        break
      case constant.FILE_TYPE_EXCEL:
        this.data.icon = require('../../assets/ic_file_excel.png')
        break
      case constant.FILE_TYPE_WORD:
        this.data.icon = require('../../assets/ic_file_word.png')
        break
      case constant.FILE_TYPE_ZIP:
        this.data.icon = require('../../assets/ic_file_zip.png')
        break
      case constant.FILE_TYPE_PDF:
        this.data.icon = require('../../assets/ic_file_pdf.png')
        break
    }
  }
}
</script>

<style scoped lang="scss">
#message_file {
  border: 1px solid #efefef;
  border-radius: 4px;
  .content {
    cursor: pointer;
    display: inline-block;
    position: relative;
    height: 96px;
    width: 220px;
    border-radius: 4px;
    background-color: white;
    font-size: 14px;
    font-weight: 500;

    .body {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
    }
    .body > section {
      width: 220px;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-left: 14px;
      padding-right: 24px;
      > div {
        .name {
          width: 140px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .size {
          font-size: 12px;
          margin-top: 8px;
          color: #a5a5a5;
        }
      }
    }

    .body > footer {
      flex: 1;
      background-color: #fcfcfc;
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
      border-color: transparent #fff transparent transparent;
    }

    .right {
      right: -10px;
      border-color: transparent transparent transparent #fff;
    }
  }
  .content:hover {
    background-color: #fafafa;
  }
}
</style>