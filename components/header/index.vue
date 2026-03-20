<template>
  <div class="app-header">
    <div class="navbar">
      <a class="logo-area" href="/">
        <div class="logo-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="logo-text">StockPulse<span>.live</span></div>
      </a>
      <div class="nav-links">
        <NuxtLink
          v-for="item in getTabList"
          :key="item.type"
          to="#"
          @click="handleNavigationBar(item)"
          :class="{ active: navigationBarActive === item.link }"
          class="nav-link">
          <i :class="item.icon"></i>{{ item.name }}
        </NuxtLink>
      </div>
      <div class="search-user">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input @keyup.enter="handleSearch" type="text" placeholder="搜索代码或资讯..." />
        </div>
        <template v-if="isLogin && userInfo && userInfo.id">
          <div class="user-badge" ref="userBadgeRef" @click="handleDropdownClick">
            <i class="fas fa-user-circle"></i>
            <span>{{ userInfo.name }}</span>
            <i class="fas fa-chevron-down" :class="{ 'rotate-180': isShowDropdown }"></i>

            <div class="user-bubble" v-if="isShowDropdown" 
            v-click-outside="closeDropdown">
              <!-- 气泡头部 - 用户信息动态显示 -->
              <div class="bubble-header">
                <div class="bubble-avatar">
                  <i class="fas fa-user-astronaut"></i>
                </div>
                <div class="bubble-info">
                  <h4>{{ userInfo.name }}</h4>
                  <p>已登录账户</p>
                </div>
              </div>

              <!-- 菜单项 -->
              <div class="bubble-menu">
                <div class="bubble-item" @click.stop="goToWatchlist">
                  <i class="fas fa-star"></i>
                  <span>自选股</span>
                  <span class="menu-badge">3</span>
                </div>
                <div class="bubble-item" @click.stop="goToSettings">
                  <i class="fas fa-cog"></i>
                  <span>个人设置</span>
                </div>
                <div class="bubble-divider"></div>
                <div class="bubble-item" @click.stop="handleLogout">
                  <i class="fas fa-sign-out-alt"></i>
                  <span>退出登录</span>
                </div>
              </div>
            </div>
          </div>
        </template>
        <template v-else>
          <div class="user-badge" @click="goToLogin">
            <i class="fas fa-user-circle"></i>
            <span>未登录</span>
            <i class="fas fa-chevron-down"></i>
          </div>
        </template>
      </div>
    </div>

    <LoginModal :modelValue="isShowLoginModal" @update-modelValue="handleUpdateModelValue" @login-success="handleLoginSuccess" />
  </div>
</template>

<script setup>
import { ref, computed, } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "~/stores/user.js";
import { storeToRefs } from "pinia";
import { useLoginStore } from "~/stores/login.js";
import LoginModal from '~/components/loginModal/index.vue'
import {useNavigationBarStore} from "~/stores/navigationBar.js"
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const { userInfo } = storeToRefs(userStore);
const loginStore = useLoginStore();
const { isLogin } = storeToRefs(loginStore);
const navigationBarStore = useNavigationBarStore()
const {navigationBarActive} = storeToRefs(navigationBarStore)
const isShowLoginModal = ref(false)
const isShowDropdown = ref(false);

const tabList = ref([
  {
    name: "资讯",
    icon: "fas fa-newspaper",
    type: "/",
    link: "/",
  },
  {
    name: "行情",
    icon: "fas fa-table",
    type: "table",
    link: "/table",
  },
  {
    name: "自选",
    icon: "fas fa-star",
    type: "star",
    link: "/star",
  },
  {
    name: "研报",
    icon: "fas fa-robot",
    type: "robot",
    link: "/robot",
  },
  {
    name: "板块",
    icon: "fas fa-chart-pie",
    type: "pie",
    link: "/pie",
  },
]);

const getTabList = computed(()=>{
  return tabList.value.filter(item=>{
    return isLogin.value ? item : item.type !== 'star'
  })
})

const handleDropdownClick = (e) => {
  e.stopPropagation();
  isShowDropdown.value = !isShowDropdown.value;
};

const closeDropdown = () => {
  isShowDropdown.value = false;
};

const goToWatchlist = () => {
  closeDropdown();
  router.push('/star');
};

const goToSettings = () => {
  closeDropdown();
  router.push('/settings');
};

const handleLogout = async () => {
  await loginStore.logout();
  closeDropdown();
  // router.push('/');
};

const handleLoginSuccess = async () => {
  isShowLoginModal.value = false
}

const handleNavigationBar = async(item)=>{
  await navigationBarStore.setNavigationBarActive(item.link)
  router.push(item.link)
}

const handleSearch = (e) => {
  console.log(e.target.value,route.path);
  const searchValue = e.target.value.trim();
  if (searchValue) {
    router.push(`/search?keyword=${searchValue}`);
  }
}

const goToLogin = () => {
  isShowLoginModal.value = true
};

const handleUpdateModelValue = (value) => {
  isShowLoginModal.value = value
}

// 自定义指令：点击外部关闭
const vClickOutside = {
  mounted(el, binding) {
    el._clickOutside = (event) => {
      // 如果点击的元素不是 el 本身，也不是 el 内部的元素，则执行回调
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event);
      }
    };
    document.addEventListener('click', el._clickOutside);
  },
  unmounted(el) {
    document.removeEventListener('click', el._clickOutside);
  }
};


</script>

