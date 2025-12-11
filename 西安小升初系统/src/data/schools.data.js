// src/data/schools.data.js
const SCHOOLS_DATA = {
    // 西安市公办初中数据
    publicSchools: [
        {
            id: 1,
            name: "西安市铁一中学",
            type: "公办",
            district: "碑林区",
            level: "省级示范",
            admissionType: "学区对口",
            features: ["理科突出", "严格管理", "社团丰富"],
            contact: "029-87654321",
            address: "西安市碑林区友谊东路120号"
        },
        // 更多学校数据...
    ],
    
    // 西安市民办初中数据
    privateSchools: [
        {
            id: 101,
            name: "西安高新第一中学初中校区",
            type: "民办",
            district: "高新区",
            level: "省级示范",
            tuition: "12000元/学期",
            enrollment: "摇号录取",
            admissionRate: "约15%",
            features: ["科技创新", "国际化", "小班教学"],
            contact: "029-88888888",
            address: "西安市高新区唐延路23号"
        },
        // 更多学校数据...
    ]
};

// 导出数据
if (typeof window !== 'undefined') {
    window.SCHOOLS_DATA = SCHOOLS_DATA;
}