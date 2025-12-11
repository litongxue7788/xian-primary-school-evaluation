// pages/Step2_Ability.js
class Step2_Ability {
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
            score1: savedData.score1 || '3', // 学业成绩
            score2: savedData.score2 || '3', // 综合素养
            score3: savedData.score3 || '3', // 学习习惯
            score4: savedData.score4 || '3', // 心理素质
            score5: savedData.score5 || '3', // 家庭支持
            score6: savedData.score6 || '3'  // 学科倾向
        };
    }
    
    saveData() {
        localStorage.setItem('xsc_user_data', JSON.stringify({
            ...JSON.parse(localStorage.getItem('xsc_user_data') || '{}'),
            ...this.data
        }));
    }
    
    render() {
        const dimensions = [
            {
                id: 'score1',
                title: '📚 学业成绩',
                description: '评估孩子在班级/年级的学业成绩排名情况',
                options: [
                    { value: '5', label: '年级前5%', desc: '顶尖水平' },
                    { value: '4', label: '年级前15%', desc: '优秀水平' },
                    { value: '3', label: '年级前30%', desc: '良好水平' },
                    { value: '2', label: '年级前50%', desc: '中等水平' },
                    { value: '1', label: '年级50%后', desc: '需要提高' }
                ]
            },
            {
                id: 'score2',
                title: '🎨 综合素养',
                description: '特长、获奖情况和综合发展水平',
                options: [
                    { value: '5', label: '省级获奖', desc: '省级以上荣誉' },
                    { value: '4', label: '市级证书', desc: '市级荣誉' },
                    { value: '3', label: '校级获奖', desc: '校级荣誉' },
                    { value: '2', label: '参与活动', desc: '积极参与' },
                    { value: '1', label: '较少参与', desc: '参与较少' }
                ]
            },
            {
                id: 'score3',
                title: '📖 学习习惯',
                description: '自律性和学习主动性',
                options: [
                    { value: '5', label: '非常自律', desc: '完全自主' },
                    { value: '4', label: '较为自律', desc: '基本自觉' },
                    { value: '3', label: '需要监督', desc: '需要提醒' },
                    { value: '2', label: '需多督促', desc: '较多督促' },
                    { value: '1', label: '习惯较差', desc: '需要改善' }
                ]
            },
            {
                id: 'score4',
                title: '💪 心理素质',
                description: '抗压能力和心理承受能力',
                options: [
                    { value: '5', label: '抗压很强', desc: '心态极好' },
                    { value: '4', label: '心态稳定', desc: '比较稳定' },
                    { value: '3', label: '一般水平', desc: '正常水平' },
                    { value: '2', label: '容易焦虑', desc: '容易紧张' },
                    { value: '1', label: '需要关注', desc: '需要引导' }
                ]
            },
            {
                id: 'score5',
                title: '👨‍👩‍👧 家庭支持',
                description: '家庭在时间、经济、精力方面的支持',
                options: [
                    { value: '5', label: '全力支持', desc: '全方位支持' },
                    { value: '4', label: '积极支持', desc: '主动支持' },
                    { value: '3', label: '一般支持', desc: '正常支持' },
                    { value: '2', label: '有限支持', desc: '支持有限' },
                    { value: '1', label: '支持不足', desc: '支持较少' }
                ]
            },
            {
                id: 'score6',
                title: '🔬 学科倾向',
                description: '孩子的学科优势和兴趣方向',
                options: [
                    { value: '5', label: '理科优势', desc: '理科突出' },
                    { value: '4', label: '文科优势', desc: '文科突出' },
                    { value: '3', label: '均衡发展', desc: '各科均衡' },
                    { value: '2', label: '有偏科', desc: '部分偏科' },
                    { value: '1', label: '学习困难', desc: '需要帮助' }
                ]
            }
        ];
        
        let html = `<div class="step-content fade-in">`;
        
        dimensions.forEach(dim => {
            const currentValue = this.data[dim.id];
            
            html += `
                <div class="card ${dim !== dimensions[0] ? 'mt-20' : ''}">
                    <div class="card-header">
                        <div class="card-title">${dim.title}</div>
                    </div>
                    <div class="card-description">
                        ${dim.description}
                    </div>
                    
                    <div class="score-options">
                        ${dim.options.map(option => `
                            <div class="score-option">
                                <input type="radio" name="${dim.id}" id="${dim.id}_${option.value}" 
                                       value="${option.value}" ${currentValue === option.value ? 'checked' : ''}>
                                <label for="${dim.id}_${option.value}" class="score-label">
                                    <span class="score-number">${option.value}</span>
                                    <span class="score-desc">
                                        <div>${option.label}</div>
                                        <div style="font-size: 12px; color: #9ca3af; margin-top: 2px;">${option.desc}</div>
                                    </span>
                                </label>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        });
        
        html += `
            <div class="info-box bg-yellow-50 border-yellow-200 p-20 mt-20">
                <h4><i class="fas fa-info-circle"></i> 评估说明</h4>
                <ul style="margin: 10px 0 0 20px; color: #92400e;">
                    <li>请根据孩子的实际情况客观评估，这将影响学校推荐的匹配度</li>
                    <li>1-5分，5分为最高，代表在该方面表现最佳</li>
                    <li>评估结果仅用于个性化推荐，不会被分享或用于其他用途</li>
                    <li>您可以随时返回修改评估结果</li>
                </ul>
            </div>
        `;
        
        html += `</div>`;
        this.container.innerHTML = html;
    }
    
    bindEvents() {
        // 绑定所有评分选项的change事件
        const radioGroups = ['score1', 'score2', 'score3', 'score4', 'score5', 'score6'];
        
        radioGroups.forEach(groupName => {
            const radios = this.container.querySelectorAll(`input[name="${groupName}"]`);
            radios.forEach(radio => {
                radio.addEventListener('change', (e) => {
                    this.data[groupName] = e.target.value;
                    this.saveData();
                    
                    // 给选中的选项添加视觉反馈
                    this.highlightSelectedOption(groupName, e.target.value);
                });
            });
        });
    }
    
    highlightSelectedOption(groupName, value) {
        // 移除该组所有选项的高亮
        const labels = this.container.querySelectorAll(`input[name="${groupName}"] + .score-label`);
        labels.forEach(label => {
            label.style.boxShadow = 'none';
            label.style.borderColor = '#e5e7eb';
        });
        
        // 高亮选中的选项
        const selectedLabel = this.container.querySelector(`input[name="${groupName}"][value="${value}"] + .score-label`);
        if (selectedLabel) {
            selectedLabel.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
            selectedLabel.style.borderColor = '#3b82f6';
        }
    }
    
    validate() {
        const requiredScores = ['score1', 'score2', 'score3', 'score4', 'score5', 'score6'];
        const missing = [];
        
        requiredScores.forEach(score => {
            if (!this.data[score]) {
                missing.push(score);
            }
        });
        
        if (missing.length > 0) {
            alert('请完成所有能力维度的评估');
            return false;
        }
        
        return true;
    }
    
    getData() {
        return this.data;
    }
    
    getTotalScore() {
        const scores = Object.values(this.data).map(Number);
        return scores.reduce((sum, score) => sum + score, 0);
    }
    
    getScoreDescription(total) {
        if (total >= 25) return '综合能力优秀，具备冲刺顶尖学校的实力';
        if (total >= 20) return '综合能力良好，有较大发展潜力';
        if (total >= 15) return '综合能力中等，需要针对性提升';
        return '需要全面提升各方面能力';
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step2_Ability = Step2_Ability;
}