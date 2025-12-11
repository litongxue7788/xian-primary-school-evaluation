/**
 * 数据服务
 * 负责数据管理和业务逻辑
 */

import { SCHOOLS_DATA } from '../data/schools.data.js';
import { POLICY_DATA } from '../data/policy.data.js';
import { STREETS_DATA } from '../data/streets.data.js';

class DataService {
    constructor() {
        this.schools = SCHOOLS_DATA;
        this.policy = POLICY_DATA;
        this.streets = STREETS_DATA;
        this.userData = null;
    }
    
    /**
     * 根据条件筛选学校
     */
    filterSchools(filters = {}) {
        let filteredSchools = [...this.schools];
        
        // 按区域筛选
        if (filters.district) {
            filteredSchools = filteredSchools.filter(school => 
                school.district === filters.district
            );
        }
        
        // 按学校类型筛选
        if (filters.type) {
            filteredSchools = filteredSchools.filter(school => 
                school.type === filters.type
            );
        }
        
        // 按学校等级筛选
        if (filters.level) {
            filteredSchools = filteredSchools.filter(school => 
                school.level === filters.level
            );
        }
        
        // 按关键词搜索
        if (filters.keyword) {
            const keyword = filters.keyword.toLowerCase();
            filteredSchools = filteredSchools.filter(school => 
                school.name.toLowerCase().includes(keyword) ||
                school.address?.toLowerCase().includes(keyword) ||
                school.tags?.some(tag => tag.toLowerCase().includes(keyword))
            );
        }
        
        // 按评分排序
        if (filters.sortBy) {
            filteredSchools.sort((a, b) => {
                switch (filters.sortBy) {
                    case 'rating':
                        return b.rating - a.rating;
                    case 'matchScore':
                        return (b.matchScore || 0) - (a.matchScore || 0);
                    case 'distance':
                        return (a.distance || Infinity) - (b.distance || Infinity);
                    default:
                        return 0;
                }
            });
        }
        
        return filteredSchools;
    }
    
    /**
     * 计算学校匹配度
     */
    calculateSchoolMatch(userData, school) {
        let score = 0;
        const weights = {
            district: 30,      // 区域匹配
            distance: 25,      // 距离权重
            rating: 20,        // 学校评分
            ability: 15,       // 学生能力匹配
            preference: 10     // 家长偏好
        };
        
        // 区域匹配（最高30分）
        if (userData.householdType === '学区内户籍' && 
            userData.district === school.district) {
            score += weights.district;
        } else if (userData.district === school.district) {
            score += weights.district * 0.5;
        }
        
        // 距离评分（模拟计算）
        if (userData.address && school.coordinates) {
            const distance = this.calculateDistance(
                userData.address,
                school.coordinates
            );
            score += Math.max(0, weights.distance * (1 - distance / 10));
        }
        
        // 学校评分（最高20分）
        score += (school.rating || 0) / 5 * weights.rating;
        
        // 学生能力匹配（最高15分）
        if (userData.studentAbility && school.targetLevel) {
            const abilityMatch = this.matchAbilityLevel(
                userData.studentAbility,
                school.targetLevel
            );
            score += abilityMatch * weights.ability;
        }
        
        // 家长偏好匹配（最高10分）
        if (userData.preferences) {
            const preferenceMatch = this.matchPreferences(
                userData.preferences,
                school
            );
            score += preferenceMatch * weights.preference;
        }
        
        return Math.min(100, Math.round(score));
    }
    
    /**
     * 计算距离（简化版）
     */
    calculateDistance(userAddress, schoolCoords) {
        // 实际应用中应该使用地理编码和距离计算API
        // 这里返回一个模拟距离
        return Math.random() * 5 + 0.5;
    }
    
    /**
     * 匹配学生能力与学校目标
     */
    matchAbilityLevel(studentAbility, schoolTarget) {
        const abilityLevels = {
            '优秀': 3,
            '良好': 2,
            '一般': 1
        };
        
        const studentLevel = abilityLevels[studentAbility] || 1;
        const schoolLevel = abilityLevels[schoolTarget] || 2;
        
        return Math.max(0, 1 - Math.abs(studentLevel - schoolLevel) / 3);
    }
    
    /**
     * 匹配家长偏好
     */
    matchPreferences(preferences, school) {
        let matchCount = 0;
        const total = Object.keys(preferences).length;
        
        if (preferences.schoolType && preferences.schoolType === school.type) {
            matchCount++;
        }
        
        if (preferences.schoolSize && school.students) {
            const sizeMatch = preferences.schoolSize === 'large' ? 
                school.students > 1500 : school.students <= 1500;
            if (sizeMatch) matchCount++;
        }
        
        if (preferences.facilities && school.facilities) {
            const hasAllFacilities = preferences.facilities.every(facility => 
                school.facilities.includes(facility)
            );
            if (hasAllFacilities) matchCount++;
        }
        
        return matchCount / Math.max(1, total);
    }
    
