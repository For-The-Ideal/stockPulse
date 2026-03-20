<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-left">
          <h1 class="page-title">
            <i class="fas fa-chart-line"></i> 相关个股
          </h1>
          <p class="page-desc">与 {{ currentStock.name }}({{ currentStock.code }}) 关联度最高的个股</p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-label">相关个股</span>
            <span class="stat-value">{{ totalStocks }}只</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">平均相关性</span>
            <span class="stat-value">{{ avgCorrelation }}%</span>
          </div>
        </div>
      </div>

      <!-- 筛选栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">关联类型：</span>
          <div class="filter-btns">
            <button 
              v-for="type in relationTypes" 
              :key="type.value"
              :class="['filter-btn', { active: activeRelation === type.value }]"
              @click="activeRelation = type.value"
            >
              <i :class="type.icon"></i> {{ type.name }}
            </button>
          </div>
        </div>
        <div class="filter-group">
          <span class="filter-label">排序：</span>
          <div class="filter-btns">
            <button 
              v-for="sort in sortOptions" 
              :key="sort.value"
              :class="['filter-btn', { active: activeSort === sort.value }]"
              @click="activeSort = sort.value"
            >
              {{ sort.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- 个股列表 -->
      <div class="stock-list">
        <div class="list-header">
          <span class="col-rank">排名</span>
          <span class="col-stock">股票名称</span>
          <span class="col-price">现价</span>
          <span class="col-change">涨跌幅</span>
          <span class="col-correlation">相关性</span>
          <span class="col-fund">资金流向</span>
          <span class="col-action">操作</span>
        </div>
        <div 
          class="stock-item" 
          v-for="(stock, index) in paginatedStocks" 
          :key="stock.code"
          @click="goToStock(stock.code)"
        >
          <div class="col-rank">
            <span class="rank-badge" :class="getRankClass(index)">{{ index + 1 }}</span>
          </div>
          <div class="col-stock">
            <div class="stock-info">
              <span class="stock-name">{{ stock.name }}</span>
              <span class="stock-code">{{ stock.code }}</span>
              <span class="relation-badge" :class="stock.relationType">
                {{ getRelationName(stock.relationType) }}
              </span>
            </div>
          </div>
          <div class="col-price">{{ stock.price }}</div>
          <div class="col-change">
            <span :class="['change-value', stock.change >= 0 ? 'positive' : 'negative']">
              <i :class="stock.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
            </span>
            <div class="change-progress">
              <div 
                class="progress-fill" 
                :class="stock.change >= 0 ? 'positive-fill' : 'negative-fill'"
                :style="{ width: getProgressWidth(stock.change) + '%' }"
              ></div>
            </div>
          </div>
          <div class="col-correlation">
            <div class="correlation-value">{{ stock.correlation }}%</div>
            <div class="correlation-bar">
              <div class="correlation-fill" :style="{ width: stock.correlation + '%' }"></div>
            </div>
          </div>
          <div class="col-fund">
            <span :class="['fund-value', stock.fundFlow >= 0 ? 'positive' : 'negative']">
              {{ stock.fundFlow >= 0 ? '+' : '' }}{{ stock.fundFlow }}亿
            </span>
          </div>
          <div class="col-action">
            <button 
              class="add-btn" 
              :class="{ added: isInWatchlist(stock) }"
              @click.stop="toggleWatchlist(stock)"
            >
              <i :class="isInWatchlist(stock) ? 'fas fa-check' : 'fas fa-plus'"></i>
              {{ isInWatchlist(stock) ? '已添加' : '自选' }}
            </button>
          </div>
        </div>

        <div v-if="filteredStocks.length === 0" class="empty-state">
          <i class="fas fa-chart-line"></i>
          <p>暂无相关个股</p>
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

const activeRelation = ref("all");
const activeSort = ref("correlation");
const currentPage = ref(1);
const pageSize = ref(10);
const watchlist = ref([]);

const relationTypes = ref([
  { value: "all", name: "全部", icon: "fas fa-th-large" },
  { value: "industry", name: "行业关联", icon: "fas fa-industry" },
  { value: "chain", name: "产业链", icon: "fas fa-link" },
  { value: "fund", name: "资金关联", icon: "fas fa-coins" },
  { value: "trend", name: "走势关联", icon: "fas fa-chart-line" }
]);

const sortOptions = ref([
  { value: "correlation", name: "相关性" },
  { value: "change", name: "涨跌幅" },
  { value: "fund", name: "资金流向" }
]);

const stocksList = ref([
  { name: "天孚通信", code: "300394", price: 92.47, change: 5.9, correlation: 92, fundFlow: 1.2, relationType: "chain" },
  { name: "中际旭创", code: "300308", price: 168.30, change: 6.8, correlation: 88, fundFlow: 0.9, relationType: "industry" },
  { name: "工业富联", code: "601138", price: 24.16, change: 5.4, correlation: 85, fundFlow: 0.7, relationType: "trend" },
  { name: "新易盛", code: "300502", price: 86.22, change: 5.0, correlation: 82, fundFlow: 0.5, relationType: "chain" },
  { name: "浪潮信息", code: "000977", price: 42.80, change: 4.5, correlation: 78, fundFlow: 0.8, relationType: "fund" }
]);

const filteredStocks = computed(() => {
  let filtered = [...stocksList.value];
  if (activeRelation.value !== "all") {
    filtered = filtered.filter(s => s.relationType === activeRelation.value);
  }
  
  if (activeSort.value === "correlation") {
    filtered.sort((a, b) => b.correlation - a.correlation);
  } else if (activeSort.value === "change") {
    filtered.sort((a, b) => b.change - a.change);
  } else if (activeSort.value === "fund") {
    filtered.sort((a, b) => b.fundFlow - a.fundFlow);
  }
  
  return filtered;
});

const totalStocks = computed(() => filteredStocks.value.length);
const avgCorrelation = computed(() => {
  if (totalStocks.value === 0) return 0;
  const total = filteredStocks.value.reduce((sum, s) => sum + s.correlation, 0);
  return Math.round(total / totalStocks.value);
});

const totalPages = computed(() => Math.ceil(totalStocks.value / pageSize.value));
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  return filteredStocks.value.slice(start, start + pageSize.value);
});

