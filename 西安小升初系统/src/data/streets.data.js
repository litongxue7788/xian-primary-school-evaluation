// 西安市各区街道数据
const STREETS_DATA = {
    '新城区': [
        '西一路街道', '长乐中路街道', '中山门街道', '韩森寨街道', 
        '解放门街道', '长乐西路街道', '太华路街道', '自强路街道'
    ],
    
    '碑林区': [
        '南院门街道', '柏树林街道', '长乐坊街道', '东关南街街道',
        '太乙路街道', '文艺路街道', '长安路街道', '张家村街道'
    ],
    
    '莲湖区': [
        '北院门街道', '青年路街道', '桃园路街道', '北关街道',
        '红庙坡街道', '环城西路街道', '土门街道', '枣园街道', '西关街道'
    ],
    
    '雁塔区': [
        '小寨路街道', '大雁塔街道', '长延堡街道', '电子城街道',
        '等驾坡街道', '鱼化寨街道', '丈八沟街道', '曲江街道'
    ],
    
    '灞桥区': [
        '纺织城街道', '十里铺街道', '红旗街道', '洪庆街道',
        '席王街道', '新筑街道', '狄寨街道'
    ],
    
    '未央区': [
        '未央宫街道', '大明宫街道', '张家堡街道', '徐家湾街道',
        '谭家街道', '草滩街道', '六村堡街道', '未央湖街道', '汉城街道'
    ],
    
    '阎良区': [
        '新华路街道', '凤凰路街道', '进步路街道', '胜利路街道',
        '新兴街道', '武屯街道', '关山街道'
    ],
    
    '临潼区': [
        '骊山街道', '秦陵街道', '新市街道', '代王街道',
        '斜口街道', '行者街道', '零口街道', '相桥街道', '雨金街道', '新丰街道'
    ],
    
    '长安区': [
        '韦曲街道', '郭杜街道', '滦镇街道', '兴隆街道',
        '大兆街道', '鸣犊街道', '朝曲街道', '五台街道',
        '高桥街道', '引镇街道', '王莽街道', '子午街道', '太乙宫街道'
    ],
    
    '高陵区': [
        '鹿苑街道', '泾渭街道', '崇皇街道', '通远街道',
        '张卜街道', '湾子镇', '耿镇'
    ],
    
    '鄠邑区': [
        '甘亭街道', '余下街道', '祖庵镇', '秦渡镇',
        '草堂镇', '庞光镇', '蒋村镇', '涝店镇', '石井镇', '玉蒿镇'
    ],
    
    '蓝田县': [
        '蓝关街道', '洩湖镇', '华胥镇', '吉卫镇',
        '汤峪镇', '焦岱镇', '玉山镇', '三里镇', '普化镇', '葛牌镇'
    ],
    
    '周至县': [
        '二曲街道', '哑柏镇', '终南镇', '马召镇',
        '集贤镇', '楼观镇', '尚村镇', '广济镇', '富仁镇', '竹峪镇'
    ],
    
    '西咸新区': [
        '三桥街道', '上林街道', '王寺街道', '斗门街道',
        '沣京街道', '建章路街道', '钓台街道', '高桥街道',
        '马王街道', '窑店街道', '正阳街道', '周陵街道',
        '渭城街道', '北杜街道', '底张街道', '永乐镇'
    ],
    
    '高新区': [
        '丈八街道', '鱼化寨街道', '细柳街道', '兴隆街道',
        '东大街道', '五星街道', '灵沼街道'
    ],
    
    '经开区': [
        '张家堡街道', '未央湖街道', '草滩街道', '六村堡街道',
        '凤城一路街道', '凤城二路街道', '凤城三路街道',
        '凤城四路街道', '凤城五路街道', '凤城六路街道'
    ],
    
    '曲江新区': [
        '曲江街道', '雁南街道', '雁塔中路街道', '雁翔路街道'
    ],
    
    '浐灞国际港（浐灞片区）': [
        '广运潭街道', '雁鸣湖街道', '新筑街道', '浐灞大道街道'
    ],
    
    '浐灞国际港（港务片区）': [
        '新筑街道', '港务西路街道', '港务东路街道', '新合街道'
    ],
    
    '航天基地': [
        '航天大道街道', '东长安街道', '神舟四路街道', '神舟五路街道'
    ]
};

