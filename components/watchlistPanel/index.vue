<template>
  <div class="watchlist-panel">
    <div id="loginPlaceholder" class="login-placeholder" v-if="!isLogin">
      <i class="fas fa-lock"></i>
      <p>登录后查看您的自选股</p>
      <button class="login-btn" @click="isLogin = true">立即登录</button>
    </div>

    <template v-else>
      <div class="watchlist-header">
        <div class="watchlist-header-content">
          <h4><i class="fas fa-star" style="color: #ffb347"></i> 自选股 (6)</h4>
        </div>
      </div>
      <div class="stock-row">
        <div class="stock-info">
          <span class="stock-symbol">腾讯控股</span
          ><span class="stock-name">00700 · 港股</span>
        </div>
        <div class="stock-price-info">
          <div class="stock-price">378.20 HKD</div>
          <div class="stock-change-red positive">+2.35%</div>
        </div>
      </div>
      <div class="stock-row">
        <div class="stock-info">
          <span class="stock-symbol">贵州茅台</span
          ><span class="stock-name">600519 · 白酒</span>
        </div>
        <div class="stock-price-info">
          <div class="stock-price">1,685.01</div>
          <div class="stock-change-red positive">+1.12%</div>
        </div>
      </div>
      <div class="stock-row">
        <div class="stock-info">
          <span class="stock-symbol">特斯拉</span
          ><span class="stock-name">TSLA · 美股</span>
        </div>
        <div class="stock-price-info">
          <div class="stock-price">189.35 USD</div>
          <div class="stock-change-green negative">-0.78%</div>
        </div>
      </div>
      <div class="stock-row">
        <div class="stock-info">
          <span class="stock-symbol">宁德时代</span
          ><span class="stock-name">300750 · 电池</span>
        </div>
        <div class="stock-price-info">
          <div class="stock-price">209.80</div>
          <div class="stock-change-red positive">+3.67%</div>
        </div>
      </div>
      <div class="stock-row">
        <div class="stock-info">
          <span class="stock-symbol">英伟达</span
          ><span class="stock-name">NVDA · 美股</span>
        </div>
        <div class="stock-price-info">
          <div class="stock-price">131.44 USD</div>
          <div class="stock-change-red positive">+4.08%</div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
const isLogin = ref(false);
</script>

<style lang="scss" scoped>
.watchlist-panel {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.4rem;
  border: 1px solid #273349;
}

.watchlist-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1.4rem;
}
.watchlist-header-content {
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: space-between;
}

.watchlist-header h4 {
  color: #d6e6ff;
  font-weight: 600;
  font-size: 1.15rem;
}
.login-btn {
  background: #2f4567;
  border: none;
  color: white;
  padding: 0.6rem 2rem;
  border-radius: 40px;
  font-weight: 600;
  cursor: pointer;
}
.login-badge {
  background: #2f4567;
  color: white;
  border: none;
  padding: 0.4rem 1.2rem;
  border-radius: 30px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: 0.2s;
}
.login-badge:hover {
  background: #3f5b86;
}

.edit-link {
  color: #5686d4;
  font-size: 0.8rem;
  text-decoration: none;
  background: #1e2c40;
  padding: 0.3rem 0.9rem;
  border-radius: 20px;
}

.stock-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.9rem 0;
  border-bottom: 1px solid #1f2d3e;
}
.stock-row:last-child {
  border-bottom: none;
}

.stock-info {
  display: flex;
  flex-direction: column;
}

.stock-symbol {
  font-weight: 700;
  color: #ffffff;
  font-size: 1rem;
}

.stock-name {
  font-size: 0.9rem;
  color: #7690b5;
  margin-top: 0.3rem;
}

.stock-price-info {
  text-align: right;
}

.stock-price {
  font-weight: 700;
  color: #ebf3ff;
}

.stock-change-red {
  font-size: 0.8rem;
  color: red;
  font-weight: 500;
  margin-top: 0.2rem;
}
.stock-change-green {
  font-size: 0.8rem;
  color: #00ff00;
  font-weight: 500;
  margin-top: 0.2rem;
}

/* 未登录状态占位 */
.login-placeholder {
  background: #0e1a2a;
  border-radius: 20px;
  padding: 2rem 1rem;
  text-align: center;
  border: 1px dashed #3a5780;
}
.login-placeholder i {
  font-size: 2.5rem;
  color: #5f7eb0;
  margin-bottom: 0.8rem;
}
.login-placeholder p {
  color: #9bb5e0;
  margin-bottom: 1rem;
}
</style>