<style lang="scss" scoped>
.app-header {
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 100;

  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: rgba(12, 20, 30, 0.95);
    border-bottom: 1px solid #2a3346;
    flex-wrap: wrap;
    gap: 1rem;
    backdrop-filter: blur(8px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    border-radius: 0;
    transition: all 0.1s;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    text-decoration: none;
  }

  .logo-icon {
    background: linear-gradient(145deg, #3b7cff, #1f4fbc);
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px -4px #0e2b5e;
  }

  .logo-icon i {
    font-size: 1.6rem;
    color: white;
  }

  .logo-text {
    font-weight: 700;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
    background: linear-gradient(135deg, #ffffff, #b0c7f0);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .logo-text span {
    font-weight: 400;
    font-size: 1rem;
    color: #6b85ac;
    background: none;
    -webkit-text-fill-color: #6b85ac;
    margin-left: 6px;
  }

  .nav-links {
    display: flex;
    gap: 0.2rem;
    background: #1b232f;
    padding: 0.3rem;
    border-radius: 40px;
    border: 1px solid #2d384a;
  }

  .nav-link {
    padding: 0.6rem 1.3rem;
    border-radius: 30px;
    font-weight: 500;
    font-size: 0.9rem;
    color: #99aec9;
    text-decoration: none;
    transition: all 0.2s;
    white-space: nowrap;
    cursor: pointer;
  }

  .nav-link i {
    margin-right: 6px;
    font-size: 0.9rem;
  }

  .nav-link.active {
    background: #2b3b52;
    color: white;
    box-shadow: 0 4px 8px #0d1a2b;
  }

  .nav-link:hover:not(.active) {
    color: #d3e3ff;
    background: #253040;
  }

  .search-user {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
  }

  .search-box {
    background: #1b2533;
    border-radius: 30px;
    padding: 0.45rem 1rem;
    display: flex;
    align-items: center;
    border: 1px solid #2f3d54;
    transition: 0.2s;
  }

  .search-box i {
    color: #6b85ad;
    font-size: 1rem;
    margin-right: 8px;
  }

  .search-box input {
    background: transparent;
    border: none;
    outline: none;
    color: #ecf5ff;
    width: 180px;
    font-size: 0.9rem;
  }

  .search-box input::placeholder {
    color: #50607c;
  }

  .user-badge {
    display: flex;
    align-items: center;
    cursor: pointer;
    gap: 8px;
    background: #1c2738;
    padding: 0.4rem 0.9rem 0.4rem 1.2rem;
    border-radius: 40px;
    border: 1px solid #344153;
    transition: 0.2s;
    position: relative;
  }

  .user-badge:hover {
    background: #2a3850;
    border-color: #5a7bb5;
  }

  .user-badge i {
    font-size: 1.2rem;
    color: #aac3ff;
  }

  .user-badge span {
    font-weight: 500;
    color: #d5e2ff;
  }

  .user-badge .fa-chevron-down {
    font-size: 0.75rem;
    color: #7e95bc;
    margin-left: 5px;
    transition: transform 0.3s;
  }

  .rotate-180 {
    transform: rotate(180deg);
  }

  /* ===== 悬浮气泡卡片 ===== */
  .user-bubble {
    position: absolute;
    top: calc(100% + 20px);
    right: 0;
    width: 280px;
    background: rgba(22, 32, 48, 0.98);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid rgba(70, 100, 140, 0.5);
    border-radius: 24px;
    box-shadow: 0 25px 50px -8px rgba(0, 0, 0, 0.8),
                0 0 0 1px rgba(75, 130, 220, 0.2) inset;
    z-index: 101;
    animation: bubbleAppear 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  @keyframes bubbleAppear {
    from {
      opacity: 0;
      transform: translateY(-10px) scale(0.95);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  /* 小三角箭头 */
  .user-bubble::before {
    content: "";
    position: absolute;
    top: -6px;
    right: 30px;
    width: 14px;
    height: 14px;
    background: rgba(22, 32, 48, 0.98);
    border-top: 1px solid rgba(70, 100, 140, 0.5);
    border-left: 1px solid rgba(70, 100, 140, 0.5);
    transform: rotate(45deg);
    backdrop-filter: blur(12px);
    border-radius: 3px;
    z-index: -1;
  }

  /* 气泡头部 */
  .bubble-header {
    padding: 1.5rem 1.2rem;
    display: flex;
    align-items: center;
    gap: 15px;
    border-bottom: 1px solid rgba(100, 130, 180, 0.2);
    background: rgba(30, 45, 65, 0.3);
  }

  .bubble-avatar {
    width: 52px;
    height: 52px;
    background: linear-gradient(145deg, #3b7cff, #1f4fbc);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 8px 16px -4px #0e2b5e;
  }

  .bubble-avatar i {
    font-size: 1.8rem;
    color: white;
  }

  .bubble-info h4 {
    color: white;
    font-size: 1.1rem;
    font-weight: 600;
    margin-bottom: 0.2rem;
  }

  .bubble-info p {
    color: #8aa9d5;
    font-size: 0.8rem;
  }

  /* 气泡菜单项 */
  .bubble-menu {
    padding: 0.5rem;
  }

  .bubble-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0.8rem 1rem;
    color: #d0e4ff;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    margin: 2px 0;
  }

  .bubble-item:hover {
    background: rgba(60, 95, 145, 0.4);
    color: white;
    transform: translateX(4px);
  }

  .bubble-item i {
    width: 24px;
    font-size: 1.1rem;
    color: #6b9eff;
  }

  .bubble-divider {
    height: 1px;
    background: linear-gradient(to right, transparent, rgba(100, 130, 180, 0.3), transparent);
    margin: 0.5rem 0;
  }

  /* 徽章计数 */
  .menu-badge {
    margin-left: auto;
    background: #2f4567;
    color: white;
    padding: 0.2rem 0.7rem;
    border-radius: 30px;
    font-size: 0.7rem;
    font-weight: 600;
  }
}
</style>