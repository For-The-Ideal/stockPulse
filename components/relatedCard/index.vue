<template>
   <!-- 相关个股 -->
<div class="related-card">
  <div class="card-header">
    <div class="header-left">
      <i class="fas fa-chart-line"></i>
      <span class="card-title">相关个股</span>
      <div class="tip-bubble">
        <i class="fas fa-info-circle"></i>
        <span class="tip-text">相关度前5名，基于行业关联性智能推荐</span>
      </div>
    </div>
    <a href="#" class="more-link" @click.prevent="goToMore">
      查看更多 <i class="fas fa-arrow-right"></i>
    </a>
  </div>
  
  <div class="related-list">
    <div 
      class="related-item" 
      v-for="(stock, index) in relatedStocks" 
      :key="stock.code" 
      @click="goToStock(stock.code)"
    >
      <div class="stock-rank">
        <span class="rank-num" :class="getRankClass(index)">{{ index + 1 }}</span>
      </div>
      <div class="stock-info">
        <span class="stock-name">{{ stock.name }}</span>
        <span class="stock-code">{{ stock.code }}</span>
      </div>
      <div class="stock-data">
        <div class="stock-price">{{ stock.price }}</div>
        <div class="stock-change-wrapper">
          <div :class="['stock-change', stock.change >= 0 ? 'positive' : 'negative']">
            <i :class="stock.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
          </div>
          <div class="change-progress">
            <div 
              class="progress-fill" 
              :class="stock.change >= 0 ? 'positive-fill' : 'negative-fill'"
              :style="{ width: getProgressWidth(stock.change) + '%' }"
            ></div>
          </div>
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
// 相关个股数据
const relatedStocks = ref([
  { name: "天孚通信", code: "300394", price: 92.47, change: 5.9 },
  { name: "中际旭创", code: "300308", price: 168.30, change: 6.8 },
  { name: "工业富联", code: "601138", price: 24.16, change: 5.4 },
  { name: "新易盛", code: "300502", price: 86.22, change: 5.0 },
  { name: "浪潮信息", code: "000977", price: 42.80, change: 4.5 }
]);

// 获取排名样式
const getRankClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

// 获取进度条宽度（最大10%涨幅对应100%宽度）
const getProgressWidth = (change) => {
  return Math.min(Math.abs(change) * 10, 100);
};

// 跳转到个股详情
const goToStock = (code) => {
  router.push(`/stock?code=${code}`);
};

// 查看更多
const goToMore = () => {
  router.push('/relatedStock');
};
</script>

<style lang="scss" scoped>
/* 相关个股卡片 */
.related-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
  transition: all 0.3s;
}

.related-card:hover {
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
  font-size: 1rem;
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

/* 相关个股列表 */
.related-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.related-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.7rem 0.8rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #0e1a28;
}

.related-item:hover {
  background: #1f2c3f;
  transform: translateX(4px);
}

/* 排名徽章 */
.stock-rank {
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

/* 股票信息 */
.stock-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stock-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.stock-code {
  color: #7690b5;
  font-size: 0.65rem;
}

/* 股票数据区域 */
.stock-data {
  text-align: right;
  min-width: 100px;
}

.stock-price {
  color: #d0e2ff;
  font-size: 0.85rem;
  font-weight: 500;
  font-family: monospace;
  margin-bottom: 0.3rem;
}

.stock-change-wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.stock-change {
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.stock-change.positive {
  color: #16c784;
}

.stock-change.negative {
  color: #ea5b5b;
}

/* 进度条 */
.change-progress {
  width: 70px;
  height: 3px;
  background: #1f2c3f;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.progress-fill.positive-fill {
  background: linear-gradient(90deg, #16c784, #2ecc71);
}

.progress-fill.negative-fill {
  background: linear-gradient(90deg, #ea5b5b, #ff6b6b);
}
</style>