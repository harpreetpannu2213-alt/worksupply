import { AIService } from '../services/AIService.js';

export const AIChat = {
    chatHistory: [],

    render() {
        const container = document.createElement('div');
        container.className = 'ai-chat-widget';

        const initialKey = AIService.getApiKey();

        container.innerHTML = `
            <!-- Chat Window -->
            <div id="ai-chat-window" class="ai-chat-window" style="display: none;">
                <div class="ai-chat-header">
                    <div>
                        <div style="font-weight: 700; font-size: 14.5px; font-family: 'Outfit', sans-serif;">WorkSupply Assistant</div>
                        <div style="font-size: 11px; color: var(--success); font-weight: 600; margin-top: 2px;">● Online</div>
                    </div>
                    <div style="display: flex; gap: 4px;">
                        <button id="ai-chat-settings" class="btn btn-ghost" style="padding: 6px; color: var(--text-main);" title="API Settings">
                            <i data-lucide="settings" style="width: 16px;"></i>
                        </button>
                        <button id="ai-chat-close" class="btn btn-ghost" style="padding: 6px; color: var(--text-main);">
                            <i data-lucide="x" style="width: 16px;"></i>
                        </button>
                    </div>
                </div>

                <!-- API Key Settings Drawer -->
                <div id="ai-chat-settings-drawer" style="display: none; background: var(--bg-elevated); padding: 16px; border-bottom: 1px solid var(--border-light); flex-direction: column; gap: 10px;">
                    <label style="font-size: 10px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; display: block;">Gemini API Key</label>
                    <div style="display: flex; gap: 8px;">
                        <input type="password" id="gemini-key-input" placeholder="Paste Gemini API Key..." value="${initialKey}" style="flex: 1; padding: 8px 12px; font-size: 13px; background: var(--bg-card);">
                        <button id="save-key-btn" class="btn btn-primary" style="padding: 8px 12px; font-size: 12px;">Save</button>
                    </div>
                    <div style="font-size: 10.5px; color: var(--text-muted); line-height: 1.5;">
                        Keys are saved locally in your browser. Get a key for free from <a href="https://aistudio.google.com/" target="_blank" style="color: var(--accent-hover); text-decoration: underline;">Google AI Studio</a>.
                    </div>
                </div>
                
                <div id="ai-chat-messages" class="ai-chat-messages">
                    <div class="ai-message bot">
                        Hi! I'm your WorkSupply AI assistant. How can I help you today?
                    </div>
                    ${!initialKey ? `
                        <div class="ai-message bot" style="border-left: 3px solid var(--warning); background: var(--warning-bg); color: var(--warning); border-radius: 4px; padding: 10px;">
                            💡 To converse with me about local timesheets, projects, and directory lists, please configure a Gemini API key. Click the ⚙️ icon in the header to set it up!
                        </div>
                    ` : ''}
                </div>
                
                <form id="ai-chat-form" class="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Type a message..." required autocomplete="off" style="border-radius: var(--border-radius-sm);">
                    <button type="submit" class="btn btn-primary" style="padding: 8px; border-radius: 50%; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
                        <i data-lucide="send" style="width: 16px;"></i>
                    </button>
                </form>
            </div>

            <!-- Floating Toggle Button -->
            <button id="ai-chat-toggle" class="ai-chat-toggle btn btn-primary">
                <i data-lucide="bot"></i>
            </button>
        `;

        this.attachEvents(container);
        return container;
    },

    attachEvents(container) {
        const toggleBtn = container.querySelector('#ai-chat-toggle');
        const closeBtn = container.querySelector('#ai-chat-close');
        const settingsBtn = container.querySelector('#ai-chat-settings');
        const settingsDrawer = container.querySelector('#ai-chat-settings-drawer');
        const saveKeyBtn = container.querySelector('#save-key-btn');
        const keyInput = container.querySelector('#gemini-key-input');
        const chatWindow = container.querySelector('#ai-chat-window');
        const form = container.querySelector('#ai-chat-form');
        const input = container.querySelector('#ai-chat-input');
        const messagesArea = container.querySelector('#ai-chat-messages');

        // Reset memory on render
        this.chatHistory = [];

        const toggleChat = () => {
            const isHidden = chatWindow.style.display === 'none';
            chatWindow.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) input.focus();
        };

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        settingsBtn.addEventListener('click', () => {
            const isClosed = settingsDrawer.style.display === 'none';
            settingsDrawer.style.display = isClosed ? 'flex' : 'none';
        });

        saveKeyBtn.addEventListener('click', () => {
            const key = keyInput.value.trim();
            if (key) {
                localStorage.setItem('worksupply_gemini_key', key);
                alert('Gemini API key saved successfully!');
            } else {
                localStorage.removeItem('worksupply_gemini_key');
                alert('Gemini API key cleared.');
            }
            settingsDrawer.style.display = 'none';
            window.dispatchEvent(new Event('hashchange')); // Refresh view to reload UI
        });

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${sender}`;
            
            // Basic markdown parser for assistant text formatting
            if (sender === 'bot') {
                msgDiv.innerHTML = this.parseMarkdown(text);
            } else {
                msgDiv.textContent = text;
            }
            
            messagesArea.appendChild(msgDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
            this.chatHistory.push({ text, sender });
        };

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const text = input.value.trim();
            if (!text) return;

            // Add user message
            addMessage(text, 'user');
            input.value = '';

            // Simulate AI typing indicator
            const typingDiv = document.createElement('div');
            typingDiv.className = 'ai-message bot typing';
            typingDiv.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span>';
            messagesArea.appendChild(typingDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;

            // Make the actual call to Gemini
            const aiResponse = await AIService.chatWithGemini(text, this.chatHistory.slice(0, -1));
            typingDiv.remove();

            if (aiResponse === "API_KEY_MISSING") {
                addMessage("I need a Gemini API Key to help you query the database. Please click the ⚙️ settings icon at the top of this widget to configure your key.", 'bot');
            } else if (aiResponse === "API_KEY_INVALID") {
                addMessage("It looks like the Gemini API Key is invalid or expired. Please check your key configuration by clicking the ⚙️ settings icon.", 'bot');
            } else {
                addMessage(aiResponse, 'bot');
            }
        });
        
        if (window.lucide) window.lucide.createIcons();
    },

    parseMarkdown(text) {
        // Very basic sanitization and markdown tag replacement for styling bot responses
        let html = text
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;");

        // Code block formatting
        html = html.replace(/```([\s\S]*?)```/g, '<pre style="background: var(--bg-elevated); padding: 8px; border-radius: 4px; overflow-x: auto; font-family: monospace; font-size: 11.5px; margin: 6px 0;"><code>$1</code></pre>');
        
        // Inline code formatting
        html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg-elevated); padding: 2px 4px; border-radius: 2px; font-family: monospace; font-size: 12px; color: var(--accent-hover);">$1</code>');
        
        // Bold formatting
        html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
        
        // Bullet points
        html = html.replace(/^\s*-\s+(.*)$/gm, '<li style="margin-left: 12px; font-size: 13px;">$1</li>');
        
        // Line breaks
        html = html.replace(/\n/g, '<br>');

        return html;
    }
};
