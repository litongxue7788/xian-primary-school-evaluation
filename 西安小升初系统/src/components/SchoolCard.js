/**
 * 学校卡片组件
 */

class SchoolCard {
    constructor(schoolData) {
        this.schoolData = schoolData;
        this.element = null;
    }
    
    /**
     * 渲染学校卡片
     * @param {HTMLElement} container - 容器元素
     * @param {Object} options - 渲染选项
     */
    render(container, options = {}) {
        const { 
            showActions = true,
            compact = false,
            showRanking = true
        } = options;
        
        const school = this.schoolData;
        
        const cardHTML = `
            <div class="school-card ${compact ? 'compact' : ''}" data-school-id="${school.id}">
                <div class="school-header">
                    ${showRanking && school.ranking ? `<span class="school-ranking">#${school.ranking}</span>` : ''}
                    <h3 class="school-name">${school.name}</h3>
                    <span class="school-type ${school.type === 'public' ? 'public' : 'private'}">
                        ${school.type === 'public' ? '公办' : '民办'}
                    </span>
                </div>
                
                <div class="school-content">
                    ${!compact ? `
                    <div class="school-info">
                        <div class="info-item">
                            <i class="icon-location"></i>
                            <span>${school.district} · ${school.address || '未填写'}</span>
                        </div>
                        <div class="info-item">
                            <i class="icon-star"></i>
                            <span>学校等级：${school.level || '未评级'}</span>
                        </div>
                        <div class="info-item">
                            <i class="icon-group"></i>
                            <span>对口小学：${this.formatPrimarySchools(school.primarySchools)}</span>
                        </div>
                    </div>
                    ` : ''}
                    
                    <div class="school-stats">
                        <div class="stat-item">
                            <div class="stat-value">${school.rating || 0}</div>
                            <div class="stat-label">综合评分</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${school.students || 0}</div>
                            <div class="stat-label">在校人数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">${school.teachers || 0}</div>
                            <div class="stat-label">教师数量</div>
                        </div>
                    </div>
                    
                    ${!compact ? `
                    <div class="school-tags">
                        ${school.tags ? school.tags.map(tag => 
                            `<span class="tag">${tag}</span>`
                        ).join('') : ''}
                    </div>
                    ` : ''}
                </div>
                
                ${showActions ? `
                <div class="school-actions">
                    <button class="btn btn-outline" data-action="details">查看详情</button>
                    <button class="btn btn-primary" data-action="compare">加入对比</button>
                    ${school.website ? `
                    <a href="${school.website}" target="_blank" class="btn btn-link">
                        官方网站
                    </a>
                    ` : ''}
                </div>
                ` : ''}
                
                <div class="match-score" style="--score: ${school.matchScore || 0}">
                    <div class="score-circle">
                        <span class="score-value">${school.matchScore || 0}</span>
                        <span class="score-label">匹配度</span>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = cardHTML;
        this.element = container.firstElementChild;
        this.bindEvents();
        
        return this.element;
    }
    
    /**
     * 格式化对口小学显示
     */
    formatPrimarySchools(schools) {
        if (!schools || schools.length === 0) {
            return '未指定';
        }
        
        if (schools.length <= 2) {
            return schools.join('、');
        }
        
        return `${schools[0]}、${schools[1]}等${schools.length}所`;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const detailsBtn = this.element.querySelector('[data-action="details"]');
        const compareBtn = this.element.querySelector('[data-action="compare"]');
        
        if (detailsBtn) {
            detailsBtn.addEventListener('click', () => {
                this.onDetailsClick?.(this.schoolData);
            });
        }
        
        if (compareBtn) {
            compareBtn.addEventListener('click', () => {
                this.onCompareClick?.(this.schoolData);
            });
        }
    }
    
    /**
     * 设置点击事件回调
     */
    setCallbacks(callbacks) {
        if (callbacks.onDetailsClick) {
            this.onDetailsClick = callbacks.onDetailsClick;
        }
        if (callbacks.onCompareClick) {
            this.onCompareClick = callbacks.onCompareClick;
        }
    }
    
    /**
     * 更新学校匹配分数
     */
    updateMatchScore(score) {
        this.schoolData.matchScore = score;
        
        const scoreCircle = this.element.querySelector('.score-circle');
        const scoreValue = this.element.querySelector('.score-value');
        
        if (scoreCircle) {
            scoreCircle.style.setProperty('--score', score);
        }
        if (scoreValue) {
            scoreValue.textContent = score;
        }
    }
    
    /**
     * 高亮显示
     */
    highlight() {
        this.element.classList.add('highlighted');
    }
    
    /**
     * 取消高亮
     */
    unhighlight() {
        this.element.classList.remove('highlighted');
    }
}

export default SchoolCard;