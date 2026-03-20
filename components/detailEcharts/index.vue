<template>
  <div class="stock-chart-card">
    <!-- 头部信息 -->
    <div class="chart-header">
      <div class="stock-info-header">
        <span class="stock-name-large">{{ stockName }}</span>
        <span class="stock-code">{{ stockCode }}</span>
        <span class="market-status" :class="marketStatusClass">
          <i class="fas fa-circle"></i> {{ marketStatus }}
        </span>
      </div>
      <div class="stock-price-large">
        <span class="price-value">
          {{
            showChangeMode
              ? formatChangePercent(currentPrice, basePrice)
              : currentPrice
          }}
        </span>
        <span :class="['stock-change-large', priceChangeClass]">
          {{ priceChange }}
        </span>
      </div>
    </div>

    <!-- 模式切换 - 双按钮开关 -->
    <div class="mode-switch">
      <button
        class="mode-btn"
        :class="{ active: !showChangeMode }"
        @click="setChartMode(false)"
      >
        <i class="fas fa-chart-line"></i>
        <span>价格走势</span>
      </button>
      <button
        class="mode-btn"
        :class="{ active: showChangeMode }"
        @click="setChartMode(true)"
      >
        <i class="fas fa-percent"></i>
        <span>涨跌幅走势</span>
      </button>
    </div>

    <!-- 图表切换 Tab（分时/K线） -->
    <div class="chart-tabs">
      <button
        v-for="tab in chartTabs"
        :key="tab.type"
        :class="['chart-tab', { active: currentChartType === tab.type }]"
        @click="switchChart(tab.type)"
      >
        <i :class="tab.icon"></i> {{ tab.name }}
      </button>
    </div>

    <!-- ECharts 容器 -->
    <div ref="chartRef" class="chart-container"></div>

    <!-- 底部关键数据 -->
    <div class="chart-footer" v-if="stockData">
      <div class="footer-item">
        <span class="footer-label">昨收</span>
        <span class="footer-value">{{ stockData.prevClose }}</span>
      </div>
      <div class="footer-item">
        <span class="footer-label">今开</span>
        <span class="footer-value">{{ stockData.open }}</span>
      </div>
      <div class="footer-item">
        <span class="footer-label">最高</span>
        <span class="footer-value">{{ stockData.high }}</span>
      </div>
      <div class="footer-item">
        <span class="footer-label">最低</span>
        <span class="footer-value">{{ stockData.low }}</span>
      </div>
      <div class="footer-item">
        <span class="footer-label">成交量</span>
        <span class="footer-value">{{ stockData.volume }}</span>
      </div>
      <div class="footer-item">
        <span class="footer-label">成交额</span>
        <span class="footer-value">{{ stockData.turnover }}</span>
      </div>
    </div>

    <!-- 资金流向简表 -->
    <div class="fund-flow">
      <div class="fund-title">
        <i class="fas fa-coins"></i> 资金流向
        <span class="fund-time">{{ fundFlowTime }}</span>
      </div>
      <div class="fund-items">
        <div class="fund-item">
          <span class="fund-label">主力净流入</span>
          <span class="fund-value positive">{{ mainFlow }}</span>
        </div>
        <div class="fund-item">
          <span class="fund-label">超大单</span>
          <span class="fund-value positive">{{ superFlow }}</span>
        </div>
        <div class="fund-item">
          <span class="fund-label">大单</span>
          <span class="fund-value positive">{{ bigFlow }}</span>
        </div>
        <div class="fund-item">
          <span class="fund-label">中单</span>
          <span class="fund-value negative">{{ midFlow }}</span>
        </div>
        <div class="fund-item">
          <span class="fund-label">小单</span>
          <span class="fund-value negative">{{ smallFlow }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";
import * as echarts from "echarts";

const props = defineProps({
  stockName: { type: String, default: "宁德时代" },
  stockCode: { type: String, default: "300750.SZ" },
  currentPrice: { type: Number, default: 209.8 },
  priceChange: { type: String, default: "+3.67%" },
  stockData: {
    type: Object,
    default: () => ({
      open: "202.50元",
      high: "212.80元",
      low: "201.20元",
      prevClose: "202.30元",
      volume: "25.6万手",
      turnover: "53.2亿",
    }),
  },
});

// Refs
const chartRef = ref(null);
let mainChart = null;  // ✅ 只保留主图表
const currentChartType = ref("line");
const showChangeMode = ref(false);
const basePrice = ref(202.3);

// 设置图表模式
const setChartMode = (isChangeMode) => {
  showChangeMode.value = isChangeMode;
  nextTick(() => {
    if (currentChartType.value === "line") {
      drawLineChart();
    } else {
      drawCandlestickChart();
    }
  });
};

// 格式化涨跌幅显示
const formatChangePercent = (price, base) => {
  const changePercent = (((price - base) / base) * 100).toFixed(2);
  return `${changePercent}%`;
};

// 市场状态
const marketStatus = computed(() => {
  const hour = new Date().getHours();
  if (hour >= 9 && hour < 11.5) return "交易中";
  if (hour >= 13 && hour < 15) return "交易中";
  return "已收盘";
});

const marketStatusClass = computed(() => {
  return marketStatus.value === "交易中" ? "trading" : "closed";
});

const fundFlowTime = ref("今日 14:55");

// 资金流向数据
const mainFlow = ref("+6.24亿");
const superFlow = ref("+3.87亿");
const bigFlow = ref("+2.37亿");
const midFlow = ref("-1.28亿");
const smallFlow = ref("-2.15亿");

const chartTabs = ref([
  { type: "line", name: "分时图", icon: "fas fa-chart-line" },
  { type: "candlestick", name: "K线图", icon: "fas fa-chart-bar" },
]);

const priceChangeClass = computed(() => {
  return props.priceChange.includes("+") ? "positive" : "negative";
});

// 将价格数据转换为涨跌幅数据
const convertToChangePercent = (prices, basePrice) => {
  return prices.map((price) => ((price - basePrice) / basePrice) * 100);
};

// 生成分时图数据
const generateTimeData = () => {
  const times = [];
  const prices = [];
  const avgPrices = [];
  let price = 202.5;
  let trend = 0;
  let volatility = 0.2;

  for (let i = 0; i < 240; i++) {
    const hour = Math.floor(i / 60) + 9;
    const minute = i % 60;
    times.push(`${hour}:${minute.toString().padStart(2, "0")}`);

    if (i < 30) {
      trend = 0.3;
      volatility = 0.25;
    } else if (i < 180) {
      trend = Math.sin(i * 0.03) * 0.15;
      volatility = 0.35;
    } else {
      trend = 0.2;
      volatility = 0.2;
    }

    price += (Math.random() - 0.5) * volatility + trend * 0.05;
    price = Math.max(198, Math.min(218, price));
    prices.push(Number(price.toFixed(2)));

    const avgBase = 202.5 + (price - 202.5) * 0.65 + Math.sin(i * 0.05) * 0.3;
    avgPrices.push(Number(avgBase.toFixed(2)));
  }

  return { times, prices, avgPrices };
};

// 生成K线数据
const generateKlineData = () => {
  const dates = [];
  const prices = [];
  let price = 202.5;
  let trend = 0;

  for (let i = 30; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(`${date.getMonth() + 1}/${date.getDate()}`);

    if (i > 20) {
      trend = (Math.random() - 0.4) * 4;
    } else if (i > 10) {
      trend = (Math.random() - 0.3) * 5 + 1;
    } else {
      trend = (Math.random() - 0.6) * 3;
    }

    price += trend;
    price = Math.max(185, Math.min(230, price));
    prices.push(Number(price.toFixed(2)));
  }

  return { dates, prices };
};

// 绘制分时图
const drawLineChart = () => {
  if (!chartRef.value) return;
  
  if (!mainChart) {
    mainChart = echarts.init(chartRef.value);
  }

  const { times, prices, avgPrices } = generateTimeData();

  let seriesData, avgSeriesData, yAxisName, yAxisFormatter, seriesColor;

  if (showChangeMode.value) {
    const changeData = convertToChangePercent(prices, basePrice.value);
    const avgChangeData = convertToChangePercent(avgPrices, basePrice.value);
    seriesData = changeData;
    avgSeriesData = avgChangeData;
    yAxisName = "涨跌幅 (%)";
    yAxisFormatter = (value) => `${value.toFixed(2)}%`;
    seriesColor = "#ff6b6b";
  } else {
    seriesData = prices;
    avgSeriesData = avgPrices;
    yAxisName = "价格 (元)";
    yAxisFormatter = (value) => `${value.toFixed(2)}`;
    seriesColor = "#16c784";
  }

  const option = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => {
        if (showChangeMode.value) {
          return `${value.toFixed(2)}%`;
        }
        return `${value.toFixed(2)} 元`;
      },
    },
    grid: {
      left: "8%",
      right: "5%",
      top: "12%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: times,
      axisLabel: { color: "#7a94b8", interval: 60, rotate: 0, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      name: yAxisName,
      nameTextStyle: { color: "#7a94b8" },
      axisLabel: {
        color: "#7a94b8",
        formatter: yAxisFormatter,
      },
      splitLine: { lineStyle: { color: "#25344a" } },
    },
    series: [
      {
        name: showChangeMode.value ? "涨跌幅走势" : "实时价格",
        type: "line",
        data: seriesData,
        smooth: true,
        lineStyle: { color: seriesColor, width: 2.5 },
        areaStyle: { opacity: 0.15, color: seriesColor },
        symbol: "none",
      },
      {
        name: "均线",
        type: "line",
        data: avgSeriesData,
        smooth: true,
        lineStyle: { color: "#ffb347", width: 1.5, type: "dashed" },
        symbol: "none",
      },
    ],
  };

  mainChart.setOption(option, true);
};

