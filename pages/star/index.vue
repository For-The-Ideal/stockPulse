<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <div class="watchlist-header">
        <h2 class="page-title">
          <i class="fas fa-star" style="color: #ffb347"></i> 我的自选股
        </h2>
        <div class="header-actions">
          <button class="action-btn" :disabled="isRefreshing" @click="refreshData">
            <i :class="['fas', isRefreshing ? 'fa-spinner fa-pulse' : 'fa-sync-alt']"></i>
            {{ isRefreshing ? '刷新中...' : '刷新' }}
          </button>
          <button class="action-btn add-btn" @click="showAddDialog">
            <i class="fas fa-plus"></i> 添加自选
          </button>
        </div>
      </div>

      <div class="watchlist-grid">
        <!-- 核心自选 -->
        <div class="watch-group">
          <div class="group-title">
            <i class="fas fa-star" style="color: #ffb347"></i> 核心自选
            <span class="group-stats">{{ coreStocks.length }}只 | 今日涨幅 {{ coreGroupChange }}%</span>
          </div>
          <div class="watch-item header-item">
            <span class="stock-name">股票名称</span>
            <span class="stock-price">现价</span>
            <span class="stock-change">涨跌幅</span>
          </div>
          <transition-group name="fade" tag="div">
            <div class="watch-item" v-for="stock in coreStocks" :key="stock.code">
              <span class="stock-name">
                <span class="stock-symbol">{{ stock.name }}</span>
                <span class="stock-code">{{ stock.code }}</span>
              </span>
              <span class="stock-price">{{ formatPrice(stock.price) }}</span>
              <span :class="['stock-change', stock.changePercent >= 0 ? 'positive' : 'negative']">
                <i :class="stock.changePercent >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ formatChange(stock.changePercent) }}
              </span>
            </div>
          </transition-group>
        </div>

        <!-- 最近浏览 -->
        <div class="watch-group">
          <div class="group-title">
            <i class="fas fa-clock"></i> 最近浏览
            <span class="group-stats">{{ recentStocks.length }}只</span>
          </div>
          <div class="watch-item header-item">
            <span class="stock-name">股票名称</span>
            <span class="stock-price">现价</span>
            <span class="stock-change">涨跌幅</span>
          </div>
          <transition-group name="fade" tag="div">
            <div class="watch-item" v-for="stock in recentStocks" :key="stock.code">
              <span class="stock-name">
                <span class="stock-symbol">{{ stock.name }}</span>
                <span class="stock-code">{{ stock.code }}</span>
              </span>
              <span class="stock-price">{{ formatPrice(stock.price) }}</span>
              <span :class="['stock-change', stock.changePercent >= 0 ? 'positive' : 'negative']">
                <i :class="stock.changePercent >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ formatChange(stock.changePercent) }}
              </span>
            </div>
          </transition-group>
        </div>

        <!-- 异动提醒 -->
        <div class="watch-group">
          <div class="group-title">
            <i class="fas fa-bell"></i> 异动提醒
            <span class="group-stats">今日异动 {{ alertStocks.length }}只</span>
          </div>
          <div class="watch-item header-item">
            <span class="stock-name">股票名称</span>
            <span class="stock-price">现价</span>
            <span class="stock-change">异动类型</span>
          </div>
          <transition-group name="fade" tag="div">
            <div class="watch-item" v-for="stock in alertStocks" :key="stock.code">
              <span class="stock-name">
                <span class="stock-symbol">{{ stock.name }}</span>
                <span class="stock-code">{{ stock.code }}</span>
                <span class="alert-badge" :class="stock.alertType" v-if="stock.alert">
                  <i :class="getAlertIcon(stock.alertType)"></i>
                  {{ getAlertText(stock.alertType) }}
                </span>
              </span>
              <span class="stock-price">{{ formatPrice(stock.price) }}</span>
              <span :class="['stock-change', stock.changePercent >= 0 ? 'positive' : 'negative']">
                <i :class="stock.changePercent >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ formatChange(stock.changePercent) }}
              </span>
            </div>
          </transition-group>
        </div>

        <!-- 自定义组合 -->
        <div class="watch-group">
          <div class="group-title">
            <i class="fas fa-chart-pie"></i> 自定义组合
            <span class="group-stats">{{ portfolios.length }}个组合</span>
          </div>
          <transition-group name="fade" tag="div">
            <div class="portfolio-item" v-for="portfolio in portfolios" :key="portfolio.name">
              <div class="portfolio-info">
                <span class="portfolio-name">{{ portfolio.name }}</span>
                <span class="portfolio-desc">{{ portfolio.desc }}</span>
              </div>
              <div :class="['portfolio-change', portfolio.change >= 0 ? 'positive' : 'negative']">
                <i :class="portfolio.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                {{ formatChange(portfolio.change) }}
              </div>
            </div>
          </transition-group>
        </div>
      </div>

      <!-- 异动统计面板 -->
      <div class="alert-stats" v-if="alertStocks.length">
        <div class="stats-title">
          <i class="fas fa-chart-line"></i> 异动统计
          <span class="stats-time">实时更新</span>
        </div>
        <div class="stats-grid">
          <div class="stat-card surge">
            <i class="fas fa-rocket"></i>
            <div class="stat-info">
              <span class="stat-label">涨幅异动</span>
              <span class="stat-value">{{ surgeCount }}只</span>
            </div>
          </div>
          <div class="stat-card plunge">
            <i class="fas fa-fall"></i>
            <div class="stat-info">
              <span class="stat-label">跌幅异动</span>
              <span class="stat-value">{{ plungeCount }}只</span>
            </div>
          </div>
          <div class="stat-card volume">
            <i class="fas fa-waveform"></i>
            <div class="stat-info">
              <span class="stat-label">放量异动</span>
              <span class="stat-value">{{ volumeSurgeCount }}只</span>
            </div>
          </div>
        </div>
      </div>
    </div>

     <AddStockModal
      v-model:visible="showAddModal"
      :existing-stocks="watchlist"
      @add="handleAddStock"
    />
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Breadcrumb from "~/components/breadcrumb/index.vue";
import AddStockModal from '~/components/addStockModal/index.vue';

