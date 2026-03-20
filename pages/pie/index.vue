<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <h2 class="page-title">
          <i class="fas fa-chart-pie"></i> 板块行情
        </h2>
      </div>

      <!-- 板块网格 -->
      <div class="sector-map">
        <div class="sector-block" v-for="sector in sectors" :key="sector.name">
          <div class="sector-header">
            <div class="sector-info">
              <i :class="sector.icon" class="sector-icon"></i>
              <span class="sector-name">{{ sector.name }}</span>
            </div>
            <div :class="['sector-change', sector.change >= 0 ? 'positive' : 'negative']">
              <i :class="sector.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ sector.change >= 0 ? '+' : '' }}{{ sector.change }}%
            </div>
          </div>
          <div class="sector-stocks">
            <div 
              class="sector-stock-row" 
              v-for="stock in sector.stocks" 
              :key="stock.name"
              @click="goToStock(stock.code)"
            >
              <span class="stock-name">{{ stock.name }}</span>
              <span :class="['stock-change', stock.change >= 0 ? 'positive' : 'negative']">
                <i :class="stock.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
              </span>
            </div>
          </div>
          <div class="sector-footer">
            <button class="more-btn" @click="goToSector(sector.name)">
              查看全部 <i class="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- 资金流向排行榜 -->
      <div class="flow-rank">
        <div class="rank-header">
          <h3><i class="fas fa-chart-line"></i> 板块资金流向排行</h3>
          <span class="rank-time">今日 14:55</span>
        </div>
        <div class="rank-list">
          <div class="rank-item" @click="goToSector(item.name)" v-for="(item, index) in fundFlowRank" :key="item.name">
            <span class="rank-num" :class="{ top: index < 3 }">{{ index + 1 }}</span>
            <span class="rank-name">{{ item.name }}</span>
            <div class="rank-bar">
              <div class="rank-bar-fill" :style="{ width: item.percent + '%' }"></div>
            </div>
            <span :class="['rank-value', item.change >= 0 ? 'positive' : 'negative']">
              {{ item.change >= 0 ? '+' : '' }}{{ item.change }}亿
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import Breadcrumb from "~/components/breadcrumb/index.vue";

const router = useRouter();

// 板块数据
const sectors = ref([
  {
    name: "半导体",
    icon: "fas fa-microchip",
    change: 4.2,
    stocks: [
      { name: "中芯国际", code: "688981", change: 2.1 },
      { name: "北方华创", code: "002371", change: 3.4 },
      { name: "韦尔股份", code: "603501", change: 1.8 },
      { name: "兆易创新", code: "603986", change: 2.5 }
    ]
  },
  {
    name: "汽车整车",
    icon: "fas fa-car",
    change: 2.7,
    stocks: [
      { name: "比亚迪", code: "002594", change: 0.8 },
      { name: "长城汽车", code: "601633", change: 2.5 },
      { name: "赛力斯", code: "601127", change: 4.1 },
      { name: "长安汽车", code: "000625", change: 1.2 }
    ]
  },
  {
    name: "创新药",
    icon: "fas fa-flask",
    change: 1.5,
    stocks: [
      { name: "百济神州", code: "688235", change: 2.2 },
      { name: "荣昌生物", code: "688331", change: -0.5 },
      { name: "康方生物", code: "9926.HK", change: 3.0 },
      { name: "信达生物", code: "1801.HK", change: 1.8 }
    ]
  },
  {
    name: "银行",
    icon: "fas fa-hand-holding-usd",
    change: -0.8,
    stocks: [
      { name: "招商银行", code: "600036", change: -0.6 },
      { name: "兴业银行", code: "601166", change: -1.2 },
      { name: "工商银行", code: "601398", change: -0.3 },
      { name: "建设银行", code: "601939", change: -0.4 }
    ]
  },
  {
    name: "光伏",
    icon: "fas fa-charging-station",
    change: 2.0,
    stocks: [
      { name: "隆基绿能", code: "601012", change: 1.7 },
      { name: "阳光电源", code: "300274", change: 3.2 },
      { name: "通威股份", code: "600438", change: 1.5 },
      { name: "晶澳科技", code: "002459", change: 2.1 }
    ]
  },
  {
    name: "算力",
    icon: "fas fa-database",
    change: 5.6,
    stocks: [
      { name: "中际旭创", code: "300308", change: 6.8 },
      { name: "工业富联", code: "601138", change: 5.4 },
      { name: "浪潮信息", code: "000977", change: 4.2 },
      { name: "寒武纪", code: "688256", change: 7.1 }
    ]
  }
]);

// 资金流向排行
const fundFlowRank = ref([
  { name: "半导体", change: 48.6, percent: 100 },
  { name: "算力", change: 32.4, percent: 67 },
  { name: "汽车整车", change: 25.8, percent: 53 },
  { name: "光伏", change: 18.2, percent: 37 },
  { name: "创新药", change: 12.5, percent: 26 },
  { name: "银行", change: -8.3, percent: 17 }
]);

// 跳转到个股详情
const goToStock = (code) => {
  router.push(`/stock?code=${code}`);
};

