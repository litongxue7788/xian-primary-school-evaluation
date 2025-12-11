// pages/Step6_Analysis.js
class Step6_Analysis {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = this.loadData();
        this.chart = null;
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.generateChart();
        this.generateAnalysis();
    }
    
    loadData() {
        const savedData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        return {
            score1: savedData.score1 || 3,
            score2: savedData.score2 || 3,
            score3: savedData.score3 || 3,
            score4: savedData.score4 || 3,
            score5: savedData.score5 || 3,
            score6: savedData.score6 || 3,
            specialties: savedData.specialties ? JSON.parse(savedData.specialties) : [],
            currentGrade: savedData.currentGrade || '六年级'
        };
    }
    
    render() {
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">📊</div>
                        <div class="card-title">能力雷达图分析</div>
                    </div>
                    <div class="card-description">
                        基于您的评估结果生成的能力分析图表
                    </div>
                    
                    <div class="chart-container" style="position: relative; height: 400px; width: 100%;">
                        <canvas id="abilityChart"></canvas>
                    </div>
                    
                    <div class="score-summary mt-20">
                        <div class="summary-grid">
                            <div class="summary-item">
                                <div class="summary-label">学业成绩</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score1 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score1}/5</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">综合素养</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score2 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score2}/5</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">学习习惯</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score3 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score3}/5</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">心理素质</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score4 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score4}/5</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">家庭支持</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score5 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score5}/5</span>
                                </div>
                            </div>
                            <div class="summary-item">
                                <div class="summary-label">学科倾向</div>
                                <div class="summary-value">
                                    <div class="score-bar">
                                        <div class="score-fill" style="width: ${(this.data.score6 / 5) * 100}%"></div>
                                    </div>
                                    <span class="score-number">${this.data.score6}/5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">🔍</div>
                        <div class="card-title">深度分析报告</div>
                    </div>
                    <div class="card-body">
                        <div id="detailedAnalysis" style="min-height: 300px;">
                            <div class="analysis-loading">
                                <div class="spinner"></div>
                                <p>正在生成深度分析报告...</p>
                            </div>
                        </div>
                        <button class="btn btn-outline w-full mt-10" onclick="this.generateAIReport()">
                            <i class="fas fa-robot"></i> AI生成详细建议
                        </button>
                    </div>
                </div>
                
                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">🎯</div>
                        <div class="card-title">针对性提升建议</div>
                    </div>
                    <div class="card-body">
                        ${this.generateRecommendations()}
                    </div>
                </div>
                
                <div class="info-box bg-yellow-50 border-yellow-200 p-20 mt-20">
                    <h4><i class="fas fa-chart-line"></i> 下一步建议</h4>
                    <p>基于您的能力评估结果，系统将在下一步为您：</p>
                    <ul style="margin: 10px 0 0 20px; color: #92400e;">
                        <li>匹配适合的学校类型（公办/民办）</li>
                        <li>推荐具体的学校名单</li>
                        <li>制定个性化时间规划</li>
                        <li>提供备考建议和材料准备清单</li>
                    </ul>
                    <div class="text-center mt-15">
                        <button class="btn btn-primary" onclick="window.app.goToStep(7)">
                            前往AI智能推荐 <i class="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateChart() {
        const ctx = document.getElementById('abilityChart');
        if (!ctx) return;
        
        if (this.chart) {
            this.chart.destroy();
        }
        
        const scores = [
            parseInt(this.data.score1),
            parseInt(this.data.score2),
            parseInt(this.data.score3),
            parseInt(this.data.score4),
            parseInt(this.data.score5),
            parseInt(this.data.score6)
        ];
        
        // 计算平均分
        const averageScore = scores.reduce((a, b) => a + b, 0) / scores.length;
        
        this.chart = new Chart(ctx, {
            type: 'radar',
            data: {
                labels: ['学业成绩', '综合素养', '学习习惯', '心理素质', '家庭支持', '学科倾向'],
                datasets: [{
                    label: '您的评估',
                    data: scores,
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    borderColor: 'rgba(59, 130, 246, 1)',
                    pointBackgroundColor: 'rgba(59, 130, 246, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(59, 130, 246, 1)',
                    borderWidth: 2
                }, {
                    label: '平均水平',
                    data: [3, 3, 3, 3, 3, 3],
                    backgroundColor: 'rgba(209, 213, 219, 0.1)',
                    borderColor: 'rgba(156, 163, 175, 0.5)',
                    borderWidth: 1,
                    borderDash: [5, 5],
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    r: {
                        beginAtZero: true,
                        max: 5,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                return value;
                            }
                        },
                        pointLabels: {
                            font: {
                                size: 14,
                                family: "'PingFang SC', 'Microsoft YaHei', sans-serif"
                            },
                            color: '#374151'
                        },
                        grid: {
                            color: 'rgba(229, 231, 235, 0.5)'
                        },
                        angleLines: {
                            color: 'rgba(229, 231, 235, 0.5)'
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14,
                                family: "'PingFang SC', 'Microsoft YaHei', sans-serif"
                            },
                            padding: 20,
                            usePointStyle: true
                        }
                    },
                    tooltip: {
                        backgroundColor: 'rgba(17, 24, 39, 0.9)',
                        titleFont: {
                            size: 14,
                            family: "'PingFang SC', 'Microsoft YaHei', sans-serif"
                        },
                        bodyFont: {
                            size: 14,
                            family: "'PingFang SC', 'Microsoft YaHei', sans-serif"
                        },
                        padding: 12,
                        cornerRadius: 6,
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += context.raw + '分';
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    
    generateAnalysis() {
        const analysisDiv = document.getElementById('detailedAnalysis');
        if (!analysisDiv) return;
        
        setTimeout(() => {
            const scores = [
                parseInt(this.data.score1),
                parseInt(this.data.score2),
                parseInt(this.data.score3),
                parseInt(this.data.score4),
                parseInt(this.data.score5),
                parseInt(this.data.score6)
            ];
            
            const totalScore = scores.reduce((a, b) => a + b, 0);
            const averageScore = totalScore / scores.length;
            
            // 找出最高和最低的维度
            const maxScore = Math.max(...scores);
            const minScore = Math.min(...scores);
            const maxIndex = scores.indexOf(maxScore);
            const minIndex = scores.indexOf(minScore);
            
            const dimensions = ['学业成绩', '综合素养', '学习习惯', '心理素质', '家庭支持', '学科倾向'];
            const maxDimension = dimensions[maxIndex];
            const minDimension = dimensions[minIndex];
            
            let overallAssessment = '';
            if (averageScore >= 4) {
                overallAssessment = '优秀水平，具备冲刺顶尖学校的实力';
            } else if (averageScore >= 3.5) {
                overallAssessment = '良好水平，有较大发展潜力';
            } else if (averageScore >= 3) {
                overallAssessment = '中等水平，需要针对性提升';
            } else {
                overallAssessment = '需要全面提升各方面能力';
            }
            
            analysisDiv.innerHTML = `
                <div class="detailed-analysis">
                    <div class="analysis-header">
                        <h4>能力评估综合分析</h4>
                        <div class="overall-score">
                            <div class="score-circle">
                                <div class="score-value">${averageScore.toFixed(1)}</div>
                                <div class="score-label">平均分</div>
                            </div>
                            <div class="score-info">
                                <div class="total-score">总分：${totalScore}/30</div>
                                <div class="assessment">${overallAssessment}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="analysis-details">
                        <div class="detail-section">
                            <h5><i class="fas fa-star"></i> 优势领域</h5>
                            <p>您的孩子在<strong>${maxDimension}</strong>方面表现突出（${maxScore}分），这是升学的重要优势。</p>
                            <ul>
                                ${this.getStrengthsDescription(maxDimension, maxScore)}
                            </ul>
                        </div>
                        
                        <div class="detail-section">
                            <h5><i class="fas fa-bullseye"></i> 提升空间</h5>
                            <p>在<strong>${minDimension}</strong>方面（${minScore}分）还有提升空间，建议重点关注。</p>
                            <ul>
                                ${this.getImprovementDescription(minDimension, minScore)}
                            </ul>
                        </div>
                        
                        ${this.data.specialties.length > 0 ? `
                        <div class="detail-section">
                            <h5><i class="fas fa-award"></i> 特长匹配</h5>
                            <p>孩子的特长（${this.data.specialties.join('、')）可以匹配以下类型的学校：</p>
                            <ul>
                                ${this.getSpecialtiesMatch()}
                            </ul>
                        </div>
                        ` : ''}
                        
                        <div class="detail-section">
                            <h5><i class="fas fa-school"></i> 择校建议</h5>
                            <p>基于您的能力评估，建议考虑以下类型的学校：</p>
                            <div class="school-types">
                                ${this.getSchoolTypesRecommendation(averageScore)}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }, 1000);
    }
    
    getStrengthsDescription(dimension, score) {
        const descriptions = {
            '学业成绩': [
                '学业基础扎实，学习能力较强',
                '在文化课方面有明显优势',
                '适合报考对学业成绩要求较高的学校'
            ],
            '综合素养': [
                '综合素质全面，发展潜力大',
                '在特长和综合能力方面有优势',
                '适合报考注重素质教育的学校'
            ],
            '学习习惯': [
                '学习自觉性高，自主学习能力强',
                '良好的学习习惯有助于长期发展',
                '适合报考学习氛围浓厚的学校'
            ],
            '心理素质': [
                '心态稳定，抗压能力强',
                '在考试和竞赛中能发挥正常水平',
                '适合报考竞争压力较大的学校'
            ],
            '家庭支持': [
                '家庭支持力度大，教育资源丰富',
                '有良好的家庭教育环境',
                '适合报考需要家庭配合度高的学校'
            ],
            '学科倾向': [
                '有明显的学科特长和发展方向',
                '在特定学科领域有优势',
                '适合报考特色鲜明、有特长生政策的学校'
            ]
        };
        
        const items = descriptions[dimension] || ['在该领域表现良好，继续保持'];
        return items.map(item => `<li>${item}</li>`).join('');
    }
    
    getImprovementDescription(dimension, score) {
        const suggestions = {
            '学业成绩': [
                '加强基础知识的学习和巩固',
                '制定合理的学习计划，提高学习效率',
                '适当参加补习班或请家教辅导'
            ],
            '综合素养': [
                '多参加课外活动和社团',
                '培养兴趣爱好，参加相关比赛',
                '注重综合素质的全面发展'
            ],
            '学习习惯': [
                '培养良好的时间管理习惯',
                '提高学习专注力和自律性',
                '建立规律的学习作息时间'
            ],
            '心理素质': [
                '进行适当的心理辅导和训练',
                '参加集体活动，提高社交能力',
                '学习压力管理技巧'
            ],
            '家庭支持': [
                '增加家庭陪伴和关注时间',
                '优化家庭教育方式和环境',
                '加强家校沟通与合作'
            ],
            '学科倾向': [
                '发现并培养孩子的学科兴趣',
                '均衡发展各学科能力',
                '寻找适合的学习方法和策略'
            ]
        };
        
        const items = suggestions[dimension] || ['加强该方面的训练和提高'];
        return items.map(item => `<li>${item}</li>`).join('');
    }
    
    getSpecialtiesMatch() {
        const matches = {
            '数学': '适合报考数学特色学校或理科实验班',
            '语文': '适合报考文科特色学校或语言类实验班',
            '英语': '适合报考外语特色学校或国际班',
            '艺术': '适合报考艺术特色学校或有艺术特长生政策的学校',
            '体育': '适合报考体育特色学校或有体育特长生政策的学校',
            '科技': '适合报考科技特色学校或创新实验班',
            '音乐': '适合报考音乐特色学校或艺术特长生项目',
            '舞蹈': '适合报考艺术特色学校或舞蹈特长生项目',
            '编程': '适合报考科技特色学校或信息学实验班',
            '演讲': '适合报考文科特色学校或辩论社团强的学校'
        };
        
        return this.data.specialties
            .filter(specialty => matches[specialty])
            .map(specialty => `<li>${specialty}：${matches[specialty]}</li>`)
            .join('');
    }
    
    getSchoolTypesRecommendation(averageScore) {
        let recommendations = [];
        
        if (averageScore >= 4) {
            recommendations.push({
                type: '顶尖民办学校',
                desc: '学业成绩优秀，综合素质高，可冲刺全市顶尖民办学校',
                icon: '🏆'
            });
            recommendations.push({
                type: '优质公办学校',
                desc: '第一顺位资格，可确保优质公办学校学位',
                icon: '🎯'
            });
        } else if (averageScore >= 3.5) {
            recommendations.push({
                type: '中等民办学校',
                desc: '有较好基础，可报考中等偏上民办学校',
                icon: '📈'
            });
            recommendations.push({
                type: '学区公办学校',
                desc: '确保学区内的公办学校，同时冲刺民办',
                icon: '🏫'
            });
        } else if (averageScore >= 3) {
            recommendations.push({
                type: '普通民办学校',
                desc: '可尝试报考竞争不太激烈的民办学校',
                icon: '🎓'
            });
            recommendations.push({
                type: '对口公办学校',
                desc: '以对口公办学校为主要目标，确保有学上',
                icon: '✅'
            });
        } else {
            recommendations.push({
                type: '公办学校为主',
                desc: '以公办学校为主要方向，重点提升基础能力',
                icon: '📚'
            });
            recommendations.push({
                type: '特色学校',
                desc: '考虑报考有特长生政策的特色学校',
                icon: '🌟'
            });
        }
        
        return recommendations.map(rec => `
            <div class="school-type">
                <div class="type-icon">${rec.icon}</div>
                <div class="type-content">
                    <div class="type-name">${rec.type}</div>
                    <div class="type-desc">${rec.desc}</div>
                </div>
            </div>
        `).join('');
    }
    
    generateRecommendations() {
        const scores = [
            parseInt(this.data.score1),
            parseInt(this.data.score2),
            parseInt(this.data.score3),
            parseInt(this.data.score4),
            parseInt(this.data.score5),
            parseInt(this.data.score6)
        ];
        
        const improvementAreas = [];
        if (scores[0] <= 3) improvementAreas.push('学业成绩');
        if (scores[2] <= 3) improvementAreas.push('学习习惯');
        if (scores[3] <= 3) improvementAreas.push('心理素质');
        
        if (improvementAreas.length === 0) {
            return `
                <div class="improvement-plan">
                    <div class="plan-header">
                        <i class="fas fa-check-circle" style="color: #10b981;"></i>
                        <h5>能力均衡发展</h5>
                    </div>
                    <p>您的孩子在各维度能力上发展较为均衡，建议：</p>
                    <ul>
                        <li>继续保持良好的学习状态和习惯</li>
                        <li>适当挑战更高难度的学习内容</li>
                        <li>参与有竞争力的活动和竞赛</li>
                        <li>提前了解目标学校的入学要求</li>
                    </ul>
                </div>
            `;
        }
        
        return `
            <div class="improvement-plan">
                <div class="plan-header">
                    <i class="fas fa-bullseye" style="color: #3b82f6;"></i>
                    <h5>重点提升计划</h5>
                </div>
                <p>建议重点提升以下方面：<strong>${improvementAreas.join('、')}</strong></p>
                
                <div class="improvement-steps">
                    ${improvementAreas.map(area => this.getAreaImprovementSteps(area)).join('')}
                </div>
                
                <div class="plan-timeline">
                    <h6><i class="fas fa-calendar-alt"></i> 时间安排建议</h6>
                    ${this.getTimelineRecommendation()}
                </div>
            </div>
        `;
    }
    
    getAreaImprovementSteps(area) {
        const steps = {
            '学业成绩': [
                '制定每日学习计划，确保2-3小时的有效学习时间',
                '每周进行一次知识点的系统复习',
                '每月完成一套模拟试卷，检测学习效果',
                '针对薄弱科目进行专项训练'
            ],
            '学习习惯': [
                '建立固定的作息时间表，保证充足睡眠',
                '使用番茄工作法，提高学习效率',
                '养成课前预习、课后复习的习惯',
                '定期整理错题本，避免重复犯错'
            ],
            '心理素质': [
                '参加集体活动，提高社交能力',
                '学习深呼吸、冥想等放松技巧',
                '进行模拟考试，适应考试压力',
                '培养积极乐观的心态，正确看待竞争'
            ]
        };
        
        const areaSteps = steps[area] || ['加强该方面的训练和培养'];
        
        return `
            <div class="improvement-area">
                <h6>${area}提升计划</h6>
                <ul>
                    ${areaSteps.map(step => `<li>${step}</li>`).join('')}
                </ul>
            </div>
        `;
    }
    
    getTimelineRecommendation() {
        const grade = this.data.currentGrade;
        const timelines = {
            '六年级': [
                '3-4月：重点提升薄弱科目，完成基础知识巩固',
                '5月：进行模拟考试训练，提高应试能力',
                '6月：关注招生政策，准备报名材料',
                '7月：参加学校开放日，确定目标学校'
            ],
            '五年级': [
                '本学期：打好学科基础，培养良好学习习惯',
                '暑假：参加兴趣班，培养特长爱好',
                '下学期：了解小升初政策，初步筛选学校',
                '明年：开始系统准备升学材料'
            ],
            '四年级': [
                '当前：注重全面发展，培养学习兴趣',
                '明年：加强基础学科学习，提高学习能力',
                '后年：开始了解升学信息，参加相关活动',
                '长期：为小升初做好充分准备'
            ]
        };
        
        const timeline = timelines[grade] || [
            '立即开始：全面了解小升初政策和要求',
            '短期目标：提升基础能力和学习习惯',
            '中期规划：参加相关活动和竞赛',
            '长期准备：为升学做好充分准备'
        ];
        
        return `
            <ul>
                ${timeline.map(item => `<li>${item}</li>`).join('')}
            </ul>
        `;
    }
    
    async generateAIReport() {
        const analysisDiv = document.getElementById('detailedAnalysis');
        if (!analysisDiv) return;
        
        // 检查AI配置
        const config = JSON.parse(localStorage.getItem('xsc_config') || '{}');
        if (!config.isConnected) {
            analysisDiv.innerHTML = `
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle"></i>
                    AI分析功能需要在线模式。请先配置AI服务。
                </div>
            `;
            return;
        }
        
        analysisDiv.innerHTML = `
            <div class="ai-analysis-loading">
                <div class="spinner"></div>
                <p>AI正在深度分析您的能力评估数据...</p>
                <p style="font-size: 12px; color: #6b7280;">这可能需要几秒钟时间</p>
            </div>
        `;
        
        try {
            // 收集所有数据
            const userData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
            
            // 构建提示词
            const prompt = `
请基于以下学生能力评估数据，生成一份详细的分析报告：

【基本信息】
- 当前年级：${userData.currentGrade || '未填写'}
- 学生姓名：${userData.studentName || '未填写'}

【能力评估（1-5分）】
1. 学业成绩：${userData.score1 || 3}分
2. 综合素养：${userData.score2 || 3}分
3. 学习习惯：${userData.score3 || 3}分
4. 心理素质：${userData.score4 || 3}分
5. 家庭支持：${userData.score5 || 3}分
6. 学科倾向：${userData.score6 || 3}分

【学生特长】
${userData.specialties ? JSON.parse(userData.specialties).join('、') : '无'}

【户籍信息】
- 户籍区：${userData.householdDistrict || '未填写'}
- 居住区：${userData.residenceDistrict || '未填写'}

【升学意向】
- 是否考虑民办：${userData.considerPrivate || '未填写'}
- 预算范围：${userData.budget || '未填写'}

请生成一份详细的能力分析报告，包括：
1. 总体评估和定位
2. 优势领域分析
3. 需要提升的方面
4. 适合的学校类型推荐
5. 具体的提升建议和时间规划
6. 升学策略建议

请用中文回答，保持专业且易于家长理解，使用适当的标题和分段。
            `;
            
            // 这里应该调用AI服务
            // 暂时返回模拟数据
            const response = await this.callAI(prompt);
            
            analysisDiv.innerHTML = `
                <div class="ai-analysis-result">
                    <div class="analysis-header">
                        <h4><i class="fas fa-robot"></i> AI能力分析报告</h4>
                        <div class="analysis-meta">
                            <span class="meta-item"><i class="fas fa-calendar"></i> ${new Date().toLocaleDateString()}</span>
                            <span class="meta-item"><i class="fas fa-user-graduate"></i> ${userData.currentGrade || '六年级'}</span>
                        </div>
                    </div>
                    <div class="analysis-content">
                        <div style="white-space: pre-line; line-height: 1.6;">${response}</div>
                    </div>
                </div>
            `;
            
        } catch (error) {
            analysisDiv.innerHTML = `
                <div class="alert alert-danger">
                    <i class="fas fa-times-circle"></i>
                    AI分析失败：${error.message}
                </div>
            `;
        }
    }
    
    async callAI(prompt) {
        // 这里应该调用你的AI服务
        // 暂时返回模拟数据
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(`# AI能力分析报告

## 📊 总体评估
基于您的评估数据，孩子的综合能力处于**良好水平**。总分${this.getTotalScore()}/30，平均分${(this.getTotalScore()/6).toFixed(1)}分，显示出均衡的发展潜力。

## 🌟 优势领域
1. **学业成绩优秀**：${this.data.score1}分，表明孩子有扎实的学科基础
2. **家庭支持充分**：${this.data.score5}分，良好的家庭环境是升学的重要保障
3. **学习习惯良好**：${this.data.score3}分，有助于持续的学习进步

## 📈 提升建议
1. **心理素质培养**：${this.data.score4}分，建议加强抗压能力和自信心训练
2. **综合素养拓展**：${this.data.score2}分，可多参与课外活动和兴趣培养
3. **学科倾向明确**：${this.data.score6}分，帮助孩子发现并发展学科特长

## 🏫 学校类型推荐
基于您的能力评估和户籍情况，建议考虑：

### 第一梯队：优质民办学校
- 适合理由：学业基础扎实，家庭支持充分
- 推荐类型：全市招生的民办初中
- 注意事项：摇号存在不确定性，需准备保底方案

### 第二梯队：学区公办学校
- 适合理由：户籍与居住地匹配度高
- 推荐类型：学区内的优质公办学校
- 优势：入学确定性高，离家近

### 第三梯队：特色学校
- 适合理由：${this.data.specialties ? JSON.parse(this.data.specialties).join('、') : '有特长'}优势
- 推荐类型：有特长生招生政策的学校
- 机会：利用特长增加录取机会

## 🗓️ 时间规划建议
### 短期（1-3个月）
1. 重点提升心理素质：参加集体活动，进行模拟考试训练
2. 巩固学业基础：每周进行知识复习和错题整理
3. 了解目标学校：收集学校信息，参加开放日活动

### 中期（3-6个月）
1. 培养特长优势：参加相关比赛和活动
2. 提高综合素养：参与社会实践和志愿服务
3. 准备升学材料：整理获奖证书和综合素质评价

### 长期（6-12个月）
1. 系统复习备考：完成知识体系构建
2. 心理调适准备：适应升学压力
3. 确定最终志愿：基于模拟考试结果和学校了解

## 💡 升学策略
1. **双线准备策略**：同时准备民办和公办学校
2. **特长发展策略**：利用特长优势争取特长生资格
3. **稳妥保底策略**：确保有合适的公办学校保底

---
*本报告基于您提供的数据生成，仅供参考。实际升学请以当年政策和学校要求为准。*
                `);
            }, 2000);
        });
    }
    
    getTotalScore() {
        const scores = [
            parseInt(this.data.score1),
            parseInt(this.data.score2),
            parseInt(this.data.score3),
            parseInt(this.data.score4),
            parseInt(this.data.score5),
            parseInt(this.data.score6)
        ];
        return scores.reduce((a, b) => a + b, 0);
    }
    
    validate() {
        // 步骤6主要是展示分析结果，无需验证
        return true;
    }
    
    getData() {
        return this.data;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step6_Analysis = Step6_Analysis;
}