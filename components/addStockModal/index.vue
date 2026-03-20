<template>
  <Teleport to="body">
    <Transition name="modal-fade">
      <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
        <div class="modal-container" @click.stop>
          <!-- 头部 -->
          <div class="modal-header">
            <div class="header-left">
              <i class="fas fa-plus-circle" style="color: #ffb347"></i>
              <h3>添加自选股</h3>
            </div>
            <button class="modal-close" @click="closeModal">
              <i class="fas fa-times"></i>
            </button>
          </div>

          <!-- 搜索区域 -->
          <div class="search-section">
            <div class="search-input-wrapper">
              <i class="fas fa-search"></i>
              <input
                type="text"
                v-model="searchKeyword"
                placeholder="输入股票代码或名称，如：600519、贵州茅台"
                @input="handleSearch"
                maxLength="6"
                @focus="showDropdown = true"
                ref="searchInput"
                autofocus
              />
              <button
                v-if="searchKeyword"
                class="clear-btn"
                @click="clearSearch"
              >
                <i class="fas fa-times-circle"></i>
              </button>
            </div>
          </div>

          <!-- 内容区域 - 固定高度，超出滚动 -->
          <div class="modal-content">
            <!-- 搜索下拉列表 -->
            <div
              v-if="showDropdown && (filteredStocks.length > 0 || searchKeyword)"
              class="search-dropdown"
            >
              <!-- 加载状态 -->
              <div v-if="loading" class="loading-state">
                <i class="fas fa-spinner fa-pulse"></i>
                <span>搜索中...</span>
              </div>

              <!-- 搜索结果列表 -->
              <div v-else-if="filteredStocks.length > 0" class="results-list">
                <div
                  v-for="stock in filteredStocks"
                  :key="stock.code"
                  class="stock-item"
                  @click="selectStock(stock)"
                >
                  <div class="stock-info">
                    <span class="stock-name">{{ stock.name }}</span>
                    <span class="stock-code">{{ stock.code }}</span>
                    <span class="stock-market" :class="stock.market">
                      {{ getMarketName(stock.market) }}
                    </span>
                  </div>
                  <div class="stock-price-info">
                    <span class="stock-price">{{
                      formatPrice(stock.price)
                    }}</span>
                    <span
                      :class="[
                        'stock-change',
                        stock.changePercent >= 0 ? 'positive' : 'negative',
                      ]"
                    >
                      {{ formatChange(stock.changePercent) }}
                    </span>
                  </div>
                  <button
                    class="add-btn-small"
                    @click.stop="addToWatchlist(stock)"
                  >
                    <i class="fas fa-plus"></i>
                    添加
                  </button>
                </div>
              </div>

              <!-- 无搜索结果 -->
              <div v-else-if="searchKeyword && !loading" class="empty-state">
                <i class="fas fa-search"></i>
                <p>未找到相关股票</p>
                <span>请检查代码或名称是否正确</span>
              </div>
            </div>

            <!-- 热门推荐（无搜索时显示） -->
            <div v-if="!searchKeyword && !showDropdown" class="hot-recommend">
              <div class="hot-header">
                <i class="fas fa-fire" style="color: #ffb347"></i>
                <span>热门推荐</span>
              </div>
              <div class="hot-list">
                <div
                  v-for="stock in hotStocks"
                  :key="stock.code"
                  class="hot-stock-item"
                  @click="selectStock(stock)"
                >
                  <div class="stock-info">
                    <span class="stock-name">{{ stock.name }}</span>
                    <span class="stock-code">{{ stock.code }}</span>
                  </div>
                  <div class="stock-price-info">
                    <span class="stock-price">{{
                      formatPrice(stock.price)
                    }}</span>
                    <span
                      :class="[
                        'stock-change',
                        stock.changePercent >= 0 ? 'positive' : 'negative',
                      ]"
                    >
                      {{ formatChange(stock.changePercent) }}
                    </span>
                  </div>
                  <button
                    class="add-btn-small"
                    @click.stop="addToWatchlist(stock)"
                  >
                    <i class="fas fa-plus"></i>
                    添加
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 底部提示 -->
          <div class="modal-footer">
            <span class="tip-text">
              <i class="fas fa-info-circle"></i>
              点击股票即可添加至自选
            </span>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";