// 跳转到板块详情
const goToSector = (name) => {
  router.push(`/sections?name=${encodeURIComponent(name)}`);
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
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  color: #e2f0ff;
  font-size: 1.8rem;  /* 从 1.5rem 调大 */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-stats {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.stat-badge {
  background: #0e1a28;
  padding: 0.5rem 1.2rem;  /* 从 0.4rem 1rem 调大 */
  border-radius: 30px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.95rem;  /* 从 0.85rem 调大 */
  color: #b8d6ff;
  border: 1px solid #2f4567;
}

.stat-badge i {
  font-size: 0.85rem;  /* 从 0.75rem 调大 */
}

/* 板块网格 */
.sector-map {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin-bottom: 2rem;
}

.sector-block {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.4rem;  /* 从 1.2rem 调大 */
  border: 1px solid #273349;
  transition: all 0.2s;
  cursor: pointer;
}

.sector-block:hover {
  transform: translateY(-2px);
  border-color: #3f5a82;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
}

/* 板块头部 */
.sector-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;  /* 从 0.8rem 调大 */
  margin-bottom: 1rem;   /* 从 0.8rem 调大 */
  border-bottom: 1px solid #2c3f5a;
}

.sector-info {
  display: flex;
  align-items: center;
  gap: 0.6rem;  /* 从 0.5rem 调大 */
}

.sector-icon {
  font-size: 1.1rem;  /* 从 1rem 调大 */
  color: #6b9eff;
}

.sector-name {
  font-size: 1.1rem;  /* 从 1rem 调大 */
  font-weight: 600;
  color: #ddeeff;
}

.sector-change {
  font-size: 1rem;  /* 从 0.9rem 调大 */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.sector-change i {
  font-size: 0.8rem;  /* 从 0.7rem 调大 */
}

/* 板块内个股 */
.sector-stocks {
  min-height: 160px;  /* 从 140px 调大 */
}

.sector-stock-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;  /* 从 0.4rem 调大 */
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 6px;
}

.sector-stock-row:hover {
  background: rgba(60, 95, 145, 0.2);
  padding-left: 0.3rem;
  padding-right: 0.3rem;
}

.stock-name {
  color: #b8d1f5;
  font-size: 0.95rem;  /* 从 0.85rem 调大 */
  font-weight: 500;
}

.stock-change {
  font-size: 0.95rem;  /* 从 0.85rem 调大 */
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.stock-change i {
  font-size: 0.75rem;  /* 从 0.65rem 调大 */
}

/* 板块底部 */
.sector-footer {
  margin-top: 1rem;    /* 从 0.8rem 调大 */
  padding-top: 0.8rem;  /* 从 0.6rem 调大 */
  border-top: 1px solid #2c3f5a;
  text-align: right;
}

.more-btn {
  background: transparent;
  border: none;
  color: #6b9eff;
  font-size: 0.85rem;  /* 从 0.75rem 调大 */
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  transition: all 0.2s;
}

.more-btn:hover {
  color: #8cb0ff;
  gap: 0.5rem;
}

/* 资金流向排行榜 */
.flow-rank {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.4rem;  /* 从 1.2rem 调大 */
  border: 1px solid #273349;
}

.rank-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.2rem;  /* 从 1rem 调大 */
  flex-wrap: wrap;
  gap: 0.5rem;
}

.rank-header h3 {
  color: #b3ceff;
  font-size: 1.1rem;  /* 从 1rem 调大 */
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rank-time {
  color: #7a94b8;
  font-size: 0.8rem;  /* 从 0.7rem 调大 */
}

.rank-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;  /* 从 0.8rem 调大 */
}

.rank-item {
  display: flex;
  align-items: center;
  gap: 1rem;  /* 从 0.8rem 调大 */
  padding: 0.6rem;  /* 从 0.5rem 调大 */
  background: #0e1a28;
  border-radius: 0.8rem;
  transition: all 0.2s;
}

.rank-item:hover {
  background: #1a2a3a;
}

.rank-num {
  width: 32px;   /* 从 28px 调大 */
  height: 32px;  /* 从 28px 调大 */
  background: #1f2c3f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.85rem;  /* 从 0.75rem 调大 */
  font-weight: 600;
  color: #7a94b8;
}

.rank-num.top {
  background: #ffb347;
  color: #0b0e14;
}

.rank-name {
  width: 80px;  /* 从 70px 调大 */
  color: #d0e2ff;
  font-size: 0.95rem;  /* 从 0.85rem 调大 */
  font-weight: 500;
}

.rank-bar {
  flex: 1;
  height: 8px;  /* 从 6px 调大 */
  background: #1f2c3f;
  border-radius: 4px;
  overflow: hidden;
}

.rank-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #16c784, #3e7aff);
  border-radius: 4px;
  transition: width 0.3s;
}

.rank-value {
  width: 80px;  /* 从 70px 调大 */
  text-align: right;
  font-size: 0.95rem;  /* 从 0.85rem 调大 */
  font-weight: 500;
  font-family: monospace;
}

/* 通用颜色 */
.positive {
  color: #16c784;
}

.negative {
  color: #ea5b5b;
}

/* 响应式 */
@media (max-width: 900px) {
  .page-container {
    padding: 1rem;
  }
  
  .sector-map {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .rank-item {
    flex-wrap: wrap;
  }
  
  .rank-name {
    width: auto;
    flex: 1;
  }
  
  .rank-value {
    width: auto;
  }
}

@media (max-width: 600px) {
  .sector-map {
    grid-template-columns: 1fr;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header-stats {
    width: 100%;
  }
  
  .stat-badge {
    flex: 1;
    justify-content: center;
  }
}
</style>