const showAddModal = ref(false);
// 核心自选股数据
const coreStocks = ref([
  { name: "腾讯控股", code: "00700", price: 378.20, changePercent: 2.35 },
  { name: "贵州茅台", code: "600519", price: 1685.01, changePercent: 1.12 },
  { name: "宁德时代", code: "300750", price: 209.80, changePercent: 3.67 },
  { name: "特斯拉", code: "TSLA", price: 189.35, changePercent: -0.78 },
  { name: "英伟达", code: "NVDA", price: 131.44, changePercent: 4.08 }
]);

// 最近浏览数据
const recentStocks = ref([
  { name: "中芯国际", code: "688981", price: 48.25, changePercent: 2.10 },
  { name: "比亚迪", code: "002594", price: 258.60, changePercent: 0.84 },
  { name: "东方财富", code: "300059", price: 13.52, changePercent: 0.97 },
  { name: "药明康德", code: "603259", price: 42.50, changePercent: -4.10 }
]);

// 异动提醒数据
const alertStocks = ref([
  { 
    name: "工业富联", 
    code: "601138", 
    price: 24.16, 
    changePercent: 5.42, 
    alert: true, 
    alertType: "surge"
  },
  { 
    name: "天孚通信", 
    code: "300394", 
    price: 92.47, 
    changePercent: 5.91, 
    alert: true, 
    alertType: "surge"
  },
  { 
    name: "山西汾酒", 
    code: "600809", 
    price: 225.80, 
    changePercent: -3.21, 
    alert: true, 
    alertType: "plunge"
  },
  { 
    name: "中际旭创", 
    code: "300308", 
    price: 168.30, 
    changePercent: 6.82, 
    alert: true, 
    alertType: "surge"
  },
  { 
    name: "药明康德", 
    code: "603259", 
    price: 42.50, 
    changePercent: -4.10, 
    alert: true, 
    alertType: "plunge"
  },
  { 
    name: "宁德时代", 
    code: "300750", 
    price: 209.80, 
    changePercent: 3.67, 
    alert: true, 
    alertType: "volume"
  }
]);

// 自定义组合数据
const portfolios = ref([
  { name: "AI 硬件组合", desc: "算力 + 芯片", change: 3.28 },
  { name: "创新药精选", desc: "生物医药", change: -1.15 },
  { name: "红利低波", desc: "高股息策略", change: 0.42 }
]);

// 刷新状态
const isRefreshing = ref(false);