const getRelationName = (type) => {
  const map = { industry: "行业", chain: "产业链", fund: "资金", trend: "走势" };
  return map[type] || "关联";
};

const getRankClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

const getProgressWidth = (change) => {
  return Math.min(Math.abs(change) * 10, 100);
};

const isInWatchlist = (stock) => {
  return watchlist.value.some(s => s.code === stock.code);
};

const toggleWatchlist = (stock) => {
  if (isInWatchlist(stock)) {
    watchlist.value = watchlist.value.filter(s => s.code !== stock.code);
  } else {
    watchlist.value.push(stock);
  }
};

const goToStock = (code) => {
  router.push(`/stock/${code}`);
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

/* 个股列表 */
.stock-list {
  background: #131c28;
  border-radius: 1.5rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
  overflow-x: auto;
}

.list-header {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1.2fr 1fr 1.2fr 80px;
  gap: 0.8rem;
  padding: 1rem 1.2rem;
  background: #0e1a28;
  color: #7a94b8;
  font-size: 0.8rem;
  font-weight: 500;
  border-bottom: 1px solid #2a3346;
}

.stock-item {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1.2fr 1fr 1.2fr 80px;
  gap: 0.8rem;
  padding: 0.8rem 1.2rem;
  border-bottom: 1px solid #1f2d3e;
  cursor: pointer;
  transition: all 0.2s;
}

.stock-item:hover {
  background: rgba(60, 95, 145, 0.1);
}

.stock-item:last-child {
  border-bottom: none;
}

/* 排名徽章 */
.col-rank {
  display: flex;
  align-items: center;
  justify-content: center;
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

/* 股票信息 */
.stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stock-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
}

.stock-code {
  color: #7690b5;
  font-size: 0.7rem;
}

.relation-badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.relation-badge.industry {
  background: rgba(62, 122, 255, 0.15);
  color: #3e7aff;
  border: 1px solid #3e7aff;
}

.relation-badge.chain {
  background: rgba(22, 199, 132, 0.15);
  color: #16c784;
  border: 1px solid #16c784;
}

.relation-badge.fund {
  background: rgba(255, 180, 71, 0.15);
  color: #ffb447;
  border: 1px solid #ffb447;
}

.relation-badge.trend {
  background: rgba(234, 91, 91, 0.15);
  color: #ea5b5b;
  border: 1px solid #ea5b5b;
}

/* 价格和涨跌幅 */
.col-price {
  color: #d0e2ff;
  font-weight: 500;
  font-family: monospace;
}

.col-change {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.change-value {
  font-size: 0.85rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.change-value.positive {
  color: #16c784;
}

.change-value.negative {
  color: #ea5b5b;
}

.change-progress {
  width: 80px;
  height: 3px;
  background: #1f2c3f;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s;
}

.progress-fill.positive-fill {
  background: linear-gradient(90deg, #16c784, #2ecc71);
}

.progress-fill.negative-fill {
  background: linear-gradient(90deg, #ea5b5b, #ff6b6b);
}

/* 相关性 */
.col-correlation {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.correlation-value {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ffb347;
}

.correlation-bar {
  width: 80px;
  height: 3px;
  background: #1f2c3f;
  border-radius: 2px;
  overflow: hidden;
}

.correlation-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb347, #ff9f2e);
  border-radius: 2px;
  transition: width 0.3s;
}

/* 资金流向 */
.fund-value {
  font-size: 0.85rem;
  font-weight: 500;
  font-family: monospace;
}

.fund-value.positive {
  color: #16c784;
}

.fund-value.negative {
  color: #ea5b5b;
}

/* 操作按钮 */
.add-btn {
  background: #2f4567;
  border: none;
  color: white;
  padding: 0.2rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.add-btn:hover {
  background: #3f5b86;
}

.add-btn.added {
  background: #1f2c3f;
  cursor: default;
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
@media (max-width: 1000px) {
  .list-header,
  .stock-item {
    grid-template-columns: 50px 1.5fr 0.8fr 1fr 0.8fr 1fr 70px;
    gap: 0.5rem;
  }
}

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
  
  .list-header {
    display: none;
  }
  
  .stock-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
    padding: 1rem;
  }
  
  .col-rank,
  .col-stock,
  .col-price,
  .col-change,
  .col-correlation,
  .col-fund,
  .col-action {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .col-rank::before { content: "排名: "; color: #7a94b8; }
  .col-stock::before { content: "股票: "; color: #7a94b8; }
  .col-price::before { content: "现价: "; color: #7a94b8; }
  .col-change::before { content: "涨跌幅: "; color: #7a94b8; }
  .col-correlation::before { content: "相关性: "; color: #7a94b8; }
  .col-fund::before { content: "资金流向: "; color: #7a94b8; }
  .col-action::before { content: "操作: "; color: #7a94b8; }
}
</style>