<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 板块头部信息 -->
      <div class="sector-header-card">
        <div class="sector-title-section">
          <i :class="sectorInfo.icon" class="sector-big-icon" :style="{ color: sectorInfo.iconColor }"></i>
          <div>
            <h1 class="sector-name">{{ sectorInfo.name }}</h1>
            <span class="sector-code">{{ sectorInfo.code }}</span>
          </div>
        </div>
        <div class="sector-stats">
          <div class="stat-item">
            <span class="stat-label">今日涨跌幅</span>
            <span :class="['stat-value', sectorInfo.change >= 0 ? 'positive' : 'negative']">
              <i :class="sectorInfo.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ sectorInfo.change >= 0 ? '+' : '' }}{{ sectorInfo.change }}%
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">成分股数量</span>
            <span class="stat-value">{{ sectorInfo.stockCount }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">总市值</span>
            <span class="stat-value">{{ sectorInfo.totalMarketCap }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">成交额</span>
            <span class="stat-value">{{ sectorInfo.turnover }}</span>
          </div>
        </div>
      </div>

      <!-- 板块涨跌走势图 -->
      <div class="sector-chart-card">
        <div class="chart-header">
          <h3><i class="fas fa-chart-line"></i> 板块走势</h3>
          <div class="chart-tabs">
            <button 
              :class="['chart-tab', { active: activeChart === 'kline' }]"
              @click="activeChart = 'kline'"
            >
              K线图
            </button>
            <button 
              :class="['chart-tab', { active: activeChart === 'time' }]"
              @click="activeChart = 'time'"
            >
              分时图
            </button>
          </div>
        </div>
        <div ref="chartRef" class="chart-container"></div>
      </div>

      <!-- 个股列表 -->
      <div class="stock-list-card">
        <div class="card-header">
          <h3><i class="fas fa-list"></i> 成分股列表 ({{ sectorStocks.length }})</h3>
          <div class="list-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                v-model="searchKeyword" 
                placeholder="搜索股票名称或代码..."
              />
            </div>
            <div class="sort-btns">
              <button 
                class="sort-btn" 
                :class="{ active: sortType === 'change' }"
                @click="sortType = 'change'"
              >
                按涨跌幅
              </button>
              <button 
                class="sort-btn" 
                :class="{ active: sortType === 'price' }"
                @click="sortType = 'price'"
              >
                按价格
              </button>
            </div>
          </div>
        </div>
        
        <div class="stock-list">
          <div class="list-header">
            <span class="col-name">股票名称</span>
            <span class="col-code">代码</span>
            <span class="col-price">现价</span>
            <span class="col-change">涨跌幅</span>
            <span class="col-action">操作</span>
          </div>
          <div 
            class="stock-item" 
            v-for="stock in filteredAndSortedStocks" 
            :key="stock.code"
            @click="goToStock(stock.code)"
          >
            <span class="col-name">{{ stock.name }}</span>
            <span class="col-code">{{ stock.code }}</span>
            <span class="col-price">{{ stock.price }}</span>
            <span :class="['col-change', stock.change >= 0 ? 'positive' : 'negative']">
              <i :class="stock.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ stock.change >= 0 ? '+' : '' }}{{ stock.change }}%
            </span>
            <span class="col-action">
              <button 
                class="add-btn" 
                @click.stop="addToWatchlist(stock)"
                :class="{ added: isInWatchlist(stock) }"
              >
                <i :class="isInWatchlist(stock) ? 'fas fa-check' : 'fas fa-plus'"></i>
                {{ isInWatchlist(stock) ? '已添加' : '自选' }}
              </button>
            </span>
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as echarts from "echarts";
import Breadcrumb from "~/components/breadcrumb/index.vue";

const route = useRoute();
const router = useRouter();

// 获取板块名称（从路由参数）
const sectorName = computed(() => route.params.name || "半导体");

// 板块信息
const sectorInfo = ref({
  name: "半导体",
  code: "BK801",
  icon: "fas fa-microchip",
  iconColor: "#6b9eff",
  change: 4.2,
  stockCount: 126,
  totalMarketCap: "3.2万亿",
  turnover: "856亿"
});

// 板块成分股数据
const sectorStocks = ref([
  { name: "中芯国际", code: "688981", price: 48.25, change: 2.1 },
  { name: "北方华创", code: "002371", price: 258.60, change: 3.4 },
  { name: "韦尔股份", code: "603501", price: 92.47, change: 1.8 },
  { name: "兆易创新", code: "603986", price: 89.30, change: 2.5 },
  { name: "紫光国微", code: "002049", price: 65.20, change: 1.5 },
  { name: "长电科技", code: "600584", price: 28.90, change: 0.8 },
  { name: "卓胜微", code: "300782", price: 112.50, change: 3.2 },
  { name: "圣邦股份", code: "300661", price: 78.60, change: 1.2 },
  { name: "华润微", code: "688396", price: 52.30, change: 0.5 },
  { name: "闻泰科技", code: "600745", price: 42.80, change: -0.3 },
  { name: "三安光电", code: "600703", price: 15.60, change: 0.2 },
  { name: "士兰微", code: "600460", price: 22.40, change: 1.0 }
]);

// 自选股列表（模拟）
const watchlist = ref([]);

// 搜索和排序
const searchKeyword = ref("");
const sortType = ref("change"); // change, price
const currentPage = ref(1);
const pageSize = ref(10);

// 图表相关
const chartRef = ref(null);
let chart = null;
const activeChart = ref("kline");

// 过滤和排序
const filteredStocks = computed(() => {
  if (!searchKeyword.value) return sectorStocks.value;
  const keyword = searchKeyword.value.toLowerCase();
  return sectorStocks.value.filter(s => 
    s.name.toLowerCase().includes(keyword) || 
    s.code.includes(keyword)
  );
});

const sortedStocks = computed(() => {
  const list = [...filteredStocks.value];
  if (sortType.value === "change") {
    list.sort((a, b) => b.change - a.change);
  } else if (sortType.value === "price") {
    list.sort((a, b) => b.price - a.price);
  }
  return list;
});

const filteredAndSortedStocks = computed(() => {
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
      pages.push('...');
      pages.push(total);
    } else if (current >= total - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = total - 3; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      pages.push('...');
      for (let i = current - 1; i <= current + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(total);
    }
  }
  return pages;
});

// 检查是否在自选列表
const isInWatchlist = (stock) => {
  return watchlist.value.some(s => s.code === stock.code);
};

// 添加到自选
const addToWatchlist = (stock) => {
  if (!isInWatchlist(stock)) {
    watchlist.value.push(stock);
  }
};

// 跳转到个股详情
const goToStock = (code) => {
  router.push(`/stock?code=${code}`);
};

// 生成板块走势数据
const generateChartData = () => {
  const dates = [];
  const prices = [];
  let price = 1000;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    price += (Math.random() - 0.5) * 15;
    price = Math.max(950, Math.min(1150, price));
    prices.push(price);
  }
  
  return { dates, prices };
};

