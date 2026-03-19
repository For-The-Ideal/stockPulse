<template>
     <div class="sidebar">
            <!-- 热门资讯排行 -->
            <div class="sidebar-card">
                <div class="card-header">
                    <h3><i class="fas fa-fire"></i> 热门资讯排行</h3>
                    <a href="#" class="card-more">更多 <i class="fas fa-angle-right"></i></a>
                </div>
                <div class="hot-news-item">
                    <span class="hot-news-rank top1">1</span>
                    <div class="hot-news-content">
                        <div class="hot-news-title">宁德时代神行电池量产在即，已获多家车企定点</div>
                        <div class="hot-news-meta">
                            <span><i class="far fa-clock"></i> 35分钟前</span>
                            <span><i class="fas fa-eye"></i> 8.2w</span>
                        </div>
                    </div>
                </div>
                <div class="hot-news-item">
                    <span class="hot-news-rank top2">2</span>
                    <div class="hot-news-content">
                        <div class="hot-news-title">中芯国际：先进制程突破，Q2营收指引超预期</div>
                        <div class="hot-news-meta">
                            <span><i class="far fa-clock"></i> 1小时前</span>
                            <span><i class="fas fa-eye"></i> 4.1w</span>
                        </div>
                    </div>
                </div>
                <div class="hot-news-item">
                    <span class="hot-news-rank top3">3</span>
                    <div class="hot-news-content">
                        <div class="hot-news-title">券商并购提速：国联证券收购民生证券获通过</div>
                        <div class="hot-news-meta">
                            <span><i class="far fa-clock"></i> 2小时前</span>
                            <span><i class="fas fa-eye"></i> 3.6w</span>
                        </div>
                    </div>
                </div>
                <div class="hot-news-item">
                    <span class="hot-news-rank">4</span>
                    <div class="hot-news-content">
                        <div class="hot-news-title">比亚迪豹8上市48小时订单破万，机构看好</div>
                        <div class="hot-news-meta">
                            <span><i class="far fa-clock"></i> 3小时前</span>
                            <span><i class="fas fa-eye"></i> 2.9w</span>
                        </div>
                    </div>
                </div>
                <div class="hot-news-item">
                    <span class="hot-news-rank">5</span>
                    <div class="hot-news-content">
                        <div class="hot-news-title">百济神州欧洲新适应症获批，出海里程碑</div>
                        <div class="hot-news-meta">
                            <span><i class="far fa-clock"></i> 5小时前</span>
                            <span><i class="fas fa-eye"></i> 1.7w</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 热门股票 -->
            <div class="sidebar-card">
                <div class="card-header">
                    <h3><i class="fas fa-chart-line"></i> 热门股票</h3>
                    <a href="#" class="card-more">更多 <i class="fas fa-angle-right"></i></a>
                </div>
                <div class="hot-stock-item">
                    <div class="hot-stock-info">
                        <span class="hot-stock-name">宁德时代</span>
                        <span class="hot-stock-code">300750.SZ</span>
                    </div>
                    <span class="hot-stock-change positive">+3.67%</span>
                </div>
                <div class="hot-stock-item">
                    <div class="hot-stock-info">
                        <span class="hot-stock-name">中际旭创</span>
                        <span class="hot-stock-code">300308.SZ</span>
                    </div>
                    <span class="hot-stock-change positive">+6.82%</span>
                </div>
                <div class="hot-stock-item">
                    <div class="hot-stock-info">
                        <span class="hot-stock-name">贵州茅台</span>
                        <span class="hot-stock-code">600519.SH</span>
                    </div>
                    <span class="hot-stock-change positive">+1.12%</span>
                </div>
                <div class="hot-stock-item">
                    <div class="hot-stock-info">
                        <span class="hot-stock-name">药明康德</span>
                        <span class="hot-stock-code">603259.SH</span>
                    </div>
                    <span class="hot-stock-change negative">-4.10%</span>
                </div>
                <div class="hot-stock-item">
                    <div class="hot-stock-info">
                        <span class="hot-stock-name">比亚迪</span>
                        <span class="hot-stock-code">002594.SZ</span>
                    </div>
                    <span class="hot-stock-change positive">+0.84%</span>
                </div>
            </div>

            <!-- 热门概念 -->
            <div class="sidebar-card">
                <div class="card-header">
                    <h3><i class="fas fa-tags"></i> 热门概念</h3>
                </div>
                <div class="concept-tags">
                    <span class="concept-tag"><i class="fas fa-bolt"></i> 新能源车</span>
                    <span class="concept-tag"><i class="fas fa-microchip"></i> 半导体</span>
                    <span class="concept-tag"><i class="fas fa-robot"></i> 人工智能</span>
                    <span class="concept-tag"><i class="fas fa-flask"></i> 创新药</span>
                    <span class="concept-tag"><i class="fas fa-sun"></i> 光伏</span>
                    <span class="concept-tag"><i class="fas fa-database"></i> 算力</span>
                    <span class="concept-tag"><i class="fas fa-charging-station"></i> 快充</span>
                    <span class="concept-tag"><i class="fas fa-memory"></i> 存储芯片</span>
                </div>
            </div>
        </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

        /* 右侧侧边栏 */
        .sidebar {
            width: 100%;
        }

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
        

        /* 筛选栏 (多源) */
        .filter-bar {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
        }
        .filter-label {
            color: #9ab3d9;
            background: #1f2c3f;
            padding: 0.3rem 1rem;
            border-radius: 30px;
            font-size: 0.85rem;
        }
        .filter-options {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
        }
        .source-chip {
            background: #1f2c3f;
            color: #b5cef0;
            padding: 0.4rem 1.2rem;
            border-radius: 40px;
            font-size: 0.85rem;
            border: 1px solid #334257;
            cursor: pointer;
            transition: 0.1s;
        }
        .source-chip.active {
            background: #2f4567;
            color: white;
            border-color: #5f8ad4;
        }
        .source-chip i { margin-right: 6px; }

        /* 资讯列表 */
        .news-list {
            background: #131c28;
            border-radius: 1.8rem;
            border: 1px solid #273349;
            padding: 0.5rem 1.5rem;
            margin-bottom: 2rem;
        }
        .list-item {
            display: flex;
            align-items: flex-start;
            gap: 1.2rem;
            padding: 1.2rem 0;
            border-bottom: 1px solid #1f2d3e;
        }
        .list-item:last-child {
            border-bottom: none;
        }
        .item-tag {
            background: #1f3147;
            color: #8fb1f0;
            font-size: 0.7rem;
            font-weight: 600;
            padding: 0.25rem 1rem;
            border-radius: 30px;
            white-space: nowrap;
        }
        .item-content {
            flex: 1;
        }
        .item-title {
            font-weight: 600;
            color: #eef4ff;
            font-size: 1.05rem;
            margin-bottom: 0.4rem;
            line-height: 1.4;
        }
        .item-meta {
            display: flex;
            gap: 1.5rem;
            color: #687e9f;
            font-size: 0.8rem;
            align-items: center;
            flex-wrap: wrap;
        }
        .source-badges {
            display: flex;
            gap: 6px;
        }
        .source-badge {
            background: #1f324b;
            color: #b4d0ff;
            font-size: 0.6rem;
            padding: 0.2rem 0.7rem;
            border-radius: 30px;
            border: 1px solid #375175;
        }
        .double-source {
            background: #3f4d2e;
            color: #e9ffb2;
            border-color: #819b4d;
        }

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

        /* ===== 右侧边栏卡片样式 ===== */
        .sidebar-card {
            background: #131c28;
            border-radius: 1.8rem;
            border: 1px solid #273349;
            padding: 1.5rem;
            margin-bottom: 1.5rem;
        }

        .card-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.2rem;
        }

        .card-header h3 {
            color: #ddeeff;
            font-size: 1.1rem;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .card-header h3 i {
            color: #ffb347;
            font-size: 1rem;
        }

        .card-more {
            color: #6b9eff;
            font-size: 0.8rem;
            text-decoration: none;
        }

        .card-more:hover {
            text-decoration: underline;
        }

        /* 热门资讯列表 */
        .hot-news-item {
            display: flex;
            gap: 0.8rem;
            padding: 0.8rem 0;
            border-bottom: 1px solid #1f2d3e;
            cursor: pointer;
            transition: 0.2s;
        }

        .hot-news-item:last-child {
            border-bottom: none;
        }

        .hot-news-item:hover {
            background: rgba(60, 95, 145, 0.2);
            margin: 0 -0.5rem;
            padding: 0.8rem 0.5rem;
            border-radius: 12px;
        }

        .hot-news-rank {
            width: 24px;
            height: 24px;
            background: #1f2c3f;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #ffb347;
            font-weight: 600;
            font-size: 0.8rem;
            flex-shrink: 0;
        }

        .hot-news-rank.top1 {
            background: #ffb347;
            color: #0b0e14;
        }

        .hot-news-rank.top2 {
            background: #9aa9b9;
            color: #0b0e14;
        }

        .hot-news-rank.top3 {
            background: #b08b5c;
            color: #0b0e14;
        }

        .hot-news-content {
            flex: 1;
        }

        .hot-news-title {
            color: #eef4ff;
            font-size: 0.9rem;
            font-weight: 500;
            margin-bottom: 0.3rem;
            line-height: 1.4;
        }

        .hot-news-meta {
            color: #687e9f;
            font-size: 0.7rem;
            display: flex;
            gap: 1rem;
        }

        /* 热门股票 */
        .hot-stock-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.8rem 0;
            border-bottom: 1px solid #1f2d3e;
        }

        .hot-stock-item:last-child {
            border-bottom: none;
        }

        .hot-stock-info {
            display: flex;
            flex-direction: column;
        }

        .hot-stock-name {
            color: white;
            font-weight: 600;
            font-size: 0.9rem;
        }

        .hot-stock-code {
            color: #7690b5;
            font-size: 0.7rem;
        }

        .hot-stock-change {
            font-weight: 600;
            font-size: 0.9rem;
        }

        .hot-stock-change.positive {
            color: #16c784;
        }

        .hot-stock-change.negative {
            color: #ea5b5b;
        }

        /* 概念标签 */
        .concept-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
        }

        .concept-tag {
            background: #1f2c3f;
            border: 1px solid #33475f;
            border-radius: 30px;
            padding: 0.4rem 1rem;
            color: #b8d6ff;
            font-size: 0.8rem;
            cursor: pointer;
            transition: 0.2s;
        }

        .concept-tag:hover {
            background: #2f4567;
            color: white;
            border-color: #5f8ad4;
        }

        .concept-tag i {
            margin-right: 4px;
            color: #ffb347;
            font-size: 0.7rem;
        }

        .footer-note {
            padding: 1.5rem 2rem;
            border-top: 1px solid #25344a;
            color: #50668b;
            display: flex;
            justify-content: space-between;
        }
</style>