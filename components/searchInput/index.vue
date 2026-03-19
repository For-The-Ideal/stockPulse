<template>
  <!-- 头部 + 总数 -->
  <div class="page-header">
    <h1><i class="fas fa-fire" style="color: #ffb347"></i> 多源资讯中心</h1>
    <span class="total-count"
      ><i class="far fa-newspaper"></i> 今日更新 158 条</span
    >
  </div>

  <!-- 搜索框 + 按钮 (核心新增) -->
  <div class="search-section">
    <div class="search-wrapper">
      <i class="fas fa-search"></i>
      <input
        type="text"
        placeholder="搜索资讯标题、股票代码或关键词..."
        value="宁德时代"
      />
      <button>
        <i class="fas fa-sliders-h" style="margin-right: 6px"></i> 搜索
      </button>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
/* 页面标题 */
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}
.page-header h1 {
  color: #e2f0ff;
  font-size: 1.8rem;
  font-weight: 600;
}
.total-count {
  background: #1f2c3f;
  color: #b8d6ff;
  padding: 0.3rem 1rem;
  border-radius: 30px;
  font-size: 0.9rem;
}

/* 搜索框 */
.search-section {
  margin-bottom: 1.8rem;
}
.search-wrapper {
  display: flex;
  gap: 1rem;
  align-items: center;
  background: #131c28;
  border-radius: 60px;
  border: 1px solid #2a3f60;
  padding: 0.3rem 0.3rem 0.3rem 1.5rem;
}
.search-wrapper i {
  color: #6b85ad;
  font-size: 1rem;
}
.search-wrapper input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  color: #ecf5ff;
  font-size: 1rem;
  padding: 0.8rem 0;
}
.search-wrapper button {
  background: #2f4567;
  border: none;
  color: white;
  padding: 0.7rem 2rem;
  border-radius: 60px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}
.search-wrapper button:hover {
  background: #3f5b86;
}
</style>
