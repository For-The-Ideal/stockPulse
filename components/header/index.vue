<template>
  <div class="app-header">
    <div class="navbar">
      <div class="logo-area">
        <div class="logo-icon">
          <i class="fas fa-chart-line"></i>
        </div>
        <div class="logo-text">StockPulse<span>.live</span></div>
      </div>
      <div class="nav-links">
        <a href="#" class="nav-link active"
          ><i class="fas fa-newspaper"></i>资讯</a
        >
        <a href="#" class="nav-link"><i class="fas fa-table"></i>行情</a>
        <a href="#" class="nav-link"><i class="fas fa-star"></i>自选</a>
        <a href="#" class="nav-link"><i class="fas fa-robot"></i>研报</a>
        <a href="#" class="nav-link"><i class="fas fa-chart-pie"></i>板块</a>
      </div>
      <div class="search-user">
        <div class="search-box">
          <i class="fas fa-search"></i>
          <input type="text" placeholder="搜索代码或资讯..." />
        </div>
        <div class="user-badge">
          <i class="fas fa-user-circle"></i>
          <span>腾远</span>
          <i class="fas fa-chevron-down"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  width: 100%;
  position: sticky;
  top: 0;
  .navbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1.2rem 2rem;
    background: rgba(12, 20, 30, 0.95); /* 稍提高透明度，吸顶更融合 */
    border-bottom: 1px solid #2a3346;
    flex-wrap: wrap;
    gap: 1rem;
    z-index: 100;
    backdrop-filter: blur(8px); /* 毛玻璃效果，增加现代感 */
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3); /* 轻微阴影突出吸顶 */
    border-radius: 0; /* 吸顶时无圆角 */
    transition: all 0.1s;
  }

  .logo-area {
    display: flex;
    align-items: center;
    gap: 10px;
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
    gap: 8px;
    background: #1c2738;
    padding: 0.4rem 0.9rem 0.4rem 1.2rem;
    border-radius: 40px;
    border: 1px solid #344153;
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
  }
}
</style>
