import { Store } from '../services/Store.js';

export const Login = {
    async render() {
        const container = document.createElement('div');
        container.className = 'login-page';
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
            max-width: 420px;
            padding: 48px;
            z-index: 10;
            margin: 20px;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Outfit', sans-serif;">
                    <i data-lucide="shield-check" style="width: 32px; height: 32px; color: var(--accent-hover);"></i>
                    WORK<span style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SUPPLY</span>
                </div>
                <p style="color: var(--text-muted); font-size: 15px; font-weight: 500;">Welcome back. Please sign in to continue.</p>
            </div>

            <form id="login-form">
                <div class="form-group" style="margin-bottom: 24px;">
                    <label>Email Address</label>
                    <div style="position: relative;">
                        <i data-lucide="mail" style="position: absolute; left: 14px; top: 12px; width: 18px; color: var(--text-light);"></i>
                        <input type="email" id="login-email" placeholder="name@worksupply.com" required
                               style="padding-left: 44px; height: 48px;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Password</label>
                    <div style="position: relative;">
                        <i data-lucide="lock" style="position: absolute; left: 14px; top: 12px; width: 18px; color: var(--text-light);"></i>
                        <input type="password" id="login-password" placeholder="••••••••" required
                               style="padding-left: 44px; height: 48px;">
                    </div>
                </div>

                <div id="login-error" class="badge danger" style="width: 100%; display: none; margin-bottom: 16px; justify-content: center; padding: 10px; border-radius: 8px;">
                    Invalid email or password. Please try again.
                </div>

                <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 32px;">
                    <a href="#/forgot-password" style="font-size: 14px; color: var(--accent-hover); text-decoration: none; font-weight: 600;">Forgot password?</a>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: var(--border-radius-md);">
                    Sign In
                </button>

                <div style="margin-top: 32px; text-align: center; font-size: 15px; color: var(--text-muted);">
                    New to WorkSupply? <a href="#/register" style="color: var(--accent-hover); text-decoration: none; font-weight: 700;">Create Account</a>
                </div>
            </form>
        `;

        container.appendChild(card);
        return container;
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

        const form = document.getElementById('login-form');
        const err = document.getElementById('login-error');
        const emailInput = document.getElementById('login-email');
        const passInput = document.getElementById('login-password');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = Store.login(emailInput.value, passInput.value);
                if (user) {
                    if (user.role === 'admin') {
                        window.location.hash = '/admin/reports';
                    } else {
                        window.location.hash = '/employee/dashboard';
                    }
                } else {
                    err.style.display = 'inline-flex';
                }
            });
        }
    }
};