// 绘制K线图
const drawCandlestickChart = () => {
  if (!chartRef.value) return;
  
  if (!mainChart) {
    mainChart = echarts.init(chartRef.value);
  }

  const { dates, prices } = generateKlineData();

  let seriesData, yAxisName, yAxisFormatter, seriesColor;

  if (showChangeMode.value) {
    const changeData = convertToChangePercent(prices, basePrice.value);
    seriesData = changeData;
    yAxisName = "涨跌幅 (%)";
    yAxisFormatter = (value) => `${value.toFixed(2)}%`;
    seriesColor = "#ff6b6b";
  } else {
    seriesData = prices;
    yAxisName = "价格 (元)";
    yAxisFormatter = (value) => `${value.toFixed(2)}`;
    seriesColor = "#3e7aff";
  }

  const mainOption = {
    backgroundColor: "transparent",
    tooltip: {
      trigger: "axis",
      axisPointer: { type: "shadow" },
      valueFormatter: (value) => {
        if (showChangeMode.value) {
          return `${value.toFixed(2)}%`;
        }
        return `${value.toFixed(2)} 元`;
      },
    },
    grid: {
      left: "8%",
      right: "5%",
      top: "10%",
      bottom: "8%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: { color: "#7a94b8", rotate: 45, fontSize: 10 },
    },
    yAxis: {
      type: "value",
      name: yAxisName,
      nameTextStyle: { color: "#7a94b8" },
      axisLabel: {
        color: "#7a94b8",
        formatter: yAxisFormatter,
      },
      splitLine: { lineStyle: { color: "#25344a" } },
    },
    series: [
      {
        name: showChangeMode.value ? "涨跌幅走势" : "收盘价",
        type: "line",
        data: seriesData,
        smooth: true,
        lineStyle: { color: seriesColor, width: 2 },
        areaStyle: { opacity: 0.1, color: seriesColor },
        symbol: "circle",
        symbolSize: 3,
        itemStyle: { color: seriesColor },
      },
    ],
  };

  mainChart.setOption(mainOption, true);
};

