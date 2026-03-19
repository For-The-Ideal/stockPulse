<template>
  <div class="pagination">
    <span class="page-btn"><i class="fas fa-chevron-left"></i></span>
    <span class="page-btn active">1</span>
    <span class="page-btn">2</span>
    <span class="page-btn">3</span>
    <span class="page-btn">4</span>
    <span class="page-dots">...</span>
    <span class="page-btn">12</span>
    <span class="page-btn"><i class="fas fa-chevron-right"></i></span>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
/* 分页组件 */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}
.page-btn {
  background: #1f2c3f;
  border: 1px solid #33475f;
  color: #b8d6ff;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}
.page-btn:hover {
  background: #2f4567;
  color: white;
}
.page-btn.active {
  background: #2f4567;
  color: white;
  border-color: #5f8ad4;
}
.page-dots {
  color: #6f8ab0;
  margin: 0 0.2rem;
}
</style>
