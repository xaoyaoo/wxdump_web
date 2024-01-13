<script setup lang="ts">
import ChatRecprdsHeader from '@/components/messages/ChatRecprdsHeader.vue';
import ChatRecordsMain from '@/components/messages/ChatRecordsMain.vue';
import { ref, defineProps, nextTick } from 'vue';

interface User {
  account: string
  describe: string
  headImgUrl: string
  nickname: string
  remark: string
  username: string
  chat_count: number
}

const props = defineProps({
  userData: {
    type: Object as () => User,
    required: true,
  }
});

const scrollbarRef = ref(null);
const chatRecordsMainRef = ref(null);
const scrollTop = ref(0);
const scrollHeight = ref(0);

const scrollToBottom = () => {
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

function handleScroll({ scrollTop }) {
  if (scrollTop === 0) {
    if (chatRecordsMainRef.value) {
      chatRecordsMainRef.value.loadMore()
    }
  }
}

</script>

<template>
  <el-container>
    <el-header style="height: 65px; max-height: 65px; width: 100%;background-color: #d2d2fa;padding-top: 5px;">
      <ChatRecprdsHeader :userData="userData"/>
    </el-header>

    <el-main style="overflow-y: auto; height: calc(100vh - 65px);padding: 0">
      <el-scrollbar ref="scrollbarRef" @scroll="handleScroll">
        <ChatRecordsMain
            ref="chatRecordsMainRef"
            :userData="userData"
            :setScrollTop="scrollToBottom"
            :updateScrollTop="updateScrollTop"
        />
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>
