<template>
  <div>
    <Breadcrumb />
    <div class="page-container">
      <SearchInput />
      <SourceTag />

      <div class="content-container">
        <div class="feed-container">
          <FeedList />
          <Pagination />
        </div>
        <div class="sidebar-container">
          <Sidebar />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Breadcrumb from "~/components/breadcrumb/index.vue";
import SearchInput from "~/components/searchInput/index.vue";
import SourceTag from "~/components/sourceTag/index.vue";
import FeedList from "~/components/feedList/index.vue";
import Pagination from "~/components/pagination/index.vue";
import Sidebar from "~/components/sidebar/index.vue";
</script>

<style lang="scss" scoped>
.page-container {
  padding: 1rem 2rem 2.5rem 2rem;
}
.content-container {
  display: flex;
  gap: 1rem;
}
.feed-container {
  width: 100%;
}
.sidebar-container {
  width: 40%;
}
</style>