// Props
const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
});

// Emits
const emit = defineEmits(["update:visible", "add", "close"]);

// 状态
const searchKeyword = ref("");
const loading = ref(false);
const showDropdown = ref(false);
const searchInput = ref(null);

// 股票数据池
const allStocks = ref([
  {
    code: "600519",
    name: "贵州茅台",
    price: 1685.01,
    changePercent: 1.12,
    market: "sh",
  },
  {
    code: "000858",
    name: "五粮液",
    price: 142.5,
    changePercent: 0.85,
    market: "sz",
  },
  {
    code: "300750",
    name: "宁德时代",
    price: 209.8,
    changePercent: 3.67,
    market: "sz",
  },
  {
    code: "002594",
    name: "比亚迪",
    price: 258.6,
    changePercent: 0.84,
    market: "sz",
  },
  {
    code: "601318",
    name: "中国平安",
    price: 42.3,
    changePercent: -0.52,
    market: "sh",
  },
  {
    code: "600036",
    name: "招商银行",
    price: 35.2,
    changePercent: 0.32,
    market: "sh",
  },
  {
    code: "000001",
    name: "平安银行",
    price: 11.85,
    changePercent: 0.42,
    market: "sz",
  },
  {
    code: "002475",
    name: "立讯精密",
    price: 32.6,
    changePercent: 2.15,
    market: "sz",
  },
  {
    code: "300059",
    name: "东方财富",
    price: 13.52,
    changePercent: 0.97,
    market: "sz",
  },
  {
    code: "688981",
    name: "中芯国际",
    price: 48.25,
    changePercent: 2.1,
    market: "sh",
  },
  {
    code: "601012",
    name: "隆基绿能",
    price: 18.9,
    changePercent: 1.23,
    market: "sh",
  },
  {
    code: "002230",
    name: "科大讯飞",
    price: 45.8,
    changePercent: 3.45,
    market: "sz",
  },
  {
    code: "600900",
    name: "长江电力",
    price: 27.5,
    changePercent: 0.18,
    market: "sh",
  },
  {
    code: "000333",
    name: "美的集团",
    price: 58.3,
    changePercent: 0.95,
    market: "sz",
  },
  {
    code: "600887",
    name: "伊利股份",
    price: 28.6,
    changePercent: 0.45,
    market: "sh",
  },
]);

// 热门推荐
const hotStocks = ref([
  {
    code: "300750",
    name: "宁德时代",
    price: 209.8,
    changePercent: 3.67,
    market: "sz",
  },
  {
    code: "002594",
    name: "比亚迪",
    price: 258.6,
    changePercent: 0.84,
    market: "sz",
  },
  {
    code: "600519",
    name: "贵州茅台",
    price: 1685.01,
    changePercent: 1.12,
    market: "sh",
  },
  {
    code: "688981",
    name: "中芯国际",
    price: 48.25,
    changePercent: 2.1,
    market: "sh",
  },
  {
    code: "300059",
    name: "东方财富",
    price: 13.52,
    changePercent: 0.97,
    market: "sz",
  },
]);

// 过滤搜索结果
const filteredStocks = computed(() => {
  if (!searchKeyword.value.trim()) return [];

  const keyword = searchKeyword.value.trim().toLowerCase();
  return allStocks.value.filter(
    (stock) =>
      stock.name.toLowerCase().includes(keyword) ||
      stock.code.includes(keyword) ||
      getPinyinInitial(stock.name).includes(keyword),
  );
});

