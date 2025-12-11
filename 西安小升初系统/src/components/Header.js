/**
 * 页面头部组件
 */

class Header {
    constructor() {
        this.element = null;
    }
    
    /**
     * 渲染头部组件
     * @param {HTMLElement} container - 容器元素
     */
    render(container) {
        const headerHTML = `
            <header class="app-header">
                <div class="header-content">
                    <div class="logo-section">
                        <img src="./assets/images/logo.png" alt="西安小升初系统" class="logo" />
                        <h1 class="app-title">西安小升初智能评估系统</h1>
                    </div>
                    <div class="user-section">
                        <div class="user-info">
                            <span class="user-name" id="userName">家长用户</span>
                            <div class="user-menu">
                                <button class="menu-btn" id="userMenuBtn">
                                    <i class="icon-user"></i>
                                </button>
                                <div class="menu-dropdown">
                                    <a href="#" class="menu-item" id="profileBtn">个人中心</a>
                                    <a href="#" class="menu-item" id="historyBtn">历史记录</a>
                                    <div class="menu-divider"></div>
                                    <a href="#" class="menu-item" id="logoutBtn">退出登录</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" id="progressFill"></div>
                </div>
            </header>
        `;
        
        container.innerHTML = headerHTML;
        this.element = container.firstElementChild;
        this.bindEvents();
        
        return this.element;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        const userMenuBtn = this.element.querySelector('#userMenuBtn');
        const menuDropdown = this.element.querySelector('.menu-dropdown');
        
        if (userMenuBtn) {
            userMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                menuDropdown.classList.toggle('show');
            });
        }
        
        // 点击其他地方关闭菜单
        document.addEventListener('click', () => {
            menuDropdown.classList.remove('show');
        });
    }
    
    /**
     * 更新用户信息
     * @param {string} userName - 用户名
     */
    updateUserInfo(userName) {
        const userNameElement = this.element.querySelector('#userName');
        if (userNameElement && userName) {
            userNameElement.textContent = userName;
        }
    }
    
    /**
     * 更新进度条
     * @param {number} progress - 进度百分比(0-100)
     */
    updateProgress(progress) {
        const progressFill = this.element.querySelector('#progressFill');
        if (progressFill) {
            const clampedProgress = Math.max(0, Math.min(100, progress));
            progressFill.style.width = `${clampedProgress}%`;
        }
    }
    
    /**
     * 设置菜单点击事件回调
     */
    setMenuCallbacks(callbacks) {
        const profileBtn = this.element.querySelector('#profileBtn');
        const historyBtn = this.element.querySelector('#historyBtn');
        const logoutBtn = this.element.querySelector('#logoutBtn');
        
        if (profileBtn && callbacks.onProfile) {
            profileBtn.addEventListener('click', (e) => {
                e.preventDefault();
                callbacks.onProfile();
            });
        }
        
        if (historyBtn && callbacks.onHistory) {
            historyBtn.addEventListener('click', (e) => {
                e.preventDefault();
                callbacks.onHistory();
            });
        }
        
        if (logoutBtn && callbacks.onLogout) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                callbacks.onLogout();
            });
        }
    }
}

export default Header;