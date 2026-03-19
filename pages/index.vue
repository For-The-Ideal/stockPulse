<template>
  <div class="home-page">
    <div class="main-grid">
      <div class="left-col">
         <MarketSnapshot />
         
            <div class="news-feed">
    <div class="section-header">
      <h3><i class="fas fa-fire"></i> 热门公司 · 多源资讯</h3>
      <NuxtLink class="market-date" to="/search">
        <span>更多</span> 
        <i class="fas fa-angle-right"></i>
      </NuxtLink>
    </div>

    <SourceTag />
  
<FeedList />
   

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
import MarketSnapshot from '@/components/marketSnapshot/index.vue'
import FeedList from '@/components/feedList/index.vue'
import WatchlistPanel from '@/components/watchlistPanel/index.vue'
import Feature from '@/components/feature/index.vue'
import HotSectors from '@/components/hotSectors/index.vue'
import FlowPanel from '@/components/flowPanel/index.vue'
import SourceTag from '@/components/sourceTag/index.vue'
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
.market-date {
    color: #788fb0;
    font-size: 0.85rem;
    background: #1f2b3c;
    padding: 0.3rem 1rem;
    border-radius: 30px;
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

/* 筛选栏 */
.source-filter {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
}
.filter-label {
  color: #9ab3d9;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  background: #1f2c3f;
  padding: 0.3rem 1rem;
  border-radius: 30px;
}
.filter-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.source-chip {
  background: #1f2c3f;
  color: #b5cef0;
  padding: 0.4rem 1.2rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #334257;
  cursor: default;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.1s;
}
.source-chip i {
  font-size: 0.8rem;
  color: #6086c0;
  margin-right: 0.2rem;
}
.source-chip.active {
  background: #2f4567;
  color: white;
  border-color: #5f8ad4;
  box-shadow: 0 2px 8px #1e3a62;
}
.source-chip.active i {
  color: #ffdb9d;
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid #1f2b3d;
}
.news-item:last-child {
  border-bottom: none;
}

.news-tag {
  background: #1f3147;
  color: #8fb1f0;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.25rem 0.8rem;
  border-radius: 30px;
  letter-spacing: 0.4px;
  white-space: nowrap;
}

.news-content {
  flex: 1;
}

.news-title {
  font-weight: 600;
  color: #eef4ff;
  margin-bottom: 5px;
  line-height: 1.4;
  font-size: 1rem;
}

.news-meta {
  display: flex;
  gap: 1.2rem;
  color: #687e9f;
  font-size: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
}
.news-meta i {
  margin-right: 3px;
  font-size: 0.7rem;
  color: #486184;
}

.source-badges {
  display: flex;
  gap: 6px;
  margin-left: 10px;
  flex-wrap: wrap;
}
.source-badge {
  background: #1f324b;
  color: #b4d0ff;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.7rem;
  border-radius: 30px;
  border: 1px solid #375175;
  display: inline-flex;
  align-items: center;
  gap: 3px;
}
.source-badge i {
  font-size: 0.55rem;
  color: #ffcc80;
}
.double-source {
  background: #3f4d2e;
  color: #e9ffb2;
  border-color: #819b4d;
  font-weight: 700;
}
.double-source i {
  color: #f9d77e;
}

.hot-badge {
  background: #3d5a7c;
  color: white;
  padding: 0.15rem 0.6rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  margin-left: 8px;
}
</style>
