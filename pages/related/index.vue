<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 页面头部 -->
      <div class="page-header">
        <div>
          <h2 class="page-title">
            <i class="fas fa-chart-line"></i> 相关个股
            <span class="stock-badge"
              >{{ currentStock.name }}({{ currentStock.code }})</span
            >
          </h2>
          <p class="page-desc">
            基于行业、产业链、资金流向等多维度智能分析，推荐与当前股票关联度最高的个股
          </p>
        </div>
        <div class="header-stats">
          <div class="stat-card">
            <span class="stat-label">相关个股数量</span>
            <span class="stat-value">{{ relatedStocks.length }}</span>
          </div>
          <div class="stat-card">
            <span class="stat-label">平均相关性</span>
            <span class="stat-value">{{ avgCorrelation }}%</span>
          </div>
        </div>
      </div>

      <!-- 筛选和排序栏 -->
      <div class="filter-bar">
        <div class="filter-group">
          <span class="filter-label">关联类型：</span>
          <div class="filter-btns">
            <button
              v-for="type in relationTypes"
              :key="type.value"
              :class="[
                'filter-btn',
                { active: activeRelationType === type.value },
              ]"
              @click="activeRelationType = type.value"
            >
              <i :class="type.icon"></i> {{ type.name }}
            </button>
          </div>
        </div>
        <div class="sort-group">
          <span class="filter-label">排序：</span>
          <div class="sort-btns">
            <button
              :class="['sort-btn', { active: sortBy === 'correlation' }]"
              @click="sortBy = 'correlation'"
            >
              相关性
            </button>
            <button
              :class="['sort-btn', { active: sortBy === 'change' }]"
              @click="sortBy = 'change'"
            >
              涨跌幅
            </button>
            <button
              :class="['sort-btn', { active: sortBy === 'fund' }]"
              @click="sortBy = 'fund'"
            >
              资金流向
            </button>
          </div>
        </div>
      </div>

      <!-- 相关个股列表 -->
      <div class="related-stocks-list">
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
          v-for="(stock, index) in sortedStocks"
          :key="stock.code"
          @click="goToStock(stock.code)"
        >
          <div class="col-rank">
            <span class="rank-num" :class="{ top: index < 3 }">{{
              index + 1
            }}</span>
          </div>
          <div class="col-stock">
            <div class="stock-info">
              <span class="stock-name">{{ stock.name }}</span>
              <span class="stock-code">{{ stock.code }}</span>
              <span class="relation-badge" :class="stock.relationType">
                <i :class="getRelationIcon(stock.relationType)"></i>
                {{ getRelationName(stock.relationType) }}
              </span>
            </div>
          </div>
          <div class="col-price">
            <span class="price-value">{{ stock.price }}</span>
          </div>
          <div class="col-change">
            <span
              :class="[
                'change-value',
                stock.change >= 0 ? 'positive' : 'negative',
              ]"
            >
              <i
                :class="
                  stock.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
              {{ stock.change >= 0 ? "+" : "" }}{{ stock.change }}%
            </span>
            <!-- 涨跌幅进度条 -->
            <div class="change-bar-container">
              <div
                class="change-bar"
                :class="stock.change >= 0 ? 'positive-bar' : 'negative-bar'"
                :style="{
                  width: Math.min(Math.abs(stock.change) * 10, 100) + '%',
                }"
              ></div>
            </div>
          </div>
          <div class="col-correlation">
            <div class="correlation-wrapper">
              <div class="correlation-value">{{ stock.correlation }}%</div>
              <div class="correlation-bar">
                <div
                  class="correlation-fill"
                  :style="{ width: stock.correlation + '%' }"
                ></div>
              </div>
            </div>
          </div>
          <div class="col-fund">
            <span
              :class="[
                'fund-value',
                stock.fundFlow >= 0 ? 'positive' : 'negative',
              ]"
            >
              <i
                :class="
                  stock.fundFlow >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'
                "
              ></i>
              {{ formatFundFlow(stock.fundFlow) }}
            </span>
          </div>
          <div class="col-action">
            <button
              class="action-btn"
              :class="{ added: isInWatchlist(stock) }"
              @click.stop="toggleWatchlist(stock)"
            >
              <i
                :class="isInWatchlist(stock) ? 'fas fa-check' : 'fas fa-plus'"
              ></i>
              {{ isInWatchlist(stock) ? "已添加" : "自选" }}
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="sortedStocks.length === 0" class="empty-state">
        <i class="fas fa-chart-line"></i>
        <p>暂无相关个股数据</p>
      </div>

      <!-- 分页 -->
      <div class="pagination" v-if="totalPages > 1">
        <button
          class="page-btn"
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
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
        <button
          class="page-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          <i class="fas fa-chevron-right"></i>
        </button>
        <span class="page-info"
          >共 {{ totalPages }} 页 / {{ filteredStocks.length }} 条</span
        >
      </div>

      <!-- 关联分析说明 -->
      <div class="analysis-note">
        <div class="note-header">
          <i class="fas fa-chart-line"></i>
          <span>关联分析说明</span>
        </div>
        <div class="note-content">
          <div class="note-item">
            <i class="fas fa-microchip"></i>
            <span>行业关联：同属一个产业链上下游</span>
          </div>
          <div class="note-item">
            <i class="fas fa-chart-line"></i>
            <span>资金关联：主力资金流向相似</span>
          </div>
          <div class="note-item">
            <i class="fas fa-chart-bar"></i>
            <span>走势关联：股价走势高度相关</span>
          </div>
          <div class="note-item">
            <i class="fas fa-newspaper"></i>
            <span>资讯关联：同时被提及的热点新闻</span>
          </div>
        </div>
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