// 拼音首字母转换
const getPinyinInitial = (name) => {
  const map = {
    贵州茅台: "gzmt",
    五粮液: "wly",
    宁德时代: "ndsd",
    比亚迪: "byd",
    中国平安: "zgpa",
    招商银行: "zsyh",
    平安银行: "payh",
    立讯精密: "lxjm",
    东方财富: "dfcf",
    中芯国际: "zxgj",
    隆基绿能: "ljln",
    科大讯飞: "kdxf",
    长江电力: "cjdl",
    美的集团: "mdjt",
    伊利股份: "ylgf",
  };
  return map[name] || "";
};

// 获取市场名称
const getMarketName = (market) => {
  const map = { sh: "沪市", sz: "深市", hk: "港股", us: "美股" };
  return map[market] || "其他";
};

// 格式化价格
const formatPrice = (price) => price.toFixed(2);

// 格式化涨跌幅
const formatChange = (change) => {
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
};

// 搜索处理
const handleSearch = async () => {
  if (!searchKeyword.value.trim()) return;

  loading.value = true;
  showDropdown.value = true;

  setTimeout(() => {
    loading.value = false;
  }, 300);
};

// 清空搜索
const clearSearch = () => {
  searchKeyword.value = "";
  showDropdown.value = false;
  nextTick(() => {
    if (searchInput.value) searchInput.value.focus();
  });
};

// 选择股票
const selectStock = (stock) => {
  addToWatchlist(stock);
};

// 添加到自选 - 只需通知父组件
const addToWatchlist = (stock) => {
  // 通知父组件添加股票
  emit("add", stock);

  // 显示成功提示
  showSuccessTip(stock.name);

  // 清空搜索，关闭下拉
  searchKeyword.value = "";
  showDropdown.value = false;
};

// 显示成功提示
const showSuccessTip = (name) => {
  const tip = document.createElement("div");
  tip.className = "add-success-tip";
  tip.innerHTML = `<i class="fas fa-check-circle"></i> 已添加 ${name} 至自选股`;
  document.body.appendChild(tip);

  setTimeout(() => {
    tip.remove();
  }, 2000);
};

// 关闭弹窗
const closeModal = () => {
  showDropdown.value = false;
  searchKeyword.value = "";
  emit("update:visible", false);
  emit("close");
};

// 点击遮罩关闭
const handleOverlayClick = (e) => {
  if (e.target.classList.contains("modal-overlay")) {
    closeModal();
  }
};

// 点击外部关闭下拉
const handleClickOutside = (e) => {
  const dropdown = document.querySelector(".search-dropdown");
  const input = document.querySelector(".search-input-wrapper");
  if (dropdown && !dropdown.contains(e.target) && !input.contains(e.target)) {
    showDropdown.value = false;
  }
};

// 监听可见性
watch(
  () => props.visible,
  (val) => {
    if (val) {
      nextTick(() => {
        if (searchInput.value) searchInput.value.focus();
      });
      document.addEventListener("click", handleClickOutside);
    } else {
      document.removeEventListener("click", handleClickOutside);
    }
  }
);
</script>

<style lang="scss" scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* 弹窗容器 */
.modal-container {
  width: 560px;
  max-width: 90vw;
  background: #131c28;
  border-radius: 1.5rem;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(75, 130, 200, 0.15) inset;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 80vh;
  animation: modalSlideIn 0.3s ease;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* 头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #2a3346;
  background: rgba(18, 28, 45, 0.9);
  flex-shrink: 0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.header-left i {
  font-size: 1.3rem;
}

.header-left h3 {
  color: #d6e6ff;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 0;
}

.modal-close {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1f2c3f;
  border: 1px solid #2f4567;
  color: #9bb5e0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #2f4567;
  color: white;
  transform: rotate(90deg);
}

/* 搜索区域 */
.search-section {
  padding: 1.2rem 1.5rem;
  border-bottom: 1px solid #2a3346;
  flex-shrink: 0;
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: #0e1622;
  border: 1px solid #2c3f5c;
  border-radius: 40px;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
}

.search-input-wrapper:focus-within {
  border-color: #3e7aff;
  box-shadow: 0 0 0 2px rgba(62, 122, 255, 0.2);
}

.search-input-wrapper i {
  color: #6b85ad;
  font-size: 0.9rem;
  margin-right: 0.5rem;
}

.search-input-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ecf5ff;
  font-size: 0.9rem;
}