// 拼音转换工具函数
const PINYIN_MAP = {
    '新': 'xin', '城': 'cheng', '区': 'qu',
    '碑': 'bei', '林': 'lin',
    '莲': 'lian', '湖': 'hu',
    '雁': 'yan', '塔': 'ta',
    '灞': 'ba', '桥': 'qiao',
    '未': 'wei', '央': 'yang',
    '阎': 'yan', '良': 'liang',
    '临': 'lin', '潼': 'tong',
    '长': 'chang', '安': 'an',
    '高': 'gao', '陵': 'ling',
    '鄠': 'hu', '邑': 'yi',
    '蓝': 'lan', '田': 'tian',
    '周': 'zhou', '至': 'zhi',
    '西': 'xi', '咸': 'xian',
    '经': 'jing', '开': 'kai',
    '曲': 'qu', '江': 'jiang',
    '浐': 'chan', '灞': 'ba',
    '航': 'hang', '天': 'tian', '基': 'ji', '地': 'di',
    '一': 'yi', '二': 'er', '三': 'san', '四': 'si', '五': 'wu', '六': 'liu', '七': 'qi', '八': 'ba', '九': 'jiu', '十': 'shi',
    '东': 'dong', '南': 'nan', '北': 'bei', '中': 'zhong',
    '路': 'lu', '街': 'jie', '道': 'dao',
    '太': 'tai', '华': 'hua', '乙': 'yi',
    '自': 'zi', '强': 'qiang',
    '解': 'jie', '放': 'fang', '门': 'men',
    '韩': 'han', '森': 'sen', '寨': 'zhai',
    '文': 'wen', '艺': 'yi',
    '张': 'zhang', '家': 'jia', '村': 'cun',
    '青': 'qing', '年': 'nian',
    '桃': 'tao', '园': 'yuan',
    '红': 'hong', '庙': 'miao', '坡': 'po',
    '环': 'huan', '土': 'tu',
    '枣': 'zao',
    '小': 'xiao',
    '大': 'da',
    '延': 'yan', '堡': 'bao',
    '电': 'dian', '子': 'zi',
    '等': 'deng', '驾': 'jia',
    '鱼': 'yu', '化': 'hua',
    '丈': 'zhang',
    '纺': 'fang', '织': 'zhi',
    '里': 'li', '铺': 'pu',
    '旗': 'qi',
    '洪': 'hong', '庆': 'qing',
    '席': 'xi', '王': 'wang',
    '筑': 'zhu',
    '狄': 'di',
    '宫': 'gong',
    '明': 'ming',
    '徐': 'xu', '湾': 'wan',
    '谭': 'tan',
    '草': 'cao', '滩': 'tan',
    '汉': 'han',
    '凤': 'feng', '凰': 'huang',
    '进': 'jin',
    '胜': 'sheng', '利': 'li',
    '兴': 'xing',
    '武': 'wu', '屯': 'tun',
    '关': 'guan', '山': 'shan',
    '骊': 'li',
    '秦': 'qin',
    '市': 'shi',
    '代': 'dai',
    '斜': 'xie', '口': 'kou',
    '行': 'xing', '者': 'zhe',
    '零': 'ling',
    '相': 'xiang',
    '雨': 'yu', '金': 'jin',
    '丰': 'feng',
    '泉': 'quan',
    '韦': 'wei',
    '郭': 'guo', '杜': 'du',
    '滦': 'luan', '镇': 'zhen',
    '兆': 'zhao',
    '鸣': 'ming', '犊': 'du',
    '朝': 'chao',
    '台': 'tai',
    '引': 'yin',
    '孙': 'sun', '合': 'he',
    '甘': 'gan', '亭': 'ting',
    '余': 'yu', '下': 'xia',
    '祖': 'zu', '庵': 'an',
    '渡': 'du',
    '堂': 'tang',
    '庞': 'pang', '光': 'guang',
    '蒋': 'jiang',
    '店': 'dian',
    '石': 'shi', '井': 'jing',
    '玉': 'yu', '蒿': 'hao',
    '洩': 'xie',
    '胥': 'xu',
    '吉': 'ji', '卫': 'wei',
    '汤': 'tang', '峪': 'yu',
    '焦': 'jiao', '岱': 'dai',
    '普': 'pu',
    '葛': 'ge', '牌': 'pai',
    '瞿': 'qu', '源': 'yuan',
    '孟': 'meng',
    '辋': 'wang', '川': 'chuan',
    '哑': 'ya', '柏': 'bai',
    '终': 'zhong',
    '马': 'ma', '召': 'zhao',
    '集': 'ji', '贤': 'xian',
    '楼': 'lou', '观': 'guan',
    '尚': 'shang',
    '广': 'guang', '济': 'ji',
    '富': 'fu', '仁': 'ren',
    '竹': 'zhu',
    '上': 'shang',
    '斗': 'dou',
    '沣': 'feng', '京': 'jing',
    '建': 'jian', '章': 'zhang',
    '钓': 'diao',
    '正': 'zheng', '阳': 'yang',
    '渭': 'wei',
    '底': 'di',
    '永': 'yong', '乐': 'le',
    '泾': 'jing', '干': 'gan',
    '崇': 'chong',
    '庄': 'zhuang',
    '细': 'xi', '柳': 'liu',
    '灵': 'ling', '沼': 'zhao',
    '港': 'gang', '务': 'wu',
    '运': 'yun',
    '神': 'shen', '舟': 'zhou',
    '外': 'wai', '片': 'pian'
};

