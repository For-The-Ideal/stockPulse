<template>
  <div class="default-layout">
    <Header />
    <Layout>
      <slot />
    </Layout>
    <Footer />
  </div>
</template>

<script setup>
import Header from "~/components/header/index.vue";
import Layout from "~/components/layout/index.vue";
import Footer from "~/components/footer/index.vue";
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, "Helvetica Neue", sans-serif;
}

a, 
.nuxt-link-exact-active,
.nuxt-link-active,
a:visited,
a:active,
a:hover {
  text-decoration: none !important;
}

/* 或者更精确地只针对 NuxtLink */
a[href] {
  text-decoration: none;
}

body {
     background: #0b0e14;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    min-height: 100vh;
    padding: 0;
    width: 100%;
    margin: 0;
}

.default-layout {
  width: 90vw;
  background: #11161f;
  border-radius: 0 0 2rem 2rem; /* 只保留底部圆角，头部吸顶后无顶部圆角更合理 */
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8),
    0 0 0 1px rgba(75, 130, 200, 0.15) inset;
  overflow: visible; /* 改为visible，因为要滚动 */
  backdrop-filter: blur(2px);
  margin: 0 1rem 2rem 1rem; /* 左右留小边距，底部留边距 */
}
</style>
