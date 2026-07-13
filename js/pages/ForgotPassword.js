import { Store } from '../services/Store.js';

export const ForgotPassword = {
    async render() {
        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            width: 100%;
            height: 100vh;
            align-items: center;
            justify-content: center;
            position: relative;
            overflow: hidden;
        `;
        
        // Add animated gradient mesh and floating orbs
        const mesh = document.createElement('div');
        mesh.className = 'animated-mesh-bg';
        mesh.innerHTML = `
            <div class="floating-orb floating-orb-1"></div>
            <div class="floating-orb floating-orb-2"></div>
        `;
        container.appendChild(mesh);

        const card = document.createElement('div');
        card.className = 'card glass-card fade-in';
        card.style.cssText = `
            width: 100%;
            max-width: 400px;
            padding: 40px;
            z-index: 10;
            margin: 20px;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 28px; font-weight: 900; letter-spacing: -1px; color: var(--text-main); margin-bottom: 8px; font-family: 'Outfit', sans-serif;">
                    WORK<span style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SUPPLY</span>
                </div>
                <h3 style="margin-top: 16px; margin-bottom: 8px;">Reset Password</h3>
                <p style="font-size: 14px; color: var(--text-muted);">Enter your email address and we'll send you instructions to reset your password.</p>
            </div>

            <form id="forgot-password-form">
                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Email Address</label>
                    <input type="email" id="reset-email" placeholder="name@company.com" required style="height: 44px;">
                </div>

                <div id="reset-message" style="display: none; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13.5px; line-height: 1.5; border: 1px solid transparent; text-align: center;"></div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: var(--border-radius-md);">
                    Send Reset Link
                </button>

                <div style="margin-top: 24px; text-align: center; font-size: 14px; color: var(--text-muted);">
                    Remember your password? <a href="#/login" style="color: var(--accent-hover); text-decoration: none; font-weight: 600;">Back to Sign In</a>
                </div>
            </form>
        `;

        container.appendChild(card);
        return container;
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();
        const form = document.getElementById('forgot-password-form');
        const messageDiv = document.getElementById('reset-message');
        const emailInput = document.getElementById('reset-email');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = emailInput.value;
                const users = Store.getUsers();
                const user = users.find(u => u.email === email);

                messageDiv.style.display = 'block';

                if (user) {
                    messageDiv.style.backgroundColor = 'var(--success-bg)';
                    messageDiv.style.color = 'var(--success)';
                    messageDiv.style.borderColor = 'var(--success-border)';
                    messageDiv.innerHTML = `Success! A password reset link has been sent to <b>${email}</b>. Please check your inbox.`;
                    console.log(`Password reset requested for: ${email}`);
                } else {
                    messageDiv.style.backgroundColor = 'var(--danger-bg)';
                    messageDiv.style.color = 'var(--danger)';
                    messageDiv.style.borderColor = 'var(--danger-border)';
                    messageDiv.innerHTML = `We couldn't find an account with that email address.`;
                }
            });
        }
    }
};
