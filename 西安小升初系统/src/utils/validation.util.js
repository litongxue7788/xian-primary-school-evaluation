/**
 * 表单验证工具函数
 */

class ValidationUtil {
    /**
     * 验证手机号码
     * @param {string} phone - 手机号码
     * @returns {Object} 验证结果
     */
    static validatePhone(phone) {
        const phoneRegex = /^1[3-9]\d{9}$/;
        const isValid = phoneRegex.test(phone);
        
        return {
            isValid: isValid,
            message: isValid ? '' : '请输入正确的11位手机号码',
            type: 'phone'
        };
    }
    
    /**
     * 验证身份证号码
     * @param {string} idCard - 身份证号码
     * @returns {Object} 验证结果
     */
    static validateIDCard(idCard) {
        // 简化的身份证验证（实际应更复杂）
        const idCardRegex = /^\d{17}[\dXx]$/;
        const isValid = idCardRegex.test(idCard);
        
        return {
            isValid: isValid,
            message: isValid ? '' : '请输入正确的身份证号码',
            type: 'idCard'
        };
    }
    
    /**
     * 验证日期格式
     * @param {string} date - 日期字符串
     * @param {string} format - 日期格式
     * @returns {Object} 验证结果
     */
    static validateDate(date, format = 'YYYY-MM-DD') {
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        const isValid = dateRegex.test(date);
        
        if (isValid) {
            const dateObj = new Date(date);
            const isValidDate = !isNaN(dateObj.getTime());
            return {
                isValid: isValidDate,
                message: isValidDate ? '' : '请输入有效的日期',
                type: 'date'
            };
        }
        
        return {
            isValid: false,
            message: '日期格式应为 YYYY-MM-DD',
            type: 'date'
        };
    }
    
    /**
     * 验证必填字段
     */
    static validateRequired(value, fieldName) {
        const isValid = value !== null && value !== undefined && value !== '';
        
        return {
            isValid: isValid,
            message: isValid ? '' : `${fieldName}为必填项`,
            type: 'required'
        };
    }
    
    /**
     * 验证数字范围
     */
    static validateNumberRange(value, min, max) {
        const num = Number(value);
        const isValid = !isNaN(num) && num >= min && num <= max;
        
        return {
            isValid: isValid,
            message: isValid ? '' : `请输入${min}到${max}之间的数字`,
            type: 'range'
        };
    }
    
    /**
     * 批量验证字段
     */
    static validateForm(fields) {
        const errors = [];
        
        for (const [fieldName, rules] of Object.entries(fields)) {
            for (const rule of rules) {
                const result = this.validateField(rule.value, rule.type, rule.params);
                if (!result.isValid) {
                    errors.push({
                        field: fieldName,
                        message: result.message,
                        type: result.type
                    });
                    break; // 每个字段只显示第一个错误
                }
            }
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    /**
     * 验证单个字段
     */
    static validateField(value, type, params = {}) {
        switch (type) {
            case 'required':
                return this.validateRequired(value, params.fieldName || '字段');
            case 'phone':
                return this.validatePhone(value);
            case 'idCard':
                return this.validateIDCard(value);
            case 'date':
                return this.validateDate(value, params.format);
            case 'number':
                return this.validateNumberRange(value, params.min, params.max);
            default:
                return { isValid: true, message: '', type: 'unknown' };
        }
    }
}

export default ValidationUtil;