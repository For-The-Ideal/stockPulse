<template>
  <div class="home-page">
    <div class="main-grid">
      <div class="left-col">
        <MarketSnapshot />

        <div class="news-feed">
          <div class="section-header">
            <h3><i class="fas fa-fire"></i> 热门公司 · 多源资讯</h3>

            <div class="sort-switch">
              <span class="sort-label"><i class="fas fa-sort"></i> 排序：</span>
              <div class="sort-options">
                <span class="sort-chip active" data-sort="hot"
                  ><i class="fas fa-fire"></i> 最热</span
                >
                <span class="sort-chip" data-sort="latest"
                  ><i class="fas fa-clock"></i> 最新</span
                >
              </div>
            </div>
          </div>

          <SourceTag />

          <FeedList />
          <Pagination />
        </div>
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
import MarketSnapshot from "@/components/marketSnapshot/index.vue";
import FeedList from "@/components/feedList/index.vue";
import WatchlistPanel from "@/components/watchlistPanel/index.vue";
import Feature from "@/components/feature/index.vue";
import HotSectors from "@/components/hotSectors/index.vue";
import FlowPanel from "@/components/flowPanel/index.vue";
import SourceTag from "@/components/sourceTag/index.vue";
import Pagination from "~/components/pagination/index.vue";
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

/* 资讯区域 - 保留筛选项+标记 */
.news-feed {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.6rem;
  cursor: pointer;
  border: 1px solid #273349;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;
  color: #fff;
}

.section-header h3 {
  color: #ddeeff;
  font-weight: 600;
  font-size: 1.3rem;
  letter-spacing: -0.2px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-header h3 i {
  color: #3e7aff;
  font-size: 1.2rem;
}

/* 排序切换组件样式 */
.sort-switch {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #1b232f;
  padding: 0.2rem 0.8rem;
  border-radius: 40px;
  border: 1px solid #2d384a;
}

.sort-label {
  color: #9ab3d9;
  font-size: 0.85rem;
}

.sort-options {
  display: flex;
  gap: 0.2rem;
}

.sort-chip {
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  color: #99aec9;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 5px;
}

.sort-chip i {
  font-size: 0.75rem;
}

.sort-chip:hover {
  background: #253040;
  color: #d3e3ff;
}

.sort-chip.active {
  background: #2f4567;
  color: white;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .sort-switch {
    justify-content: center;
  }
}
</style>