// 当前股票信息（从路由获取或默认）
const currentStock = ref({
  name: "宁德时代",
  code: "300750.SZ",
});

// 关联类型筛选
const relationTypes = ref([
  { value: "all", name: "全部", icon: "fas fa-th-large" },
  { value: "industry", name: "行业关联", icon: "fas fa-industry" },
  { value: "chain", name: "产业链关联", icon: "fas fa-link" },
  { value: "fund", name: "资金关联", icon: "fas fa-coins" },
  { value: "trend", name: "走势关联", icon: "fas fa-chart-line" },
]);

const activeRelationType = ref("all");
const sortBy = ref("correlation");
const currentPage = ref(1);
const pageSize = ref(10);
const watchlist = ref([]);

// 相关个股数据
const relatedStocks = ref([
  {
    name: "比亚迪",
    code: "002594.SZ",
    price: 258.6,
    change: 0.84,
    correlation: 92,
    fundFlow: 2.35,
    relationType: "chain",
    relationDetail: "动力电池下游客户，深度合作",
  },
  {
    name: "亿纬锂能",
    code: "300014.SZ",
    price: 45.2,
    change: 2.15,
    correlation: 88,
    fundFlow: 1.52,
    relationType: "industry",
    relationDetail: "锂电池行业龙头，竞争关系",
  },
  {
    name: "国轩高科",
    code: "002074.SZ",
    price: 21.8,
    change: 1.23,
    correlation: 85,
    fundFlow: 0.86,
    relationType: "industry",
    relationDetail: "动力电池二线厂商",
  },
  {
    name: "欣旺达",
    code: "300207.SZ",
    price: 16.5,
    change: -0.52,
    correlation: 82,
    fundFlow: -0.32,
    relationType: "chain",
    relationDetail: "消费电池供应商",
  },
  {
    name: "德方纳米",
    code: "300769.SZ",
    price: 89.3,
    change: 3.45,
    correlation: 79,
    fundFlow: 1.23,
    relationType: "chain",
    relationDetail: "磷酸铁锂正极材料供应商",
  },
  {
    name: "当升科技",
    code: "300073.SZ",
    price: 42.6,
    change: 1.87,
    correlation: 76,
    fundFlow: 0.68,
    relationType: "chain",
    relationDetail: "正极材料核心供应商",
  },
  {
    name: "天赐材料",
    code: "002709.SZ",
    price: 22.38,
    change: 1.91,
    correlation: 74,
    fundFlow: 0.95,
    relationType: "chain",
    relationDetail: "电解液核心供应商",
  },
  {
    name: "璞泰来",
    code: "603659.SH",
    price: 28.9,
    change: 2.32,
    correlation: 72,
    fundFlow: 0.54,
    relationType: "chain",
    relationDetail: "负极材料供应商",
  },
  {
    name: "星源材质",
    code: "300568.SZ",
    price: 12.3,
    change: 0.65,
    correlation: 70,
    fundFlow: 0.28,
    relationType: "chain",
    relationDetail: "隔膜材料供应商",
  },
  {
    name: "先导智能",
    code: "300450.SZ",
    price: 23.5,
    change: -1.02,
    correlation: 68,
    fundFlow: -0.45,
    relationType: "chain",
    relationDetail: "锂电设备核心供应商",
  },
]);

