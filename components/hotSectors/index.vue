<template>
  <div class="hot-sectors">
    <div class="section-header">
      <h4><i class="fas fa-chart-pie"></i> 板块热点</h4>
      <span class="market-date">今日资金</span>
    </div>
    <div class="sector-item">
      <span class="sector-name"><i class="fas fa-bolt"></i> 半导体</span>
      <div class="sector-progress">
        <div class="progress-bar-bg">
          <div class="progress-fill" style="width: 85%"></div>
        </div>
        <span class="sector-perc positive">+4.2%</span>
      </div>
    </div>
    <div class="sector-item">
      <span class="sector-name"><i class="fas fa-car"></i> 汽车整车</span>
      <div class="sector-progress">
        <div class="progress-bar-bg">
          <div class="progress-fill" style="width: 67%"></div>
        </div>
        <span class="sector-perc positive">+2.7%</span>
      </div>
    </div>
    <div class="sector-item">
      <span class="sector-name"><i class="fas fa-flask"></i> 创新药</span>
      <div class="sector-progress">
        <div class="progress-bar-bg">
          <div class="progress-fill" style="width: 45%"></div>
        </div>
        <span class="sector-perc positive">+1.5%</span>
      </div>
    </div>
    <div class="sector-item">
      <span class="sector-name"
        ><i class="fas fa-hand-holding-usd"></i> 银行</span
      >
      <div class="sector-progress">
        <div class="progress-bar-bg">
          <div
            class="progress-fill"
            style="width: 22%; background: #ea5b5b"
          ></div>
        </div>
        <span class="sector-perc negative">-0.8%</span>
      </div>
    </div>
    <div class="sector-item">
      <span class="sector-name"
        ><i class="fas fa-charging-station"></i> 光伏</span
      >
      <div class="sector-progress">
        <div class="progress-bar-bg">
          <div class="progress-fill" style="width: 58%"></div>
        </div>
        <span class="sector-perc positive">+2.0%</span>
      </div>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.hot-sectors {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.4rem;
  border: 1px solid #273349;
}
.section-header {
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.market-date {
  color: #788fb0;
  font-size: 0.85rem;
  background: #1f2b3c;
  padding: 0.3rem 1rem;
  border-radius: 30px;
}
.sector-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px dashed #253141;
}
.sector-item:last-child {
  border-bottom: none;
}
.sector-name {
  color: #b9d0f0;
  font-weight: 500;
  font-size: 0.9rem;
}
.sector-progress {
  display: flex;
  align-items: center;
  gap: 0.7rem;
}
.progress-bar-bg {
  width: 100px;
  height: 6px;
  background: #242f41;
  border-radius: 8px;
}
.progress-fill {
  height: 6px;
  border-radius: 8px;
  background: linear-gradient(90deg, #3d89ff, #75aaff);
}
.sector-perc {
  font-weight: 600;
  font-size: 0.9rem;
  color: #fff;
  min-width: 45px;
  text-align: right;
}
</style>
