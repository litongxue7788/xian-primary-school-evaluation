// src/services/ai.service.js
class AIService {
    constructor() {
        this.baseURL = '/api/ai'; // 后端API地址
        this.config = {
            provider: 'bailian',
            apiKey: '',
            appId: ''
        };
    }
    
    async initialize(config) {
        this.config = { ...this.config, ...config };
    }
    
    async callAI(prompt, options = {}) {
        const { provider = this.config.provider, apiKey = this.config.apiKey } = options;
        
        try {
            const response = await fetch(this.baseURL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    provider,
                    message: prompt,
                    apiKey,
                    appId: this.config.appId
                })
            });
            
            if (!response.ok) {
                throw new Error(`API错误: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.response;
            } else {
                throw new Error(data.error || '未知错误');
            }
            
        } catch (error) {
            console.error('AI调用失败:', error);
            throw error;
        }
    }
    
    // 学校推荐功能
    async getSchoolRecommendation(userData) {
        const prompt = this.createSchoolRecommendationPrompt(userData);
        return await this.callAI(prompt);
    }
    
    // 能力分析功能
    async getAbilityAnalysis(userData) {
        const prompt = this.createAbilityAnalysisPrompt(userData);
        return await this.callAI(prompt);
    }
    
    // 时间规划功能
    async getTimelinePlan(userData) {
        const prompt = this.createTimelinePrompt(userData);
        return await this.callAI(prompt);
    }
    
    // 构建提示词
    createSchoolRecommendationPrompt(userData) {
        return `
作为西安小升初专家，请基于以下学生信息推荐合适的学校：

学生信息：
- 姓名：${userData.studentName || '未填写'}
- 年级：${userData.currentGrade || '六年级'}
- 户籍：${userData.householdDistrict || '未填写'} ${userData.householdStreet || ''}
- 居住：${userData.residenceDistrict || '未填写'} ${userData.residenceStreet || ''}
- 房产：${userData.propertyType || '未填写'}
- 预算：${userData.budget || '未填写'}
- 特长：${userData.specialties ? userData.specialties.join('、') : '无'}

请按照以下格式推荐学校：
1. 推荐3所公办学校（基于户籍学区）
2. 推荐3所民办学校（考虑预算和特长）
3. 每所学校包含：名称、类型、区县、匹配度、推荐理由、入学概率
4. 给出具体的行动建议

请用中文回答，保持专业且易懂。
        `;
    }
    
    createAbilityAnalysisPrompt(userData) {
        // 能力分析提示词
        return `分析学生能力并给出建议...`;
    }
    
    createTimelinePrompt(userData) {
        // 时间规划提示词
        return `制定个性化时间规划...`;
    }
}

// 创建全局实例
const aiService = new AIService();

// 导出
if (typeof window !== 'undefined') {
    window.AIService = aiService;
}