/**
 * AI API服务（Node.js后端）
 * 处理AI相关的请求
 */

const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

// 配置OpenAI（实际项目中应从环境变量读取）
const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY || 'your-api-key-here'
});
const openai = new OpenAIApi(configuration);

// 西安小升初政策知识库
const POLICY_KNOWLEDGE = `
西安小升初政策要点：

1. 公办学校入学原则：
   - 按照"学区划分、免试就近入学"原则
   - 优先安排学区内户籍与实际居住地一致的适龄儿童
   - 学区内户籍以2023年8月31日前为准

2. 民办学校招生政策：
   - 实行电脑随机派位（摇号）
   - 报名人数超过招生计划的，实行电脑随机录取
   - 每位学生只能报名一所民办学校

3. 入学条件：
   - 西安市户籍适龄儿童
   - 外来务工人员随迁子女
   - 符合条件的高层次人才子女

4. 重要时间节点：
   - 3月：政策发布
   - 4月：网上报名
   - 5月：民办学校摇号
   - 6月：公布录取结果

5. 所需材料：
   - 户口本
   - 房产证明
   - 居住证（非本地户籍）
   - 务工证明（随迁子女）
`;

/**
 * AI问答接口
 */
router.post('/ask', async (req, res) => {
    try {
        const { question, context } = req.body;
        
        if (!question) {
            return res.status(400).json({
                error: '问题不能为空'
            });
        }
        
        // 使用OpenAI API生成回答
        const completion = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: `你是西安小升初政策专家，请根据以下政策知识回答问题：
${POLICY_KNOWLEDGE}
                    
如果问题超出政策范围，请如实告知。
回答要简洁明了，适合家长理解。`
                },
                {
                    role: "user",
                    content: question
                }
            ],
            max_tokens: 500,
            temperature: 0.7
        });
        
        const answer = completion.data.choices[0].message.content;
        
        res.json({
            success: true,
            data: {
                question,
                answer,
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('AI服务错误:', error);
        
        // 如果API调用失败，返回预设答案
        const fallbackAnswer = getFallbackAnswer(req.body.question);
        
        res.json({
            success: true,
            data: {
                question: req.body.question,
                answer: fallbackAnswer,
                timestamp: new Date().toISOString(),
                note: '使用备用知识库回答'
            }
        });
    }
});

/**
 * 获取备用回答
 */
function getFallbackAnswer(question) {
    const lowercaseQuestion = question.toLowerCase();
    
    // 预设常见问题回答
    if (lowercaseQuestion.includes('公办') && lowercaseQuestion.includes('录取')) {
        return `公办学校按照"学区划分、免试就近入学"原则招生。具体录取顺序为：
1. 学区内户籍与实际居住地一致的适龄儿童
2. 西安市城区集体户适龄儿童
3. 符合政策的随迁子女
4. 其他符合政策的适龄儿童

需要提供的材料包括：户口本、房产证明（或租房合同）、儿童预防接种证等。`;
    }
    
    if (lowercaseQuestion.includes('民办') && lowercaseQuestion.includes('摇号')) {
        return `民办学校实行电脑随机派位（摇号）录取：
1. 每位学生只能报名一所民办初中
2. 报名人数未超过招生计划的，直接录取全部报名学生
3. 报名人数超过招生计划的，实行电脑随机录取
4. 摇号结果由公证处公证，确保公平公正

摇号时间通常在5月中旬，结果在教育局官网公布。`;
    }
    
    if (lowercaseQuestion.includes('学区房')) {
        return `学区房政策要点：
1. 学区房以房产证为准，且实际居住
2. 一套住房小学6年内、初中3年内只能安排一名适龄儿童入学
3. 购买二手房需注意前房东子女入学情况
4. 公租房、单位集资房等也属于学区房范畴

建议在教育局官网查询最新的学区划分。`;
    }
    
    if (lowercaseQuestion.includes('随迁子女')) {
        return `外来务工人员随迁子女入学条件：
1. 父母双方或一方持有西安市居住证
2. 父母双方或一方在西安有稳定工作
3. 父母双方或一方在西安缴纳社保
4. 随迁子女在户籍所在地无监护条件

需提供的材料：居住证、务工证明、社保缴纳证明、户口本、租房合同等。`;
    }
    
    return `您的问题已收到。关于"${question}"，建议您：
1. 关注西安市教育局官方网站的最新通知
2. 咨询所在学区的学校招生办公室
3. 参加教育局组织的政策宣讲会

您也可以具体描述您的情况，我会提供更有针对性的建议。`;
}

/**
 * 获取政策摘要
 */
router.get('/policy/summary', (req, res) => {
    const summaries = {
        publicSchools: {
            title: '公办学校入学政策',
            points: [
                '学区划分，免试就近入学',
                '优先安排人户一致的适龄儿童',
                '集体户、随迁子女按序安排'
            ]
        },
        privateSchools: {
            title: '民办学校招生政策',
            points: [
                '网上报名，每位学生限报一所',
                '报名超计划的实行电脑随机录取',
                '摇号过程公开透明'
            ]
        },
        materials: {
            title: '入学所需材料',
            points: [
                '户口本原件及复印件',
                '房产证明或居住证明',
                '儿童预防接种证明',
                '居住证（非本地户籍）'
            ]
        }
    };
    
    res.json({
        success: true,
        data: summaries
    });
});

/**
 * 学校推荐分析
 */
router.post('/recommend/schools', async (req, res) => {
    try {
        const userData = req.body;
        
        // 简化的推荐逻辑
        const recommendations = analyzeUserData(userData);
        
        res.json({
            success: true,
            data: {
                recommendations,
                analysis: generateAnalysis(userData),
                timestamp: new Date().toISOString()
            }
        });
        
    } catch (error) {
        console.error('推荐分析错误:', error);
        res.status(500).json({
            success: false,
            error: '分析服务暂时不可用'
        });
    }
});

/**
 * 分析用户数据（简化版）
 */
function analyzeUserData(userData) {
    // 这里应该是复杂的分析逻辑
    // 简化返回一些示例数据
    return [
        {
            schoolName: "西安市第一中学",
            matchScore: 85,
            reason: "符合学区政策，学生成绩优秀"
        },
        {
            schoolName: "高新第一学校",
            matchScore: 78,
            reason: "民办优质学校，适合您的偏好"
        }
    ];
}

/**
 * 生成分析报告
 */
function generateAnalysis(userData) {
    const strengths = [];
    const suggestions = [];
    
    if (userData.householdType === '学区内户籍') {
        strengths.push('具有学区户籍优势');
    } else {
        suggestions.push('建议提前准备居住证和务工证明');
    }
    
    if (userData.studentAbility === '优秀') {
        strengths.push('学生成绩优秀，竞争力强');
    }
    
    return {
        strengths,
        suggestions,
        overallAssessment: '情况良好，建议按计划准备'
    };
}

module.exports = router;