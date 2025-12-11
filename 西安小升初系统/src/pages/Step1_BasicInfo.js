// pages/Step1_BasicInfo.js
class Step1_BasicInfo {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = this.loadData();
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.bindEvents();
    }
    
    loadData() {
        // 从本地存储加载数据
        const savedData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        return {
            studentName: savedData.studentName || '',
            studentGender: savedData.studentGender || '',
            currentSchool: savedData.currentSchool || '',
            currentGrade: savedData.currentGrade || '六年级'
        };
    }
    
    saveData() {
        localStorage.setItem('xsc_user_data', JSON.stringify(this.data));
    }
    
    render() {
        const { studentName, studentGender, currentSchool, currentGrade } = this.data;
        
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🎓</div>
                        <div class="card-title">学生当前年级</div>
                    </div>
                    <div class="card-description">
                        选择学生当前所在年级，用于精确的时间规划
                    </div>
                    
                    <div class="score-options">
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade6" value="六年级" 
                                   ${currentGrade === '六年级' ? 'checked' : ''}>
                            <label for="grade6" class="score-label">
                                <span class="score-number">六年级</span>
                                <span class="score-desc">2026年小升初</span>
                            </label>
                        </div>
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade5" value="五年级"
                                   ${currentGrade === '五年级' ? 'checked' : ''}>
                            <label for="grade5" class="score-label">
                                <span class="score-number">五年级</span>
                                <span class="score-desc">2027年小升初</span>
                            </label>
                        </div>
                        <div class="score-option">
                            <input type="radio" name="currentGrade" id="grade4" value="四年级"
                                   ${currentGrade === '四年级' ? 'checked' : ''}>
                            <label for="grade4" class="score-label">
                                <span class="score-number">四年级</span>
                                <span class="score-desc">2028年小升初</span>
                            </label>
                        </div>
                    </div>
                </div>

                <div class="card mt-20">
                    <div class="card-header">
                        <div class="card-icon">👦</div>
                        <div class="card-title">学生基本信息</div>
                    </div>
                    <div class="card-description">
                        填写学生基本资料（均为可选，如需要更精准的推荐建议填写）
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">学生姓名（可选）</label>
                        <input type="text" class="form-control" id="studentName" 
                               placeholder="请输入学生姓名" value="${studentName}">
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">学生性别</label>
                        <select class="form-select" id="studentGender">
                            <option value="">请选择</option>
                            <option value="男" ${studentGender === '男' ? 'selected' : ''}>男生</option>
                            <option value="女" ${studentGender === '女' ? 'selected' : ''}>女生</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label class="form-label">所在小学（可选）</label>
                        <input type="text" class="form-control" id="currentSchool" 
                               placeholder="请输入所在小学名称" value="${currentSchool}">
                    </div>
                </div>
                
                <div class="info-box bg-blue-50 border-blue-200 p-20 mt-20">
                    <h4><i class="fas fa-lightbulb"></i> 温馨提示</h4>
                    <p>填写详细信息有助于获得更精准的学校推荐和时间规划，但所有信息均为可选。</p>
                    <p>系统会严格保护您的隐私，所有数据仅存储在您的浏览器本地。</p>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // 年级选择
        const gradeRadios = this.container.querySelectorAll('input[name="currentGrade"]');
        gradeRadios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                this.data.currentGrade = e.target.value;
                this.saveData();
            });
        });
        
        // 姓名输入
        const nameInput = this.container.querySelector('#studentName');
        if (nameInput) {
            nameInput.addEventListener('input', (e) => {
                this.data.studentName = e.target.value;
                this.saveData();
            });
        }
        
        // 性别选择
        const genderSelect = this.container.querySelector('#studentGender');
        if (genderSelect) {
            genderSelect.addEventListener('change', (e) => {
                this.data.studentGender = e.target.value;
                this.saveData();
            });
        }
        
        // 学校输入
        const schoolInput = this.container.querySelector('#currentSchool');
        if (schoolInput) {
            schoolInput.addEventListener('input', (e) => {
                this.data.currentSchool = e.target.value;
                this.saveData();
            });
        }
    }
    
    validate() {
        // 步骤1无需强制验证，所有信息都是可选的
        return true;
    }
    
    getData() {
        return this.data;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step1_BasicInfo = Step1_BasicInfo;
}