// 计算各类型异动数量
const surgeCount = computed(() => {
  return alertStocks.value.filter(s => s.alertType === 'surge').length;
});

const plungeCount = computed(() => {
  return alertStocks.value.filter(s => s.alertType === 'plunge').length;
});

const volumeSurgeCount = computed(() => {
  return alertStocks.value.filter(s => s.alertType === 'volume').length;
});

// 计算核心自选组整体涨跌幅
const coreGroupChange = computed(() => {
  if (coreStocks.value.length === 0) return 0;
  const total = coreStocks.value.reduce((sum, stock) => sum + stock.changePercent, 0);
  return (total / coreStocks.value.length).toFixed(2);
});

// 获取异动图标
const getAlertIcon = (type) => {
  const icons = {
    surge: 'fas fa-rocket',
    plunge: 'fas fa-fall',
    volume: 'fas fa-waveform'
  };
  return icons[type] || 'fas fa-bell';
};

// 获取异动文字
const getAlertText = (type) => {
  const texts = {
    surge: '涨幅异动',
    plunge: '跌幅异动',
    volume: '放量异动'
  };
  return texts[type] || '异动';
};

// 格式化价格显示
const formatPrice = (price) => {
  if (typeof price === 'number') {
    return price.toFixed(2);
  }
  return parseFloat(price).toFixed(2);
};

// 格式化涨跌幅显示
const formatChange = (change) => {
  const value = typeof change === 'number' ? change : parseFloat(change);
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
};

// 刷新数据
const refreshData = async () => {
  if (isRefreshing.value) return;
  
  isRefreshing.value = true;
  
  try {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    coreStocks.value = coreStocks.value.map(stock => ({
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.01),
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5
    }));
    
    recentStocks.value = recentStocks.value.map(stock => ({
      ...stock,
      price: stock.price * (1 + (Math.random() - 0.5) * 0.01),
      changePercent: stock.changePercent + (Math.random() - 0.5) * 0.5
    }));
    
    alertStocks.value = alertStocks.value.map(stock => {
      const newChange = stock.changePercent + (Math.random() - 0.5) * 1;
      let newAlertType = stock.alertType;
      
      if (newChange > 3) newAlertType = 'surge';
      else if (newChange < -2) newAlertType = 'plunge';
      else if (Math.random() > 0.7) newAlertType = 'volume';
      else newAlertType = stock.alertType;
      
      return {
        ...stock,
        price: stock.price * (1 + (Math.random() - 0.5) * 0.02),
        changePercent: newChange,
        alertType: newAlertType
      };
    });
    
  } catch (error) {
    console.error('刷新失败', error);
  } finally {
    isRefreshing.value = false;
  }
};

// 添加自选
const showAddDialog = () => {
  console.log('打开添加自选弹窗');
  showAddModal.value = true;
};

// 自选股列表
const watchlist = ref([
  { code: '600519', name: '贵州茅台', price: 1685.01, changePercent: 1.12, market: 'sh' },
  { code: '300750', name: '宁德时代', price: 209.80, changePercent: 3.67, market: 'sz' },
]);