// 绘制图表
const drawChart = () => {
  if (!chartRef.value) return;
  
  if (!chart) {
    chart = echarts.init(chartRef.value);
  }
  
  const { dates, prices } = generateChartData();
  
  const option = {
    backgroundColor: "transparent",
    tooltip: { trigger: "axis" },
    grid: { left: "8%", right: "5%", top: "10%", bottom: "8%", containLabel: true },
    xAxis: { 
      type: "category", 
      data: dates, 
      axisLabel: { color: "#7a94b8", rotate: 45, fontSize: 10 } 
    },
    yAxis: { 
      type: "value", 
      name: "指数点位",
      nameTextStyle: { color: "#7a94b8" },
      axisLabel: { color: "#7a94b8" },
      splitLine: { lineStyle: { color: "#25344a" } }
    },
    series: [{
      name: "板块指数",
      type: "line",
      data: prices,
      smooth: true,
      lineStyle: { color: "#3e7aff", width: 2 },
      areaStyle: { opacity: 0.1, color: "#3e7aff" },
      symbol: "circle",
      symbolSize: 3
    }]
  };
  
  chart.setOption(option, true);
};

// 监听窗口大小变化
const handleResize = () => {
  if (chart) chart.resize();
};

onMounted(() => {
  // 根据路由参数更新板块信息
  if (route.params.name) {
    sectorInfo.value.name = route.params.name;
  }
  drawChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (chart) {
    chart.dispose();
    chart = null;
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style lang="scss" scoped>
.page-container {
  padding: 1rem 2rem 2rem 2rem;
}

/* 板块头部卡片 */
.sector-header-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
}

.sector-title-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.sector-big-icon {
  font-size: 2.5rem;
}

.sector-name {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.sector-code {
  color: #7a94b8;
  font-size: 0.9rem;
}

.sector-stats {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.stat-label {
  color: #7a94b8;
  font-size: 0.75rem;
}

.stat-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

/* 板块走势图表 */
.sector-chart-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.chart-header h3 {
  color: #b3ceff;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.chart-tabs {
  display: flex;
  gap: 0.5rem;
  background: #1b232f;
  padding: 0.2rem;
  border-radius: 40px;
}

.chart-tab {
  padding: 0.4rem 1.2rem;
  border-radius: 30px;
  font-size: 0.85rem;
  color: #99aec9;
  cursor: pointer;
  background: transparent;
  border: none;
}

.chart-tab.active {
  background: #2f4567;
  color: white;
}

.chart-container {
  width: 100%;
  height: 320px;
}

/* 个股列表卡片 */
.stock-list-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.card-header h3 {
  color: #b3ceff;
  font-size: 1rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.list-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  background: #0e1622;
  border: 1px solid #2c3f5c;
  border-radius: 30px;
  padding: 0.4rem 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.search-box i {
  color: #6b85ad;
  font-size: 0.8rem;
}

.search-box input {
  background: transparent;
  border: none;
  outline: none;
  color: #ecf5ff;
  width: 180px;
  font-size: 0.85rem;
}

.sort-btns {
  display: flex;
  gap: 0.5rem;
  background: #1f2c3f;
  padding: 0.2rem;
  border-radius: 30px;
}

.sort-btn {
  background: transparent;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 30px;
  color: #99aec9;
  font-size: 0.75rem;
  cursor: pointer;
}

.sort-btn.active {
  background: #2f4567;
  color: white;
}

/* 列表样式 */
.stock-list {
  overflow-x: auto;
}

.list-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.8rem 0.5rem;
  background: #0e1a28;
  border-radius: 0.8rem;
  color: #7a94b8;
  font-size: 0.8rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.stock-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 1rem;
  padding: 0.8rem 0.5rem;
  border-bottom: 1px solid #1f2d3e;
  cursor: pointer;
  transition: all 0.2s;
}

.stock-item:hover {
  background: rgba(60, 95, 145, 0.1);
  border-radius: 0.8rem;
}

.col-name {
  color: #ffffff;
  font-weight: 500;
}

.col-code {
  color: #7690b5;
  font-size: 0.8rem;
}

.col-price {
  color: #d0e2ff;
  font-weight: 500;
}

.col-change {
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
}

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
  width: 32px;
  height: 32px;
  border-radius: 8px;
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

/* 通用颜色 */
.positive {
  color: #16c784;
}

.negative {
  color: #ea5b5b;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .list-header,
  .stock-item {
    grid-template-columns: 1.5fr 1fr 1fr 1fr 0.8fr;
    gap: 0.5rem;
    font-size: 0.8rem;
  }
  
  .card-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .list-controls {
    width: 100%;
  }
  
  .search-box {
    flex: 1;
  }
  
  .search-box input {
    width: 100%;
  }
}
</style>