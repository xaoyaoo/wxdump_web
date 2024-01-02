<script setup lang="ts">
import ContactsList from '@/components/ContactsList.vue';

</script>

<template>

  <div id="chat_view" class="common-layout">
    <el-container>
      <!--  这是左边的list    -->
      <el-aside width="200px">
        <ContactsList/>
      </el-aside>
      <!--这是右边的具体聊天记录-->
      <el-container>
        <el-header>Header</el-header>
        <el-main>Main</el-main>
      </el-container>

    </el-container>
  </div>

</template>

<style scoped>

</style>