// src/app.js - 主应用入口
class XiaoShengChuApp {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 7;
        this.userData = {};
        this.config = {
            aiProvider: 'bailian',
            apiKey: '',
            appId: '',
            isConnected: false
        };
        
        this.init();
    }
    
    init() {
        // 恢复用户数据
        this.restoreUserData();
        
        // 恢复配置
        this.restoreConfig();
        
        // 初始化组件
        this.initStepIndicator();
        this.initStepContent();
        this.initNavigation();
        this.initChat();
        
        // 更新UI
        this.updateUI();
    }
    
    restoreUserData() {
        const savedData = localStorage.getItem('xsc_user_data');
        if (savedData) {
            this.userData = JSON.parse(savedData);
        }
    }
    
    restoreConfig() {
        const savedConfig = localStorage.getItem('xsc_config');
        if (savedConfig) {
            this.config = JSON.parse(savedConfig);
            this.updateStatusIndicator();
        }
    }
    
    saveUserData() {
        localStorage.setItem('xsc_user_data', JSON.stringify(this.userData));
    }
    
    saveConfig() {
        localStorage.setItem('xsc_config', JSON.stringify(this.config));
    }
    
    initStepIndicator() {
        const stepNav = document.getElementById('stepNav');
        if (!stepNav) return;
        
        stepNav.innerHTML = '';
        
        const steps = [
            { number: 1, label: '基础信息' },
            { number: 2, label: '能力评估' },
            { number: 3, label: '户籍居住' },
            { number: 4, label: '学区房产' },
            { number: 5, label: '民办意向' },
            { number: 6, label: '能力分析' },
            { number: 7, label: 'AI推荐' }
        ];
        
        steps.forEach(step => {
            const stepItem = document.createElement('div');
            stepItem.className = `step-item ${step.number === this.currentStep ? 'active' : ''}`;
            stepItem.innerHTML = `
                <div class="step-number">${step.number}</div>
                <div class="step-label">${step.label}</div>
            `;
            stepItem.addEventListener('click', () => this.goToStep(step.number));
            stepNav.appendChild(stepItem);
        });
    }
    
    initStepContent() {
        const container = document.getElementById('stepContainer');
        if (!container) return;
        
        // 根据当前步骤加载内容
        this.loadStepContent();
    }
    
    loadStepContent() {
        const container = document.getElementById('stepContainer');
        container.innerHTML = '';
        
        // 创建步骤容器
        const stepDiv = document.createElement('div');
        stepDiv.className = 'step-content fade-in';
        stepDiv.id = `step${this.currentStep}-content`;
        
        // 根据步骤加载不同内容
        switch(this.currentStep) {
            case 1:
                this.renderStep1(stepDiv);
                break;
            case 2:
                this.renderStep2(stepDiv);
                break;
            case 3:
                this.renderStep3(stepDiv);
                break;
            case 4:
                this.renderStep4(stepDiv);
                break;
            case 5:
                this.renderStep5(stepDiv);
                break;
            case 6:
                this.renderStep6(stepDiv);
                break;
            case 7:
                this.renderStep7(stepDiv);
                break;
        }
        
        container.appendChild(stepDiv);
    }
    
    initNavigation() {
        const navButtons = document.getElementById('navButtons');
        if (!navButtons) return;
        
        navButtons.innerHTML = '';
        
        // 如果不是第一步，显示上一步按钮
        if (this.currentStep > 1) {
            const prevBtn = document.createElement('button');
            prevBtn.className = 'btn btn-secondary';
            prevBtn.innerHTML = '<i class="fas fa-arrow-left"></i> 上一步';
            prevBtn.addEventListener('click', () => this.previousStep());
            navButtons.appendChild(prevBtn);
        }
        
        // 如果不是最后一步，显示下一步按钮
        if (this.currentStep < this.totalSteps) {
            const nextBtn = document.createElement('button');
            nextBtn.className = 'btn btn-primary';
            nextBtn.innerHTML = `下一步 <i class="fas fa-arrow-right"></i>`;
            nextBtn.addEventListener('click', () => this.nextStep());
            navButtons.appendChild(nextBtn);
        } else {
            // 最后一步显示报告生成按钮
            const generateBtn = document.createElement('button');
            generateBtn.className = 'btn btn-primary';
            generateBtn.innerHTML = '<i class="fas fa-file-alt"></i> 生成完整报告';
            generateBtn.addEventListener('click', () => this.generateReport());
            navButtons.appendChild(generateBtn);
            
            const exportBtn = document.createElement('button');
            exportBtn.className = 'btn btn-secondary';
            exportBtn.innerHTML = '<i class="fas fa-file-pdf"></i> 导出PDF';
            exportBtn.addEventListener('click', () => this.exportPDF());
            navButtons.appendChild(exportBtn);
        }
    }
    
    initChat() {
        // 聊天功能初始化
        const chatBtn = document.querySelector('.assistant-btn');
        const chatWindow = document.getElementById('chatWindow');
        
        if (chatBtn && chatWindow) {
            chatBtn.addEventListener('click', () => {
                chatWindow.classList.toggle('active');
            });
        }
    }
    
    updateUI() {
        // 更新进度条
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            const progress = ((this.currentStep - 1) / (this.totalSteps - 1)) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        // 更新步骤指示器
        this.initStepIndicator();
        
        // 更新导航按钮
        this.initNavigation();
        
        // 保存用户数据
        this.saveUserData();
    }
    
    goToStep(stepNumber) {
        if (stepNumber >= 1 && stepNumber <= this.totalSteps) {
            this.currentStep = stepNumber;
            this.loadStepContent();
            this.updateUI();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    nextStep() {
        // 验证当前步骤
        if (!this.validateCurrentStep()) {
            return;
        }
        
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.loadStepContent();
            this.updateUI();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    previousStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.loadStepContent();
            this.updateUI();
            
            // 滚动到顶部
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    validateCurrentStep() {
        // 这里实现各步骤的验证逻辑
        switch(this.currentStep) {
            case 3:
                return this.validateStep3();
            // 其他步骤的验证
            default:
                return true;
        }
    }
    
    validateStep3() {
        // 验证步骤3的逻辑
        const householdDistrict = document.getElementById('householdDistrict');
        const residenceDistrict = document.getElementById('residenceDistrict');
        
        if (!householdDistrict || !householdDistrict.value) {
            alert('请选择户籍所在区');
            return false;
        }
        
        if (!residenceDistrict || !residenceDistrict.value) {
            alert('请选择实际居住区');
            return false;
        }
        
        return true;
    }
    
    collectFormData() {
        // 收集所有步骤的数据
        const data = {};
        
        // 这里收集所有表单数据
        // 具体实现需要根据每个步骤的HTML结构来写
        
        return data;
    }
    
    generateReport() {
        console.log('生成报告中...');
        alert('报告生成功能正在开发中...');
        // 这里调用PDF服务生成报告
    }
    
    exportPDF() {
        console.log('导出PDF...');
        // 这里调用PDF导出服务
    }
    
    updateStatusIndicator() {
        const statusText = document.getElementById('statusText');
        const statusIndicator = document.getElementById('statusIndicator');
        
        if (this.config.isConnected) {
            statusText.textContent = `${this.config.aiProvider} 已连接`;
            statusIndicator.className = 'status-indicator connected';
        } else {
            statusText.textContent = '本地模式';
            statusIndicator.className = 'status-indicator local';
        }
    }
    
    // 以下是各个步骤的渲染函数
    renderStep1(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">👦</div>
                    <div class="card-title">学生基本信息</div>
                </div>
                <div class="card-description">
                    请填写学生的基本资料，这将帮助我们为您提供更精准的评估
                </div>
                
                <div class="form-group">
                    <label class="form-label">学生姓名（可选）</label>
                    <input type="text" class="form-control" id="studentName" 
                           placeholder="请输入学生姓名" value="${this.userData.studentName || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">学生性别</label>
                    <select class="form-select" id="studentGender">
                        <option value="">请选择</option>
                        <option value="男" ${this.userData.studentGender === '男' ? 'selected' : ''}>男生</option>
                        <option value="女" ${this.userData.studentGender === '女' ? 'selected' : ''}>女生</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">所在小学（可选）</label>
                    <input type="text" class="form-control" id="currentSchool" 
                           placeholder="请输入所在小学名称" value="${this.userData.currentSchool || ''}">
                </div>
                
                <div class="form-group">
                    <label class="form-label">当前年级</label>
                    <div class="score-options">
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade6" value="六年级" 
                                   ${this.userData.currentGrade === '六年级' ? 'checked' : 'checked'}>
                            <label for="grade6" class="score-label">
                                <span class="score-number">六年级</span>
                                <span class="score-desc">2026年小升初</span>
                            </label>
                        </div>
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade5" value="五年级"
                                   ${this.userData.currentGrade === '五年级' ? 'checked' : ''}>
                            <label for="grade5" class="score-label">
                                <span class="score-number">五年级</span>
                                <span class="score-desc">2027年小升初</span>
                            </label>
                        </div>
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade4" value="四年级"
                                   ${this.userData.currentGrade === '四年级' ? 'checked' : ''}>
                            <label for="grade4" class="score-label">
                                <span class="score-number">四年级</span>
                                <span class="score-desc">2028年小升初</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStep2(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">📚</div>
                    <div class="card-title">能力评估</div>
                </div>
                <div class="card-description">
                    请评估孩子在以下6个维度的表现（1-5分，5分为最佳）
                </div>
                
                ${this.renderAbilityDimension('学业成绩', '评估孩子在班级/年级的学业成绩排名情况', 'score1')}
                ${this.renderAbilityDimension('综合素养', '特长、获奖情况和综合发展水平', 'score2')}
                ${this.renderAbilityDimension('学习习惯', '自律性和学习主动性', 'score3')}
                ${this.renderAbilityDimension('心理素质', '抗压能力和心理承受能力', 'score4')}
                ${this.renderAbilityDimension('家庭支持', '家庭在时间、经济、精力方面的支持', 'score5')}
                ${this.renderAbilityDimension('学科倾向', '孩子的学科优势和兴趣方向', 'score6')}
            </div>
        `;
    }
    
    renderAbilityDimension(title, description, scoreName) {
        const savedScore = this.userData[scoreName] || '3';
        
        return `
            <div class="form-group">
                <label class="form-label">${title}</label>
                <div class="card-description" style="margin-bottom: 15px;">${description}</div>
                <div class="score-options">
                    ${[1, 2, 3, 4, 5].map(score => `
                        <div class="score-option">
                            <input type="radio" name="${scoreName}" id="${scoreName}-${score}" 
                                   value="${score}" ${savedScore === score.toString() ? 'checked' : ''}>
                            <label for="${scoreName}-${score}" class="score-label">
                                <span class="score-number">${score}</span>
                                <span class="score-desc">${this.getScoreDescription(title, score)}</span>
                            </label>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    getScoreDescription(dimension, score) {
        const descriptions = {
            '学业成绩': {
                1: '年级50%后',
                2: '年级前50%',
                3: '年级前30%',
                4: '年级前15%',
                5: '年级前5%'
            },
            '综合素养': {
                1: '较少参与',
                2: '参与活动',
                3: '校级获奖',
                4: '市级证书',
                5: '省级获奖'
            }
        };
        
        return descriptions[dimension]?.[score] || '请评估';
    }
    
    renderStep3(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🏠</div>
                    <div class="card-title">户籍与居住信息</div>
                </div>
                <div class="card-description">
                    请准确填写户籍和实际居住信息，这将直接影响公办学校匹配和入学顺位评估
                </div>
                
                <div class="grid-2-columns">
                    <div>
                        <h4>📍 户籍信息</h4>
                        <div class="form-group">
                            <label class="form-label">户籍所在区 *</label>
                            <select class="form-select" id="householdDistrict">
                                <option value="">请选择区</option>
                                <option value="新城区">新城区</option>
                                <option value="碑林区">碑林区</option>
                                <option value="莲湖区">莲湖区</option>
                                <option value="雁塔区">雁塔区</option>
                                <option value="灞桥区">灞桥区</option>
                                <option value="未央区">未央区</option>
                                <option value="长安区">长安区</option>
                                <option value="西咸新区">西咸新区</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">户籍所在街道</label>
                            <select class="form-select" id="householdStreet">
                                <option value="">请先选择区</option>
                            </select>
                        </div>
                    </div>
                    
                    <div>
                        <h4>🏡 实际居住信息</h4>
                        <div class="form-group">
                            <label class="form-label">实际居住区 *</label>
                            <select class="form-select" id="residenceDistrict">
                                <option value="">请选择区</option>
                                <option value="新城区">新城区</option>
                                <option value="碑林区">碑林区</option>
                                <option value="莲湖区">莲湖区</option>
                                <option value="雁塔区">雁塔区</option>
                                <option value="灞桥区">灞桥区</option>
                                <option value="未央区">未央区</option>
                                <option value="长安区">长安区</option>
                                <option value="西咸新区">西咸新区</option>
                            </select>
                        </div>
                        
                        <div class="form-group">
                            <label class="form-label">实际居住街道</label>
                            <select class="form-select" id="residenceStreet">
                                <option value="">请先选择区</option>
                            </select>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="form-label">居住性质</label>
                    <select class="form-select" id="residenceType">
                        <option value="">请选择</option>
                        <option value="自有房产">自有房产</option>
                        <option value="租房">租房</option>
                        <option value="单位宿舍">单位宿舍</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" id="sameDistrict"> 户籍区与居住区相同
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" id="sameStreet"> 户籍街道与居住街道相同
                        </label>
                    </div>
                </div>
            </div>
        `;
        
        // 初始化街道数据
        this.initStreetSelectors();
    }
    
    initStreetSelectors() {
        // 这里初始化街道选择器
        // 实际实现需要加载街道数据
    }
    
    renderStep4(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🏡</div>
                    <div class="card-title">学区房产信息</div>
                </div>
                <div class="card-description">
                    请填写学区房产相关信息，这直接影响公办学校入学资格
                </div>
                
                <div class="form-group">
                    <label class="form-label">学区房情况</label>
                    <select class="form-select" id="hasHouse">
                        <option value="">请选择</option>
                        <option value="yes-good">有，对口优质公办</option>
                        <option value="yes-normal">有，对口一般公办</option>
                        <option value="no">暂无学区房</option>
                        <option value="rent">租房居住</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">房产证类型</label>
                    <select class="form-select" id="propertyType">
                        <option value="">请选择</option>
                        <option value="商品房">商品房</option>
                        <option value="房改房">房改房</option>
                        <option value="安置房">安置房</option>
                        <option value="经济适用房">经济适用房</option>
                        <option value="其他">其他</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">房产持有时间</label>
                    <select class="form-select" id="propertyYears">
                        <option value="">请选择</option>
                        <option value="3年以上">3年以上</option>
                        <option value="1-3年">1-3年</option>
                        <option value="1年以内">1年以内</option>
                        <option value="新购">新购（未满1年）</option>
                    </select>
                </div>
                
                <div class="info-box bg-blue-50 border-blue-200 p-20 mt-20">
                    <h4>📝 西安市公办入学顺位说明</h4>
                    <p><strong>第一顺位：</strong>房户一致，且在学区内居住</p>
                    <p><strong>第二顺位：</strong>房户一致，但跨学区居住</p>
                    <p><strong>第三顺位：</strong>集体户/挂靠户，无学区房</p>
                    <p><strong>第四顺位：</strong>租房居住，统筹安排入学</p>
                </div>
            </div>
        `;
    }
    
    renderStep5(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">💰</div>
                    <div class="card-title">民办意向与预算</div>
                </div>
                <div class="card-description">
                    请填写关于民办学校的意向和预算信息
                </div>
                
                <div class="form-group">
                    <label class="form-label">是否考虑民办学校</label>
                    <select class="form-select" id="considerPrivate">
                        <option value="">请选择</option>
                        <option value="yes">是，愿意参加摇号</option>
                        <option value="cautious">观望中，看情况决定</option>
                        <option value="no">否，只考虑公办</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">可接受的跨区范围</label>
                    <select class="form-select" id="crossDistrictPreference">
                        <option value="">请选择</option>
                        <option value="本区">仅限本区学校</option>
                        <option value="相邻区">本区及相邻区</option>
                        <option value="全市范围">全市范围均可</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">民办学校预算（初中三年）</label>
                    <select class="form-select" id="budget">
                        <option value="">请选择</option>
                        <option value="low">3万以内（公办为主）</option>
                        <option value="medium">3-10万（可考虑民办）</option>
                        <option value="high">10万以上（民办无压力）</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label class="form-label">孩子特长（可多选）</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" value="数学" class="strength-check"> 数学
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="语文" class="strength-check"> 语文
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="英语" class="strength-check"> 英语
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="艺术" class="strength-check"> 艺术
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" value="体育" class="strength-check"> 体育
                        </label>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderStep6(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">📊</div>
                    <div class="card-title">能力分析</div>
                </div>
                <div class="card-description">
                    基于您的填写信息生成的能力分析报告
                </div>
                
                <div class="text-center">
                    <div class="chart-container" style="width: 100%; max-width: 600px; margin: 0 auto;">
                        <canvas id="abilityChart"></canvas>
                    </div>
                    
                    <div id="abilityAnalysis" class="mt-20">
                        <div class="info-box bg-blue-50 border-blue-200 p-20">
                            <h4>🎯 AI深度能力分析</h4>
                            <p>请点击"下一步：AI推荐"来生成详细的能力分析报告</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // 初始化图表
        this.initAbilityChart();
    }
    
    initAbilityChart() {
        // 这里初始化能力图表
        // 实际实现需要收集评分数据并绘制图表
    }
    
    renderStep7(container) {
        container.innerHTML = `
            <div class="card">
                <div class="card-header">
                    <div class="card-icon">🤖</div>
                    <div class="card-title">AI智能推荐</div>
                </div>
                <div class="card-description">
                    基于您的所有信息，AI正在为您生成个性化推荐...
                </div>
                
                <div id="recommendationContent" class="text-center">
                    <div class="loading-spinner">
                        <div class="spinner"></div>
                        <p>AI正在分析您的信息...</p>
                    </div>
                </div>
            </div>
            
            <div class="card mt-20">
                <div class="card-header">
                    <div class="card-icon">📅</div>
                    <div class="card-title">个性化时间规划</div>
                </div>
                <div id="timelineContent">
                    <!-- 时间规划内容 -->
                </div>
            </div>
        `;
        
        // 生成AI推荐
        this.generateAIRecommendation();
    }
    
    generateAIRecommendation() {
        // 这里调用AI服务生成推荐
        // 如果是本地模式，显示提示信息
        if (!this.config.isConnected) {
            document.getElementById('recommendationContent').innerHTML = `
                <div class="info-box">
                    <h4>AI推荐功能需要配置API</h4>
                    <p>请点击右上角配置按钮，设置AI API密钥以启用智能推荐功能</p>
                    <button class="btn btn-primary mt-20" onclick="toggleConfigPanel()">
                        前往配置
                    </button>
                </div>
            `;
        } else {
            // 调用AI服务
            this.callAIForRecommendation();
        }
    }
    
    callAIForRecommendation() {
        // 调用AI服务
        console.log('调用AI生成推荐...');
    }
}

// 全局应用实例
let app;

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    app = new XiaoShengChuApp();
});

// 全局函数
function toggleConfigPanel() {
    const panel = document.getElementById('configPanel');
    panel.classList.toggle('active');
}

function useLocalMode() {
    app.config.isConnected = false;
    app.updateStatusIndicator();
    app.saveConfig();
    toggleConfigPanel();
    alert('已切换到本地模式');
}

function saveConfig() {
    const providerSelect = document.getElementById('providerSelect');
    const apiKeyInput = document.getElementById('apiKeyInput');
    const appIdInput = document.getElementById('appIdInput');
    
    app.config.aiProvider = providerSelect.value;
    app.config.apiKey = apiKeyInput.value;
    app.config.appId = appIdInput.value;
    app.config.isConnected = true;
    
    app.updateStatusIndicator();
    app.saveConfig();
    
    toggleConfigPanel();
    alert('配置保存成功！');
}

// 导出全局变量
window.app = app;
window.toggleConfigPanel = toggleConfigPanel;
window.useLocalMode = useLocalMode;
window.saveConfig = saveConfig;