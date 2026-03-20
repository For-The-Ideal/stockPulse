<template>
    <!-- 相关资讯 -->
<div class="news-card">
  <div class="card-header">
    <div class="header-left">
      <i class="fas fa-newspaper"></i>
      <span class="card-title">相关资讯</span>
      <div class="tip-bubble">
        <i class="fas fa-info-circle"></i>
        <span class="tip-text">与当前股票相关的最新资讯</span>
      </div>
    </div>
    <a href="#" class="more-link" @click.prevent="goToMoreNews">
      查看更多 <i class="fas fa-arrow-right"></i>
    </a>
  </div>
  
  <div class="news-list">
    <div 
      class="news-item" 
      v-for="(news, index) in relatedNews" 
      :key="news.id"
      @click="goToNewsDetail(news.id)"
    >
      <div class="news-rank">
        <span class="rank-num" :class="getNewsRankClass(index)">{{ index + 1 }}</span>
      </div>
      <div class="news-content">
        <div class="news-title">{{ news.title }}</div>
        <div class="news-meta">
          <span class="news-time">
            <i class="far fa-clock"></i> {{ news.time }}
          </span>
          <span class="news-source">{{ news.source }}</span>
          <span class="news-views" v-if="news.views">
            <i class="fas fa-eye"></i> {{ news.views }}
          </span>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
// 相关资讯数据
const relatedNews = ref([
  { 
    id: 1, 
    title: "宁德时代发布新一代神行电池，充电10分钟续航600公里", 
    time: "35分钟前", 
    source: "东方财富",
    views: "8.2w",
    tag: "hot"
  },
  { 
    id: 2, 
    title: "宁德时代与宝马签署长期合作协议，供货周期至2030年", 
    time: "2小时前", 
    source: "同花顺",
    views: "4.5w",
    tag: "new"
  },
  { 
    id: 3, 
    title: "中信证券：宁德时代目标价上调至310元，维持买入评级", 
    time: "5小时前", 
    source: "中信证券",
    views: "2.3w",
    tag: "analysis"
  },
  { 
    id: 4, 
    title: "宁德时代神行电池量产在即，多家车企已定点", 
    time: "昨天", 
    source: "财联社",
    views: "1.8w",
    tag: "exclusive"
  },
  { 
    id: 5, 
    title: "宁德时代Q1财报超预期，净利润同比增长35.8%", 
    time: "昨天", 
    source: "证券时报",
    views: "1.2w",
    tag: "hot"
  }
]);

// 获取资讯排名样式（前三名特殊）
const getNewsRankClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

// 获取标签样式
const getTagClass = (tag) => {
  const map = {
    hot: "hot",
    new: "new",
    exclusive: "exclusive",
    analysis: "analysis"
  };
  return map[tag] || "normal";
};

// 跳转到资讯详情
const goToNewsDetail = (id) => {
  router.push(`/detail?id=${id}`);
};

// 查看更多资讯
const goToMoreNews = () => {
  router.push('/relatedInformation');
};
</script>

<style lang="scss" scoped>
/* 相关资讯卡片 */
.news-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
  transition: all 0.3s;
}

.news-card:hover {
  border-color: #3f5a82;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 卡片头部 */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #2a3346;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.header-left i {
  color: #3e7aff;
  font-size: 1rem;
}

.card-title {
  color: #d6e6ff;
  font-weight: 600;
  font-size: 1rem;
}

/* 气泡提示 */
.tip-bubble {
  position: relative;
  display: inline-flex;
  align-items: center;
  cursor: pointer;
}

.tip-bubble i {
  color: #7a94b8;
  font-size: 0.7rem;
  transition: color 0.2s;
}

.tip-bubble:hover i {
  color: #6b9eff;
}

.tip-bubble .tip-text {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  background: #1f2d42;
  color: #d0e2ff;
  font-size: 0.7rem;
  font-weight: normal;
  padding: 0.5rem 0.8rem;
  border-radius: 8px;
  white-space: nowrap;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  border: 1px solid #2f4567;
  z-index: 10;
  opacity: 0;
  visibility: hidden;
  transition: all 0.2s;
  pointer-events: none;
}

.tip-bubble:hover .tip-text {
  opacity: 1;
  visibility: visible;
}

.tip-bubble .tip-text::before {
  content: '';
  position: absolute;
  bottom: 100%;
  left: 8px;
  width: 0;
  height: 0;
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #2f4567;
}

.more-link {
  color: #6b9eff;
  text-decoration: none;
  font-size: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
}

.more-link:hover {
  gap: 0.5rem;
  color: #8cb0ff;
}

/* 资讯列表 */
.news-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.news-item {
  display: flex;
  align-items: flex-start;
  gap: 0.8rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #0e1a28;
}

.news-item:hover {
  background: #1f2c3f;
  transform: translateX(4px);
}

/* 排名徽章 */
.news-rank {
  width: 32px;
  flex-shrink: 0;
}

.rank-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  font-weight: 600;
  background: #1f2c3f;
  color: #7a94b8;
}

.rank-num.gold {
  background: linear-gradient(135deg, #ffd700, #ffb347);
  color: #0b0e14;
}

.rank-num.silver {
  background: linear-gradient(135deg, #c0c0c0, #a0a0a0);
  color: #0b0e14;
}

.rank-num.bronze {
  background: linear-gradient(135deg, #cd7f32, #b87333);
  color: #0b0e14;
}

/* 资讯内容 */
.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.news-title {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.4;
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.news-time,
.news-source,
.news-views {
  color: #7a94b8;
  font-size: 0.7rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.news-time i,
.news-source i,
.news-views i {
  font-size: 0.6rem;
}

/* 资讯标签 */
.news-tag {
  flex-shrink: 0;
}

.tag-badge {
  font-size: 0.65rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  white-space: nowrap;
  display: inline-block;
}

.tag-badge.hot {
  background: rgba(234, 91, 91, 0.2);
  color: #ea5b5b;
  border: 1px solid #ea5b5b;
}

.tag-badge.new {
  background: rgba(22, 199, 132, 0.2);
  color: #16c784;
  border: 1px solid #16c784;
}

.tag-badge.exclusive {
  background: rgba(255, 180, 71, 0.2);
  color: #ffb447;
  border: 1px solid #ffb447;
}

.tag-badge.analysis {
  background: rgba(62, 122, 255, 0.2);
  color: #3e7aff;
  border: 1px solid #3e7aff;
}
</style>