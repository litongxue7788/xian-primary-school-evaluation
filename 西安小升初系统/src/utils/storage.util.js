// src/utils/storage.util.js
class StorageUtil {
    static setItem(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('保存数据失败:', error);
            return false;
        }
    }
    
    static getItem(key, defaultValue = null) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : defaultValue;
        } catch (error) {
            console.error('读取数据失败:', error);
            return defaultValue;
        }
    }
    
    static removeItem(key) {
        localStorage.removeItem(key);
    }
    
    static clear() {
        localStorage.clear();
    }
    
    // 保存用户数据
    static saveUserData(data) {
        return this.setItem('xsc_user_data', data);
    }
    
    // 获取用户数据
    static getUserData() {
        return this.getItem('xsc_user_data', {});
    }
    
    // 保存配置
    static saveConfig(config) {
        return this.setItem('xsc_config', config);
    }
    
    // 获取配置
    static getConfig() {
        return this.getItem('xsc_config', {
            aiProvider: 'bailian',
            apiKey: '',
            appId: '',
            isConnected: false
        });
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.StorageUtil = StorageUtil;
}