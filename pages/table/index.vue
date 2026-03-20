<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <MarketSnapshot />
      
      <div class="market-page">
        <!-- 页面头部 -->
        <div class="page-header">
          <div class="header-left">
            <h2 class="section-title">
              <i class="fas fa-chart-line"></i> 市场排行
            </h2>
            <span class="update-time">
              <i class="fas fa-clock"></i> 更新于 {{ currentTime }}
            </span>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div class="market-grid">
          <!-- 涨幅榜 -->
          <div class="leaderboard">
            <div class="leaderboard-header">
              <h4><i class="fas fa-arrow-up" style="color: #16c784"></i> 涨幅榜</h4>
              <a href="#" class="more-link" @click.prevent="goToMore('gainers')">
                更多 <i class="fas fa-angle-right"></i>
              </a>
            </div>
            <table class="leader-table">
              <tbody>
                <tr v-for="(item, index) in gainersList.slice(0, 10)" :key="item.name" @click="goToStock(item.code)">
                  <td class="rank-cell">
                    <span class="rank-badge" :class="getRankClass(index)">{{ index + 1 }}</span>
                  </td>
                  <td class="name-cell">
                    <span class="stock-name">{{ item.name }}</span>
                    <span class="stock-code">{{ item.code || '--' }}</span>
                  </td>
                  <td class="price-cell">{{ item.price }}</td>
                  <td class="change-cell positive">
                    <i class="fas fa-arrow-up"></i> +{{ item.change }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 跌幅榜 -->
          <div class="leaderboard">
            <div class="leaderboard-header">
              <h4><i class="fas fa-arrow-down" style="color: #ea5b5b"></i> 跌幅榜</h4>
              <a href="#" class="more-link" @click.prevent="goToMore('decliners')">
                更多 <i class="fas fa-angle-right"></i>
              </a>
            </div>
            <table class="leader-table">
              <tbody>
                <tr v-for="(item, index) in declinersList.slice(0, 10)" :key="item.name" @click="goToStock(item.code)">
                  <td class="rank-cell">
                    <span class="rank-badge" :class="getRankClass(index)">{{ index + 1 }}</span>
                  </td>
                  <td class="name-cell">
                    <span class="stock-name">{{ item.name }}</span>
                    <span class="stock-code">{{ item.code || '--' }}</span>
                  </td>
                  <td class="price-cell">{{ item.price }}</td>
                  <td class="change-cell negative">
                    <i class="fas fa-arrow-down"></i> {{ item.change }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 成交量榜 -->
          <div class="leaderboard">
            <div class="leaderboard-header">
              <h4><i class="fas fa-chart-bar" style="color: #3e7aff"></i> 成交量榜</h4>
              <a href="#" class="more-link" @click.prevent="goToMore('volume')">
                更多 <i class="fas fa-angle-right"></i>
              </a>
            </div>
            <table class="leader-table">
              <tbody>
                <tr v-for="(item, index) in volumeList.slice(0, 10)" :key="item.name" @click="goToStock(item.code)">
                  <td class="rank-cell">
                    <span class="rank-badge" :class="getRankClass(index)">{{ index + 1 }}</span>
                  </td>
                  <td class="name-cell">
                    <span class="stock-name">{{ item.name }}</span>
                    <span class="stock-code">{{ item.code || '--' }}</span>
                  </td>
                  <td class="volume-cell">{{ item.volume }}{{ item.unit }}</td>
                  <td :class="['change-cell', item.change >= 0 ? 'positive' : 'negative']">
                    <i :class="item.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- 龙虎榜 -->
          <div class="leaderboard">
            <div class="leaderboard-header">
              <h4><i class="fas fa-tiger" style="color: #ffb347"></i> 龙虎榜</h4>
              <a href="#" class="more-link" @click.prevent="goToMore('longhu')">
                更多 <i class="fas fa-angle-right"></i>
              </a>
            </div>
            <table class="leader-table">
              <tbody>
                <tr v-for="(item, index) in longhuList.slice(0, 10)" :key="item.name" @click="goToStock(item.code)">
                  <td class="rank-cell">
                    <span class="rank-badge" :class="getRankClass(index)">{{ index + 1 }}</span>
                  </td>
                  <td class="name-cell">
                    <span class="stock-name">{{ item.name }}</span>
                    <span class="stock-type" :class="getTypeClass(item.type)">
                      {{ item.type }}
                    </span>
                  </td>
                  <td :class="['change-cell', item.change >= 0 ? 'positive' : 'negative']">
                    <i :class="item.change >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
                    {{ item.change >= 0 ? '+' : '' }}{{ item.change }}%
                  </td>
                  <td :class="['net-cell', item.netBuy >= 0 ? 'positive' : 'negative']">
                    {{ item.netBuy >= 0 ? '净买' : '净卖' }}{{ Math.abs(item.netBuy) }}{{ item.unit }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 北向资金条 -->
        <div class="north-money">
          <span><i class="fas fa-map-pin"></i> 北向资金净流入: <span style="color: #16c784">+52.8亿</span></span>
          <span>沪股通: +31.2亿</span>
          <span>深股通: +21.6亿</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import MarketSnapshot from "~/components/marketSnapshot/index.vue";
import Breadcrumb from "~/components/breadcrumb/index.vue";

const router = useRouter();

// 当前时间
const currentTime = ref("");
const updateTime = () => {
  const now = new Date();
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
};


// 涨幅榜数据
const gainersList = ref([
  { name: "宁德时代", code: "300750", change: 7.2, price: 209.80 },
  { name: "中际旭创", code: "300308", change: 6.8, price: 168.30 },
  { name: "天孚通信", code: "300394", change: 5.9, price: 92.47 },
  { name: "工业富联", code: "601138", change: 5.4, price: 24.16 },
  { name: "新易盛", code: "300502", change: 5.0, price: 86.22 },
  { name: "浪潮信息", code: "000977", change: 4.5, price: 42.80 },
  { name: "寒武纪", code: "688256", change: 4.2, price: 168.50 },
  { name: "科大讯飞", code: "002230", change: 3.8, price: 45.60 }
]);

// 跌幅榜数据
const declinersList = ref([
  { name: "药明康德", code: "603259", change: -4.1, price: 42.50 },
  { name: "爱美客", code: "300896", change: -3.8, price: 189.20 },
  { name: "山西汾酒", code: "600809", change: -3.2, price: 225.80 },
  { name: "古井贡酒", code: "000596", change: -2.9, price: 242.10 },
  { name: "洋河股份", code: "002304", change: -2.5, price: 92.70 },
  { name: "泸州老窖", code: "000568", change: -2.1, price: 185.30 },
  { name: "五粮液", code: "000858", change: -1.8, price: 142.50 },
  { name: "贵州茅台", code: "600519", change: -1.2, price: 1685.01 }
]);

// 成交量榜数据
const volumeList = ref([
  { name: "东方财富", code: "300059", volume: 124.5, change: 1.2, unit: "亿" },
  { name: "贵州茅台", code: "600519", volume: 86.3, change: 0.5, unit: "亿" },
  { name: "中国平安", code: "601318", volume: 72.8, change: -0.3, unit: "亿" },
  { name: "比亚迪", code: "002594", volume: 68.1, change: 2.1, unit: "亿" },
  { name: "宁德时代", code: "300750", volume: 65.4, change: 7.2, unit: "亿" },
  { name: "隆基绿能", code: "601012", volume: 52.3, change: 1.5, unit: "亿" },
  { name: "中芯国际", code: "688981", volume: 48.6, change: 2.8, unit: "亿" },
  { name: "药明康德", code: "603259", volume: 45.2, change: -4.1, unit: "亿" }
]);

// 龙虎榜数据
const longhuList = ref([
  { name: "天孚通信", code: "300394", type: "机构买入", change: 5.9, netBuy: 1.2, unit: "亿" },
  { name: "中际旭创", code: "300308", type: "深股通", change: 6.8, netBuy: 0.9, unit: "亿" },
  { name: "药明康德", code: "603259", type: "机构卖出", change: -4.1, netBuy: -2.3, unit: "亿" },
  { name: "工业富联", code: "601138", type: "游资", change: 5.4, netBuy: 0.7, unit: "亿" },
  { name: "山西汾酒", code: "600809", type: "北向卖出", change: -3.2, netBuy: -1.1, unit: "亿" },
  { name: "浪潮信息", code: "000977", type: "机构买入", change: 4.5, netBuy: 0.8, unit: "亿" },
  { name: "寒武纪", code: "688256", type: "游资", change: 4.2, netBuy: 0.5, unit: "亿" },
  { name: "科大讯飞", code: "002230", type: "深股通", change: 3.8, netBuy: 0.6, unit: "亿" }
]);

// 获取排名样式
const getRankClass = (index) => {
  if (index === 0) return "gold";
  if (index === 1) return "silver";
  if (index === 2) return "bronze";
  return "";
};

// 获取类型样式
const getTypeClass = (type) => {
  if (type.includes("买入")) return "buy";
  if (type.includes("卖出")) return "sell";
  return "normal";
};

// 跳转到更多页面
const goToMore = (type) => {
  router.push(`/ranking/${type}`);
};

// 跳转到个股详情
const goToStock = (code) => {
  if (code) {
    router.push(`/stock?code=${code}`);
  }
};

updateTime();
</script>

<style lang="scss" scoped>
.page-container {
  padding: 1rem 2rem 2rem 2rem;
}

.market-page {
  display: block;
}

/* 页面头部 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.section-title {
  color: #e2f0ff;
  font-size: 1.2rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0;
}

.update-time {
  color: #7a94b8;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* 卡片视图 - 4列网格 */
.market-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.leaderboard {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1.2rem;
  border: 1px solid #273349;
  transition: all 0.2s;
}

.leaderboard:hover {
  border-color: #3f5a82;
}

.leaderboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid #2a3346;
}

.leaderboard-header h4 {
  color: #f0f6ff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.more-link {
  color: #6b9eff;
  text-decoration: none;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.2rem;
  transition: all 0.2s;
}

.more-link:hover {
  gap: 0.4rem;
  color: #8cb0ff;
}

/* 表格样式 */
.leader-table {
  width: 100%;
  color: #d0e2ff;
  font-size: 0.85rem;
  border-collapse: collapse;
}

.leader-table td {
  padding: 0.6rem 0;
  border-bottom: 1px solid #1f2e42;
}

.leader-table tr {
  cursor: pointer;
  transition: all 0.2s;
}

.leader-table tr:hover {
  background: rgba(60, 95, 145, 0.15);
  border-radius: 0.5rem;
}

.leader-table tr:last-child td {
  border-bottom: none;
}

/* 排名徽章 */
.rank-cell {
  width: 50px;
}

.rank-badge {
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
.name-cell {
  width: 40%;
}

.stock-name {
  color: #ffffff;
  font-weight: 500;
  font-size: 0.9rem;
  display: block;
}

.stock-code {
  color: #7690b5;
  font-size: 0.65rem;
}

.price-cell,
.volume-cell {
  width: 25%;
  color: #d0e2ff;
  font-weight: 500;
  font-family: monospace;
}

.change-cell {
  width: 25%;
  font-weight: 600;
  text-align: left;
}

.change-cell.positive {
  color: #16c784;
}

.change-cell.negative {
  color: #ea5b5b;
}

.change-cell i {
  font-size: 0.7rem;
  margin-right: 0.2rem;
}

/* 龙虎榜特殊样式 */
.stock-type {
  font-size: 0.6rem;
  padding: 0.15rem 0.4rem;
  border-radius: 12px;
  display: inline-block;
  margin-top: 0.2rem;
}

.stock-type.buy {
  background: rgba(22, 199, 132, 0.15);
  color: #16c784;
}

.stock-type.sell {
  background: rgba(234, 91, 91, 0.15);
  color: #ea5b5b;
}

.stock-type.normal {
  background: rgba(62, 122, 255, 0.15);
  color: #3e7aff;
}

.net-cell {
  font-weight: 600;
  font-family: monospace;
  text-align: left;
}

.net-cell.positive {
  color: #16c784;
}

.net-cell.negative {
  color: #ea5b5b;
}

/* 北向资金条 */
.north-money {
  background: #131c28;
  border-radius: 1.5rem;
  padding: 1rem 1.5rem;
  border: 1px solid #273349;
  display: flex;
  justify-content: space-between;
  color: #c1d9ff;
  font-size: 0.85rem;
  flex-wrap: wrap;
  gap: 1rem;
}

/* 响应式 */
@media (max-width: 1000px) {
  .market-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .page-container {
    padding: 1rem;
  }
  
  .market-grid {
    grid-template-columns: 1fr;
  }
  
  .north-money {
    flex-direction: column;
    align-items: center;
  }
  
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>