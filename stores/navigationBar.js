export const useNavigationBarStore = defineStore("navigationBar", {
  state: () => ({
    navigationBarActive: "/",
  }),

  actions: {
    async setNavigationBarActive(path) {
      this.navigationBarActive = path;
    },
  },
});
