/**
 * AI聊天窗口组件
 */

class ChatWindow {
    constructor(config = {}) {
        this.config = {
            title: 'AI升学助手',
            placeholder: '请输入您的问题...',
            autoScroll: true,
            showTypingIndicator: true,
            ...config
        };
        
        this.messages = [];
        this.isOpen = false;
        this.isTyping = false;
        this.element = null;
    }
    
    /**
     * 渲染聊天窗口
     */
    render(container) {
        const chatHTML = `
            <div class="chat-container">
                <!-- 聊天按钮 -->
                <button class="chat-toggle-btn" id="chatToggle">
                    <i class="icon-chat"></i>
                    <span class="badge" id="messageBadge">0</span>
                </button>
                
                <!-- 聊天窗口 -->
                <div class="chat-window">
                    <div class="chat-header">
                        <h3>${this.config.title}</h3>
                        <button class="close-btn" id="closeChat">×</button>
                    </div>
                    
                    <div class="chat-messages" id="chatMessages">
                        <!-- 消息将动态添加 -->
                    </div>
                    
                    <div class="chat-input-area">
                        <div class="quick-questions">
                            <button class="quick-question" data-question="公办学校如何录取？">公办学校如何录取？</button>
                            <button class="quick-question" data-question="学区房要求是什么？">学区房要求是什么？</button>
                            <button class="quick-question" data-question="民办摇号政策">民办摇号政策</button>
                        </div>
                        
                        <div class="input-wrapper">
                            <textarea 
                                id="chatInput" 
                                placeholder="${this.config.placeholder}" 
                                rows="1"
                            ></textarea>
                            <button class="send-btn" id="sendMessage">
                                <i class="icon-send"></i>
                            </button>
                        </div>
                        
                        <div class="chat-tips">
                            <small>提示：我可以回答关于小升初政策、学校选择、报名流程等问题</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = chatHTML;
        this.element = container.firstElementChild;
        this.bindEvents();
        
        // 添加欢迎消息
        this.addMessage({
            type: 'ai',
            content: '您好！我是西安小升初AI助手，有什么可以帮您的吗？',
            timestamp: new Date()
        });
        
        return this.element;
    }
    
    /**
     * 绑定事件
     */
    bindEvents() {
        // 切换聊天窗口
        const toggleBtn = this.element.querySelector('#chatToggle');
        const closeBtn = this.element.querySelector('#closeChat');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggle());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }
        
        // 发送消息
        const sendBtn = this.element.querySelector('#sendMessage');
        const chatInput = this.element.querySelector('#chatInput');
        
        if (sendBtn && chatInput) {
            sendBtn.addEventListener('click', () => this.sendMessage());
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });
            
            // 自动调整输入框高度
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + 'px';
            });
        }
        
        // 快捷问题
        const quickQuestions = this.element.querySelectorAll('.quick-question');
        quickQuestions.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.dataset.question;
                chatInput.value = question;
                this.sendMessage();
            });
        });
    }
    
    /**
     * 切换聊天窗口显示/隐藏
     */
    toggle() {
        this.isOpen = !this.isOpen;
        const chatWindow = this.element.querySelector('.chat-window');
        
        if (this.isOpen) {
            chatWindow.classList.add('open');
            this.element.querySelector('#chatInput')?.focus();
        } else {
            chatWindow.classList.remove('open');
        }
    }
    
    /**
     * 打开聊天窗口
     */
    open() {
        this.isOpen = true;
        this.element.querySelector('.chat-window').classList.add('open');
        this.element.querySelector('#chatInput')?.focus();
    }
    
    /**
     * 关闭聊天窗口
     */
    close() {
        this.isOpen = false;
        this.element.querySelector('.chat-window').classList.remove('open');
    }
    
    /**
     * 发送消息
     */
    async sendMessage() {
        const input = this.element.querySelector('#chatInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // 添加用户消息
        this.addMessage({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // 清空输入框
        input.value = '';
        input.style.height = 'auto';
        
        // 显示AI正在输入
        this.showTypingIndicator();
        
        try {
            // 调用AI服务
            const response = await this.config.aiService?.ask(message);
            
            // 移除输入指示器
            this.hideTypingIndicator();
            
            // 添加AI回复
            this.addMessage({
                type: 'ai',
                content: response || '暂时无法回答这个问题',
                timestamp: new Date()
            });
            
        } catch (error) {
            this.hideTypingIndicator();
            this.addMessage({
                type: 'ai',
                content: '抱歉，服务暂时不可用，请稍后再试。',
                timestamp: new Date()
            });
        }
    }
    
    /**
     * 添加消息
     */
    addMessage(message) {
        this.messages.push(message);
        this.renderMessage(message);
        
        // 更新消息徽章
        if (message.type === 'ai' && !this.isOpen) {
            this.updateBadge();
        }
    }
    
    /**
     * 渲染单条消息
     */
    renderMessage(message) {
        const messagesContainer = this.element.querySelector('#chatMessages');
        
        const messageElement = document.createElement('div');
        messageElement.className = `message ${message.type}`;
        
        const timeString = message.timestamp.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        messageElement.innerHTML = `
            <div class="message-content">
                <div class="message-text">${this.formatMessageContent(message.content)}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;
        
        messagesContainer.appendChild(messageElement);
        
        // 自动滚动到底部
        if (this.config.autoScroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    /**
     * 格式化消息内容（支持简单Markdown）
     */
    formatMessageContent(content) {
        // 处理换行
        content = content.replace(/\n/g, '<br>');
        
        // 处理加粗
        content = content.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        
        // 处理链接
        content = content.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
        
        return content;
    }
    
    /**
     * 显示正在输入指示器
     */
    showTypingIndicator() {
        if (!this.config.showTypingIndicator) return;
        
        this.isTyping = true;
        const messagesContainer = this.element.querySelector('#chatMessages');
        
        const typingElement = document.createElement('div');
        typingElement.className = 'message ai typing';
        typingElement.innerHTML = `
            <div class="message-content">
                <div class="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        
        this.typingIndicator = typingElement;
        messagesContainer.appendChild(typingElement);
        
        if (this.config.autoScroll) {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }
    
    /**
     * 隐藏正在输入指示器
     */
    hideTypingIndicator() {
        if (this.typingIndicator) {
            this.typingIndicator.remove();
            this.typingIndicator = null;
        }
        this.isTyping = false;
    }
    
    /**
     * 更新消息徽章
     */
    updateBadge() {
        const badge = this.element.querySelector('#messageBadge');
        if (badge) {
            const unreadCount = this.messages.filter(m => 
                m.type === 'ai' && 
                !m.read
            ).length;
            
            badge.textContent = unreadCount;
            badge.style.display = unreadCount > 0 ? 'block' : 'none';
        }
    }
    
    /**
     * 设置AI服务
     */
    setAIService(aiService) {
        this.config.aiService = aiService;
    }
    
    /**
     * 添加预设回复选项
     */
    addQuickReplies(replies) {
        const quickRepliesContainer = document.createElement('div');
        quickRepliesContainer.className = 'quick-replies';
        
        replies.forEach(reply => {
            const button = document.createElement('button');
            button.className = 'quick-reply';
            button.textContent = reply.text;
            button.addEventListener('click', () => {
                this.addMessage({
                    type: 'user',
                    content: reply.text,
                    timestamp: new Date()
                });
                
                if (reply.action) {
                    reply.action();
                }
            });
            quickRepliesContainer.appendChild(button);
        });
        
        const messagesContainer = this.element.querySelector('#chatMessages');
        messagesContainer.appendChild(quickRepliesContainer);
    }
}

export default ChatWindow;