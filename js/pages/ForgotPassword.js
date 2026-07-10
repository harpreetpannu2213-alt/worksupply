import { Store } from '../services/Store.js';

export const ForgotPassword = {
    async render() {
        const container = document.createElement('div');
        container.style.display = 'flex';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.backgroundColor = 'var(--bg-main)';

        container.innerHTML = `
            <div class="card fade-in" style="width: 100%; max-width: 400px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 28px; font-weight: 800; letter-spacing: 1px; color: var(--text-main); margin-bottom: 8px;">
                        WORK<span style="color: var(--brand-blue);">SUPPLY</span>
                    </div>
                    <h3>Reset Password</h3>
                    <p style="font-size: 14px; color: var(--text-muted);">Enter your email address and we'll send you instructions to reset your password.</p>
                </div>

                <form id="forgot-password-form">
                    <div class="form-group">
                        <label>Email Address</label>
                        <input type="email" id="reset-email" placeholder="name@company.com" required>
                    </div>

                    <div id="reset-message" style="display: none; padding: 12px; border-radius: 8px; margin-bottom: 16px; font-size: 13px;"></div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 16px; margin-top: 8px;">
                        Send Reset Link
                    </button>

                    <div style="margin-top: 24px; text-align: center; font-size: 14px;">
                        Remember your password? <a href="#/login" style="color: var(--brand-blue); text-decoration: none; font-weight: 600;">Back to Sign In</a>
                    </div>
                </form>
            </div>
        `;

        return container;
    },

    async afterRender() {
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
                    messageDiv.style.backgroundColor = '#E7F3EF';
                    messageDiv.style.color = '#128C7E';
                    messageDiv.innerHTML = `Success! A password reset link has been sent to <b>${email}</b>. Please check your inbox.`;

                    // In a real app, this would call an API.
                    // For this demo, we can just log it or simulate a timeout
                    console.log(`Password reset requested for: ${email}`);
                } else {
                    messageDiv.style.backgroundColor = '#FDEEEE';
                    messageDiv.style.color = '#EA0038';
                    messageDiv.innerHTML = `We couldn't find an account with that email address.`;
                }
            });
        }
    }
};