    /**
     * 获取政策信息
     */
    getPolicyInfo(category) {
        if (category) {
            return this.policy[category] || [];
        }
        return this.policy;
    }
    
    /**
     * 获取街道数据
     */
    getStreets(district) {
        if (district) {
            return this.streets[district] || [];
        }
        return this.streets;
    }
    
    /**
     * 保存用户数据
     */
    saveUserData(data) {
        this.userData = { ...this.userData, ...data };
        
        // 保存到本地存储
        try {
            localStorage.setItem('xian_xiaoshengchu_user_data', 
                JSON.stringify(this.userData));
        } catch (error) {
            console.warn('无法保存到本地存储:', error);
        }
        
        return this.userData;
    }
    
    /**
     * 加载用户数据
     */
    loadUserData() {
        try {
            const savedData = localStorage.getItem('xian_xiaoshengchu_user_data');
            if (savedData) {
                this.userData = JSON.parse(savedData);
            }
        } catch (error) {
            console.warn('无法从本地存储加载数据:', error);
            this.userData = null;
        }
        
        return this.userData;
    }
    
    /**
     * 清除用户数据
     */
    clearUserData() {
        this.userData = null;
        try {
            localStorage.removeItem('xian_xiaoshengchu_user_data');
        } catch (error) {
            console.warn('无法清除本地存储:', error);
        }
    }
    
    /**
     * 获取推荐学校
     */
    getRecommendedSchools(userData, limit = 10) {
        const allSchools = this.filterSchools({
            district: userData.district,
            type: userData.schoolTypePreference || 'public'
        });
        
        // 计算匹配分数
        const schoolsWithScore = allSchools.map(school => ({
            ...school,
            matchScore: this.calculateSchoolMatch(userData, school)
        }));
        
        // 按匹配度排序
        schoolsWithScore.sort((a, b) => b.matchScore - a.matchScore);
        
        return schoolsWithScore.slice(0, limit);
    }
    
    /**
     * 生成分析报告
     */
    generateAnalysisReport(userData) {
        const recommendedSchools = this.getRecommendedSchools(userData, 5);
        const policyRelevant = this.getRelevantPolicies(userData);
        
        return {
            summary: this.generateSummary(userData, recommendedSchools),
            schools: recommendedSchools,
            policies: policyRelevant,
            timeline: this.generateTimeline(userData),
            suggestions: this.generateSuggestions(userData, recommendedSchools),
            generatedAt: new Date().toISOString()
        };
    }
    
    /**
     * 获取相关政策
     */
    getRelevantPolicies(userData) {
        const relevantPolicies = [];
        
        if (userData.householdType) {
            relevantPolicies.push(
                ...this.getPolicyInfo('householdRegistration')
            );
        }
        
        if (userData.propertyInfo) {
            relevantPolicies.push(
                ...this.getPolicyInfo('propertyRequirements')
            );
        }
        
        return relevantPolicies;
    }
    
    /**
     * 生成摘要
     */
    generateSummary(userData, recommendedSchools) {
        const topSchool = recommendedSchools[0];
        const matchScore = topSchool?.matchScore || 0;
        
        let summary = `根据您的信息分析，`;
        
        if (matchScore >= 80) {
            summary += `您的情况非常符合优质学校的入学条件，推荐学校匹配度高达${matchScore}%。`;
        } else if (matchScore >= 60) {
            summary += `您的情况基本符合入学条件，推荐学校匹配度${matchScore}%。`;
        } else {
            summary += `建议您进一步了解相关政策或考虑其他选择。`;
        }
        
        return summary;
    }
    
    /**
     * 生成时间线
     */
    generateTimeline(userData) {
        const currentYear = new Date().getFullYear();
        
        return [
            {
                month: '3月',
                events: ['关注教育局官方通知', '开始准备报名材料']
            },
            {
                month: '4月',
                events: ['网上报名', '提交材料审核']
            },
            {
                month: '5月',
                events: ['民办学校摇号', '公办学校资格审查']
            },
            {
                month: '6月',
                events: ['公布录取结果', '办理入学手续']
            },
            {
                month: '8月',
                events: ['新生报到', '入学准备']
            }
        ];
    }
    
    /**
     * 生成建议
     */
    generateSuggestions(userData, recommendedSchools) {
        const suggestions = [];
        
        if (userData.householdType === '非本地户籍') {
            suggestions.push({
                type: 'warning',
                text: '非本地户籍需提前办理居住证和社保，建议尽早准备。'
            });
        }
        
        if (!userData.propertyInfo?.hasOwnProperty) {
            suggestions.push({
                type: 'info',
                text: '如无学区房，可考虑民办学校或关注随迁子女入学政策。'
            });
        }
        
        if (recommendedSchools.length === 0) {
            suggestions.push({
                type: 'important',
                text: '未找到匹配学校，建议联系教育局或咨询专业人士。'
            });
        }
        
        return suggestions;
    }
}

export default DataService;