const switchChart = (type) => {
  currentChartType.value = type;
  nextTick(() => {
    if (type === "line") {
      drawLineChart();
    } else {
      drawCandlestickChart();
    }
  });
};

const initChart = () => {
  nextTick(() => {
    if (chartRef.value) {
      drawLineChart();
    }
  });
};

const handleResize = () => {
  if (mainChart) mainChart.resize();
};

onMounted(() => {
  initChart();
  window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
  if (mainChart) {
    mainChart.dispose();
    mainChart = null;
  }
  window.removeEventListener("resize", handleResize);
});
</script>

<style scoped>
.stock-chart-card {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem;
  border: 1px solid #273349;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.stock-info-header {
  display: flex;
  align-items: baseline;
  gap: 12px;
  flex-wrap: wrap;
}

.stock-name-large {
  font-size: 1.3rem;
  font-weight: 700;
  color: white;
}

.stock-code {
  color: #7a94b8;
  font-size: 0.8rem;
}

.market-status {
  font-size: 0.7rem;
  padding: 0.2rem 0.6rem;
  border-radius: 20px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.market-status i {
  font-size: 0.5rem;
}

.market-status.trading {
  background: #1d4e3a;
  color: #8cffc7;
}

.market-status.closed {
  background: #2f3a4a;
  color: #9aaec9;
}

.stock-price-large {
  text-align: right;
}

.price-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #16c784;
}

