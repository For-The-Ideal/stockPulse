<template>
       <div class="source-filter">
      <span class="filter-label"><i class="fas fa-rss"></i> 信源筛选</span>
      <div class="filter-options">
        <span class="source-chip active"
          ><i class="fas fa-check-circle"></i> 全部</span
        >
        <span class="source-chip"
          ><i class="fas fa-chart-bar"></i> 东方财富</span
        >
        <span class="source-chip"><i class="fas fa-dragon"></i> 同花顺</span>
        <span class="source-chip"
          ><i class="fas fa-newspaper"></i> 其他资讯</span
        >
      </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

/* 筛选栏 */
.source-filter {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1.6rem;
  flex-wrap: wrap;
}
.filter-label {
  color: #9ab3d9;
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.3px;
  background: #1f2c3f;
  padding: 0.3rem 1rem;
  border-radius: 30px;
}
.filter-options {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
.source-chip {
  background: #1f2c3f;
  color: #b5cef0;
  padding: 0.4rem 1.2rem;
  border-radius: 40px;
  font-size: 0.85rem;
  font-weight: 500;
  border: 1px solid #334257;
  cursor: default;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: 0.1s;
}
.source-chip i {
  font-size: 0.8rem;
  color: #6086c0;
  margin-right: 0.2rem;
}
.source-chip.active {
  background: #2f4567;
  color: white;
  border-color: #5f8ad4;
  box-shadow: 0 2px 8px #1e3a62;
}
.source-chip.active i {
  color: #ffdb9d;
}
</style>