.search-input-wrapper input::placeholder {
  color: #50607c;
}

.clear-btn {
  background: transparent;
  border: none;
  color: #7a94b8;
  cursor: pointer;
  padding: 0 0.3rem;
  transition: color 0.2s;
}

.clear-btn:hover {
  color: #ea5b5b;
}

/* 内容区域 - 固定高度，超出滚动 */
.modal-content {
  flex: 1;
  overflow-y: auto;
  min-height: 300px;
  max-height: 400px;
}

/* 滚动条样式 */
.modal-content::-webkit-scrollbar {
  width: 6px;
}

.modal-content::-webkit-scrollbar-track {
  background: #1f2c3f;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb {
  background: #3f5b86;
  border-radius: 3px;
}

.modal-content::-webkit-scrollbar-thumb:hover {
  background: #5f8ad4;
}

/* 搜索下拉列表 */
.search-dropdown {
  background: #0e1a28;
  overflow: hidden;
}

.results-list {
  padding: 0.5rem;
}

.stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  gap: 0.8rem;
}

.stock-item:hover {
  background: #1f2c3f;
}

.stock-info {
  flex: 2;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.stock-name {
  font-weight: 600;
  color: #ffffff;
  font-size: 0.95rem;
}

.stock-code {
  color: #7690b5;
  font-size: 0.75rem;
}

.stock-market {
  font-size: 0.65rem;
  padding: 0.1rem 0.4rem;
  border-radius: 10px;
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

.stock-price-info {
  flex: 1;
  text-align: right;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.1rem;
}

.stock-price {
  color: #d0e2ff;
  font-weight: 500;
  font-size: 0.9rem;
}

.stock-change {
  font-size: 0.75rem;
  font-weight: 600;
}

.stock-change.positive {
  color: #16c784;
}

.stock-change.negative {
  color: #ea5b5b;
}

.add-btn-small {
  background: #2f4567;
  border: none;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.add-btn-small:hover {
  background: #3f5b86;
  transform: translateY(-1px);
}

/* 加载状态 */
.loading-state {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2rem;
  color: #7a94b8;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #7a94b8;
}

.empty-state i {
  font-size: 2rem;
  margin-bottom: 0.5rem;
  opacity: 0.5;
}

.empty-state p {
  margin: 0.5rem 0;
  font-size: 0.9rem;
}

.empty-state span {
  font-size: 0.8rem;
  opacity: 0.7;
}

/* 热门推荐 */
.hot-recommend {
  padding: 1rem 1rem;
}

.hot-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  color: #b8d6ff;
  font-weight: 500;
  font-size: 0.9rem;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.hot-stock-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.7rem;
  border-radius: 0.8rem;
  cursor: pointer;
  transition: all 0.2s;
  background: #0e1622;
  gap: 0.8rem;
}

.hot-stock-item:hover {
  background: #1f2c3f;
}

/* 底部 */
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #2a3346;
  background: rgba(18, 28, 45, 0.6);
  flex-shrink: 0;
}

.tip-text {
  font-size: 0.7rem;
  color: #7a94b8;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  justify-content: center;
}

/* 添加成功提示 */
.add-success-tip {
  position: fixed;
  top: 80px;
  right: 20px;
  background: #1d4e3a;
  color: #8cffc7;
  padding: 0.8rem 1.2rem;
  border-radius: 40px;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1001;
  animation: slideInRight 0.3s ease;
}

@keyframes slideInRight {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* 过渡动画 */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
</style>