<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <!-- 股票基本信息卡片 -->
      <div class="stock-info-card">
        <div class="stock-header">
          <div class="stock-name-section">
            <h1 class="stock-name">{{ stockInfo.name }}</h1>
            <span class="stock-code">{{ stockInfo.code }}</span>
            <span class="stock-market" :class="stockInfo.market">
              {{ getMarketName(stockInfo.market) }}
            </span>
          </div>
          <div class="stock-actions">
            <button 
              class="action-btn follow-btn" 
              :class="{ followed: isFollowed }"
              @click="toggleFollow"
            >
              <i :class="isFollowed ? 'fas fa-star' : 'far fa-star'"></i>
              {{ isFollowed ? '已自选' : '添加自选' }}
            </button>
            <button class="action-btn alert-btn">
              <i class="fas fa-bell"></i>
              设置提醒
            </button>
          </div>
        </div>
        
        <div class="stock-price-section">
          <div class="price-info">
            <span class="current-price">{{ stockInfo.price }}</span>
            <span :class="['price-change', stockInfo.change >= 0 ? 'positive' : 'negative']">
              <i :class="stockInfo.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
              {{ stockInfo.change >= 0 ? '+' : '' }}{{ stockInfo.change }}%
            </span>
            <span class="price-detail">今开 {{ stockInfo.open }} | 最高 {{ stockInfo.high }} | 最低 {{ stockInfo.low }}</span>
          </div>
          <div class="key-metrics">
            <div class="metric-item">
              <span class="metric-label">换手率</span>
              <span class="metric-value">{{ stockInfo.turnoverRate }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">市盈率(动)</span>
              <span class="metric-value">{{ stockInfo.peRatio }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">市净率</span>
              <span class="metric-value">{{ stockInfo.pbRatio }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">总市值</span>
              <span class="metric-value">{{ stockInfo.marketCap }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">流通市值</span>
              <span class="metric-value">{{ stockInfo.circulatingCap }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">成交量</span>
              <span class="metric-value">{{ stockInfo.volume }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="chart-card">
        <div class="chart-header">
          <div class="chart-tabs">
            <button 
              v-for="tab in chartTabs" 
              :key="tab.type"
              :class="['chart-tab', { active: activeChart === tab.type }]"
              @click="activeChart = tab.type"
            >
              <i :class="tab.icon"></i> {{ tab.name }}
            </button>
          </div>
          <div class="chart-controls">
            <button 
              class="mode-btn" 
              :class="{ active: !showChangeMode }"
              @click="showChangeMode = false"
            >
              价格走势
            </button>
            <button 
              class="mode-btn" 
              :class="{ active: showChangeMode }"
              @click="showChangeMode = true"
            >
              涨跌幅走势
            </button>
          </div>
        </div>
        <div ref="chartRef" class="chart-container"></div>
      </div>

      <!-- 两列布局 -->
      <div class="two-columns">
        <!-- 左侧：财务数据 + 公司简介 -->
        <div class="left-column">
          <!-- 财务指标 -->
          <div class="finance-card">
            <div class="card-title">
              <i class="fas fa-chart-line"></i> 财务指标
              <span class="finance-date">2024年Q4</span>
            </div>
            <div class="finance-grid">
              <div class="finance-item">
                <span class="finance-label">营业收入</span>
                <span class="finance-value">{{ financeData.revenue }}</span>
                <span :class="['finance-trend', financeData.revenueTrend]">
                  {{ financeData.revenueTrend === 'up' ? '+' : '' }}{{ financeData.revenueChange }}%
                </span>
              </div>
              <div class="finance-item">
                <span class="finance-label">净利润</span>
                <span class="finance-value">{{ financeData.profit }}</span>
                <span :class="['finance-trend', financeData.profitTrend]">
                  {{ financeData.profitTrend === 'up' ? '+' : '' }}{{ financeData.profitChange }}%
                </span>
              </div>
              <div class="finance-item">
                <span class="finance-label">毛利率</span>
                <span class="finance-value">{{ financeData.grossMargin }}%</span>
                <span class="finance-trend neutral">同比 +1.2%</span>
              </div>
              <div class="finance-item">
                <span class="finance-label">净资产收益率</span>
                <span class="finance-value">{{ financeData.roe }}%</span>
                <span class="finance-trend up">优秀</span>
              </div>
            </div>
          </div>

          <!-- 资金流向 -->
          <div class="fund-card">
            <div class="card-title">
              <i class="fas fa-coins"></i> 资金流向
              <span class="fund-time">今日 14:55</span>
            </div>
            <div class="fund-flow-chart">
              <div class="fund-item">
                <span class="fund-label">主力净流入</span>
                <span class="fund-value positive">{{ fundFlow.main }}</span>
                <div class="fund-bar"><div class="bar-fill" style="width: 72%"></div></div>
              </div>
              <div class="fund-item">
                <span class="fund-label">超大单</span>
                <span class="fund-value positive">{{ fundFlow.superLarge }}</span>
                <div class="fund-bar"><div class="bar-fill" style="width: 45%"></div></div>
              </div>
              <div class="fund-item">
                <span class="fund-label">大单</span>
                <span class="fund-value positive">{{ fundFlow.large }}</span>
                <div class="fund-bar"><div class="bar-fill" style="width: 28%"></div></div>
              </div>
              <div class="fund-item">
                <span class="fund-label">中单</span>
                <span class="fund-value negative">{{ fundFlow.medium }}</span>
                <div class="fund-bar"><div class="bar-fill negative" style="width: 35%"></div></div>
              </div>
              <div class="fund-item">
                <span class="fund-label">小单</span>
                <span class="fund-value negative">{{ fundFlow.small }}</span>
                <div class="fund-bar"><div class="bar-fill negative" style="width: 42%"></div></div>
              </div>
            </div>
          </div>

          <!-- 公司简介 -->
          <div class="company-card">
            <div class="card-title">
              <i class="fas fa-building"></i> 公司简介
            </div>
            <div class="company-desc">
              {{ companyInfo.desc }}
            </div>
            <div class="company-links">
              <a href="#" class="company-link">官方网站 <i class="fas fa-external-link-alt"></i></a>
              <a href="#" class="company-link">招股书 <i class="fas fa-file-pdf"></i></a>
              <a href="#" class="company-link">公告 <i class="fas fa-file-alt"></i></a>
            </div>
          </div>

           <div class="rating-card">
            <div class="card-title">
              <i class="fas fa-star"></i> 机构评级
            </div>
            <div class="rating-summary">
              <div class="rating-score">
                <span class="score">{{ rating.avgScore }}</span>
                <span class="score-label">综合评分</span>
              </div>
              <div class="rating-stats">
                <div class="stat"><span class="stat-label">买入</span><span class="stat-value">{{ rating.buy }}</span></div>
                <div class="stat"><span class="stat-label">增持</span><span class="stat-value">{{ rating.overweight }}</span></div>
                <div class="stat"><span class="stat-label">中性</span><span class="stat-value">{{ rating.hold }}</span></div>
                <div class="stat"><span class="stat-label">减持</span><span class="stat-value">{{ rating.underweight }}</span></div>
                <div class="stat"><span class="stat-label">卖出</span><span class="stat-value">{{ rating.sell }}</span></div>
              </div>
            </div>
            <div class="rating-target">
              <span class="target-label">目标价</span>
              <span class="target-price">{{ rating.targetPrice }}</span>
              <span class="target-desc">较现价 {{ rating.targetUpside }}% 空间</span>
            </div>
          </div>
        </div>

        <!-- 右侧：相关资讯 + 相关个股 -->
        <div class="right-column">
          <!-- 相关资讯 -->
<RealCart />
          <!-- 相关个股 -->
     <RelatedCard />

          <!-- 机构评级 -->
         
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import * as echarts from "echarts";
import Breadcrumb from "~/components/breadcrumb/index.vue";
import RelatedCard from "~/components/relatedCard/index.vue";
import RealCart from "~/components/realCart/index.vue";
const route = useRoute();
const router = useRouter();

// 股票基本信息
const stockInfo = ref({
  name: "宁德时代",
  code: "300750.SZ",
  market: "sz",
  price: 209.80,
  change: 3.67,
  open: 202.50,
  high: 212.80,
  low: 201.20,
  turnoverRate: 4.82,
  peRatio: 18.5,
  pbRatio: 3.2,
  marketCap: "8920亿",
  circulatingCap: "7850亿",
  volume: "25.6万手"
});

// 财务数据
const financeData = ref({
  revenue: "4009亿",
  revenueTrend: "up",
  revenueChange: 22.5,
  profit: "507亿",
  profitTrend: "up",
  profitChange: 35.8,
  grossMargin: 22.1,
  roe: 19.2
});

// 资金流向
const fundFlow = ref({
  main: "+6.24亿",
  superLarge: "+3.87亿",
  large: "+2.37亿",
  medium: "-1.28亿",
  small: "-2.15亿"
});

// 公司简介
const companyInfo = ref({
  desc: "宁德时代新能源科技股份有限公司是全球领先的锂离子电池研发制造公司，专注于新能源汽车动力电池系统、储能系统的研发、生产和销售。公司产品覆盖乘用车、商用车、储能等领域，连续多年全球动力电池装机量排名第一。"
});

// 相关资讯
const relatedNews = ref([
  { id: 1, title: "宁德时代发布新一代神行电池，充电10分钟续航600公里", time: "35分钟前", source: "东方财富" },
  { id: 2, title: "宁德时代与宝马签署长期合作协议，供货周期至2030年", time: "2小时前", source: "同花顺" },
  { id: 3, title: "中信证券：宁德时代目标价上调至310元，维持买入评级", time: "5小时前", source: "中信证券" },
  { id: 4, title: "宁德时代神行电池量产在即，多家车企已定点", time: "昨天", source: "财联社" }
]);

// 相关个股
const relatedStocks = ref([
  { name: "比亚迪", code: "002594", price: 258.60, change: 0.84 },
  { name: "亿纬锂能", code: "300014", price: 45.20, change: 2.15 },
  { name: "国轩高科", code: "002074", price: 21.80, change: 1.23 },
  { name: "欣旺达", code: "300207", price: 16.50, change: -0.52 }
]);

// 机构评级
const rating = ref({
  avgScore: 4.5,
  buy: 28,
  overweight: 12,
  hold: 3,
  underweight: 1,
  sell: 0,
  targetPrice: 285.00,
  targetUpside: 35.8
});

// 图表相关
const chartRef = ref(null);
let chart = null;
const activeChart = ref("kline");
const showChangeMode = ref(false);

const chartTabs = ref([
  { type: "kline", name: "K线图", icon: "fas fa-chart-bar" },
  { type: "time", name: "分时图", icon: "fas fa-chart-line" }
]);

// 自选状态
const isFollowed = ref(false);

// 获取市场名称
const getMarketName = (market) => {
  const map = { sh: "沪市", sz: "深市", hk: "港股", us: "美股" };
  return map[market] || "其他";
};

// 切换自选
const toggleFollow = () => {
  isFollowed.value = !isFollowed.value;
  // 这里可以调用API添加/移除自选
};

// 跳转到个股
const goToStock = (code) => {
  router.push(`/stock?code=9527`);
};

// 生成模拟K线数据
const generateKlineData = () => {
  const dates = [];
  const prices = [];
  let price = 202.5;
  
  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);
    
    price += (Math.random() - 0.5) * 4;
    price = Math.max(185, Math.min(230, price));
    prices.push(price);
  }
  
  return { dates, prices };
};

// 生成分时图数据
const generateTimeData = () => {
  const times = [];
  const prices = [];
  let price = 202.5;
  
  for (let i = 0; i < 240; i++) {
    const hour = Math.floor(i / 60) + 9;
    const minute = i % 60;
    times.push(`${hour}:${minute.toString().padStart(2, "0")}`);
    
    price += (Math.random() - 0.5) * 0.3;
    price = Math.max(198, Math.min(215, price));
    prices.push(price);
  }
  
  return { times, prices };
};

// 绘制图表
const drawChart = () => {
  if (!chartRef.value) return;
  
  if (!chart) {
    chart = echarts.init(chartRef.value);
  }
  
  let option;
  
  if (activeChart.value === "kline") {
    const { dates, prices } = generateKlineData();
    const seriesData = showChangeMode.value 
      ? prices.map(p => ((p - 202.3) / 202.3 * 100))
      : prices;
    
    option = {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { left: "8%", right: "5%", top: "10%", bottom: "8%", containLabel: true },
      xAxis: { type: "category", data: dates, axisLabel: { color: "#7a94b8", rotate: 45, fontSize: 10 } },
      yAxis: { 
        type: "value", 
        name: showChangeMode.value ? "涨跌幅 (%)" : "价格 (元)",
        nameTextStyle: { color: "#7a94b8" },
        axisLabel: { color: "#7a94b8", formatter: (v) => showChangeMode.value ? `${v.toFixed(2)}%` : v.toFixed(2) },
        splitLine: { lineStyle: { color: "#25344a" } }
      },
      series: [{
        name: showChangeMode.value ? "涨跌幅走势" : "收盘价",
        type: "line",
        data: seriesData,
        smooth: true,
        lineStyle: { color: "#3e7aff", width: 2 },
        areaStyle: { opacity: 0.1, color: "#3e7aff" },
        symbol: "circle",
        symbolSize: 3
      }]
    };
  } else {
    const { times, prices } = generateTimeData();
    const seriesData = showChangeMode.value 
      ? prices.map(p => ((p - 202.3) / 202.3 * 100))
      : prices;
    
    option = {
      backgroundColor: "transparent",
      tooltip: { trigger: "axis" },
      grid: { left: "8%", right: "5%", top: "10%", bottom: "8%", containLabel: true },
      xAxis: { type: "category", data: times, axisLabel: { color: "#7a94b8", interval: 60, fontSize: 10 } },
      yAxis: { 
        type: "value", 
        name: showChangeMode.value ? "涨跌幅 (%)" : "价格 (元)",
        nameTextStyle: { color: "#7a94b8" },
        axisLabel: { color: "#7a94b8", formatter: (v) => showChangeMode.value ? `${v.toFixed(2)}%` : v.toFixed(2) },
        splitLine: { lineStyle: { color: "#25344a" } }
      },
      series: [{
        name: showChangeMode.value ? "涨跌幅走势" : "实时价格",
        type: "line",
        data: seriesData,
        smooth: true,
        lineStyle: { color: "#16c784", width: 2 },
        areaStyle: { opacity: 0.15, color: "#16c784" },
        symbol: "none"
      }]
    };
  }
  
  chart.setOption(option, true);
};

// 监听窗口大小变化
const handleResize = () => {
  if (chart) chart.resize();
};

onMounted(() => {
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

/* 股票信息卡片 */
.stock-info-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.5rem;
  border: 1px solid #273349;
  margin-bottom: 1.5rem;
}

.stock-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.stock-name-section {
  display: flex;
  align-items: baseline;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.stock-name {
  color: #ffffff;
  font-size: 1.8rem;
  font-weight: 700;
  margin: 0;
}

.stock-code {
  color: #7a94b8;
  font-size: 1rem;
}

.stock-market {
  font-size: 0.75rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  background: #1f2c3f;
  color: #9bb5e0;
}

.stock-market.sh {
  background: #1d4e3a;
  color: #8cffc7;
}

.stock-market.sz {
  background: #2f4567;
  color: #b8d6ff;
}

.stock-actions {
  display: flex;
  gap: 0.8rem;
}

.action-btn {
  padding: 0.5rem 1.2rem;
  border-radius: 30px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.follow-btn {
  background: #2f4567;
  border: 1px solid #2f4567;
  color: white;
}

.follow-btn.followed {
  background: #ffb347;
  border-color: #ffb347;
  color: #0b0e14;
}

.follow-btn:hover {
  background: #3f5b86;
}

.alert-btn {
  background: transparent;
  border: 1px solid #2f4567;
  color: #b8d6ff;
}

.alert-btn:hover {
  background: #2f4567;
  color: white;
}

.stock-price-section {
  padding-top: 0.5rem;
}

.price-info {
  display: flex;
  align-items: baseline;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 1rem;
}

.current-price {
  font-size: 2.5rem;
  font-weight: 700;
  color: #ffffff;
}

.price-change {
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.price-detail {
  color: #7a94b8;
  font-size: 0.85rem;
}

.key-metrics {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #2a3346;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.metric-label {
  color: #7a94b8;
  font-size: 0.75rem;
}

.metric-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

/* 图表卡片 */
.chart-card {
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
  transition: 0.2s;
  background: transparent;
  border: none;
}

.chart-tab.active {
  background: #2f4567;
  color: white;
}

.chart-controls {
  display: flex;
  gap: 0.5rem;
  background: #1b232f;
  padding: 0.2rem;
  border-radius: 40px;
}

.mode-btn {
  padding: 0.4rem 1rem;
  border-radius: 30px;
  font-size: 0.8rem;
  color: #99aec9;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: 0.2s;
}

.mode-btn.active {
  background: #2f4567;
  color: white;
}

.chart-container {
  width: 100%;
  height: 400px;
}

/* 两列布局 */
.two-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

/* 左侧卡片样式 */
.left-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.finance-card,
.fund-card,
.company-card {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
}

.card-title {
  color: #b3ceff;
  font-weight: 600;
  font-size: 1rem;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
}

.finance-date,
.fund-time {
  color: #7a94b8;
  font-size: 0.7rem;
  font-weight: normal;
}

.finance-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.finance-item {
  background: #0e1a28;
  border-radius: 1rem;
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.finance-label {
  color: #7a94b8;
  font-size: 0.7rem;
}

.finance-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

.finance-trend {
  font-size: 0.7rem;
}

.finance-trend.up {
  color: #16c784;
}

.finance-trend.down {
  color: #ea5b5b;
}

.finance-trend.neutral {
  color: #ffb347;
}

/* 资金流向 */
.fund-flow-chart {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.fund-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.fund-label {
  width: 70px;
  color: #7a94b8;
  font-size: 0.8rem;
}

.fund-value {
  width: 80px;
  font-weight: 600;
  font-size: 0.85rem;
  font-family: monospace;
}

.fund-value.positive {
  color: #16c784;
}

.fund-value.negative {
  color: #ea5b5b;
}

.fund-bar {
  flex: 1;
  height: 6px;
  background: #1f2c3f;
  border-radius: 3px;
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  background: #16c784;
  border-radius: 3px;
}

.bar-fill.negative {
  background: #ea5b5b;
}

/* 公司简介 */
.company-desc {
  color: #b8d1f5;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.company-links {
  display: flex;
  gap: 1rem;
}

.company-link {
  color: #6b9eff;
  text-decoration: none;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.company-link:hover {
  text-decoration: underline;
}

/* 右侧卡片样式 */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}



/* 机构评级 */
.rating-summary {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #2a3346;
}

.rating-score {
  text-align: center;
  padding-right: 1rem;
  border-right: 1px solid #2a3346;
}

.score {
  font-size: 2rem;
  font-weight: 700;
  color: #ffb347;
}

.score-label {
  color: #7a94b8;
  font-size: 0.7rem;
  display: block;
}

.rating-stats {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  text-align: center;
}

.stat {
  display: flex;
  flex-direction: column;
}

.stat-label {
  color: #7a94b8;
  font-size: 0.7rem;
}

.stat-value {
  color: #ffffff;
  font-weight: 600;
  font-size: 1rem;
}

.rating-target {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.target-label {
  color: #7a94b8;
  font-size: 0.8rem;
}

.target-price {
  color: #16c784;
  font-weight: 600;
  font-size: 1.1rem;
}

.target-desc {
  color: #7a94b8;
  font-size: 0.75rem;
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
  
  .two-columns {
    grid-template-columns: 1fr;
  }
  
  .finance-grid {
    grid-template-columns: 1fr;
  }
  
  .rating-stats {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 600px) {
  .stock-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .price-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }
  
  .key-metrics {
    gap: 1rem;
  }
  
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .rating-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>