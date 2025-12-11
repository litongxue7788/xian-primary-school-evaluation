/**
 * PDF生成服务
 * 用于生成评估报告PDF
 */

class PDFService {
    constructor() {
        this.isGenerating = false;
    }
    
    /**
     * 生成评估报告PDF
     */
    async generateReport(reportData, options = {}) {
        if (this.isGenerating) {
            throw new Error('PDF正在生成中，请稍候');
        }
        
        this.isGenerating = true;
        
        try {
            // 这里使用jsPDF库，需要先引入
            // 简化的实现，实际需要安装jsPDF库
            
            const pdfContent = this.createPDFContent(reportData);
            
            if (options.download) {
                await this.downloadPDF(pdfContent, options.filename);
            }
            
            if (options.preview) {
                this.previewPDF(pdfContent);
            }
            
            return pdfContent;
            
        } catch (error) {
            console.error('生成PDF失败:', error);
            throw error;
        } finally {
            this.isGenerating = false;
        }
    }
    
    /**
     * 创建PDF内容
     */
    createPDFContent(reportData) {
        // 简化的PDF内容生成
        // 实际应用中应该使用jsPDF库来生成复杂的PDF
        
        const content = {
            title: '西安小升初智能评估报告',
            date: new Date().toLocaleDateString(),
            sections: [
                {
                    title: '基本信息',
                    content: this.formatBasicInfo(reportData.userData)
                },
                {
                    title: '学校推荐',
                    content: this.formatSchools(reportData.schools)
                },
                {
                    title: '政策分析',
                    content: this.formatPolicies(reportData.policies)
                },
                {
                    title: '时间规划',
                    content: this.formatTimeline(reportData.timeline)
                },
                {
                    title: '个性化建议',
                    content: this.formatSuggestions(reportData.suggestions)
                }
            ]
        };
        
        return content;
    }
    
    /**
     * 格式化基本信息
     */
    formatBasicInfo(userData) {
        return `
学生姓名：${userData.studentName || '未填写'}
户籍类型：${userData.householdType || '未填写'}
所在区域：${userData.district || '未填写'}
房产情况：${userData.propertyInfo?.hasOwnProperty ? '有房产' : '无房产'}
学生能力：${userData.studentAbility || '未评估'}
        `.trim();
    }
    
    /**
     * 格式化学校信息
     */
    formatSchools(schools) {
        if (!schools || schools.length === 0) {
            return '暂无推荐学校';
        }
        
        return schools.map((school, index) => `
${index + 1}. ${school.name}（${school.type === 'public' ? '公办' : '民办'}）
   匹配度：${school.matchScore}%
   区域：${school.district}
   评分：${school.rating}/5
        `).join('\n\n');
    }
    
    /**
     * 格式化政策信息
     */
    formatPolicies(policies) {
        if (!policies || policies.length === 0) {
            return '暂无相关政策';
        }
        
        return policies.map(policy => `
${policy.title}：
${policy.content}
        `).join('\n\n');
    }
    
    /**
     * 格式化时间线
     */
    formatTimeline(timeline) {
        return timeline.map(item => `
${item.month}：
${item.events.map(event => `  • ${event}`).join('\n')}
        `).join('\n');
    }
    
    /**
     * 格式化建议
     */
    formatSuggestions(suggestions) {
        if (!suggestions || suggestions.length === 0) {
            return '暂无建议';
        }
        
        return suggestions.map(suggestion => `
${suggestion.type === 'important' ? '【重要】' : ''}
${suggestion.text}
        `).join('\n\n');
    }
    
    /**
     * 下载PDF
     */
    async downloadPDF(content, filename = '小升初评估报告') {
        // 简化的下载功能
        // 实际应用中应该使用jsPDF生成真实的PDF文件
        
        const text = this.convertToText(content);
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * 预览PDF
     */
    previewPDF(content) {
        const text = this.convertToText(content);
        
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <html>
                <head>
                    <title>评估报告预览</title>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #333; }
                        .section { margin: 20px 0; }
                        .section-title { 
                            color: #2c5282; 
                            border-bottom: 2px solid #e2e8f0;
                            padding-bottom: 5px;
                        }
                    </style>
                </head>
                <body>
                    <h1>${content.title}</h1>
                    <p>生成日期：${content.date}</p>
                    ${content.sections.map(section => `
                        <div class="section">
                            <h2 class="section-title">${section.title}</h2>
                            <pre style="white-space: pre-wrap;">${section.content}</pre>
                        </div>
                    `).join('')}
                </body>
            </html>
        `);
        previewWindow.document.close();
    }
    
    /**
     * 转换为文本
     */
    convertToText(content) {
        let text = `${content.title}\n`;
        text += `生成日期：${content.date}\n\n`;
        
        content.sections.forEach(section => {
            text += `${section.title}\n`;
            text += '='.repeat(section.title.length) + '\n\n';
            text += section.content + '\n\n';
        });
        
        text += '\n\n--- 系统生成报告 ---\n';
        text += '西安小升初智能评估系统\n';
        
        return text;
    }
    
    /**
     * 检查是否支持PDF生成
     */
    isSupported() {
        // 检查是否支持必要的API
        return typeof window !== 'undefined' && 
               typeof Blob !== 'undefined' &&
               typeof URL !== 'undefined';
    }
    
    /**
     * 获取PDF生成状态
     */
    getStatus() {
        return {
            isGenerating: this.isGenerating,
            isSupported: this.isSupported()
        };
    }
}

export default PDFService;