<template>
  <div class="feed-container">
    <!-- 第一条资讯：双源标记 (同花顺+东方财富) -->
    <div class="news-item" v-for="item in 2" :key="item" @click="handleClick(item)">
      <span class="news-tag"><i class="far fa-bell"></i> 盘前</span>
      <div class="news-content">
        <div class="news-title">
          重磅！宁德时代发布新一代神行电池，充电10分钟续航600公里
          <span class="hot-badge">HOT</span>
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 35分钟前</span>
          <span><i class="fas fa-eye"></i> 8.2w阅读</span>
          <span class="source-badges">
            <span class="source-badge double-source"
              ><i class="fas fa-merge"></i> 双源</span
            >
            <span class="source-badge"
              ><i class="fas fa-dragon"></i> 同花顺</span
            >
            <span class="source-badge"
              ><i class="fas fa-chart-bar"></i> 东方财富</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 第二条：只有同花顺标记 -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-microchip"></i> 半导体</span>
      <div class="news-content">
        <div class="news-title">
          中芯国际：先进制程突破，Q2营收指引超预期，多家机构上调目标价
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 1小时前</span>
          <span><i class="fas fa-eye"></i> 4.1w阅读</span>
          <span class="source-badges">
            <span class="source-badge"
              ><i class="fas fa-dragon"></i> 同花顺</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 第三条：只有东方财富标记 -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-coins"></i> 金融</span>
      <div class="news-content">
        <div class="news-title">
          券商并购提速：国联证券收购民生证券获股东会通过，股价异动拉升
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 2小时前</span>
          <span><i class="fas fa-eye"></i> 3.6w阅读</span>
          <span class="source-badges">
            <span class="source-badge"
              ><i class="fas fa-chart-bar"></i> 东方财富</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 第四条：其他来源 (财联社) -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-car"></i> 新能源车</span>
      <div class="news-content">
        <div class="news-title">
          比亚迪方程豹“豹8”上市48小时订单破万，机构看好高端化进程
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 3小时前</span>
          <span><i class="fas fa-eye"></i> 2.9w阅读</span>
          <span class="source-badges">
            <span class="source-badge"
              ><i class="fas fa-leaf"></i> 其他·财联社</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 第五条：双源标记 (同花顺+东方财富) -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-dna"></i> 创新药</span>
      <div class="news-content">
        <div class="news-title">
          百济神州：欧洲药品管理局推荐批准百悦泽新适应症
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 5小时前</span>
          <span><i class="fas fa-eye"></i> 1.7w阅读</span>
          <span class="source-badges">
            <span class="source-badge double-source"
              ><i class="fas fa-merge"></i> 双源</span
            >
            <span class="source-badge"
              ><i class="fas fa-dragon"></i> 同花顺</span
            >
            <span class="source-badge"
              ><i class="fas fa-chart-bar"></i> 东方财富</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 再加一条只有同花顺的 使滚动更明显 -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-rocket"></i> 航天</span>
      <div class="news-content">
        <div class="news-title">
          北斗导航产业迎政策利好，中国卫星、北斗星通受关注
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 6小时前</span>
          <span><i class="fas fa-eye"></i> 1.2w阅读</span>
          <span class="source-badges">
            <span class="source-badge"
              ><i class="fas fa-dragon"></i> 同花顺</span
            >
          </span>
        </div>
      </div>
    </div>

    <!-- 再增加一条东方财富的资讯 让内容更长 -->
    <div class="news-item" v-for="item in 2" :key="item">
      <span class="news-tag"><i class="fas fa-chart-line"></i> 策略</span>
      <div class="news-content">
        <div class="news-title">
          中信证券：红利资产仍是底仓首选，科技成长有望轮动
        </div>
        <div class="news-meta">
          <span><i class="far fa-clock"></i> 7小时前</span>
          <span><i class="fas fa-eye"></i> 2.3w阅读</span>
          <span class="source-badges">
            <span class="source-badge"
              ><i class="fas fa-chart-bar"></i> 东方财富</span
            >
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const handleClick = (item) => {
  router.push({ name: 'detail', params: { id: 9527 } })
}
</script>

<style lang="scss" scoped>
/* 资讯区域 - 保留筛选项+标记 */
.feed-container {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.6rem;
  cursor: pointer;
  border: 1px solid #273349;
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
