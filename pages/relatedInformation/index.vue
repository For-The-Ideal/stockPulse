<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-newspaper"></i> 相关资讯
          </h1>
          <p class="page-desc">与 {{ currentStock.name }}({{ currentStock.code }}) 相关的最新资讯</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-label">今日更新</span>
            <span class="stat-value">{{ totalNews }}条</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">相关媒体</span>
            <span class="stat-value">{{ sourceCount }}家</span>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">资讯类型：</span>
          <div class="filter-btns">
            <button 
              v-for="type in newsTypes" 
              :key="type.value"
              :class="['filter-btn', { active: activeType === type.value }]"
              @click="activeType = type.value"
            >
              <i :class="type.icon"></i> {{ type.name }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">时间：</span>
          <div class="filter-btns">
            <button 
              v-for="time in timeRanges" 
              :key="time.value"
              :class="['filter-btn', { active: activeTime === time.value }]"
              @click="activeTime = time.value"
            >
              {{ time.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 资讯列表 -->
      <div class="news-list">
        <div 
          class="news-item" 
          v-for="(news, index) in filteredNews" 
          :key="news.id"
          @click="goToNewsDetail(news.id)"
        >
          <div class="news-rank">
            <span class="rank-badge" :class="getRankClass(news.importance)">{{ index + 1 }}</span>
          </div>
          <div class="news-content">
            <div class="news-header">
              <span class="news-tag" :class="news.type">{{ getTypeName(news.type) }}</span>
              <span class="news-time">{{ news.time }}</span>
            </div>
            <div class="news-title">{{ news.title }}</div>
            <div class="news-meta">
              <span class="news-source">
                <i class="fas fa-building"></i> {{ news.source }}
              </span>
              <span class="news-views">
                <i class="fas fa-eye"></i> {{ news.views }}阅读
              </span>
            </div>
          </div>
        </div>

        <div v-if="filteredNews.length === 0" class="empty-state">
          <i class="fas fa-newspaper"></i>
          <p>暂无相关资讯</p>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
          <i class="fas fa-chevron-left"></i>
        </button>
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-btn', { active: currentPage === page }]"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
        <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          <i class="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import Breadcrumb from "~/components/breadcrumb/index.vue";

const route = useRoute();
const router = useRouter();

const currentStock = ref({
  name: route.query.name || "宁德时代",
  code: route.query.code || "300750"
});

const activeType = ref("all");
const activeTime = ref("all");
const currentPage = ref(1);
const pageSize = ref(10);

const newsTypes = ref([
  { value: "all", name: "全部", icon: "fas fa-th-large" },
  { value: "news", name: "快讯", icon: "fas fa-bolt" },
  { value: "report", name: "研报", icon: "fas fa-file-alt" },
  { value: "announcement", name: "公告", icon: "fas fa-bullhorn" },
  { value: "analysis", name: "分析", icon: "fas fa-chart-line" }
]);

const timeRanges = ref([
  { value: "all", name: "全部" },
  { value: "today", name: "今日" },
  { value: "week", name: "本周" },
  { value: "month", name: "本月" }
]);

const newsList = ref([
  {
    id: 1,
    title: "宁德时代发布新一代神行电池，充电10分钟续航600公里",
    time: "35分钟前",
    source: "东方财富",
    views: "8.2w",
    type: "news",
    importance: "A"
  },
  {
    id: 2,
    title: "中信证券：宁德时代目标价上调至310元，维持买入评级",
    time: "2小时前",
    source: "中信证券",
    views: "4.5w",
    type: "report",
    importance: "A"
  },
  {
    id: 3,
    title: "宁德时代2024年Q4财报：净利润同比增长35.8%，超预期",
    time: "昨天",
    source: "财联社",
    views: "12.3w",
    type: "announcement",
    importance: "S"
  },
  {
    id: 4,
    title: "深度分析：宁德时代神行电池的技术壁垒与市场前景",
    time: "昨天",
    source: "证券时报",
    views: "3.2w",
    type: "analysis",
    importance: "B"
  }
]);

const filteredNews = computed(() => {
  let filtered = [...newsList.value];
  if (activeType.value !== "all") {
    filtered = filtered.filter(n => n.type === activeType.value);
  }
  return filtered;
});

const totalNews = computed(() => filteredNews.value.length);
const sourceCount = computed(() => new Set(filteredNews.value.map(n => n.source)).size);
const totalPages = computed(() => Math.ceil(filteredNews.value.length / pageSize.value));

const getTypeName = (type) => {
  const map = { news: "快讯", report: "研报", announcement: "公告", analysis: "分析" };
  return map[type] || "资讯";
};

const getRankClass = (importance) => {
  const map = { S: "gold", A: "silver", B: "bronze" };
  return map[importance] || "";
};

const goToNewsDetail = (id) => {
  router.push(`/news/${id}`);
};
</script>

<style lang="scss" scoped>
.page-container {
  padding: 1rem 2rem 2rem 2rem;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  flex: 1;
}

.page-title {
  color: #e2f0ff;
  font-size: 1.5rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.page-desc {
  color: #7a94b8;
  font-size: 0.85rem;
  margin-top: 1rem;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: #0e1a28;
  border-radius: 1rem;
  padding: 0.5rem 1rem;
  text-align: center;
  border: 1px solid #2f4567;
}

.stat-label {
  color: #7a94b8;
  font-size: 0.7rem;
  display: block;
}

.stat-value {
  color: #ffb347;
  font-size: 1.1rem;
  font-weight: 600;
}

/* 筛选栏 */
.filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
  background: #0e1a28;
  padding: 0.8rem 1rem;
  border-radius: 1rem;
  border: 1px solid #2a3f60;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.filter-label {
  color: #7a94b8;
  font-size: 0.85rem;
}

.filter-btns {
  display: flex;
  gap: 0.5rem;
  background: #1f2c3f;
  padding: 0.2rem;
  border-radius: 40px;
}

.filter-btn {
  background: transparent;
  border: none;
  padding: 0.4rem 1rem;
  border-radius: 30px;
  color: #99aec9;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.filter-btn.active {
  background: #2f4567;
  color: white;
}

.filter-btn:hover:not(.active) {
  background: #253040;
  color: #d3e3ff;
}

/* 资讯列表 */
.news-list {
  background: #131c28;
  border-radius: 1.5rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.2rem;
  border-bottom: 1px solid #1f2d3e;
  cursor: pointer;
  transition: all 0.2s;
}

.news-item:hover {
  background: rgba(60, 95, 145, 0.1);
}

.news-item:last-child {
  border-bottom: none;
}

.news-rank {
  flex-shrink: 0;
}

.rank-badge {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  background: #1f2c3f;
  color: #7a94b8;
}

.rank-badge.gold {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #0b0e14;
}

.rank-badge.silver {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #0b0e14;
}

.rank-badge.bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: #0b0e14;
}

.news-content {
  flex: 1;
}

.news-header {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
}

.news-tag {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.news-tag.news {
  background: rgba(62, 122, 255, 0.15);
  color: #3e7aff;
  border: 1px solid #3e7aff;
}

.news-tag.report {
  background: rgba(255, 180, 71, 0.15);
  color: #ffb447;
  border: 1px solid #ffb447;
}

.news-tag.announcement {
  background: rgba(22, 199, 132, 0.15);
  color: #16c784;
  border: 1px solid #16c784;
}

.news-tag.analysis {
  background: rgba(234, 91, 91, 0.15);
  color: #ea5b5b;
  border: 1px solid #ea5b5b;
}

.news-time {
  color: #7a94b8;
  font-size: 0.7rem;
}

.news-title {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.95rem;
  line-height: 1.4;
  margin-bottom: 0.5rem;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.news-source,
.news-views {
  color: #7a94b8;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.news-source i,
.news-views i {
  font-size: 0.6rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7a94b8;
}

.empty-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

/* 分页 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.page-btn {
  background: #1f2c3f;
  border: 1px solid #2f4567;
  color: #b8d6ff;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #2f4567;
  color: white;
}

.page-btn.active {
  background: #2f4567;
  color: white;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .news-item {
    flex-direction: column;
  }
  
  .news-rank {
    align-self: flex-start;
  }
}
</style>