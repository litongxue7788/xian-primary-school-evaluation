// pages/Step4_Property.js
class Step4_Property {
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
            hasHouse: savedData.hasHouse || '',
            propertyType: savedData.propertyType || '',
            propertyYears: savedData.propertyYears || '',
            admissionPriority: savedData.admissionPriority || '待评估'
        };
    }
    
    saveData() {
        localStorage.setItem('xsc_user_data', JSON.stringify({
            ...JSON.parse(localStorage.getItem('xsc_user_data') || '{}'),
            ...this.data
        }));
    }
    
    render() {
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🏡</div>
                        <div class="card-title">学区房产信息</div>
                    </div>
                    <div class="card-description">
                        公办学校入学资格相关信息，请如实填写
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label required">学区房情况</label>
                        <select class="form-select" id="hasHouse">
                            <option value="">请选择</option>
                            <option value="yes-good" ${this.data.hasHouse === 'yes-good' ? 'selected' : ''}>有，对口优质公办</option>
                            <option value="yes-normal" ${this.data.hasHouse === 'yes-normal' ? 'selected' : ''}>有，对口一般公办</option>
                            <option value="no" ${this.data.hasHouse === 'no' ? 'selected' : ''}>暂无学区房</option>
                            <option value="rent" ${this.data.hasHouse === 'rent' ? 'selected' : ''}>租房居住</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">房产证类型</label>
                        <select class="form-select" id="propertyType">
                            <option value="">请选择</option>
                            <option value="商品房" ${this.data.propertyType === '商品房' ? 'selected' : ''}>商品房</option>
                            <option value="房改房" ${this.data.propertyType === '房改房' ? 'selected' : ''}>房改房</option>
                            <option value="安置房" ${this.data.propertyType === '安置房' ? 'selected' : ''}>安置房</option>
                            <option value="经济适用房" ${this.data.propertyType === '经济适用房' ? 'selected' : ''}>经济适用房</option>
                            <option value="其他" ${this.data.propertyType === '其他' ? 'selected' : ''}>其他</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">房产持有时间</label>
                        <select class="form-select" id="propertyYears">
                            <option value="">请选择</option>
                            <option value="3年以上" ${this.data.propertyYears === '3年以上' ? 'selected' : ''}>3年以上</option>
                            <option value="1-3年" ${this.data.propertyYears === '1-3年' ? 'selected' : ''}>1-3年</option>
                            <option value="1年以内" ${this.data.propertyYears === '1年以内' ? 'selected' : ''}>1年以内</option>
                            <option value="新购" ${this.data.propertyYears === '新购' ? 'selected' : ''}>新购（未满1年）</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">预估入学顺位</label>
                        <div class="priority-display" id="priorityDisplay">
                            <div class="priority-badge ${this.getPriorityClass()}">
                                ${this.data.admissionPriority}
                            </div>
                            <div class="priority-reason" id="priorityReason">
                                ${this.getPriorityReason()}
                            </div>
                        </div>
                    </div>
                    
                    <button class="btn btn-outline w-full mt-10" onclick="this.interpretPolicy()" id="interpretBtn">
                        <i class="fas fa-brain"></i> AI解读入学顺位政策
                    </button>
                    
                    <div id="interpretationResult" class="mt-10"></div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">📝</div>
                        <div class="card-title">西安市公办入学顺位说明</div>
                    </div>
                    <div class="priority-guide">
                        <div class="priority-item">
                            <div class="priority-number">1</div>
                            <div class="priority-content">
                                <strong>第一顺位：</strong>房户一致，且在学区内居住
                                <div class="priority-desc">入学概率最高，优先安排</div>
                            </div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-number">2</div>
                            <div class="priority-content">
                                <strong>第二顺位：</strong>房户一致，但跨学区居住
                                <div class="priority-desc">在学区内学校有空余学位时安排</div>
                            </div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-number">3</div>
                            <div class="priority-content">
                                <strong>第三顺位：</strong>集体户/挂靠户，无学区房
                                <div class="priority-desc">由教育局统筹安排</div>
                            </div>
                        </div>
                        <div class="priority-item">
                            <div class="priority-number">4</div>
                            <div class="priority-content">
                                <strong>第四顺位：</strong>租房居住，统筹安排入学
                                <div class="priority-desc">在学区学校学位充足时安排</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="info-box bg-green-50 border-green-200 p-20 mt-20">
                    <h4><i class="fas fa-lightbulb"></i> 重要提醒</h4>
                    <ul style="margin: 10px 0 0 20px; color: #065f46;">
                        <li>入学顺位直接影响公办学校录取顺序</li>
                        <li>房户一致是获得优质公办学校学位的最佳途径</li>
                        <li>租房家庭需提前办理居住证等材料</li>
                        <li>建议提前了解目标学校的学区划分</li>
                    </ul>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        const hasHouse = document.getElementById('hasHouse');
        const propertyType = document.getElementById('propertyType');
        const propertyYears = document.getElementById('propertyYears');
        
        if (hasHouse) {
            hasHouse.addEventListener('change', (e) => {
                this.data.hasHouse = e.target.value;
                this.updatePriority();
                this.saveData();
            });
        }
        
        if (propertyType) {
            propertyType.addEventListener('change', (e) => {
                this.data.propertyType = e.target.value;
                this.updatePriority();
                this.saveData();
            });
        }
        
        if (propertyYears) {
            propertyYears.addEventListener('change', (e) => {
                this.data.propertyYears = e.target.value;
                this.updatePriority();
                this.saveData();
            });
        }
    }
    
    updatePriority() {
        this.data.admissionPriority = this.calculatePriority();
        this.saveData();
        
        // 更新显示
        const priorityDisplay = document.getElementById('priorityDisplay');
        const priorityReason = document.getElementById('priorityReason');
        
        if (priorityDisplay && priorityReason) {
            priorityDisplay.innerHTML = `
                <div class="priority-badge ${this.getPriorityClass()}">
                    ${this.data.admissionPriority}
                </div>
                <div class="priority-reason">
                    ${this.getPriorityReason()}
                </div>
            `;
        }
    }
    
    calculatePriority() {
        const { hasHouse, propertyType, propertyYears } = this.data;
        
        // 获取步骤3的数据
        const step3Data = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        const { householdDistrict, residenceDistrict, residenceType } = step3Data;
        
        if (!hasHouse) return '请填写房产信息';
        
        if (hasHouse === 'rent') {
            return '第四顺位（租房）';
        }
        
        if (hasHouse === 'no') {
            return '第三顺位（无学区房）';
        }
        
        if (householdDistrict && residenceDistrict) {
            if (householdDistrict === residenceDistrict && residenceType === '自有房产') {
                return '第一顺位（房户一致）';
            }
            
            if (householdDistrict === residenceDistrict && residenceType !== '自有房产') {
                return '第二顺位（房户一致但非自有）';
            }
            
            if (householdDistrict !== residenceDistrict) {
                return '第三顺位（房户不一致）';
            }
        }
        
        if (hasHouse.includes('yes')) {
            return propertyType === '商品房' ? '第一顺位（优质房产）' : '第二顺位（一般房产）';
        }
        
        return '待评估';
    }
    
    getPriorityClass() {
        const priority = this.data.admissionPriority;
        if (priority.includes('第一顺位')) return 'priority-1';
        if (priority.includes('第二顺位')) return 'priority-2';
        if (priority.includes('第三顺位')) return 'priority-3';
        if (priority.includes('第四顺位')) return 'priority-4';
        return 'priority-unknown';
    }
    
    getPriorityReason() {
        const priority = this.data.admissionPriority;
        
        if (priority.includes('第一顺位')) {
            return '户籍与房产地址一致，享受最优先入学资格';
        }
        
        if (priority.includes('第二顺位')) {
            return '户籍与房产地址在同一区域，但可能不在同一学区';
        }
        
        if (priority.includes('第三顺位')) {
            return '无学区房或房户不一致，由教育局统筹安排';
        }
        
        if (priority.includes('第四顺位')) {
            return '租房居住，排序在自有房产之后';
        }
        
        return '请完善户籍、居住和房产信息以确定入学顺位';
    }
    
    async interpretPolicy() {
        const interpretBtn = document.getElementById('interpretBtn');
        const resultDiv = document.getElementById('interpretationResult');
        
        if (!interpretBtn || !resultDiv) return;
        
        // 检查AI配置
        const config = JSON.parse(localStorage.getItem('xsc_config') || '{}');
        if (!config.isConnected) {
            resultDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    AI解读功能需要在线模式。请先配置AI服务。
                </div>
            `;
            return;
        }
        
        interpretBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> AI分析中...';
        interpretBtn.disabled = true;
        
        try {
            // 收集所有数据
            const userData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
            
            // 构建提示词
            const prompt = `
请详细解读西安市小升初的入学顺位政策，并基于以下用户信息给出具体分析：

用户信息：
1. 户籍所在区：${userData.householdDistrict || '未填写'}
2. 实际居住区：${userData.residenceDistrict || '未填写'}
3. 居住性质：${userData.residenceType || '未填写'}
4. 房产情况：${this.data.hasHouse}
5. 房产类型：${this.data.propertyType}
6. 持有时间：${this.data.propertyYears}

请分析：
1. 该用户的入学顺位
2. 顺位依据的政策条款
3. 可能的录取时间安排
4. 需要准备的材料清单
5. 提高入学概率的建议

请用中文回答，保持专业且易懂。
            `;
            
            // 调用AI服务（这里需要实现）
            const response = await this.callAI(prompt);
            
            resultDiv.innerHTML = `
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🤖</div>
                        <div class="card-title">AI政策解读</div>
                    </div>
                    <div class="card-body">
                        <div style="white-space: pre-line; line-height: 1.6;">${response}</div>
                    </div>
                </div>
            `;
            
        } catch (error) {
            resultDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle"></i>
                    解读失败：${error.message}
                </div>
            `;
        } finally {
            interpretBtn.innerHTML = '<i class="fas fa-brain"></i> AI解读入学顺位政策';
            interpretBtn.disabled = false;
        }
    }
    
    async callAI(prompt) {
        // 这里应该调用你的AI服务
        // 暂时返回模拟数据
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`
根据您提供的信息，分析如下：

🏠 **户籍情况分析**
- 户籍区：${this.data.householdDistrict || '未填写'}
- 居住区：${this.data.residenceDistrict || '未填写'}
- 居住性质：${this.data.residenceType || '未填写'}

📋 **入学顺位评估**
您当前属于：${this.data.admissionPriority}

📜 **政策依据**
根据《西安市2025年义务教育招生入学工作实施方案》：
1. 坚持"免试就近入学"原则
2. 公办学校按照学区划分入学
3. 民办学校实行电脑随机录取

📅 **时间安排建议**
1. 7月11-24日：网上报名
2. 7月30日：民办学校摇号
3. 8月10日前：公办学校录取通知

📝 **材料准备清单**
1. 户口本原件及复印件
2. 房产证或购房合同
3. 居住证（如为租房）
4. 儿童预防接种证明

💡 **提高入学概率建议**
1. 确保户籍与房产信息一致
2. 提前了解学区划分
3. 关注教育局官方通知
4. 准备备用方案

如有更多问题，欢迎继续咨询！
                `);
            }, 1500);
        });
    }
    
    validate() {
        if (!this.data.hasHouse) {
            alert('请选择学区房情况');
            return false;
        }
        return true;
    }
    
    getData() {
        return this.data;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step4_Property = Step4_Property;
}