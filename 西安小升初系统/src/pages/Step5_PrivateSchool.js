// pages/Step5_PrivateSchool.js
class Step5_PrivateSchool {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = this.loadData();
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.bindEvents();
    }
    
    loadData() {
        const savedData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        return {
            considerPrivate: savedData.considerPrivate || '',
            crossDistrictPreference: savedData.crossDistrictPreference || '',
            budget: savedData.budget || '',
            acceptLottery: savedData.acceptLottery || '',
            specialties: savedData.specialties ? JSON.parse(savedData.specialties) : [],
            educationConcepts: savedData.educationConcepts ? JSON.parse(savedData.educationConcepts) : []
        };
    }
    
    saveData() {
        localStorage.setItem('xsc_user_data', JSON.stringify({
            ...JSON.parse(localStorage.getItem('xsc_user_data') || '{}'),
            ...this.data
        }));
    }
    
    render() {
        const specialties = [
            { value: '数学', label: '数学', icon: '🧮' },
            { value: '语文', label: '语文', icon: '📚' },
            { value: '英语', label: '英语', icon: '🔤' },
            { value: '艺术', label: '艺术', icon: '🎨' },
            { value: '体育', label: '体育', icon: '⚽' },
            { value: '科技', label: '科技', icon: '🤖' },
            { value: '音乐', label: '音乐', icon: '🎵' },
            { value: '舞蹈', label: '舞蹈', icon: '💃' },
            { value: '编程', label: '编程', icon: '💻' },
            { value: '演讲', label: '演讲', icon: '🎤' }
        ];
        
        const educationConcepts = [
            { value: '学术导向', label: '学术导向', desc: '注重学业成绩和升学率' },
            { value: '素质教育', label: '素质教育', desc: '注重综合能力培养' },
            { value: '快乐教育', label: '快乐教育', desc: '注重孩子快乐成长' },
            { value: '国际视野', label: '国际视野', desc: '注重国际化教育' },
            { value: '传统教育', label: '传统教育', desc: '注重传统文化和纪律' },
            { value: '创新教育', label: '创新教育', desc: '注重创新思维培养' }
        ];
        
        // 构建特长选择HTML
        const specialtiesHtml = specialties.map(specialty => `
            <label class="specialty-option">
                <input type="checkbox" value="${specialty.value}" 
                       ${this.data.specialties.includes(specialty.value) ? 'checked' : ''}>
                <div class="specialty-card">
                    <div class="specialty-icon">${specialty.icon}</div>
                    <div class="specialty-name">${specialty.label}</div>
                </div>
            </label>
        `).join('');
        
        // 构建教育理念选择HTML
        const conceptsHtml = educationConcepts.map(concept => `
            <label class="concept-option">
                <input type="checkbox" value="${concept.value}" 
                       ${this.data.educationConcepts.includes(concept.value) ? 'checked' : ''}>
                <div class="concept-card">
                    <div class="concept-name">${concept.label}</div>
                    <div class="concept-desc">${concept.desc}</div>
                </div>
            </label>
        `).join('');
        
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">💰</div>
                        <div class="card-title">民办意向与预算</div>
                    </div>
                    <div class="card-description">
                        请填写关于民办学校的意向和预算信息，这有助于我们为您推荐合适的学校
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">是否考虑民办学校</label>
                        <select class="form-select" id="considerPrivate">
                            <option value="">请选择</option>
                            <option value="yes" ${this.data.considerPrivate === 'yes' ? 'selected' : ''}>是，愿意参加摇号</option>
                            <option value="cautious" ${this.data.considerPrivate === 'cautious' ? 'selected' : ''}>观望中，看情况决定</option>
                            <option value="no" ${this.data.considerPrivate === 'no' ? 'selected' : ''}>否，只考虑公办</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">可接受的跨区范围</label>
                        <select class="form-select" id="crossDistrictPreference">
                            <option value="">请选择</option>
                            <option value="本区" ${this.data.crossDistrictPreference === '本区' ? 'selected' : ''}>仅限本区学校</option>
                            <option value="相邻区" ${this.data.crossDistrictPreference === '相邻区' ? 'selected' : ''}>本区及相邻区</option>
                            <option value="全市范围" ${this.data.crossDistrictPreference === '全市范围' ? 'selected' : ''}>全市范围均可</option>
                        </select>
                        <div class="form-text">民办学校可全市招生，但部分学校有区域限制</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">民办学校预算（初中三年）</label>
                        <select class="form-select" id="budget">
                            <option value="">请选择</option>
                            <option value="low" ${this.data.budget === 'low' ? 'selected' : ''}>3万以内（公办为主）</option>
                            <option value="medium" ${this.data.budget === 'medium' ? 'selected' : ''}>3-10万（可考虑民办）</option>
                            <option value="high" ${this.data.budget === 'high' ? 'selected' : ''}>10万以上（民办无压力）</option>
                        </select>
                        <div class="form-text">包括学费、住宿费、伙食费等所有费用</div>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">对摇号不确定性的态度</label>
                        <select class="form-select" id="acceptLottery">
                            <option value="">请选择</option>
                            <option value="yes" ${this.data.acceptLottery === 'yes' ? 'selected' : ''}>接受，愿意冲刺热门校</option>
                            <option value="cautious" ${this.data.acceptLottery === 'cautious' ? 'selected' : ''}>谨慎，希望稳妥为主</option>
                            <option value="no" ${this.data.acceptLottery === 'no' ? 'selected' : ''}>不接受，必须确定性</option>
                        </select>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">🌟</div>
                        <div class="card-title">学生特长与兴趣</div>
                    </div>
                    <div class="card-description">
                        请选择孩子的特长和兴趣（可多选），这将影响学校特色课程的匹配
                    </div>
                    
                    <div class="specialties-grid">
                        ${specialtiesHtml}
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">💡</div>
                        <div class="card-title">教育理念偏好</div>
                    </div>
                    <div class="card-description">
                        请选择您更认同的教育理念（可多选），用于匹配学校教学风格
                    </div>
                    
                    <div class="concepts-grid">
                        ${conceptsHtml}
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">📊</div>
                        <div class="card-title">意向分析</div>
                    </div>
                    <div class="card-body">
                        <div id="intentionAnalysis" style="min-height: 120px;">
                            <div class="analysis-loading">
                                <div class="spinner"></div>
                                <p>分析您的意向偏好...</p>
                            </div>
                        </div>
                        <button class="btn btn-outline w-full mt-10" onclick="this.generateAnalysis()">
                            <i class="fas fa-chart-bar"></i> 生成意向分析报告
                        </button>
                    </div>
                </div>
                
                <div class="info-box bg-purple-50 border-purple-200 p-20 mt-20">
                    <h4><i class="fas fa-info-circle"></i> 民办学校政策要点</h4>
                    <ul style="margin: 10px 0 0 20px; color: #6d28d9;">
                        <li><strong>公民同招：</strong>民办与公办同步报名、同步招生</li>
                        <li><strong>摇号录取：</strong>报名人数超过招生计划的实行电脑随机录取</li>
                        <li><strong>全市招生：</strong>民办学校可面向全市范围招生</li>
                        <li><strong>收费标准：</strong>学费需经物价部门审批并公示</li>
                        <li><strong>2025年数据：</strong>全市28所民办初中，计划招生12361人</li>
                    </ul>
                </div>
            </div>
        `;
        
        // 初始分析
        setTimeout(() => this.generateAnalysis(), 500);
    }
    
    bindEvents() {
        // 是否考虑民办
        const considerPrivate = document.getElementById('considerPrivate');
        if (considerPrivate) {
            considerPrivate.addEventListener('change', (e) => {
                this.data.considerPrivate = e.target.value;
                this.saveData();
                this.updateFormVisibility();
            });
        }
        
        // 跨区范围
        const crossDistrictPreference = document.getElementById('crossDistrictPreference');
        if (crossDistrictPreference) {
            crossDistrictPreference.addEventListener('change', (e) => {
                this.data.crossDistrictPreference = e.target.value;
                this.saveData();
            });
        }
        
        // 预算
        const budget = document.getElementById('budget');
        if (budget) {
            budget.addEventListener('change', (e) => {
                this.data.budget = e.target.value;
                this.saveData();
            });
        }
        
        // 摇号态度
        const acceptLottery = document.getElementById('acceptLottery');
        if (acceptLottery) {
            acceptLottery.addEventListener('change', (e) => {
                this.data.acceptLottery = e.target.value;
                this.saveData();
            });
        }
        
        // 特长选择
        const specialtyCheckboxes = this.container.querySelectorAll('.specialty-option input[type="checkbox"]');
        specialtyCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.value;
                if (e.target.checked) {
                    if (!this.data.specialties.includes(value)) {
                        this.data.specialties.push(value);
                    }
                } else {
                    this.data.specialties = this.data.specialties.filter(item => item !== value);
                }
                this.saveData();
            });
        });
        
        // 教育理念选择
        const conceptCheckboxes = this.container.querySelectorAll('.concept-option input[type="checkbox"]');
        conceptCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const value = e.target.value;
                if (e.target.checked) {
                    if (!this.data.educationConcepts.includes(value)) {
                        this.data.educationConcepts.push(value);
                    }
                } else {
                    this.data.educationConcepts = this.data.educationConcepts.filter(item => item !== value);
                }
                this.saveData();
            });
        });
    }
    
    updateFormVisibility() {
        // 如果选择不考虑民办，禁用相关选项
        const considerPrivate = document.getElementById('considerPrivate');
        const crossDistrictPreference = document.getElementById('crossDistrictPreference');
        const budget = document.getElementById('budget');
        const acceptLottery = document.getElementById('acceptLottery');
        
        if (considerPrivate && considerPrivate.value === 'no') {
            if (crossDistrictPreference) crossDistrictPreference.disabled = true;
            if (budget) budget.disabled = true;
            if (acceptLottery) acceptLottery.disabled = true;
        } else {
            if (crossDistrictPreference) crossDistrictPreference.disabled = false;
            if (budget) budget.disabled = false;
            if (acceptLottery) acceptLottery.disabled = false;
        }
    }
    
    generateAnalysis() {
        const analysisDiv = document.getElementById('intentionAnalysis');
        if (!analysisDiv) return;
        
        const { considerPrivate, crossDistrictPreference, budget, acceptLottery, specialties, educationConcepts } = this.data;
        
        let analysisHtml = '';
        
        // 根据选择生成分析
        if (!considerPrivate) {
            analysisHtml = `
                <div class="analysis-empty">
                    <i class="fas fa-clipboard-question"></i>
                    <h4>请先填写意向信息</h4>
                    <p>完成表单后，系统将为您生成个性化分析</p>
                </div>
            `;
        } else {
            let schoolType = '';
            let riskLevel = '';
            let recommendations = [];
            
            if (considerPrivate === 'yes') {
                schoolType = '民办+公办双线准备';
                riskLevel = budget === 'high' ? '较高' : '中等';
                recommendations.push('建议准备2所民办冲刺校，1-2所公办保底校');
            } else if (considerPrivate === 'cautious') {
                schoolType = '以公办为主，民办为备选';
                riskLevel = '较低';
                recommendations.push('建议以优质公办为主目标，民办作为补充选择');
            } else {
                schoolType = '公办学校';
                riskLevel = '低';
                recommendations.push('建议重点关注学区内的优质公办学校');
            }
            
            if (crossDistrictPreference) {
                recommendations.push(`可接受跨区范围：${crossDistrictPreference}`);
            }
            
            if (budget) {
                const budgetText = {
                    'low': '预算有限，建议以公办学校为主',
                    'medium': '预算适中，可考虑中档民办学校',
                    'high': '预算充足，可选择各类民办学校'
                }[budget];
                if (budgetText) recommendations.push(budgetText);
            }
            
            if (specialties.length > 0) {
                recommendations.push(`特长优势：${specialties.join('、')}，可关注相关特色学校`);
            }
            
            if (educationConcepts.length > 0) {
                recommendations.push(`教育理念偏好：${educationConcepts.join('、')}`);
            }
            
            analysisHtml = `
                <div class="analysis-result">
                    <div class="analysis-summary">
                        <div class="analysis-item">
                            <div class="analysis-label">择校策略</div>
                            <div class="analysis-value highlight">${schoolType}</div>
                        </div>
                        <div class="analysis-item">
                            <div class="analysis-label">风险等级</div>
                            <div class="analysis-value risk-${riskLevel === '高' ? 'high' : riskLevel === '中等' ? 'medium' : 'low'}">${riskLevel}</div>
                        </div>
                        <div class="analysis-item">
                            <div class="analysis-label">特长匹配</div>
                            <div class="analysis-value">${specialties.length}项</div>
                        </div>
                    </div>
                    
                    <div class="analysis-recommendations">
                        <h5><i class="fas fa-lightbulb"></i> 个性化建议</h5>
                        <ul>
                            ${recommendations.map(rec => `<li>${rec}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${considerPrivate === 'yes' ? `
                    <div class="analysis-warning">
                        <i class="fas fa-exclamation-triangle"></i>
                        民办学校摇号存在不确定性，请务必准备公办保底方案
                    </div>
                    ` : ''}
                </div>
            `;
        }
        
        analysisDiv.innerHTML = analysisHtml;
    }
    
    validate() {
        if (!this.data.considerPrivate) {
            alert('请选择是否考虑民办学校');
            return false;
        }
        
        if (!this.data.budget) {
            alert('请选择民办学校预算');
            return false;
        }
        
        return true;
    }
    
    getData() {
        return {
            ...this.data,
            specialties: JSON.stringify(this.data.specialties),
            educationConcepts: JSON.stringify(this.data.educationConcepts)
        };
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step5_PrivateSchool = Step5_PrivateSchool;
}