<script setup lang="ts">
import {defineProps, ref, onMounted, watch, nextTick} from "vue";
import http from '@/router/axios.js';
import MessageText from './MessageText.vue';
import MessageImg from './MessageImg.vue';
import MessageAudio from './MessageAudio.vue';

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

// 这里的 props 是从父组件传递过来的
const props = defineProps({
  userData: {
    type: Object as () => User,
    required: true,
  },
  setScrollTop: {
    type: Function,
    required: true,
  }
});


// 定义变量
const messages = ref([]);
const userlist = ref({});
const my_wxid = ref('');
const limit = ref(500);
const start = ref(0);
const hasScrolledToTop = ref(false);

// 获取聊天记录
const req = async (start: number, limit: number, username: string) => {
  try {
    const body_data = await http.post('/api/msgs', {
      'start': start,
      'limit': limit,
      'wxid': username,
    });
    messages.value = body_data.msg_list;
    userlist.value = body_data.user_list;
    my_wxid.value = body_data.my_wxid;

    return body_data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

const fetchData = async () => {
  try {
    await req(start.value, limit.value, props.userData.username);
    if (!hasScrolledToTop.value) {
      await nextTick(() => {
        props.setScrollTop();
        hasScrolledToTop.value = false;
      });
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
};
// END 获取聊天记录

onMounted(fetchData); // 初始化时获取数据

// 监听 userData 中 username 的变化
watch(() => props.userData.username, (newUsername, oldUsername) => {
  // 执行你的函数
  // 调用你想执行的函数
  messages.value = [];
  hasScrolledToTop.value = false;
  fetchData();
});

// 这部分为构造消息的发送时间和头像
const _direction = (msg: any) => {
  if (msg.talker == '我') {
    msg.talker = my_wxid.value;
  }
  const sendname = (msg) => {
    if (!userlist.value.hasOwnProperty(msg.talker)) {
      return msg.talker;
    }

    if (userlist.value[msg.talker].remark) {
      return userlist.value[msg.talker].remark;
    } else if (userlist.value[msg.talker].nickname) {
      return userlist.value[msg.talker].nickname;
    } else if (userlist.value[msg.talker].account) {
      return userlist.value[msg.talker].account;
    } else {
      return msg.talker;
    }
  }
  return `${sendname(msg)} [${msg.type_name}] ${msg.CreateTime}`;
}

const get_head_url = (msg: any) => {
  if (msg.talker == '我') {
    msg.talker = my_wxid.value;
  }
  if (!userlist.value.hasOwnProperty(msg.talker)) {
    return '';
  }
  return userlist.value[msg.talker].headImgUrl;
}

// END 这部分为构造消息的发送时间和头像

// type_name_dict = {
//         (1, 0): "文本",
//         (3, 0): "图片",
//         (34, 0): "语音",
//         (43, 0): "视频",
//         (47, 0): "动画表情",
//
//         (49, 0): "文件",
//         (49, 1): "类似文字消息而不一样的消息",
//         (49, 5): "卡片式链接",
//         (49, 6): "文件",
//         (49, 8): "用户上传的 GIF 表情",
//         (49, 19): "合并转发的聊天记录",
//         (49, 33): "分享的小程序",
//         (49, 36): "分享的小程序",
//         (49, 57): "带有引用的文本消息",
//         (49, 63): "视频号直播或直播回放等",
//         (49, 87): "群公告",
//         (49, 88): "视频号直播或直播回放等",
//         (49, 2000): "转账消息",
//         (49, 2003): "赠送红包封面",
//
//         (50, 0): "语音通话",
//         (10000, 0): "系统通知",
//         (10000, 4): "拍一拍",
//         (10000, 8000): "系统通知"
//     }
//     # row_data = {"MsgSvrID": MsgSvrID, "type_name": type_name, "is_sender": IsSender, "talker": talker,
//     #             "room_name": StrTalker, "content": {"src": "", "msg": StrContent}, "CreateTime": CreateTime}
//  循环请求获取全部数据
const loadMore = async () => {
  let start1 = start.value + limit.value;
  let limit1 = limit.value;
  const body_data = await http.post('/api/msgs', {
    start: start1,
    limit: limit1,
    wxid: props.userData.username,
  });
  messages.value = messages.value.concat(body_data.msg_list);
  userlist.value = Object.assign(userlist.value, body_data.user_list);
};
defineExpose({
  loadMore
})
</script>

<template>
  <div id="chat">
    <div class="chat_body">
      <div class="chat_window" ref="chatWindow">
        <div class="message" v-for="(msg,index) in messages" :key="index">
          <!-- 文字消息 -->
          <MessageText v-if="msg.type_name == '文本'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                       :headUrl="get_head_url(msg)" :content="msg.content.msg"></MessageText>
          <!-- 图片消息 -->
          <MessageImg v-else-if="msg.type_name == '图片'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                      :headUrl="get_head_url(msg)" :src="msg.content.src"></MessageImg>
          <!-- 语音消息 -->
          <MessageAudio v-else-if="msg.type_name == '语音'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                        :headUrl="get_head_url(msg)" :src="msg.MsgSvrID" :msg="msg.content.msg"></MessageAudio>
        </div>
        <!--    加载更多    -->
        <div class="load_more" v-if="messages.length<userData.chat_count"
             style="display: flex; justify-content: center; margin-top: 10px;margin-bottom: 10px;">
          <el-button type="primary" @click="loadMore">加载更多</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>

#chat {
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #f5f5f5;
  display: flex;
  flex-direction: column;

  .chat_body {
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;

    .chat_window {
      height: 100%;
      overflow-y: scroll;
      width: calc(100% + 17px);
      padding: 0px;
      margin: 0px;

      > .message:last-of-type {
        margin-bottom: 8px;
      }
    }
  }
}
</style>
