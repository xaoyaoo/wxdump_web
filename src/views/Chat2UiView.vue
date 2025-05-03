<template>
  <div class="chat-report">
    <!-- 头部信息 -->
    <header>
      <h1>{{ reportData.header.title }}</h1>
      <p class="date">{{ reportData.header.date }}</p>
      <div class="meta-info">
        <span>总消息数：{{ reportData.header.metaInfo.totalMessages }}</span>
        <span>活跃用户：{{ reportData.header.metaInfo.activeUsers }}</span>
        <span>时间范围：{{ reportData.header.metaInfo.timeRange }}</span>
      </div>
    </header>

    <!-- 1. 今日讨论热点 -->
    <section class="hot-topics">
      <h2>今日讨论热点</h2>
      <div class="topics-container">
        <div
          class="topic-card"
          v-for="(topic, index) in reportData.sections.hotTopics.items"
          :key="'topic-' + index"
        >
          <h3>{{ topic.name }}</h3>
          <div class="topic-category">{{ topic.category }}</div>
          <p class="topic-summary">{{ topic.summary }}</p>
          <div class="topic-keywords">
            <span
              class="keyword"
              v-for="(keyword, kIndex) in topic.keywords"
              :key="'keyword-' + kIndex"
              >{{ keyword }}</span
            >
          </div>
          <div class="topic-mentions">提及次数：{{ topic.mentions }}</div>
        </div>
      </div>
    </section>

    <!-- 2. 实用教程与资源分享 -->
    <section class="tutorials">
      <h2>实用教程与资源分享</h2>
      <div class="tutorials-container">
        <div
          class="tutorial-card"
          v-for="(tutorial, index) in reportData.sections.tutorials.items"
          :key="'tutorial-' + index"
        >
          <div class="tutorial-type">{{ tutorial.type }}</div>
          <h3>{{ tutorial.title }}</h3>
          <div class="tutorial-meta">
            <span class="shared-by">分享者：{{ tutorial.sharedBy }}</span>
            <span class="share-time">时间：{{ tutorial.time }}</span>
          </div>
          <p class="tutorial-summary">{{ tutorial.summary }}</p>
          <div class="key-points">
            <h4>要点：</h4>
            <ul>
              <li
                v-for="(point, pIndex) in tutorial.keyPoints"
                :key="'point-' + pIndex"
              >
                {{ point }}
              </li>
            </ul>
          </div>
          <div class="tutorial-link">
            <a :href="tutorial.url" class="link valid"
              >查看原文: {{ tutorial.domain }}</a
            >
          </div>
          <div class="tutorial-category">分类：{{ tutorial.category }}</div>
        </div>
      </div>
    </section>

    <!-- 3. 重要消息汇总 -->
    <section class="important-messages">
      <h2>重要消息汇总</h2>
      <div class="messages-container">
        <div
          class="message-card"
          v-for="(message, index) in reportData.sections.importantMessages
            .items"
          :key="'message-' + index"
        >
          <div class="message-meta">
            <span class="time">{{ message.time }}</span>
            <span class="sender">{{ message.sender }}</span>
            <span class="message-type">{{ message.type }}</span>
            <span class="priority" :class="'priority-' + message.priority"
              >优先级：{{ message.priority }}</span
            >
          </div>
          <p class="message-content">{{ message.content }}</p>
          <div class="message-full-content">
            <p>{{ message.fullContent }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- 4. 有趣对话或金句 -->
    <section class="interesting-dialogues">
      <h2>有趣对话或金句</h2>
      <div class="dialogues-container">
        <div
          class="dialogue-card"
          v-for="(dialogue, index) in reportData.sections.dialogues.items"
          :key="'dialogue-' + index"
        >
          <div class="dialogue-type">{{ dialogue.type }}</div>
          <div class="dialogue-content">
            <div
              class="message"
              v-for="(msg, mIndex) in dialogue.messages"
              :key="'msg-' + mIndex"
            >
              <div class="message-meta">
                <span class="speaker">{{ msg.speaker }}</span>
                <span class="time">{{ msg.time }}</span>
              </div>
              <p class="message-content">{{ msg.content }}</p>
            </div>
          </div>
          <div class="dialogue-highlight">{{ dialogue.highlight }}</div>
          <div class="dialogue-topic">
            相关话题：{{ dialogue.relatedTopic }}
          </div>
        </div>
      </div>
    </section>

    <!-- 5. 问题与解答 -->
    <section class="questions-answers">
      <h2>问题与解答</h2>
      <div class="qa-container">
        <div
          class="qa-card"
          v-for="(qa, index) in reportData.sections.qa.items"
          :key="'qa-' + index"
        >
          <div class="question">
            <div class="question-meta">
              <span class="asker">{{ qa.question.asker }}</span>
              <span class="time">{{ qa.question.time }}</span>
            </div>
            <p class="question-content">{{ qa.question.content }}</p>
            <div class="question-tags">
              <span
                class="tag"
                v-for="(tag, tIndex) in qa.question.tags"
                :key="'tag-' + tIndex"
                >{{ tag }}</span
              >
            </div>
          </div>
          <div class="answers">
            <div
              class="answer"
              v-for="(answer, aIndex) in qa.answers"
              :key="'answer-' + aIndex"
            >
              <div class="answer-meta">
                <span class="responder">{{ answer.responder }}</span>
                <span class="time">{{ answer.time }}</span>
                <span class="accepted-badge" v-if="answer.isAccepted"
                  >最佳回答</span
                >
              </div>
              <p class="answer-content">{{ answer.content }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 6. 群内数据可视化 -->
    <section class="analytics">
      <h2>群内数据可视化</h2>

      <!-- 话题热度 -->
      <h3>话题热度</h3>
      <div class="heatmap-container">
        <div
          class="heat-item"
          v-for="(heat, index) in reportData.sections.analytics.heatmap"
          :key="'heat-' + index"
        >
          <div class="heat-topic">{{ heat.topic }}</div>
          <div class="heat-percentage">{{ heat.percentage }}%</div>
          <div class="heat-bar">
            <div
              class="heat-fill"
              :style="`width: ${heat.percentage}%; background-color: ${heat.color};`"
            ></div>
          </div>
          <div class="heat-count">{{ heat.count }}条消息</div>
        </div>
      </div>

      <!-- 话唠榜 -->
      <h3>话唠榜</h3>
      <div class="participants-container">
        <div
          class="participant-item"
          v-for="(participant, index) in reportData.sections.analytics
            .chattyRanking"
          :key="'participant-' + index"
        >
          <div class="participant-rank">{{ participant.rank }}</div>
          <div class="participant-info">
            <div class="participant-name">{{ participant.name }}</div>
            <div class="participant-count">发言数：{{ participant.count }}</div>
            <div class="participant-characteristics">
              <span
                class="characteristic"
                v-for="(char, cIndex) in participant.characteristics"
                :key="'char-' + cIndex"
                >{{ char }}</span
              >
            </div>
            <div class="participant-words">
              <span
                class="word"
                v-for="(word, wIndex) in participant.commonWords"
                :key="'word-' + wIndex"
                >{{ word }}</span
              >
            </div>
          </div>
        </div>
      </div>

      <!-- 熬夜冠军 -->
      <h3>熬夜冠军</h3>
      <div class="night-owls-container">
        <div class="night-owl-item">
          <div class="owl-crown" title="熬夜冠军">👑</div>
          <div class="owl-info">
            <div class="owl-name">
              {{ reportData.sections.analytics.nightOwl.name }}
            </div>
            <div class="owl-title">
              {{ reportData.sections.analytics.nightOwl.title }}
            </div>
            <div class="owl-time">
              最晚活跃时间：{{
                reportData.sections.analytics.nightOwl.latestTime
              }}
            </div>
            <div class="owl-messages">
              深夜消息数：{{
                reportData.sections.analytics.nightOwl.messageCount
              }}
            </div>
            <div class="owl-last-message">
              {{ reportData.sections.analytics.nightOwl.lastMessage }}
            </div>
            <div class="owl-note">
              注：熬夜时段定义为23:00-06:00，已考虑不同时区
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 7. 词云 -->
    <section class="word-cloud">
      <h2>热门词云</h2>
      <div class="cloud-container">
        <div class="cloud-wordcloud" id="word-cloud">
          <span
            class="cloud-word"
            v-for="(word, index) in reportData.sections.wordCloud.words"
            :key="'word-' + index"
            :style="{
              left: getRandomPosition(600, word.text.length * 10) + 'px',
              top: getRandomPosition(400, 20) + 'px',
              fontSize: word.size + 'px',
              color: word.color,
              transform: `rotate(${word.rotation}deg)`,
            }"
            @mouseover="hoverWord(index)"
            @mouseout="unhoverWord(index)"
          >
            {{ word.text }}
          </span>
        </div>

        <div class="cloud-legend">
          <div
            class="legend-item"
            v-for="(item, index) in reportData.sections.wordCloud.legend"
            :key="'legend-' + index"
          >
            <span
              class="legend-color"
              :style="{ backgroundColor: item.color }"
            ></span>
            <span class="legend-label">{{ item.label }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- 8. 页面底部 -->
    <footer>
      <p>数据来源：{{ reportData.footer.dataSource }}</p>
      <p>
        生成时间：<span class="generation-time">{{
          reportData.footer.generationTime
        }}</span>
      </p>
      <p>统计周期：{{ reportData.footer.statisticalPeriod }}</p>
      <p class="disclaimer">{{ reportData.footer.disclaimer }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { apiAiUiJson, type AiUiJson } from "@/api/chat";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();

const reportData = ref({
  // header: {
  //   title: "群聊报告报告",
  //   date: "2025-04-29",
  //   metaInfo: {
  //     totalMessages: "35",
  //     activeUsers: "12",
  //     timeRange: "07:03:10 - 15:36:25",
  //   },
  // },
  // sections: {
  //   hotTopics: {
  //     items: [
  //       {
  //         name: "AI技术讨论",
  //         category: "科技",
  //         summary:
  //           "222",
  //         keywords: ["Qwen3", "Vidu", "AI相机"],
  //         mentions: "15",
  //       },
        
  //     ],
  //   },
  //   tutorials: {
  //     items: [
  //       {
  //         type: "TUTORIAL",
  //         title: "体验完刚上线的Vidu Q1，后劲有点大（附AI视频创作教程）",
  //         sharedBy: "苍何",
  //         time: "2025-04-29 09:39:42",
  //         summary:
  //           "分享Vidu Q1 AI视频创作工具的体验和教程，介绍其清晰度和一致性的提升。",
  //         keyPoints: ["AI视频清晰度提升", "一致性改进"],
  //         url: "http://mp.weixin.qq.com/s?__biz=MzU4NTE1Mjg4MA==&mid=2247493267&idx=1&sn=0189fb501578ce8e27142fbe2f590d03&chksm=fc9a946728c367005c19cb5a335300d05d51a441f9f20424a0a72c904a47bdf003252576318a&mpshare=1&scene=1&srcid=04297l70B2zsuypDfjUh0rh5&sharer_shareinfo=181efb947f938ab90786c776bf7bbda7&sharer_shareinfo_first=181efb947f938ab90786c776bf7bbda7#rd",
  //         domain: "mp.weixin.qq.com",
  //         category: "AI工具",
  //       },
  //       {
  //         type: "TUTORIAL",
  //         title: "阿里新出的夸克AI相机，强大到我有点陌生",
  //         sharedBy: "苍何",
  //         time: "2025-04-29 09:42:38",
  //         summary:
  //           "介绍夸克AI相机的新奇玩法和功能，展示其强大的AI图像处理能力。",
  //         keyPoints: ["新奇玩法", "抽象功能"],
  //         url: "http://mp.weixin.qq.com/s?__biz=MzU4NTE1Mjg4MA==&mid=2247493275&idx=1&sn=93556ddd1da7fb8733a23a7c4adbb76b&chksm=fc2a2d25774cce23c75acd8850b85c585c0bcf78d14b810e157efaec5106abf563cf58e26aef&mpshare=1&scene=1&srcid=0429vDf8NbEzNLBQQyFlABmU&sharer_shareinfo=28b94477ec8201b88aa30338e82e8999&sharer_shareinfo_first=28b94477ec8201b88aa30338e82e8999#rd",
  //         domain: "mp.weixin.qq.com",
  //         category: "AI应用",
  //       },
  //       {
  //         type: "RESOURCE",
  //         title: "仅2MB，Windows瞬间超级丝滑！",
  //         sharedBy: "AHapi²⁰²⁵",
  //         time: "2025-04-29 11:13:38",
  //         summary:
  //           "分享一款轻量级Windows优化工具，声称能显著提升系统运行速度。",
  //         keyPoints: ["2MB大小", "系统优化"],
  //         url: "https://mp.weixin.qq.com/s/es77Jc6Du03ppJD5XJeQUg",
  //         domain: "mp.weixin.qq.com",
  //         category: "系统工具",
  //       },
  //     ],
  //   },
  //   importantMessages: {
  //     items: [
  //       {
  //         time: "2025-04-29 10:00:18",
  //         sender: "苍何",
  //         type: "NEWS",
  //         priority: "高",
  //         content:
  //           "2025年04月29日 AI科技早报：阿里开源8款Qwen3模型，腾讯开源Kuikly跨端框架，OpenAI推出ChatGPT购物功能等11条重要新闻。",
  //         fullContent:
  //           "2025年04月29日 AI科技早报1、阿里开源8款Qwen3模型，集成MCP，性能超DeepSeek-R1、OpenAI o1。2、Qafind Labs发布ChatDLM扩散语言模型，推理速度高达2800 tokens/s。3、腾讯开源Kuikly跨端框架，基于Kotlin支持多平台开发，已应用于QQ。4、OpenAI 推出 ChatGPT 购物功能，用户可通过 ChatGPT 便捷购物。5、字节Seed团队提出PHD-Transformer，突破预训练长度扩展瓶颈。6、百度发布文心快码3.5版本与多模态AI智能体Zulu，助力工程师提效。7、Kimi与财新传媒合作，提供专业财经内容，推动AI+传统媒体融合。8、苹果加速「N50」智能眼镜项目，融合AI技术预计2027年亮相。9、研究显示OpenAI o3在病毒学领域超越94%人类专家，生物安全引关注。10、华为测试自研AI芯片Ascend 910D，旨在替代英伟达H100芯片。11、🔥【记得收藏】早报同步更新到开源 AI 知识库：https://u55dyuejxc.feishu.cn/wiki/FkmNwxYHDigJ3akIUGHc8MSTn4d",
  //       },
  //     ],
  //   },
  //   dialogues: {
  //     items: [
  //       {
  //         type: "DIALOGUE",
  //         messages: [
  //           {
  //             speaker: "好名字",
  //             time: "2025-04-29 08:16:23",
  //             content:
  //               "这个我弄完，ai做的小程序有bug，流程走不通，还改不了[捂脸]",
  //           },
  //           {
  //             speaker: "贾👦🏻",
  //             time: "2025-04-29 08:54:33",
  //             content: "可以微调 不过源码需要买的",
  //           },
  //           {
  //             speaker: "好名字",
  //             time: "2025-04-29 09:13:32",
  //             content: "微调一次，然后再想调就需要开会员了",
  //           },
  //           {
  //             speaker: "贾👦🏻",
  //             time: "2025-04-29 09:14:09",
  //             content: "需求变更一个字 就需要重新购买[破涕为笑]",
  //           },
  //         ],
  //         highlight: "AI小程序开发中的商业化模式讨论",
  //         relatedTopic: "AI开发工具",
  //       },
  //       {
  //         type: "DIALOGUE",
  //         messages: [
  //           {
  //             speaker: "苍何",
  //             time: "2025-04-29 09:26:49",
  //             content: "我熬不动",
  //           },
  //           {
  //             speaker: "AHapi²⁰²⁵",
  //             time: "2025-04-29 09:27:25",
  //             content: "不要卷别人[旺柴]别人写了 就不卷他们了",
  //           },
  //           {
  //             speaker: "苍何",
  //             time: "2025-04-29 09:27:55",
  //             content: "新闻得第一时间，做不到写了也没啥用",
  //           },
  //           {
  //             speaker: "苍何",
  //             time: "2025-04-29 09:28:03",
  //             content: "还不如写些应用",
  //           },
  //           {
  //             speaker: "大风（Wind）",
  //             time: "2025-04-29 09:28:23",
  //             content: "看看哪些是5-7点发推文的，基本都是卷王了",
  //           },
  //           {
  //             speaker: "沉默王二",
  //             time: "2025-04-29 09:28:44",
  //             content: "身体能扛住确实离谱",
  //           },
  //           {
  //             speaker: "苍何",
  //             time: "2025-04-29 09:29:03",
  //             content: "是啊，太肝了",
  //           },
  //         ],
  //         highlight: "关于工作强度和熬夜文化的讨论",
  //         relatedTopic: "工作生活平衡",
  //       },
  //     ],
  //   },
  //   qa: {
  //     items: [
  //       {
  //         question: {
  //           asker: "银色子弹-捷",
  //           time: "2025-04-29 11:10:26",
  //           content:
  //             "问一下win11电脑，你长时间没清理，运行慢，一般用什么来清理电脑？ 不要360啊，那个太流氓了，想知道各位大佬有没有优秀的软件推荐一下",
  //           tags: ["Windows优化", "系统清理"],
  //         },
  //         answers: [
  //           {
  //             responder: "昏沉沉的",
  //             time: "2025-04-29 11:11:59",
  //             content: "ccclean",
  //             isAccepted: false,
  //           },
  //           {
  //             responder: "🤑程序儒",
  //             time: "2025-04-29 11:13:07",
  //             content: "360极速版、Wise Care 365",
  //             isAccepted: false,
  //           },
  //           {
  //             responder: "AHapi²⁰²⁵",
  //             time: "2025-04-29 11:13:38",
  //             content: "仅2MB，Windows瞬间超级丝滑！这才是，真神器！",
  //             isAccepted: true,
  //           },
  //         ],
  //       },
  //       {
  //         question: {
  //           asker: "ಠ_ಠ 闲鱼一条ಠ_ಠ",
  //           time: "2025-04-29 11:37:49",
  //           content: "请问哪位哥还有扣子的邀请码吗？",
  //           tags: ["邀请码", "扣子空间"],
  //         },
  //         answers: [
  //           {
  //             responder: "贾👦🏻",
  //             time: "2025-04-29 11:40:37",
  //             content:
  //               "RootUser_2105656329 邀请你体验扣子空间，快来和 Agent 一起开始你的工作吧！https://www.coze.cn/space-preview?invite_code=SCL7DAL0",
  //             isAccepted: true,
  //           },
  //           {
  //             responder: "9527",
  //             time: "2025-04-29 11:47:43",
  //             content:
  //               "RootUser_2106519373 邀请你体验扣子空间，快来和 Agent 一起开始你的工作吧！https://www.coze.cn/space-preview?invite_code=A8IT4MUE",
  //             isAccepted: false,
  //           },
  //         ],
  //       },
  //     ],
  //   },
  //   analytics: {
  //     heatmap: [
  //       {
  //         topic: "AI技术",
  //         percentage: "45",
  //         color: "#3da9fc",
  //         count: "16条消息",
  //       },
  //       {
  //         topic: "工作讨论",
  //         percentage: "25",
  //         color: "#f25f4c",
  //         count: "9条消息",
  //       },
  //       {
  //         topic: "工具推荐",
  //         percentage: "15",
  //         color: "#7209b7",
  //         count: "5条消息",
  //       },
  //       {
  //         topic: "其他",
  //         percentage: "15",
  //         color: "#e53170",
  //         count: "5条消息",
  //       },
  //     ],
  //     chattyRanking: [
  //       {
  //         rank: 1,
  //         name: "苍何",
  //         count: "7",
  //         characteristics: ["技术分享", "新闻发布"],
  //         commonWords: ["AI", "开源", "熬夜"],
  //       },
  //       {
  //         rank: 2,
  //         name: "AHapi²⁰²⁵",
  //         count: "6",
  //         characteristics: ["幽默评论", "资源分享"],
  //         commonWords: ["旺柴", "加班", "神器"],
  //       },
  //       {
  //         rank: 3,
  //         name: "贾👦🏻",
  //         count: "3",
  //         characteristics: ["问题解答", "邀请码分享"],
  //         commonWords: ["源码", "购买", "邀请"],
  //       },
  //     ],
  //     nightOwl: {
  //       name: "苍何",
  //       title: "熬夜冠军",
  //       latestTime: "09:42:54",
  //       messageCount: "7",
  //       lastMessage: "我熬夜写了这一篇[旺柴]",
  //     },
  //   },
  //   wordCloud: {
  //     words: [
  //       {
  //         text: "AI",
  //         size: 42,
  //         color: "#00b4d8",
  //         rotation: 0,
  //       },
  //       {
  //         text: "熬夜",
  //         size: 36,
  //         color: "#4361ee",
  //         rotation: -15,
  //       },
  //       {
  //         text: "开源",
  //         size: 32,
  //         color: "#00b4d8",
  //         rotation: 15,
  //       },
  //       {
  //         text: "Qwen3",
  //         size: 28,
  //         color: "#3da9fc",
  //         rotation: -10,
  //       },
  //       {
  //         text: "Vidu",
  //         size: 26,
  //         color: "#3da9fc",
  //         rotation: 10,
  //       },
  //       {
  //         text: "清理",
  //         size: 24,
  //         color: "#7209b7",
  //         rotation: -5,
  //       },
  //       {
  //         text: "邀请码",
  //         size: 22,
  //         color: "#7209b7",
  //         rotation: 5,
  //       },
  //     ],
  //     legend: [
  //       {
  //         color: "#00b4d8",
  //         label: "技术 相关词汇",
  //       },
  //       {
  //         color: "#4361ee",
  //         label: "生活 相关词汇",
  //       },
  //       {
  //         color: "#7209b7",
  //         label: "工具 相关词汇",
  //       },
  //     ],
  //   },
  // },
  // footer: {
  //   dataSource: "群聊聊天记录聊天记录",
  //   generationTime: "2025-04-29 16:00:00",
  //   statisticalPeriod: "2025-04-29 [时间范围]",
  //   disclaimer:
  //     "免责声明：本报告内容基于群聊公开讨论，如有不当内容或侵权问题请联系管理员处理。",
  // },
});

const param_wxid = route.query.wxid as string;
const param_startTime = route.query.start_time as string;
const param_endTime = route.query.end_time as string;

const file_name = ref<AiUiJson>({
  wxid: param_wxid,
  start_time: param_startTime,
  end_time: param_endTime,
})



const getData = async (file_name:AiUiJson) => {
  try {
    // console.log(file_name);
    const res = await apiAiUiJson(file_name);
    // console.log(res);
    
    reportData.value = res;
    
    
  }
  catch (error) {
    console.error("获取数据失败:", error);
  }
}

const getRandomPosition = (max: number, offset: number) => {
  return Math.random() * (max - offset);
};

const hoverWord = (index: string | number) => {
  const words = document.querySelectorAll(".cloud-word");
  if (words[index]) {
    words[
      index
    ].style.transform = `scale(1.1) rotate(${reportData.value.sections.wordCloud.words[index].rotation}deg)`;
    words[index].style.zIndex = "10";
  }
};

const unhoverWord = (index) => {
  const words = document.querySelectorAll(".cloud-word");
  if (words[index]) {
    words[
      index
    ].style.transform = `scale(1) rotate(${reportData.value.sections.wordCloud.words[index].rotation}deg)`;
    words[index].style.zIndex = "1";
  }
};

onMounted(async () => {
  // 初始化词云位置
  const words = document.querySelectorAll(".cloud-word");
  words.forEach((word, index) => {
    const wordData = reportData.value.sections.wordCloud.words[index];
    const left = getRandomPosition(600, word.textContent.length * 10);
    const top = getRandomPosition(400, 20);
    word.style.left = `${left}px`;
    word.style.top = `${top}px`;
  });

  await getData(file_name.value)
});
</script>

<style scoped>
/* 严格定义的CSS样式，确保风格一致性 */

.chat-report {
  font-family: "SF Pro Display", "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell,
    "Open Sans", sans-serif;
  background-color: var(--bg-ui-s-primary);
  color: var(--text-ui-s-primary);
  line-height: 1.6;
  font-size: 16px;
  width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  padding: 30px 0;
  background-color: var(--bg-ui-s-secondary);
  margin-bottom: 30px;
}

h1 {
  font-size: 36px;
  font-weight: 700;
  color: var(--accent-ui-s-primary);
  margin-bottom: 10px;
}

.date {
  font-size: 18px;
  color: var(--text-ui-s-secondary);
  margin-bottom: 20px;
}

.meta-info {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.meta-info span {
  background-color: var(--bg-ui-s-tertiary);
  padding: 5px 15px;
  border-radius: 20px;
  font-size: 14px;
}

section {
  background-color: var(--bg-ui-s-secondary);
  margin-bottom: 30px;
  padding: 25px;
}

h2 {
  font-size: 28px;
  font-weight: 600;
  color: var(--accent-ui-s-blue);
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--accent-ui-s-blue);
}

h3 {
  font-size: 22px;
  font-weight: 600;
  color: var(--accent-ui-s-primary);
  margin: 15px 0 10px 0;
}

h4 {
  font-size: 18px;
  font-weight: 600;
  color: var(--accent-ui-s-secondary);
  margin: 12px 0 8px 0;
}

p {
  margin-bottom: 15px;
}

ul,
ol {
  margin-left: 20px;
  margin-bottom: 15px;
}

li {
  margin-bottom: 5px;
}

a {
  color: var(--accent-ui-s-blue);
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

/* 卡片容器样式 */
.topics-container,
.tutorials-container,
.messages-container,
.dialogues-container,
.qa-container,
.participants-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

/* 卡片样式 */
.topic-card,
.tutorial-card,
.message-card,
.dialogue-card,
.qa-card,
.participant-item,
.night-owl-item {
  background-color: var(--bg-ui-s-tertiary);
  padding: 20px;
}

/* 话题卡片 */
.topic-category {
  display: inline-block;
  background-color: var(--accent-ui-s-blue);
  color: var(--text-ui-s-primary);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 10px;
}

.topic-keywords {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

.keyword {
  background-color: rgba(61, 169, 252, 0.2);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.topic-mentions {
  color: var(--accent-ui-s-cyan);
  font-weight: 600;
}

/* 教程卡片 */
.tutorial-type {
  display: inline-block;
  background-color: var(--accent-ui-s-secondary);
  color: var(--text-ui-s-primary);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 10px;
}

.tutorial-meta {
  color: var(--text-ui-s-secondary);
  margin-bottom: 10px;
  font-size: 14px;
}

.tutorial-category {
  margin-top: 10px;
  font-style: italic;
  color: var(--text-ui-s-secondary);
}

/* 消息卡片 */
.message-meta {
  margin-bottom: 10px;
}

.message-meta span {
  margin-right: 15px;
  font-size: 14px;
}

.message-type {
  background-color: var(--accent-ui-s-tertiary);
  color: var(--text-ui-s-primary);
  padding: 3px 10px;
  border-radius: 15px;
}

.priority {
  padding: 3px 10px;
  border-radius: 15px;
}

.priority-high {
  background-color: var(--accent-ui-s-secondary);
}

.priority-medium {
  background-color: var(--accent-ui-s-primary);
}

.priority-low {
  background-color: var(--accent-ui-s-blue);
}

/* 对话卡片 */
.dialogue-type {
  display: inline-block;
  background-color: var(--accent-ui-s-purple);
  color: var(--text-ui-s-primary);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 14px;
  margin-bottom: 10px;
}

.dialogue-content {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  margin-bottom: 15px;
}

.dialogue-highlight {
  font-style: italic;
  color: var(--accent-ui-s-primary);
  margin: 10px 0;
  font-weight: 600;
}

/* 问答卡片 */
.question {
  margin-bottom: 15px;
}

.question-meta,
.answer-meta {
  color: var(--text-ui-s-secondary);
  margin-bottom: 5px;
  font-size: 14px;
}

.question-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.tag {
  background-color: rgba(114, 9, 183, 0.2);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.answer {
  background-color: rgba(255, 255, 255, 0.05);
  padding: 15px;
  margin-top: 10px;
}

.accepted-badge {
  background-color: var(--accent-ui-s-primary);
  color: var(--text-ui-s-primary);
  padding: 3px 10px;
  border-radius: 15px;
  font-size: 14px;
}

/* 热度图 */
.heatmap-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: 15px;
}

.heat-topic {
  font-weight: 600;
  margin-bottom: 5px;
}

.heat-bar {
  height: 20px;
  background-color: rgba(255, 255, 255, 0.1);
  margin: 5px 0;
  border-radius: 10px;
  overflow: hidden;
}

.heat-fill {
  height: 100%;
  border-radius: 10px;
}

/* 话唠榜 */
.participant-rank {
  font-size: 28px;
  font-weight: 700;
  color: var(--accent-ui-s-primary);
  margin-right: 15px;
  float: left;
}

.participant-name {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 5px;
}

.participant-count {
  color: var(--accent-ui-s-cyan);
  margin-bottom: 10px;
}

.participant-characteristics,
.participant-words {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.characteristic {
  background-color: rgba(242, 95, 76, 0.2);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 14px;
}

.word {
  background-color: rgba(229, 49, 112, 0.2);
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 14px;
}

/* 熬夜冠军 */
.night-owl-item {
  background: linear-gradient(135deg, #0f0e17 0%, #192064 100%);
  padding: 20px;
  display: flex;
  align-items: center;
}

.owl-crown {
  font-size: 40px;
  margin-right: 20px;
}

.owl-name {
  font-weight: 600;
  font-size: 18px;
  margin-bottom: 5px;
}

.owl-title {
  color: var(--accent-ui-s-primary);
  font-style: italic;
  margin-bottom: 10px;
}

.owl-time,
.owl-messages {
  color: var(--text-ui-s-secondary);
  margin-bottom: 5px;
}

.owl-note {
  font-size: 14px;
  color: var(--text-ui-s-secondary);
  margin-top: 10px;
  font-style: italic;
}

/* 词云 - 云朵样式 */
.cloud-container {
  position: relative;
  margin: 0 auto;
  padding: 20px 0;
}

.cloud-wordcloud {
  position: relative;
  width: 600px;
  height: 400px;
  margin: 0 auto;
  background-color: var(--bg-ui-s-tertiary);
  border-radius: 50%;
  box-shadow: 40px 40px 0 -5px var(--bg-ui-s-tertiary),
    80px 10px 0 -10px var(--bg-ui-s-tertiary),
    110px 35px 0 -5px var(--bg-ui-s-tertiary),
    -40px 50px 0 -8px var(--bg-ui-s-tertiary),
    -70px 20px 0 -10px var(--bg-ui-s-tertiary);
  overflow: visible;
}

.cloud-word {
  position: absolute;
  transform-origin: center;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
}

.cloud-word:hover {
  transform: scale(1.1);
  z-index: 10;
}

.cloud-legend {
  margin-top: 60px;
  display: flex;
  justify-content: center;
  gap: 30px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.legend-color {
  width: 20px;
  height: 20px;
  border-radius: 50%;
}

/* 底部 */
footer {
  text-align: center;
  padding: 20px 0;
  margin-top: 50px;
  background-color: var(--bg-ui-s-secondary);
  color: var(--text-ui-s-secondary);
  font-size: 14px;
}

footer p {
  margin: 5px 0;
}

.disclaimer {
  margin-top: 15px;
  font-style: italic;
}

/* 新增头像相关样式 */
.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  transition: transform 0.3s ease;
  position: relative;
  cursor: pointer;
  border: 2px solid var(--accent-ui-s-primary);
}

/* 头像悬停效果 */
.user-avatar:hover {
  transform: scale(1.1) rotate(5deg);
  z-index: 100;
}

/* 头像tooltip */
.avatar-tooltip {
  visibility: hidden;
  background-color: var(--bg-ui-s-tertiary);
  color: var(--text-ui-s-primary);
  text-align: center;
  padding: 5px 10px;
  border-radius: 6px;
  position: absolute;
  z-index: 1000;
  bottom: 125%;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.3s;
  font-size: 14px;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.user-avatar:hover .avatar-tooltip {
  visibility: visible;
  opacity: 1;
}

/* 热度用户专区 */
.hot-users {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.hot-user-item {
  position: relative;
  text-align: center;
}

/* 皇冠标识 */
.hot-crown {
  position: absolute;
  top: -10px;
  right: -5px;
  font-size: 24px;
  color: #ffd700;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.3));
}
</style>