// 添加股票到自选
const handleAddStock = (stock) => {
  if (!watchlist.value.some(s => s.code === stock.code)) {
    watchlist.value.push(stock);
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  padding: 1rem 2rem 2rem 2rem;
}

.watchlist-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  color: #e2f0ff;
  font-size: 1.8rem;  // 从 1.5rem 调大
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-actions {
  display: flex;
  gap: 0.8rem;
}

.action-btn {
  background: #1f2c3f;
  border: 1px solid #2f4567;
  color: #b8d6ff;
  padding: 0.6rem 1.4rem;  // 从 0.5rem 1.2rem 调大
  border-radius: 30px;
  font-size: 0.95rem;  // 从 0.85rem 调大
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.action-btn:hover:not(:disabled) {
  background: #2f4567;
  color: white;
  border-color: #5f8ad4;
}

.add-btn {
  background: #2f4567;
  color: white;
}

.add-btn:hover:not(:disabled) {
  background: #3f5b86;
}

.watchlist-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.2rem;
  margin-bottom: 1.5rem;
}

.watch-group {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.4rem;
  border: 1px solid #273349;
  transition: all 0.2s;
  will-change: transform;
}

.group-title {
  color: #b3ceff;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.2rem;  // 从 1.1rem 调大
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.group-stats {
  color: #7a94b8;
  font-size: 0.85rem;  // 从 0.75rem 调大
  font-weight: normal;
}

.watch-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.85rem 0;  // 从 0.7rem 调大
  border-bottom: 1px dashed #253c58;
  transition: all 0.2s;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.watch-item:hover {
  background: rgba(60, 95, 145, 0.1);
  margin: 0 -0.5rem;
  padding: 0.85rem 0.5rem;
  border-radius: 8px;
}

.watch-item:last-child {
  border-bottom: none;
}

.header-item {
  color: #7a94b8;
  font-size: 0.9rem;  // 从 0.8rem 调大
  border-bottom: 1px solid #2f405a;
  margin-bottom: 0.3rem;
}

.header-item:hover {
  background: transparent;
  margin: 0;
  padding: 0.85rem 0;
}

.stock-name {
  flex: 2;
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.stock-symbol {
  font-weight: 600;
  color: #ffffff;
  font-size: 1rem;  // 新增，让股票名称更大
}

.stock-code {
  color: #7690b5;
  font-size: 0.8rem;  // 从 0.7rem 调大
}

.stock-price {
  flex: 1;
  text-align: right;
  color: #d0e2ff;
  font-weight: 500;
  font-family: monospace;
  font-size: 1rem;  // 新增，让价格字体更大
}

.stock-change {
  flex: 1;
  text-align: right;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.2rem;
  font-family: monospace;
  font-size: 1rem;  // 新增，让涨跌幅字体更大
}

.stock-change i {
  font-size: 0.8rem;  // 从 0.7rem 调大
}

.positive {
  color: #16c784;
}

.negative {
  color: #ea5b5b;
}

/* 异动徽章样式 */
.alert-badge {
  font-size: 0.7rem;  // 从 0.6rem 调大
  padding: 0.2rem 0.6rem;  // 从 0.15rem 0.5rem 调大
  border-radius: 12px;
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-weight: 600;
}

.alert-badge.surge {
  background: rgba(22, 199, 132, 0.2);
  color: #16c784;
  border: 1px solid #16c784;
}

.alert-badge.plunge {
  background: rgba(234, 91, 91, 0.2);
  color: #ea5b5b;
  border: 1px solid #ea5b5b;
}

.alert-badge.volume {
  background: rgba(255, 180, 71, 0.2);
  color: #ffb447;
  border: 1px solid #ffb447;
}

/* 自定义组合样式 */
.portfolio-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 0;  // 从 0.8rem 调大
  border-bottom: 1px dashed #253c58;
  cursor: pointer;
  transition: all 0.2s;
  transform: translateZ(0);
  backface-visibility: hidden;
}

.portfolio-item:hover {
  background: rgba(60, 95, 145, 0.1);
  margin: 0 -0.5rem;
  padding: 0.9rem 0.5rem;
  border-radius: 8px;
}

.portfolio-item:last-child {
  border-bottom: none;
}

.portfolio-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.portfolio-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;  // 新增
}

.portfolio-desc {
  color: #7690b5;
  font-size: 0.8rem;  // 从 0.7rem 调大
}

.portfolio-change {
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  font-family: monospace;
  font-size: 1rem;  // 新增
}

/* 异动统计面板 */
.alert-stats {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem 1.5rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
}

.stats-title {
  color: #b3ceff;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;  // 从 1rem 调大
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stats-time {
  color: #7a94b8;
  font-size: 0.8rem;  // 从 0.7rem 调大
  font-weight: normal;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-card {
  background: #0e1a28;
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.2s;
}

.stat-card i {
  font-size: 2.2rem;  // 从 2rem 调大
}

.stat-card.surge i {
  color: #16c784;
}

.stat-card.plunge i {
  color: #ea5b5b;
}

.stat-card.volume i {
  color: #ffb447;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #7a94b8;
  font-size: 0.85rem;  // 从 0.75rem 调大
}

.stat-value {
  color: #ffffff;
  font-size: 1.6rem;  // 从 1.5rem 调大
  font-weight: 700;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
}

/* 响应式 */
@media (max-width: 768px) {
  .page-container {
    padding: 1rem;
  }
  
  .watchlist-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 0.8rem;
  }
  
  .header-actions {
    width: 100%;
  }
  
  .action-btn {
    flex: 1;
    justify-content: center;
  }
}
</style>