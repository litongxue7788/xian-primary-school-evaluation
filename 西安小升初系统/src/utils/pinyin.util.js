/**
 * 拼音工具函数
 * 用于处理中文字符转拼音
 */

class PinyinUtil {
    /**
     * 获取汉字的首字母
     * @param {string} chinese - 中文字符串
     * @returns {string} 拼音首字母大写
     */
    static getPinyinInitials(chinese) {
        if (!chinese || typeof chinese !== 'string') return '';
        
        // 简化的拼音映射表（实际项目中应使用完整拼音库）
        const pinyinMap = {
            '啊': 'A', '阿': 'A', '艾': 'A', '安': 'A',
            '白': 'B', '百': 'B', '包': 'B', '贝': 'B',
            '蔡': 'C', '曹': 'C', '陈': 'C', '程': 'C',
            '大': 'D', '戴': 'D', '邓': 'D', '丁': 'D',
            '俄': 'E', '恩': 'E', '儿': 'E', '尔': 'E',
            '方': 'F', '冯': 'F', '付': 'F', '范': 'F',
            '高': 'G', '郭': 'G', '葛': 'G', '顾': 'G',
            '何': 'H', '黄': 'H', '胡': 'H', '韩': 'H',
            // ... 其他常用字
            '西': 'X', '安': 'A', '市': 'S',
            '碑': 'B', '林': 'L', '区': 'Q',
            '雁': 'Y', '塔': 'T', '新': 'X', '城': 'C'
        };
        
        return chinese.split('').map(char => {
            return pinyinMap[char] || char;
        }).join('');
    }
    
    /**
     * 获取姓名的拼音格式
     * @param {string} name - 中文姓名
     * @returns {Object} 包含各种拼音格式的对象
     */
    static getFormattedPinyin(name) {
        const initials = this.getPinyinInitials(name);
        return {
            initials: initials,
            full: this.convertToFullPinyin(name),
            capitalized: this.capitalizePinyin(name)
        };
    }
    
    /**
     * 转换为完整拼音（简化版本）
     */
    static convertToFullPinyin(name) {
        // 简化的完整拼音映射
        const fullPinyinMap = {
            '西安': 'XiAn',
            '碑林': 'BeiLin',
            '雁塔': 'YanTa',
            '新城': 'XinCheng'
        };
        
        return fullPinyinMap[name] || name;
    }
    
    /**
     * 拼音首字母大写
     */
    static capitalizePinyin(text) {
        return text.replace(/\b\w/g, char => char.toUpperCase());
    }
}

export default PinyinUtil;