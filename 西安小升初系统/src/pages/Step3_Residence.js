// pages/Step3_Residence.js
class Step3_Residence {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.data = this.loadData();
        this.districts = this.getDistricts();
        this.init();
    }
    
    init() {
        if (!this.container) return;
        this.render();
        this.bindEvents();
        this.initStreetData();
    }
    
    loadData() {
        const savedData = JSON.parse(localStorage.getItem('xsc_user_data') || '{}');
        return {
            householdDistrict: savedData.householdDistrict || '',
            householdStreet: savedData.householdStreet || '',
            householdAddress: savedData.householdAddress || '',
            residenceDistrict: savedData.residenceDistrict || '',
            residenceStreet: savedData.residenceStreet || '',
            residenceAddress: savedData.residenceAddress || '',
            residenceType: savedData.residenceType || '',
            sameDistrict: savedData.sameDistrict === 'true',
            sameStreet: savedData.sameStreet === 'true',
            inSchoolDistrict: savedData.inSchoolDistrict === 'true'
        };
    }
    
    saveData() {
        localStorage.setItem('xsc_user_data', JSON.stringify({
            ...JSON.parse(localStorage.getItem('xsc_user_data') || '{}'),
            ...this.data
        }));
    }
    
    getDistricts() {
        return [
            '新城区', '碑林区', '莲湖区', '雁塔区', '灞桥区',
            '未央区', '阎良区', '临潼区', '长安区', '高陵区',
            '鄠邑区', '蓝田县', '周至县', '西咸新区',
            '高新区', '经开区', '曲江新区', 
            '浐灞国际港（浐灞片区）', '浐灞国际港（港务片区）', '航天基地',
            '外地户籍'
        ];
    }
    
    render() {
        const districtsOptions = this.districts.map(district => 
            `<option value="${district}" ${this.data.householdDistrict === district ? 'selected' : ''}>${district}</option>`
        ).join('');
        
        this.container.innerHTML = `
            <div class="step-content fade-in">
                <div class="card">
                    <div class="card-header">
                        <div class="card-icon">🏠</div>
                        <div class="card-title">户籍与居住信息</div>
                    </div>
                    <div class="card-description">
                        请准确填写户籍和实际居住信息，这将直接影响公办学校匹配和入学顺位评估
                    </div>
                    
                    <div class="two-column-grid">
                        <div class="column">
                            <h4>📍 户籍信息</h4>
                            
                            <div class="form-group">
                                <label class="form-label required">户籍所在区</label>
                                <select class="form-select" id="householdDistrict">
                                    <option value="">请选择区</option>
                                    ${districtsOptions}
                                </select>
                                <div class="form-text">选择"外地户籍"表示非西安市户籍</div>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">户籍所在街道</label>
                                <select class="form-select" id="householdStreet" ${!this.data.householdDistrict ? 'disabled' : ''}>
                                    <option value="">${this.data.householdDistrict ? '请选择街道' : '请先选择区'}</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">户籍详细地址（可选）</label>
                                <input type="text" class="form-control" id="householdAddress" 
                                       placeholder="例如：XX小区XX号楼XX单元" value="${this.data.householdAddress}">
                            </div>
                        </div>
                        
                        <div class="column">
                            <h4>🏡 实际居住信息</h4>
                            
                            <div class="form-group">
                                <label class="form-label required">实际居住区</label>
                                <select class="form-select" id="residenceDistrict">
                                    <option value="">请选择区</option>
                                    ${districtsOptions.replace('外地户籍', '')}
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">实际居住街道</label>
                                <select class="form-select" id="residenceStreet" ${!this.data.residenceDistrict ? 'disabled' : ''}>
                                    <option value="">${this.data.residenceDistrict ? '请选择街道' : '请先选择区'}</option>
                                </select>
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">居住详细地址</label>
                                <input type="text" class="form-control" id="residenceAddress" 
                                       placeholder="例如：XX小区XX号楼XX单元" value="${this.data.residenceAddress}">
                            </div>
                            
                            <div class="form-group">
                                <label class="form-label">居住性质</label>
                                <select class="form-select" id="residenceType">
                                    <option value="">请选择</option>
                                    <option value="自有房产" ${this.data.residenceType === '自有房产' ? 'selected' : ''}>自有房产</option>
                                    <option value="租房" ${this.data.residenceType === '租房' ? 'selected' : ''}>租房</option>
                                    <option value="单位宿舍" ${this.data.residenceType === '单位宿舍' ? 'selected' : ''}>单位宿舍</option>
                                    <option value="其他" ${this.data.residenceType === '其他' ? 'selected' : ''}>其他</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    <div class="form-group mt-20">
                        <label class="form-label">户籍与居住地匹配情况</label>
                        <div class="checkbox-group">
                            <label class="checkbox-label">
                                <input type="checkbox" id="sameDistrict" ${this.data.sameDistrict ? 'checked' : ''}>
                                户籍区与居住区相同
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="sameStreet" ${this.data.sameStreet ? 'checked' : ''}>
                                户籍街道与居住街道相同
                            </label>
                            <label class="checkbox-label">
                                <input type="checkbox" id="inSchoolDistrict" ${this.data.inSchoolDistrict ? 'checked' : ''}>
                                在学区内居住
                            </label>
                        </div>
                    </div>
                    
                    <div class="transport-info mt-20 p-15 bg-gray-50 rounded">
                        <h5>🚗 交通便利性评估</h5>
                        <p style="font-size: 14px; color: #4a5568;">
                            系统将根据您的居住位置评估到推荐学校的通勤时间，优先推荐交通便利的学校。
                            <br>建议考虑：距离、公共交通、校车线路等因素。
                        </p>
                    </div>
                </div>
                
                <div class="info-box bg-blue-50 border-blue-200 p-20 mt-20">
                    <h4><i class="fas fa-graduation-cap"></i> 入学顺位说明</h4>
                    <div class="priority-list">
                        <div class="priority-item ${this.data.householdDistrict === this.data.residenceDistrict && this.data.residenceType === '自有房产' ? 'active' : ''}">
                            <span class="priority-number">1</span>
                            <span class="priority-text">第一顺位：房户一致，且在学区内居住</span>
                        </div>
                        <div class="priority-item ${this.data.householdDistrict === this.data.residenceDistrict && this.data.residenceType !== '自有房产' ? 'active' : ''}">
                            <span class="priority-number">2</span>
                            <span class="priority-text">第二顺位：房户一致，但跨学区居住</span>
                        </div>
                        <div class="priority-item ${this.data.householdDistrict !== this.data.residenceDistrict ? 'active' : ''}">
                            <span class="priority-number">3</span>
                            <span class="priority-text">第三顺位：集体户/挂靠户，无学区房</span>
                        </div>
                        <div class="priority-item ${this.data.residenceType === '租房' ? 'active' : ''}">
                            <span class="priority-number">4</span>
                            <span class="priority-text">第四顺位：租房居住，统筹安排入学</span>
                        </div>
                    </div>
                    <p class="mt-10" style="color: #1e40af; font-size: 14px;">
                        当前预估顺位：<strong>${this.calculatePriority()}</strong>
                    </p>
                </div>
            </div>
        `;
        
        // 填充街道数据
        this.populateStreets('householdDistrict', 'householdStreet', this.data.householdStreet);
        this.populateStreets('residenceDistrict', 'residenceStreet', this.data.residenceStreet);
    }
    
    bindEvents() {
        // 户籍区选择
        const householdDistrict = document.getElementById('householdDistrict');
        if (householdDistrict) {
            householdDistrict.addEventListener('change', (e) => {
                this.data.householdDistrict = e.target.value;
                this.data.householdStreet = ''; // 清空街道
                this.saveData();
                this.populateStreets('householdDistrict', 'householdStreet', '');
                
                // 自动判断是否相同
                this.autoCheckSameDistrict();
            });
        }
        
        // 户籍街道选择
        const householdStreet = document.getElementById('householdStreet');
        if (householdStreet) {
            householdStreet.addEventListener('change', (e) => {
                this.data.householdStreet = e.target.value;
                this.saveData();
                this.autoCheckSameStreet();
            });
        }
        
        // 户籍地址输入
        const householdAddress = document.getElementById('householdAddress');
        if (householdAddress) {
            householdAddress.addEventListener('input', (e) => {
                this.data.householdAddress = e.target.value;
                this.saveData();
            });
        }
        
        // 居住区选择
        const residenceDistrict = document.getElementById('residenceDistrict');
        if (residenceDistrict) {
            residenceDistrict.addEventListener('change', (e) => {
                this.data.residenceDistrict = e.target.value;
                this.data.residenceStreet = ''; // 清空街道
                this.saveData();
                this.populateStreets('residenceDistrict', 'residenceStreet', '');
                
                // 自动判断是否相同
                this.autoCheckSameDistrict();
            });
        }
        
        // 居住街道选择
        const residenceStreet = document.getElementById('residenceStreet');
        if (residenceStreet) {
            residenceStreet.addEventListener('change', (e) => {
                this.data.residenceStreet = e.target.value;
                this.saveData();
                this.autoCheckSameStreet();
            });
        }
        
        // 居住地址输入
        const residenceAddress = document.getElementById('residenceAddress');
        if (residenceAddress) {
            residenceAddress.addEventListener('input', (e) => {
                this.data.residenceAddress = e.target.value;
                this.saveData();
            });
        }
        
        // 居住性质选择
        const residenceType = document.getElementById('residenceType');
        if (residenceType) {
            residenceType.addEventListener('change', (e) => {
                this.data.residenceType = e.target.value;
                this.saveData();
            });
        }
        
        // 复选框
        const sameDistrict = document.getElementById('sameDistrict');
        const sameStreet = document.getElementById('sameStreet');
        const inSchoolDistrict = document.getElementById('inSchoolDistrict');
        
        if (sameDistrict) {
            sameDistrict.addEventListener('change', (e) => {
                this.data.sameDistrict = e.target.checked;
                this.saveData();
            });
        }
        
        if (sameStreet) {
            sameStreet.addEventListener('change', (e) => {
                this.data.sameStreet = e.target.checked;
                this.saveData();
            });
        }
        
        if (inSchoolDistrict) {
            inSchoolDistrict.addEventListener('change', (e) => {
                this.data.inSchoolDistrict = e.target.checked;
                this.saveData();
            });
        }
    }
    
    initStreetData() {
        // 等待DOM加载完成后初始化街道数据
        setTimeout(() => {
            if (this.data.householdDistrict) {
                this.populateStreets('householdDistrict', 'householdStreet', this.data.householdStreet);
            }
            if (this.data.residenceDistrict) {
                this.populateStreets('residenceDistrict', 'residenceStreet', this.data.residenceStreet);
            }
        }, 100);
    }
    
    populateStreets(districtSelectId, streetSelectId, selectedValue) {
        const districtSelect = document.getElementById(districtSelectId);
        const streetSelect = document.getElementById(streetSelectId);
        
        if (!districtSelect || !streetSelect) return;
        
        const district = districtSelect.value;
        
        if (!district) {
            streetSelect.innerHTML = '<option value="">请先选择区</option>';
            streetSelect.disabled = true;
            return;
        }
        
        // 获取街道数据
        const streets = window.getStreetsByDistrict ? window.getStreetsByDistrict(district) : [];
        
        streetSelect.innerHTML = '<option value="">请选择街道</option>';
        
        if (streets && streets.length > 0) {
            streets.forEach(street => {
                const option = document.createElement('option');
                option.value = street;
                option.textContent = street;
                if (street === selectedValue) {
                    option.selected = true;
                }
                streetSelect.appendChild(option);
            });
            streetSelect.disabled = false;
        } else {
            streetSelect.innerHTML = '<option value="">该区暂无街道数据</option>';
            streetSelect.disabled = false;
        }
    }
    
    autoCheckSameDistrict() {
        const householdDistrict = document.getElementById('householdDistrict');
        const residenceDistrict = document.getElementById('residenceDistrict');
        const sameDistrict = document.getElementById('sameDistrict');
        
        if (householdDistrict && residenceDistrict && sameDistrict) {
            const isSame = householdDistrict.value === residenceDistrict.value && 
                          householdDistrict.value !== '' && 
                          residenceDistrict.value !== '';
            
            sameDistrict.checked = isSame;
            this.data.sameDistrict = isSame;
            this.saveData();
        }
    }
    
    autoCheckSameStreet() {
        const householdStreet = document.getElementById('householdStreet');
        const residenceStreet = document.getElementById('residenceStreet');
        const sameStreet = document.getElementById('sameStreet');
        
        if (householdStreet && residenceStreet && sameStreet) {
            const isSame = householdStreet.value === residenceStreet.value && 
                          householdStreet.value !== '' && 
                          residenceStreet.value !== '';
            
            sameStreet.checked = isSame;
            this.data.sameStreet = isSame;
            this.saveData();
        }
    }
    
    calculatePriority() {
        const { householdDistrict, residenceDistrict, residenceType } = this.data;
        
        if (!householdDistrict || !residenceDistrict) {
            return '请填写完整信息';
        }
        
        if (householdDistrict === '外地户籍') {
            return '随迁子女，第四顺位';
        }
        
        if (householdDistrict === residenceDistrict && residenceType === '自有房产') {
            return '第一顺位（房户一致）';
        }
        
        if (householdDistrict === residenceDistrict && residenceType !== '自有房产') {
            return '第二顺位（房户一致但租房）';
        }
        
        if (householdDistrict !== residenceDistrict && residenceType === '自有房产') {
            return '第三顺位（房户不一致）';
        }
        
        if (residenceType === '租房') {
            return '第四顺位（租房）';
        }
        
        return '第三顺位（统筹安排）';
    }
    
    validate() {
        const errors = [];
        
        if (!this.data.householdDistrict) {
            errors.push('请选择户籍所在区');
        }
        
        if (!this.data.residenceDistrict) {
            errors.push('请选择实际居住区');
        }
        
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return false;
        }
        
        return true;
    }
    
    getData() {
        return this.data;
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.Step3_Residence = Step3_Residence;
}