<template>
  <div class="market-snapshot">
    <div class="section-header">
      <h3><i class="fas fa-chart-simple"></i> 主要指数 · 实时</h3>
      <span class="market-date"
        ><i class="far fa-clock"></i> 06月17日 14:55</span
      >
    </div>
    <div class="index-tiles">
      <div class="index-item">
        <div class="index-name"><i class="fas fa-flag"></i> 上证指数</div>
        <div class="index-value">3,162.48</div>
        <div class="index-change positive">
          <i class="fas fa-arrow-up"></i> +0.83%
        </div>
      </div>
      <div class="index-item">
        <div class="index-name"><i class="fas fa-building"></i> 深证成指</div>
        <div class="index-value">9,609.65</div>
        <div class="index-change positive">
          <i class="fas fa-arrow-up"></i> +1.27%
        </div>
      </div>
      <div class="index-item">
        <div class="index-name"><i class="fab fa-btc"></i> 创业板指</div>
        <div class="index-value">1,832.21</div>
        <div class="index-change negative">
          <i class="fas fa-arrow-down"></i> -0.15%
        </div>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.market-snapshot {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.6rem;
  border: 1px solid #273349;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.2rem;
    color: #fff;
  }

  .section-header h3 {
    color: #ddeeff;
    font-weight: 600;
    font-size: 1.3rem;
    letter-spacing: -0.2px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .section-header h3 i {
    color: #3e7aff;
    font-size: 1.2rem;
  }

  .market-date {
    color: #788fb0;
    font-size: 0.85rem;
    background: #1f2b3c;
    padding: 0.3rem 1rem;
    border-radius: 30px;
  }

  .index-tiles {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }

  .index-item {
    background: #0e1622;
    padding: 1rem 0.9rem;
    border-radius: 1.5rem;
    border: 1px solid #263041;
    transition: 0.2s;
  }
  .index-item:hover {
    border-color: #3f5a82;
    background: #121d2c;
  }

  .index-name {
    color: #a5bedd;
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .index-value {
    font-weight: 700;
    font-size: 1.5rem;
    color: #f0f6ff;
    margin: 0.3rem 0 0.1rem;
  }

  .index-change {
    font-size: 0.9rem;
    font-weight: 500;
  }

  .positive {
    color: #16c784;
  }
  .negative {
    color: #ea5b5b;
  }
}
</style>
