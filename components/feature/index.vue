<template>
    <div class="bottom-feature">
        <div class="insight-card">
          <div class="insight-icon"><i class="fas fa-calendar-alt"></i></div>
          <div class="insight-title">本周财报日历</div>
          <div class="insight-desc">拼多多、美团、Adobe 等46家公司披露业绩</div>
        </div>
        <div class="insight-card">
          <div class="insight-icon">
            <i class="fas fa-microphone-lines"></i>
          </div>
          <div class="insight-title">美联储利率决议</div>
          <div class="insight-desc">点阵图暗示年内降息一次？美元震荡</div>
        </div>
        <div class="insight-card">
          <div class="insight-icon"><i class="fas fa-chart-gantt"></i></div>
          <div class="insight-title">北向资金</div>
          <div class="insight-desc">今日净买入超50亿，重点加仓半导体</div>
        </div>
      </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
      .insight-card {
        background: #111b28;
        border-radius: 1.5rem;
        padding: 1.2rem 1.2rem;
        border: 1px solid #25344a;
        transition: 0.2s;
        margin-bottom: 1rem;
        cursor: pointer;
      }
      .insight-card:hover {
        background: #14212f;
        border-color: #3c5b84;
      }
      .insight-icon {
        font-size: 1.8rem;
        color: #4f82d0;
        margin-bottom: 0.7rem;
      }
      .insight-title {
        font-weight: 600;
        color: #d4e7ff;
        font-size: 0.95rem;
        margin-bottom: 0.25rem;
      }
      .insight-desc {
        font-size: 0.8rem;
        color: #7f98c0;
        line-height: 1.4;
      }

     
</style>
