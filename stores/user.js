import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {},
  }),

  actions: {
    async initialize() {
      console.log("第一次访问");
      // 这里可以添加初始化逻辑
    },
    async setUserInfo(userInfo) {
      this.userInfo = userInfo
      console.log('User info set:', this.userInfo)
    }
  },

  getters: {
    getUserInfo: (state) => state.userInfo,
  },
})