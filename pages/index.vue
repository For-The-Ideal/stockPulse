<template>
  <div class="home-page">
    <!-- 主要内容网格 -->
    <div class="main-grid">
      <!-- 左侧列：大盘快照 + 资讯流（含信源筛选） -->
      <div class="left-col">
        <!-- 市场概况卡片 不变 -->
        <!-- <div class="market-snapshot"></div> -->
         <MarketSnapshot />
         <FeedList />
      </div>
      <div class="right-col">
        <WatchlistPanel />
        <HotSectors />
        <FlowPanel />
         <Feature />
      </div>
     
    </div>
  </div>
</template>

<script setup>
import MarketSnapshot from '@/components/marketSnapshot/index.vue'
import FeedList from '@/components/feedList/index.vue'
import WatchlistPanel from '@/components/watchlistPanel/index.vue'
import Feature from '@/components/feature/index.vue'
import HotSectors from '@/components/hotSectors/index.vue'
import FlowPanel from '@/components/flowPanel/index.vue'
</script>

<style lang="scss" scoped>

 /* 主要内容网格 */
      .main-grid {
        display: grid;
        grid-template-columns: 2.2fr 1.3fr;
        gap: 1.5rem;
        padding: 2rem 2rem 1.8rem 2rem;
      }

      .left-col {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }

 /* 右侧列不变 */
      .right-col {
        display: flex;
        flex-direction: column;
        gap: 1.8rem;
      }

        @media (max-width: 950px) {
        .main-grid {
          grid-template-columns: 1fr;
        }
      }
</style>
