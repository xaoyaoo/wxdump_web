<script setup lang="ts">
import {defineProps, ref, onMounted, watch, nextTick, defineExpose} from "vue";
import http from '@/router/axios.js';
import MessageText from '@/components/messages/MessageText.vue';
import MessageImg from '@/components/messages/MessageImg.vue';
import MessageVideo from '@/components/messages/MessageVideo.vue';
import MessageAudio from '@/components/messages/MessageAudio.vue';
import MessageFile from '@/components/messages/MessageFile.vue';
import MessageEmoji from '@/components/messages/MessageEmoji.vue'
import MessageOther from "@/components/messages/MessageOther.vue";

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

interface UserList {
  [key: string]: User
}

interface msg {
  id: number
  type_name: string
  is_sender: number
  talker: string
  room_name: string
  content: {
    src: string
    msg: string
  }
  CreateTime: string
  MsgSvrID: string
}


const scrollbarRef = ref(null);
const chatRecordsMainRef = ref(null);
const scrollTop = ref(0);
const scrollHeight = ref(0);
const setScrollTop = () => {
  nextTick(() => {
    if (scrollbarRef.value) {
      // 假设el-scrollbar在DOM中是一个具体的元素
      const target = scrollbarRef.value.$el.children[0];
      if (target) {
        target.scrollTop = target.scrollHeight;
        scrollHeight.value = target.scrollHeight;
      }
    }
  });
};

const updateScrollTop = () => {
  const target = scrollbarRef.value.$el.children[0];
  if (target) {
    const lastScrollHeight = scrollHeight.value;
    const heightDiff = target.scrollHeight - lastScrollHeight;
    target.scrollTop = target.scrollTop + heightDiff;
    scrollHeight.value = target.scrollHeight;
  }
}

const userData = ref<User>({
  account: '',
  describe: '',
  headImgUrl: '',
  nickname: '',
  remark: '',
  username: 'wxid_lfiii0b1osu622',
  chat_count: 0,
});

// 定义变量
const messages = ref<msg[]>([]);
const userlist = ref<UserList>({});
const my_wxid = ref('');
const limit = ref(50);
const start = ref(0);
const hasScrolledToTop = ref(false);

// 获取聊天记录
// 在组件挂载后加载 JSON 文件
onMounted(async () => {
  try {
    const response1 = await fetch('./data/userdata.json');
    if (!response1.ok) {
      throw new Error('Failed to load JSON file');
    }

    console.log(response1);
    console.log("response1")
    const data1 = await response1.json();
    console.log(data1);
    userData.value = data1.myUserData;
    userlist.value = data1.userlist;

    const response2 = await fetch('./data/data.json');
    console.log(response2);
    if (!response2.ok) {
      throw new Error('Failed to load JSON file');
    }
     messages.value =  await response2.json();


  } catch (error) {
    console.error('Error loading JSON file:', error);
  }
});
// END 获取聊天记录

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

//  循环请求获取全部数据
const loadMore = async () => {
  let limit1 = limit.value;
  let start1 = start.value - limit1;
  const body_data = await http.post('/api/msgs', {
    start: start1,
    limit: limit1,
    wxid: userData.value.username,
  });
  start.value = start1;
  messages.value = body_data.msg_list.concat(messages.value);
  // 排序
  messages.value.sort((a, b) => {
    return a.id - b.id;
  });
  // 去重
  messages.value = messages.value.filter((item, index, array) => {
    return index === 0 || item.id !== array[index - 1].id;
  });
  userlist.value = Object.assign(userlist.value, body_data.user_list);

  await nextTick(() => {
    updateScrollTop()
  })
};

defineExpose({
  loadMore
})

</script>

<template>
  <div id="chat">
    <div class="chat_body">
      <div class="chat_window" ref="chatWindow">
        <!--    加载更多    -->
        <div class="load_more" v-if="messages.length<userData.chat_count"
             style="display: flex; justify-content: center; margin-top: 10px;margin-bottom: 10px;">
          <el-button type="primary" @click="loadMore">查看更多消息</el-button>
        </div>

        <div class="message" v-for="(msg,index) in messages" :key="index">
          <!-- 文字消息 -->
          <MessageText v-if="msg.type_name == '文本'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                       :headUrl="get_head_url(msg)" :content="msg.content.msg"></MessageText>
          <!-- 图片消息 -->
          <MessageImg v-else-if="msg.type_name == '图片'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                      :headUrl="get_head_url(msg)" :src="'/api/img?img_path='+msg.content.src"></MessageImg>
          <!-- 表情消息 -->
          <MessageEmoji v-else-if="msg.type_name == '动画表情'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                        :headUrl="get_head_url(msg)" :src="msg.content.src"></MessageEmoji>
          <!-- 视频消息 -->
          <MessageVideo v-else-if="msg.type_name == '视频'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                        :headUrl="get_head_url(msg)" :src="msg.content.src"></MessageVideo>
          <!-- 文件消息 -->
          <MessageFile v-else-if="msg.type_name == '文件'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                       :headUrl="get_head_url(msg)" :src="msg.content.src"></MessageFile>
          <!-- 语音消息 -->
          <MessageAudio v-else-if="msg.type_name == '语音'" :is_sender="msg.is_sender" :direction="_direction(msg)"
                        :headUrl="get_head_url(msg)" :src="'/api/'+msg.content.src"
                        :msg="msg.content.msg"></MessageAudio>
          <!-- 其他消息 -->
          <MessageOther v-else :is_sender="msg.is_sender" :direction="_direction(msg)" :headUrl="get_head_url(msg)"
                        :content="msg.content.msg"></MessageOther>

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
