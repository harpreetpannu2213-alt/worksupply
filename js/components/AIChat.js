export const AIChat = {
    render() {
        const container = document.createElement('div');
        container.className = 'ai-chat-widget';

        container.innerHTML = `
            <!-- Chat Window -->
            <div id="ai-chat-window" class="ai-chat-window" style="display: none;">
                <div class="ai-chat-header">
                    <div>
                        <div style="font-weight: 600; font-size: 14px;">WorkSupply Assistant</div>
                        <div style="font-size: 11px; color: var(--text-white-muted);">Online</div>
                    </div>
                    <button id="ai-chat-close" class="btn btn-ghost" style="padding: 4px; color: white;"><i data-lucide="x"></i></button>
                </div>
                
                <div id="ai-chat-messages" class="ai-chat-messages">
                    <div class="ai-message bot">
                        Hi! I'm your WorkSupply AI assistant. How can I help you today?
                    </div>
                </div>
                
                <form id="ai-chat-form" class="ai-chat-input-area">
                    <input type="text" id="ai-chat-input" placeholder="Type a message..." required autocomplete="off">
                    <button type="submit" class="btn btn-primary" style="padding: 8px; border-radius: 50%; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;">
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
        const chatWindow = container.querySelector('#ai-chat-window');
        const form = container.querySelector('#ai-chat-form');
        const input = container.querySelector('#ai-chat-input');
        const messagesArea = container.querySelector('#ai-chat-messages');

        const toggleChat = () => {
            const isHidden = chatWindow.style.display === 'none';
            chatWindow.style.display = isHidden ? 'flex' : 'none';
            if (isHidden) input.focus();
        };

        toggleBtn.addEventListener('click', toggleChat);
        closeBtn.addEventListener('click', toggleChat);

        const addMessage = (text, sender) => {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${sender}`;
            msgDiv.textContent = text;
            messagesArea.appendChild(msgDiv);
            messagesArea.scrollTop = messagesArea.scrollHeight;
        };

        form.addEventListener('submit', (e) => {
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

            // Simulate delayed AI response
            setTimeout(() => {
                typingDiv.remove();
                
                const responses = [
                    "I can help you navigate the timesheet system. Try going to the Submit Hours tab.",
                    "The Employee Directory contains all contact information for your registered staff.",
                    "To generate a report, head to the Weekly Reports section as an Admin.",
                    "If you are having trouble logging your hours, make sure your Project is correctly assigned.",
                    "I am an AI assistant integrated locally into your app environment! 🚀"
                ];
                
                addMessage(responses[Math.floor(Math.random() * responses.length)], 'bot');
            }, 1000);
        });
    }
};
