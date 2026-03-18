<template>
  <div class="fund-flow-panel">
    <div class="flow-header">
      <i class="fas fa-water" style="color: #3e7aff; font-size: 1.2rem"></i>
      <h4>资金流向 · 实时</h4>
      <span style="margin-left: auto; font-size: 0.75rem; color: #678fc2"
        >单位:亿元</span
      >
    </div>
    <div class="flow-grid">
      <div class="flow-item-card">
        <div class="flow-label">
          <i class="fas fa-arrow-up" style="color: #16c784"></i> 主力净流入
        </div>
        <div class="flow-number positive">+126.4</div>
        <div class="flow-detail">超大单 +87.2 / 大单 +39.2</div>
        <div class="flow-bar">
          <div class="flow-bar-fill positive" style="width: 78%"></div>
        </div>
      </div>
      <div class="flow-item-card">
        <div class="flow-label">
          <i class="fas fa-arrow-down" style="color: #ea5b5b"></i> 散户净流出
        </div>
        <div class="flow-number negative">-42.8</div>
        <div class="flow-detail">中单 -18.3 / 小单 -24.5</div>
        <div class="flow-bar">
          <div class="flow-bar-fill negative" style="width: 34%"></div>
        </div>
      </div>
      <div class="flow-item-card">
        <div class="flow-label"><i class="fas fa-bolt"></i> 北向资金</div>
        <div class="flow-number positive">+52.8</div>
        <div class="flow-detail">沪股通 +31.2 / 深股通 +21.6</div>
        <div class="flow-bar">
          <div class="flow-bar-fill positive" style="width: 62%"></div>
        </div>
      </div>
      <div class="flow-item-card">
        <div class="flow-label"><i class="fas fa-building"></i> 机构净买</div>
        <div class="flow-number positive">+78.3</div>
        <div class="flow-detail">主动买入 +102.4 / 卖出 -24.1</div>
        <div class="flow-bar">
          <div class="flow-bar-fill positive" style="width: 70%"></div>
        </div>
      </div>
    </div>
    <div class="flow-uptime">更新时间: 14:55</div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
.fund-flow-panel {
  background: #131c28;
  border-radius: 1.8rem;
  padding: 1.5rem 1.4rem;
  border: 1px solid #273349;
  margin-top: 0.2rem;
}
.flow-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 1.2rem;
}
.flow-header h4 {
  color: #d6e6ff;
  font-size: 1.15rem;
}
.flow-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}
.flow-item-card {
  background: #0e1a28;
  border-radius: 1.2rem;
  padding: 1rem;
  border: 1px solid #2d405b;
}
.flow-label {
  color: #93aecf;
  font-size: 0.8rem;
  margin-bottom: 0.3rem;
}
.flow-number {
  font-weight: 700;
  font-size: 1.4rem;
}
.flow-number.positive {
  color: #16c784;
}
.flow-number.negative {
  color: #ea5b5b;
}
.flow-uptime {
  margin-top: 0.8rem;
  text-align: right;
  color: #627da3;
  font-size: 0.8rem;
}
.flow-detail {
  font-size: 0.75rem;
  color: #7d99c0;
  margin-top: 4px;
}
.flow-bar {
  margin-top: 0.8rem;
  height: 6px;
  background: #253141;
  border-radius: 10px;
  overflow: hidden;
}
.flow-bar-fill {
  height: 6px;
  background: #3e7aff;
  border-radius: 10px;
  width: 70%;
}
.flow-bar-fill.positive {
  background: #16c784;
}
.flow-bar-fill.negative {
  background: #ea5b5b;
}
</style>
