<template>
  <div class="breadcrumb">
    <a href="#">
        <i class="fas fa-home"></i> 
        <span>首页</span>
    </a>
    <i class="fas fa-chevron-right"></i>
    <a href="#">资讯</a>
    <i class="fas fa-chevron-right"></i>
    <span style="color: #b6d0f0">多源资讯中心</span>
  </div>
</template>

<script setup>


</script>

<style lang="scss" scoped>
.breadcrumb {
  padding: 1.5rem 2rem 0.2rem 2rem;
  color: #6f8ab0;
}
.breadcrumb a {
  color: #98b2da;
  text-decoration: none;
}
.breadcrumb i {
  margin: 0 8px;
  font-size: 0.6rem;
}
</style>
