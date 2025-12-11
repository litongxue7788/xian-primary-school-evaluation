// src/data/policy.data.js
const POLICY_DATA = {
    year: 2025,
    keyDates: {
        registrationStart: "2025-07-11",
        registrationEnd: "2025-07-24",
        lotteryDate: "2025-07-30",
        admissionNotification: "2025-08-10"
    },
    rules: {
        // 入学顺位规则
        admissionPriority: [
            "第一顺位：房户一致，且在学区内居住",
            "第二顺位：房户一致，但跨学区居住",
            "第三顺位：集体户/挂靠户，无学区房",
            "第四顺位：租房居住，统筹安排入学"
        ],
        // 民办学校规则
        privateSchoolRules: [
            "全市28所民办初中实行摇号录取",
            "每个学生只能填报1所民办学校",
            "未被民办录取的学生，由教育局统筹安排公办入学"
        ],
        // 随迁子女政策
        migrantChildren: [
            "需提供居住证",
            "需提供务工证明",
            "需提供户籍证明",
            "由居住证所在区统筹安排入学"
        ]
    },
    statistics: {
        totalPrivateSchools: 28,
        totalEnrollment: 12361,
        publicSchoolCount: 156
    }
};

// 导出数据
if (typeof window !== 'undefined') {
    window.POLICY_DATA = POLICY_DATA;
}