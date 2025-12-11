// 步骤指示器组件
class StepIndicator {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            steps: [
                { number: 1, label: '基础信息' },
                { number: 2, label: '能力评估' },
                { number: 3, label: '户籍居住' },
                { number: 4, label: '学区房产' },
                { number: 5, label: '民办意向' },
                { number: 6, label: '能力分析' },
                { number: 7, label: 'AI推荐' }
            ],
            currentStep: 1,
            onChange: null,
            ...options
        };
        
        this.init();
    }
    
    init() {
        if (!this.container) return;
        
        this.render();
        this.bindEvents();
    }
    
    render() {
        const { steps, currentStep } = this.options;
        
        this.container.innerHTML = `
            <div class="step-indicator">
                ${steps.map(step => `
                    <div class="step-item ${step.number === currentStep ? 'active' : ''} ${step.number < currentStep ? 'completed' : ''}" 
                         data-step="${step.number}">
                        <div class="step-number">
                            ${step.number < currentStep ? '✓' : step.number}
                        </div>
                        <div class="step-label">${step.label}</div>
                        <div class="step-line"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    bindEvents() {
        const stepItems = this.container.querySelectorAll('.step-item');
        stepItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const step = parseInt(item.dataset.step);
                if (this.options.onChange && typeof this.options.onChange === 'function') {
                    this.options.onChange(step);
                }
            });
        });
    }
    
    update(currentStep) {
        this.options.currentStep = currentStep;
        this.render();
    }
    
    completeStep(stepNumber) {
        const stepItem = this.container.querySelector(`[data-step="${stepNumber}"]`);
        if (stepItem) {
            stepItem.classList.add('completed');
        }
    }
}

// 导出
if (typeof window !== 'undefined') {
    window.StepIndicator = StepIndicator;
}