// 将文本转换为拼音
function toPinyin(text) {
    if (!text) return '';
    let result = '';
    for (let char of text) {
        result += PINYIN_MAP[char] || char;
    }
    return result.toLowerCase();
}

// 获取拼音首字母
function getPinyinInitials(text) {
    if (!text) return '';
    let result = '';
    for (let char of text) {
        const py = PINYIN_MAP[char];
        if (py) {
            result += py[0];
        }
    }
    return result.toLowerCase();
}

// 街道搜索功能
function searchStreets(keyword, district = null) {
    const kw = keyword.toLowerCase().trim();
    if (!kw) return [];
    
    let results = [];
    
    if (district && STREETS_DATA[district]) {
        // 在指定区内搜索
        results = STREETS_DATA[district].filter(street => {
            const streetPinyin = toPinyin(street);
            const streetInitials = getPinyinInitials(street);
            return street.toLowerCase().includes(kw) || 
                   streetPinyin.includes(kw) || 
                   streetInitials.includes(kw);
        });
    } else {
        // 全局搜索
        for (const [dist, streets] of Object.entries(STREETS_DATA)) {
            streets.forEach(street => {
                const streetPinyin = toPinyin(street);
                const streetInitials = getPinyinInitials(street);
                if (street.toLowerCase().includes(kw) || 
                    streetPinyin.includes(kw) || 
                    streetInitials.includes(kw)) {
                    results.push({
                        district: dist,
                        street: street,
                        pinyin: streetPinyin,
                        initials: streetInitials
                    });
                }
            });
        }
    }
    
    return results;
}

// 获取区的所有街道
function getStreetsByDistrict(district) {
    return STREETS_DATA[district] || [];
}

// 导出
if (typeof window !== 'undefined') {
    window.STREETS_DATA = STREETS_DATA;
    window.toPinyin = toPinyin;
    window.getPinyinInitials = getPinyinInitials;
    window.searchStreets = searchStreets;
    window.getStreetsByDistrict = getStreetsByDistrict;
}

// 如果使用ES6模块
export {
    STREETS_DATA,
    toPinyin,
    getPinyinInitials,
    searchStreets,
    getStreetsByDistrict
};