.stock-change-large {
  font-size: 0.9rem;
  margin-left: 0.3rem;
}

.stock-change-large.positive {
  color: #16c784;
}

.stock-change-large.negative {
  color: #ea5b5b;
}

/* 模式切换 - 双按钮 */
.mode-switch {
  display: flex;
  gap: 0.5rem;
  background: #1b232f;
  padding: 0.3rem;
  border-radius: 60px;
  margin-bottom: 1rem;
  width: fit-content;
  border: 1px solid #2d384a;
}

.mode-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0.5rem 1.2rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  background: transparent;
  border: none;
  color: #99aec9;
  cursor: pointer;
  transition: all 0.2s;
}

.mode-btn i {
  font-size: 0.9rem;
}

.mode-btn.active {
  background: #2f4567;
  color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

.mode-btn:hover:not(.active) {
  background: #253040;
  color: #d3e3ff;
}

/* 图表切换 Tab */
.chart-tabs {
  display: flex;
  gap: 0.5rem;
  background: #1b232f;
  padding: 0.2rem;
  border-radius: 40px;
  margin-bottom: 1rem;
  width: fit-content;
}

.chart-tab {
  padding: 0.4rem 1.2rem;
  border-radius: 30px;
  font-size: 0.8rem;
  color: #99aec9;
  cursor: pointer;
  transition: 0.2s;
  border: none;
  background: transparent;
}

.chart-tab i {
  margin-right: 4px;
}

.chart-tab.active {
  background: #2f4567;
  color: white;
}

/* 主图表容器 */
.chart-container {
  width: 100%;
  height: 360px;
}

.chart-footer {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 0.8rem;
  border-top: 1px solid #25344a;
  flex-wrap: wrap;
  gap: 0.8rem;
}

.footer-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0e1622;
  padding: 0.5rem;
  border-radius: 12px;
  min-width: 70px;
  line-height: 1.4;
}

.footer-label {
  color: #7a94b8;
  font-size: 0.7rem;
}

.footer-value {
  color: #d0e2ff;
  font-size: 0.9rem;
  font-weight: 500;
}

/* 资金流向 */
.fund-flow {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #25344a;
}

.fund-title {
  color: #b8d6ff;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  gap: 8px;
}

.fund-time {
  color: #7a94b8;
  font-size: 0.7rem;
  font-weight: normal;
}

.fund-items {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.fund-item {
  flex: 1;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #0e1622;
  padding: 0.5rem;
  border-radius: 12px;
}

.fund-label {
  color: #7a94b8;
  font-size: 0.7rem;
}

.fund-value {
  font-weight: 600;
  font-size: 0.9rem;
}

.fund-value.positive {
  color: #16c784;
}

.fund-value.negative {
  color: #ea5b5b;
}

/* 响应式 */
@media (max-width: 600px) {
  .mode-switch {
    width: 100%;
  }

  .mode-btn {
    flex: 1;
    justify-content: center;
  }

  .chart-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .stock-price-large {
    text-align: left;
  }
  
  .chart-container {
    height: 280px;
  }
}
</style>