// 筛选后的数据
const filteredStocks = computed(() => {
  if (activeRelationType.value === "all") {
    return relatedStocks.value;
  }
  return relatedStocks.value.filter(
    (s) => s.relationType === activeRelationType.value,
  );
});

// 排序后的数据
const sortedStocks = computed(() => {
  const list = [...filteredStocks.value];
  if (sortBy.value === "correlation") {
    list.sort((a, b) => b.correlation - a.correlation);
  } else if (sortBy.value === "change") {
    list.sort((a, b) => b.change - a.change);
  } else if (sortBy.value === "fund") {
    list.sort((a, b) => b.fundFlow - a.fundFlow);
  }
  return list;
});

// 分页数据
const paginatedStocks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return sortedStocks.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(sortedStocks.value.length / pageSize.value);
});

const visiblePages = computed(() => {
  const total = totalPages.value;
  const current = currentPage.value;
  const pages = [];
  const maxVisible = 5;

  if (total <= maxVisible) {
    for (let i = 1; i <= total; i++) pages.push(i);
  } else {
    if (current <= 3) {
      for (let i = 1; i <= 4; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push(1);
      pages.push("...");
      for (let i = total - 3; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push("...");
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push("...");
      pages.push(total);
    }
  }
  return pages;
});

// 计算平均相关性
const avgCorrelation = computed(() => {
  if (filteredStocks.value.length === 0) return 0;
  const total = filteredStocks.value.reduce((sum, s) => sum + s.correlation, 0);
  return Math.round(total / filteredStocks.value.length);
});

// 获取关联类型图标
const getRelationIcon = (type) => {
  const icons = {
    industry: "fas fa-industry",
    chain: "fas fa-link",
    fund: "fas fa-coins",
    trend: "fas fa-chart-line",
  };
  return icons[type] || "fas fa-chart-line";
};

// 获取关联类型名称
const getRelationName = (type) => {
  const names = {
    industry: "行业关联",
    chain: "产业链关联",
    fund: "资金关联",
    trend: "走势关联",
  };
  return names[type] || "关联";
};

// 格式化资金流向
const formatFundFlow = (value) => {
  if (value >= 0) {
    return `+${value.toFixed(2)}亿`;
  }
  return `${value.toFixed(2)}亿`;
};

// 检查是否在自选列表
const isInWatchlist = (stock) => {
  return watchlist.value.some((s) => s.code === stock.code);
};

// 切换自选
const toggleWatchlist = (stock) => {
  if (isInWatchlist(stock)) {
    watchlist.value = watchlist.value.filter((s) => s.code !== stock.code);
  } else {
    watchlist.value.push(stock);
  }
};

// 跳转到个股详情
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
  align-items: flex-start;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  color: #e2f0ff;
  font-size: 1.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 0.3rem;
  flex-wrap: wrap;
}

.stock-badge {
  background: #2f4567;
  color: #ffb347;
  font-size: 1rem;
  padding: 0.2rem 0.8rem;
  border-radius: 30px;
  font-weight: normal;
}

.page-desc {
  color: #7a94b8;
  font-size: 0.85rem;
}

.header-stats {
  display: flex;
  gap: 1rem;
}

.stat-card {
  background: #0e1a28;
  border-radius: 1rem;
  padding: 0.6rem 1.2rem;
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
  font-size: 1.2rem;
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
}

.filter-group,
.sort-group {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.filter-label {
  color: #7a94b8;
  font-size: 0.85rem;
}

.filter-btns,
.sort-btns {
  display: flex;
  gap: 0.5rem;
  background: #1f2c3f;
  padding: 0.2rem;
  border-radius: 40px;
}

.filter-btn,
.sort-btn {
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

.filter-btn.active,
.sort-btn.active {
  background: #2f4567;
  color: white;
}

.filter-btn:hover:not(.active),
.sort-btn:hover:not(.active) {
  background: #253040;
  color: #d3e3ff;
}

/* 列表样式 */
.related-stocks-list {
  background: #131c28;
  border-radius: 1.5rem;
  border: 1px solid #273349;
  overflow-x: auto;
  margin-bottom: 1.5rem;
}

.list-header {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1.2fr 1.2fr 1.2fr 80px;
  gap: 1rem;
  padding: 1rem 1.2rem;
  background: #0e1a28;
  color: #7a94b8;
  font-size: 0.85rem;
  font-weight: 500;
  border-bottom: 1px solid #2a3346;
}

.stock-item {
  display: grid;
  grid-template-columns: 60px 2fr 1fr 1.2fr 1.2fr 1.2fr 80px;
  gap: 1rem;
  padding: 1rem 1.2rem;
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

/* 列样式 */
.col-rank {
  display: flex;
  align-items: center;
  justify-content: center;
}

.rank-num {
  width: 32px;
  height: 32px;
  background: #1f2c3f;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #7a94b8;
}

.rank-num.top {
  background: #ffb347;
  color: #0b0e14;
}

.col-stock .stock-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stock-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 0.95rem;
}

.stock-code {
  color: #7690b5;
  font-size: 0.7rem;
}

.relation-badge {
  font-size: 0.65rem;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.relation-badge.industry {
  background: rgba(62, 122, 255, 0.2);
  color: #6b9eff;
  border: 1px solid #6b9eff;
}

.relation-badge.chain {
  background: rgba(22, 199, 132, 0.2);
  color: #16c784;
  border: 1px solid #16c784;
}

.relation-badge.fund {
  background: rgba(255, 180, 71, 0.2);
  color: #ffb447;
  border: 1px solid #ffb447;
}

.relation-badge.trend {
  background: rgba(234, 91, 91, 0.2);
  color: #ea5b5b;
  border: 1px solid #ea5b5b;
}

.col-price .price-value {
  color: #d0e2ff;
  font-weight: 500;
  font-size: 0.95rem;
}

.col-change {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.change-value {
  font-weight: 600;
  font-size: 0.9rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  width: fit-content;
}

.change-bar-container {
  width: 100%;
  height: 4px;
  background: #1f2c3f;
  border-radius: 2px;
  overflow: hidden;
}

.change-bar {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.change-bar.positive-bar {
  background: linear-gradient(90deg, #16c784, #2ecc71);
}

.change-bar.negative-bar {
  background: linear-gradient(90deg, #ea5b5b, #ff6b6b);
}

/* 相关性样式 */
.correlation-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.correlation-value {
  font-weight: 600;
  font-size: 0.85rem;
  color: #ffb347;
}

.correlation-bar {
  width: 100%;
  height: 4px;
  background: #1f2c3f;
  border-radius: 2px;
  overflow: hidden;
}

.correlation-fill {
  height: 100%;
  background: linear-gradient(90deg, #ffb347, #ff9f2e);
  border-radius: 2px;
  transition: width 0.3s ease;
}

/* 资金流向 */
.fund-value {
  font-weight: 500;
  font-size: 0.85rem;
  font-family: monospace;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

/* 操作按钮 */
.col-action {
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn {
  background: #2f4567;
  border: none;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.action-btn:hover {
  background: #3f5b86;
  transform: translateY(-1px);
}

.action-btn.added {
  background: #1f2c3f;
  cursor: default;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7a94b8;
  background: #131c28;
  border-radius: 1.5rem;
  border: 1px solid #273349;
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
  margin-top: 1.5rem;
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

.page-info {
  color: #7a94b8;
  font-size: 0.8rem;
  margin-left: 0.8rem;
}

/* 关联分析说明 */
.analysis-note {
  background: #0e1a28;
  border-radius: 1rem;
  padding: 1rem 1.2rem;
  margin-top: 1.5rem;
  border: 1px solid #2a3f60;
}

.note-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #b3ceff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.8rem;
}

.note-content {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.note-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  color: #7a94b8;
  font-size: 0.75rem;
}

.note-item i {
  font-size: 0.7rem;
  color: #6b9eff;
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

  .list-header,
  .stock-item {
    grid-template-columns: 50px 1.5fr 0.8fr 1fr 1fr 1fr 70px;
    gap: 0.5rem;
    font-size: 0.8rem;
  }

  .filter-bar {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
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

  .col-rank::before {
    content: "排名: ";
    color: #7a94b8;
  }
  .col-stock::before {
    content: "股票: ";
    color: #7a94b8;
  }
  .col-price::before {
    content: "现价: ";
    color: #7a94b8;
  }
  .col-change::before {
    content: "涨跌幅: ";
    color: #7a94b8;
  }
  .col-correlation::before {
    content: "相关性: ";
    color: #7a94b8;
  }
  .col-fund::before {
    content: "资金流向: ";
    color: #7a94b8;
  }
  .col-action::before {
    content: "操作: ";
    color: #7a94b8;
  }

  .col-stock .stock-info {
    flex: 1;
    justify-content: flex-end;
  }

  .correlation-wrapper {
    align-items: flex-end;
  }
}
</style>
