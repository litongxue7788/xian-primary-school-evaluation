// pages/Step7_Recommendation.js
class Step7_Recommendation {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = this.loadData();
        this.recommendations = null;
        this.timeline = null;
        this.policyTips = null;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.loadRecommendations();
    }
    
    loadData() {
        const savedData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        return {
            studentName: savedData.studentName || '',
            currentGrade: savedData.currentGrade || '六年级',
            householdDistrict: savedData.householdDistrict || '',
            residenceDistrict: savedData.residenceDistrict || '',
            considerPrivate: savedData.considerPrivate || '',
            budget: savedData.budget || '',
            specialties: savedData.specialties ? JSON.parse(savedData.specialties) : [],
            admissionPriority: savedData.admissionPriority || '待评估'
        };
    }
    
    render() {
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="report-header text-center mb-30">
                    <h1><i class="fas fa-graduation-cap"></i> 个性化升学报告</h1>
                    <p class="subtitle">基于您的所有信息生成的专属推荐</p>
                    <div class="report-meta">
                        <span class="meta-item"><i class="fas fa-user"></i> ${this.data.studentName || '学生'}</span>
                        <span class="meta-item"><i class="fas fa-calendar"></i> ${this.data.currentGrade}</span>
                        <span class="meta-item"><i class="fas fa-map-marker-alt"></i> ${this.data.householdDistrict || '未填写'}</span>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🤖</div>
                        <div class="card-title">AI智能学校推荐</div>
                    </div>
                    <div class="card-description">
                        基于您的户籍、居住、能力、预算等所有信息，AI为您推荐最适合的学校
                    </div>
                    
                    <div id="recommendationContent">
                        <div class="loading-container">
                            <div class="loading-spinner"></div>
                            <p>AI正在深度分析您的信息...</p>
                            <p class="loading-desc">这可能需要一些时间，请耐心等待</p>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">📅</div>
                        <div class="card-title">个性化时间规划</div>
                    </div>
                    <div id="timelineContent">
                        <div class="loading-container-small">
                            <div class="spinner small"></div>
                            <p>生成时间规划中...</p>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">💡</div>
                        <div class="card-title">政策提醒与建议</div>
                    </div>
                    <div id="policyTipsContent">
                        <div class="loading-container-small">
                            <div class="spinner small"></div>
                            <p>分析政策要点中...</p>
                        </div>
                    </div>
                </div>
                
                <div class="action-buttons mt-30">
                    <div class="btn-group">
                        <button class="btn btn-primary" onclick="this.exportPDF()">
                            <i class="fas fa-file-pdf"></i> 导出完整PDF报告
                        </button>
                        <button class="btn btn-secondary" onclick="this.exportJSON()">
                            <i class="fas fa-file-code"></i> 导出JSON数据
                        </button>
                        <button class="btn btn-outline" onclick="this.printReport()">
                            <i class="fas fa-print"></i> 打印报告
                        </button>
                        <button class="btn btn-outline" onclick="window.app.goToStep(1)">
                            <i class="fas fa-redo"></i> 重新评估
                        </button>
                    </div>
                </div>
                
                <div class="info-box bg-blue-50 border-blue-200 p-20 mt-20">
                    <h4><i class="fas fa-info-circle"></i> 使用说明</h4>
                    <p>本报告基于您填写的信息和西安市2025年招生政策生成，请注意：</p>
                    <ul style="margin: 10px 0 0 20px; color: #1e40af;">
                        <li>学校推荐仅供参考，请结合实际情况选择</li>
                        <li>时间规划基于常规安排，具体以教育局通知为准</li>
                        <li>政策提醒基于当前政策，如有变化请关注官方通知</li>
                        <li>建议咨询学校或教育部门获取最准确信息</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    async loadRecommendations() {
        try {
            // 检查AI配置
            const config = JSON.parse(localStorage.getItem('xsc_config') || '{}');
            
            if (!config.isConnected) {
                this.showLocalRecommendations();
                this.showLocalTimeline();
                this.showLocalPolicyTips();
                return;
            }
            
            // 收集所有数据
            const userData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
            
            // 并行获取所有数据
            await Promise.all([
                this.generateAIRecommendations(userData),
                this.generateAITimeline(userData),
                this.generateAIPolicyTips(userData)
            ]);
            
        } catch (error) {
            console.error('加载推荐失败:', error);
            this.showErrorRecommendations(error);
        }
    }
    
    async generateAIRecommendations(userData) {
        const recommendationContent = document.getElementById('recommendationContent');
        if (!recommendationContent) return;
        
        try {
            // 构建提示词
            const prompt = this.buildRecommendationPrompt(userData);
            
            // 调用AI服务
            const response = await this.callAI(prompt, 'recommendation');
            
            this.recommendations = response;
            recommendationContent.innerHTML = this.formatRecommendations(response);
            
        } catch (error) {
            recommendationContent.innerHTML = `
                <div class="error-container">
                    <i class="fas fa-exclamation-triangle"></i>
                    <h4>AI推荐生成失败</h4>
                    <p>${error.message}</p>
                    <button class="btn btn-outline mt-10" onclick="this.retryRecommendations()">重试</button>
                </div>
            `;
        }
    }
    
    async generateAITimeline(userData) {
        const timelineContent = document.getElementById('timelineContent');
        if (!timelineContent) return;
        
        try {
            const prompt = this.buildTimelinePrompt(userData);
            const response = await this.callAI(prompt, 'timeline');
            
            this.timeline = response;
            timelineContent.innerHTML = this.formatTimeline(response);
            
        } catch (error) {
            timelineContent.innerHTML = `
                <div class="error-container small">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>时间规划生成失败</p>
                </div>
            `;
        }
    }
    
    async generateAIPolicyTips(userData) {
        const policyTipsContent = document.getElementById('policyTipsContent');
        if (!policyTipsContent) return;
        
        try {
            const prompt = this.buildPolicyTipsPrompt(userData);
            const response = await this.callAI(prompt, 'policy');
            
            this.policyTips = response;
            policyTipsContent.innerHTML = this.formatPolicyTips(response);
            
        } catch (error) {
            policyTipsContent.innerHTML = `
                <div class="error-container small">
                    <i class="fas fa-exclamation-triangle"></i>
                    <p>政策分析生成失败</p>
                </div>
            `;
        }
    }
    
    buildRecommendationPrompt(userData) {
        return `
请基于以下学生信息，生成一份详细的学校推荐报告：

【学生基本信息】
- 姓名：${userData.studentName || '未填写'}
- 年级：${userData.currentGrade || '六年级'}
- 户籍区：${userData.householdDistrict || '未填写'}
- 居住区：${userData.residenceDistrict || '未填写'}
- 居住性质：${userData.residenceType || '未填写'}
- 入学顺位：${userData.admissionPriority || '待评估'}

【能力评估】
1. 学业成绩：${userData.score1 || 3}分
2. 综合素养：${userData.score2 || 3}分
3. 学习习惯：${userData.score3 || 3}分
4. 心理素质：${userData.score4 || 3}分
5. 家庭支持：${userData.score5 || 3}分
6. 学科倾向：${userData.score6 || 3}分

【升学意向】
- 是否考虑民办：${userData.considerPrivate || '未填写'}
- 跨区偏好：${userData.crossDistrictPreference || '未填写'}
- 预算范围：${userData.budget || '未填写'}
- 摇号态度：${userData.acceptLottery || '未填写'}

【学生特长】
${userData.specialties ? JSON.parse(userData.specialties).join('、') : '无'}

请按照以下格式生成推荐报告：

## 🏫 学校推荐策略
基于您的具体情况，建议采用[策略类型]策略。

## 📋 推荐学校列表
请推荐8-10所学校，包括：
1. 3所冲刺校（匹配度高但竞争激烈）
2. 3所稳妥校（匹配度适中，录取概率大）
3. 2所保底校（确保录取的学校）
4. 2所对口公办校（基于户籍的学区学校）

每所学校请包含：
- 学校名称（必须是西安市真实存在的学校）
- 类型（公办/民办）
- 区县
- 对口学区/招生范围
- 匹配度（百分比）
- 推荐理由（结合所有信息）
- 入学概率/摇号概率
- 推荐类型（冲刺/稳妥/保底/对口）
- 收费标准（民办学校必填）
- 学校特色

## 💡 择校建议
1. 报名策略建议
2. 材料准备建议
3. 风险提示
4. 备选方案

请使用中文，以专业但易懂的方式呈现。确保所有信息基于西安市2025年官方政策。
        `;
    }
    
    buildTimelinePrompt(userData) {
        const targetYear = userData.currentGrade === '六年级' ? '2026' : 
                          userData.currentGrade === '五年级' ? '2027' : '2028';
        
        return `
请基于以下学生信息，制定一份${targetYear}年西安小升初的个性化时间规划：

【学生信息】
- 当前年级：${userData.currentGrade || '六年级'}
- 户籍情况：${userData.householdDistrict || '未填写'} ${userData.householdStreet || ''}
- 居住情况：${userData.residenceDistrict || '未填写'} ${userData.residenceStreet || ''}
- 入学顺位：${userData.admissionPriority || '待评估'}
- 是否考虑民办：${userData.considerPrivate || '未填写'}

请制定详细的时间规划，包括：
1. 每月的重要事项和时间节点
2. 关键政策发布时间
3. 材料准备时间安排
4. 学校了解和参观时间
5. 报名和录取时间安排
6. 特殊情况处理时间

请以表格形式呈现，标注每个事项的重要性（关键/重要/提醒），并给出具体的行动建议。

时间范围：从当前时间到${targetYear}年9月入学。
        `;
    }
    
    buildPolicyTipsPrompt(userData) {
        return `
请基于以下学生信息，生成针对性的政策提醒与建议：

【学生信息】
- 户籍区：${userData.householdDistrict || '未填写'}
- 居住区：${userData.residenceDistrict || '未填写'}
- 居住性质：${userData.residenceType || '未填写'}
- 房产情况：${userData.hasHouse || '未填写'}
- 入学顺位：${userData.admissionPriority || '待评估'}
- 是否考虑民办：${userData.considerPrivate || '未填写'}
- 预算范围：${userData.budget || '未填写'}

请分析：
1. 该学生面临的特殊政策情况
2. 需要特别注意的政策条款
3. 可能遇到的政策风险
4. 规避风险的建议
5. 可以利用的政策优势
6. 需要提前准备的政策材料

请以要点形式呈现，突出重点，给出具体可操作的建议。
        `;
    }
    
    async callAI(prompt, type = 'general') {
        // 这里应该调用你的AI服务
        // 暂时返回模拟数据
        return new Promise((resolve) => {
            setTimeout(() => {
                const responses = {
                    'recommendation': this.getMockRecommendations(),
                    'timeline': this.getMockTimeline(),
                    'policy': this.getMockPolicyTips(),
                    'general': 'AI服务暂时不可用，请稍后重试'
                };
                resolve(responses[type] || responses.general);
            }, 2000);
        });
    }
    
    getMockRecommendations() {
        return {
            strategy: '民办+公办双线准备策略',
            schools: [
                {
                    name: '西安高新第一中学初中校区',
                    type: '民办',
                    district: '高新区',
                    admission: '全市摇号',
                    match: '85%',
                    reason: '理科优势明显，学业成绩优秀，家庭支持充分',
                    probability: '摇号概率约15%',
                    category: '冲刺',
                    fee: '12000元/学期',
                    features: ['科技创新', '小班教学', '国际化']
                },
                {
                    name: '西安铁一中分校',
                    type: '民办',
                    district: '碑林区',
                    admission: '全市摇号',
                    match: '80%',
                    reason: '综合素养较好，学习习惯良好',
                    probability: '摇号概率约20%',
                    category: '冲刺',
                    fee: '10000元/学期',
                    features: ['严格管理', '社团丰富', '理科突出']
                },
                {
                    name: '西安交通大学附属中学分校',
                    type: '民办',
                    district: '雁塔区',
                    admission: '全市摇号',
                    match: '75%',
                    reason: '匹配学生学科倾向，有相关特色课程',
                    probability: '摇号概率约25%',
                    category: '稳妥',
                    fee: '9000元/学期',
                    features: ['学术导向', '研究性学习', '社团多样']
                },
                {
                    name: '西安市第八十三中学',
                    type: '公办',
                    district: this.data.householdDistrict || '新城区',
                    admission: '学区对口',
                    match: '90%',
                    reason: '户籍所在区对口学校，入学概率高',
                    probability: '第一顺位，基本确保',
                    category: '对口',
                    fee: '公办免费',
                    features: ['传统名校', '师资雄厚', '管理规范']
                }
            ],
            suggestions: [
                '建议同时报名1-2所民办学校，确保有公办学校保底',
                '提前准备摇号材料，关注摇号时间和结果公布',
                '参加目标学校的开放日活动，深入了解学校',
                '准备好备用方案，应对摇号不中的情况'
            ]
        };
    }
    
    getMockTimeline() {
        const grade = this.data.currentGrade;
        const timelines = {
            '六年级': [
                { month: '2026年3月', events: ['关注民办学校招生简章发布', '参加学校开放日'], importance: '重要' },
                { month: '2026年4月', events: ['了解目标学校详细情况', '准备报名材料'], importance: '重要' },
                { month: '2026年5月', events: ['核查户籍和房产信息', '参加民办学校咨询会'], importance: '关键' },
                { month: '2026年6月', events: ['网上报名（预计6月中旬）', '确认报名信息'], importance: '关键' },
                { month: '2026年7月', events: ['民办学校摇号（7月30日）', '公布录取结果'], importance: '关键' },
                { month: '2026年8月', events: ['公办学校录取通知', '办理入学手续'], importance: '重要' }
            ],
            '五年级': [
                { month: '2025年9-12月', events: ['重点提升学业成绩', '培养良好学习习惯'], importance: '重要' },
                { month: '2026年1-3月', events: ['了解小升初政策', '初步筛选目标学校'], importance: '重要' },
                { month: '2026年4-6月', events: ['参加素质拓展活动', '丰富个人简历'], importance: '重要' },
                { month: '2026年7-8月', events: ['暑期强化训练', '查漏补缺'], importance: '提醒' },
                { month: '2026年9月', events: ['进入六年级', '开始全面准备'], importance: '关键' }
            ],
            '四年级': [
                { month: '2025年', events: ['打好语文、数学、英语基础'], importance: '重要' },
                { month: '2026年', events: ['培养综合素养', '参加兴趣班和社团'], importance: '重要' },
                { month: '2027年', events: ['了解学校信息', '制定升学目标'], importance: '提醒' },
                { month: '2028年', events: ['正式准备升学材料', '关注政策变化'], importance: '关键' }
            ]
        };
        
        return timelines[grade] || timelines['六年级'];
    }
    
    getMockPolicyTips() {
        return {
            specialSituations: [
                '户籍与居住地不一致，属于第二顺位',
                '考虑民办学校，需参加摇号录取',
                '预算中等，可选择中档民办学校'
            ],
            importantPolicies: [
                '公民同招：只能选择公办或民办其中一类报名',
                '摇号录取：民办学校报名超计划的实行电脑随机录取',
                '房户一致优先：户籍与房产一致的优先录取',
                '统筹安排：未被民办录取的由教育局统筹安排公办入学'
            ],
            risks: [
                '摇号不确定性可能导致无法进入理想学校',
                '第二顺位可能被统筹到非首选学校',
                '政策变化可能影响录取结果'
            ],
            suggestions: [
                '准备2-3所目标学校，包括冲刺校和保底校',
                '提前了解学区划分和学校招生范围',
                '关注教育局官方网站获取最新政策',
                '准备好所有相关证明材料'
            ],
            advantages: [
                '学业成绩良好，在录取中有一定优势',
                '家庭支持充分，有条件准备升学',
                '有明确特长，可考虑特长生招生'
            ],
            materials: [
                '户口本原件及复印件',
                '房产证或购房合同（如有）',
                '居住证（如为租房）',
                '儿童预防接种证明',
                '综合素质评价材料'
            ]
        };
    }
    
    formatRecommendations(data) {
        if (typeof data === 'string') {
            return `
                <div class="ai-content">
                    <div style="white-space: pre-line;">${data}</div>
                </div>
            `;
        }
        
        return `
            <div class="recommendation-result">
                <div class="strategy-section">
                    <h4>🏫 推荐策略</h4>
                    <div class="strategy-card">
                        <div class="strategy-icon">🎯</div>
                        <div class="strategy-content">
                            <div class="strategy-title">${data.strategy}</div>
                            <div class="strategy-desc">基于您的具体情况制定的最优策略</div>
                        </div>
                    </div>
                </div>
                
                <div class="schools-section">
                    <h4>📋 推荐学校列表</h4>
                    <div class="schools-table-container">
                        <table class="schools-table">
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>学校名称</th>
                                    <th>类型</th>
                                    <th>区县</th>
                                    <th>匹配度</th>
                                    <th>推荐类型</th>
                                    <th>入学概率</th>
                                    <th>收费标准</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${data.schools.map((school, index) => `
                                    <tr>
                                        <td>${index + 1}</td>
                                        <td>
                                            <div class="school-name">${school.name}</div>
                                            <div class="school-features">${school.features.join(' · ')}</div>
                                        </td>
                                        <td><span class="badge ${school.type === '民办' ? 'badge-primary' : 'badge-success'}">${school.type}</span></td>
                                        <td>${school.district}</td>
                                        <td>
                                            <div class="match-bar">
                                                <div class="match-fill" style="width: ${school.match}"></div>
                                                <span class="match-text">${school.match}</span>
                                            </div>
                                        </td>
                                        <td><span class="badge badge-${school.category}">${school.category}</span></td>
                                        <td>${school.probability}</td>
                                        <td>${school.fee}</td>
                                    </tr>
                                    <tr class="school-detail">
                                        <td colspan="8">
                                            <div class="detail-content">
                                                <strong>推荐理由：</strong>${school.reason}
                                            </div>
                                        </td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                </div>
                
                <div class="suggestions-section">
                    <h4>💡 择校建议</h4>
                    <ul class="suggestions-list">
                        ${data.suggestions.map(suggestion => `<li>${suggestion}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    formatTimeline(data) {
        if (typeof data === 'string') {
            return `
                <div class="ai-content">
                    <div style="white-space: pre-line;">${data}</div>
                </div>
            `;
        }
        
        return `
            <div class="timeline-result">
                <div class="timeline-container">
                    ${data.map((item, index) => `
                        <div class="timeline-item ${index % 2 === 0 ? 'left' : 'right'}">
                            <div class="timeline-date">${item.month}</div>
                            <div class="timeline-content">
                                <div class="timeline-events">
                                    ${item.events.map(event => `<div class="event">${event}</div>`).join('')}
                                </div>
                                <div class="timeline-importance importance-${item.importance}">
                                    ${item.importance === '关键' ? '🔴' : item.importance === '重要' ? '🟡' : '🔵'} ${item.importance}
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    formatPolicyTips(data) {
        if (typeof data === 'string') {
            return `
                <div class="ai-content">
                    <div style="white-space: pre-line;">${data}</div>
                </div>
            `;
        }
        
        return `
            <div class="policy-tips-result">
                <div class="tips-grid">
                    <div class="tip-card tip-warning">
                        <div class="tip-header">
                            <i class="fas fa-exclamation-triangle"></i>
                            <h5>特殊情况</h5>
                        </div>
                        <ul>
                            ${data.specialSituations.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tip-card tip-info">
                        <div class="tip-header">
                            <i class="fas fa-info-circle"></i>
                            <h5>重要政策</h5>
                        </div>
                        <ul>
                            ${data.importantPolicies.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tip-card tip-danger">
                        <div class="tip-header">
                            <i class="fas fa-shield-alt"></i>
                            <h5>风险提示</h5>
                        </div>
                        <ul>
                            ${data.risks.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tip-card tip-success">
                        <div class="tip-header">
                            <i class="fas fa-lightbulb"></i>
                            <h5>应对建议</h5>
                        </div>
                        <ul>
                            ${data.suggestions.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tip-card tip-primary">
                        <div class="tip-header">
                            <i class="fas fa-trophy"></i>
                            <h5>您的优势</h5>
                        </div>
                        <ul>
                            ${data.advantages.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                    
                    <div class="tip-card tip-secondary">
                        <div class="tip-header">
                            <i class="fas fa-file-alt"></i>
                            <h5>材料准备</h5>
                        </div>
                        <ul>
                            ${data.materials.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `;
    }
    
    showLocalRecommendations() {
        const recommendationContent = document.getElementById('recommendationContent');
        if (!recommendationContent) return;
        
        recommendationContent.innerHTML = `
            <div class="local-recommendations">
                <div class="local-header">
                    <i class="fas fa-laptop"></i>
                    <h4>本地模式推荐</h4>
                </div>
                <div class="local-content">
                    <p>当前处于本地模式，AI推荐功能不可用。</p>
                    <p>建议配置AI服务以获得更精准的个性化推荐：</p>
                    
                    <div class="config-steps">
                        <div class="step">
                            <div class="step-number">1</div>
                            <div class="step-content">
                                <strong>点击右上角"配置"按钮</strong>
                                <div class="step-desc">进入AI配置面板</div>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">2</div>
                            <div class="step-content">
                                <strong>选择AI提供商并输入API Key</strong>
                                <div class="step-desc">支持阿里百炼、OpenAI、DeepSeek等</div>
                            </div>
                        </div>
                        <div class="step">
                            <div class="step-number">3</div>
                            <div class="step-content">
                                <strong>保存配置并重试</strong>
                                <div class="step-desc">系统将为您生成AI推荐</div>
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-primary mt-20" onclick="toggleConfigPanel()">
                        <i class="fas fa-cog"></i> 前往配置
                    </button>
                </div>
            </div>
        `;
    }
    
    showLocalTimeline() {
        const timelineContent = document.getElementById('timelineContent');
        if (!timelineContent) return;
        
        timelineContent.innerHTML = `
            <div class="local-timeline">
                <h5>2025年小升初常规时间安排</h5>
                <table class="simple-table">
                    <tr><td>7月11-24日</td><td>公民办同步报名</td><td><span class="badge badge-danger">关键</span></td></tr>
                    <tr><td>7月30日</td><td>民办学校摇号录取</td><td><span class="badge badge-danger">关键</span></td></tr>
                    <tr><td>8月1-5日</td><td>民办学校补录报名</td><td><span class="badge badge-warning">重要</span></td></tr>
                    <tr><td>8月10日前</td><td>公办学校录取通知</td><td><span class="badge badge-danger">关键</span></td></tr>
                    <tr><td>8月15-20日</td><td>统筹安排入学</td><td><span class="badge badge-warning">重要</span></td></tr>
                    <tr><td>8月25-31日</td><td>各校发放录取通知书</td><td><span class="badge badge-info">提醒</span></td></tr>
                </table>
                <p class="note">💡 配置AI服务后可获得基于您个人情况的个性化时间规划</p>
            </div>
        `;
    }
    
    showLocalPolicyTips() {
        const policyTipsContent = document.getElementById('policyTipsContent');
        if (!policyTipsContent) return;
        
        policyTipsContent.innerHTML = `
            <div class="local-policy-tips">
                <h5>通用政策提醒</h5>
                <div class="tips-list">
                    <div class="tip-item">
                        <i class="fas fa-check-circle"></i>
                        <span>公民同招，只能选择公办或民办其中一类报名</span>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle"></i>
                        <span>民办学校实行电脑随机录取（摇号）</span>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle"></i>
                        <span>房户一致的家庭享有最优先入学资格</span>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle"></i>
                        <span>未被民办录取的学生，由教育局统筹安排公办入学</span>
                    </div>
                    <div class="tip-item">
                        <i class="fas fa-check-circle"></i>
                        <span>随迁子女需提供居住证、务工证明等材料</span>
                    </div>
                </div>
                <p class="note">💡 配置AI服务后可获得基于您个人情况的个性化政策分析</p>
            </div>
        `;
    }
    
    showErrorRecommendations(error) {
        const recommendationContent = document.getElementById('recommendationContent');
        if (!recommendationContent) return;
        
        recommendationContent.innerHTML = `
            <div class="error-container">
                <i class="fas fa-exclamation-triangle" style="color: #ef4444; font-size: 48px;"></i>
                <h4>推荐生成失败</h4>
                <p>${error.message || '未知错误'}</p>
                <div class="error-actions">
                    <button class="btn btn-primary" onclick="this.retryLoad()">重试</button>
                    <button class="btn btn-outline" onclick="this.showLocalRecommendations()">使用本地数据</button>
                </div>
            </div>
        `;
    }
    
    async exportPDF() {
        alert('PDF导出功能正在开发中...\n\n即将推出功能：\n- 完整报告导出\n- 学校推荐列表\n- 时间规划表\n- 政策提醒要点');
        
        // 这里应该实现PDF导出功能
        // 可以使用jsPDF库
    }
    
    exportJSON() {
        try {
            const userData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
            const config = JSON.parse(localStorage.getItem('xsc_config') || '{}');
            
            const exportData = {
                metadata: {
                    exportTime: new Date().toISOString(),
                    version: '1.0',
                    system: '西安小升初智能评估系统'
                },
                userData: userData,
                config: config,
                recommendations: this.recommendations,
                timeline: this.timeline,
                policyTips: this.policyTips
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            const exportFileDefaultName = `西安小升初评估数据_${this.data.studentName || '学生'}_${new Date().getTime()}.json`;
            
            const linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
            
            alert('JSON数据导出成功！');
            
        } catch (error) {
            console.error('JSON导出失败:', error);
            alert('JSON导出失败：' + error.message);
        }
    }
    
    printReport() {
        window.print();
    }
    
    retryLoad() {
        this.loadRecommendations();
    }
    
    validate() {
        // 步骤7是结果展示，无需验证
        return true;
    }
    
    getData() {
        return this.data;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step7_Recommendation = Step7_Recommendation;
}