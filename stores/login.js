import { defineStore } from "pinia";
import { useUserStore } from "~/stores/user.js";

export const useLoginStore = defineStore("login", {
  state: () => ({
    isLogin: false,
    loginInfo: {},
  }),

  actions: {
    async setLoginInfo() {
      const userStore = useUserStore();
      this.isLogin = true;
      userStore.setUserInfo({
      id: 1,
      name: "张三",
      email: "zhangsan@example.com",
    });
    },
    async logout() {
      const userStore = useUserStore();
      this.isLogin = false;
      this.loginInfo = {};
      userStore.setUserInfo({});
    },
  },

  getters: {},
});
