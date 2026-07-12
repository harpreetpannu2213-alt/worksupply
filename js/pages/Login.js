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
            background: linear-gradient(135deg, #075e54 0%, #128c7e 100%);
            position: relative;
            overflow: hidden;
        `;
        
        // Add some decorative organic shapes
        const shape1 = document.createElement('div');
        shape1.style.cssText = 'position: absolute; top: -10%; left: -5%; width: 400px; height: 400px; background: rgba(37, 211, 102, 0.1); border-radius: 50%; filter: blur(80px);';
        const shape2 = document.createElement('div');
        shape2.style.cssText = 'position: absolute; bottom: -10%; right: -5%; width: 300px; height: 300px; background: rgba(255, 255, 255, 0.05); border-radius: 50%; filter: blur(60px);';
        container.appendChild(shape1);
        container.appendChild(shape2);

        const card = document.createElement('div');
        card.className = 'fade-in';
        card.style.cssText = `
            width: 100%;
            max-width: 420px;
            padding: 48px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 10;
            margin: 20px;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 40px;">
                <div style="font-size: 32px; font-weight: 900; letter-spacing: -1px; color: #111b21; margin-bottom: 12px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="shield-check" style="width: 32px; height: 32px; color: #25d366;"></i>
                    WORK<span style="color: #128c7e;">SUPPLY</span>
                </div>
                <p style="color: #667781; font-size: 15px; font-weight: 500;">Welcome back. Please sign in to continue.</p>
            </div>

            <form id="login-form">
                <div class="form-group" style="margin-bottom: 24px;">
                    <label style="font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; margin-bottom: 8px;">Email Address</label>
                    <div style="position: relative;">
                        <i data-lucide="mail" style="position: absolute; left: 14px; top: 12px; width: 18px; color: #a0aec0;"></i>
                        <input type="email" id="login-email" placeholder="name@worksupply.com" required
                               style="padding-left: 44px; height: 48px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 15px;">
                    </div>
                </div>
                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; color: #4a5568; margin-bottom: 8px;">Password</label>
                    <div style="position: relative;">
                        <i data-lucide="lock" style="position: absolute; left: 14px; top: 12px; width: 18px; color: #a0aec0;"></i>
                        <input type="password" id="login-password" placeholder="••••••••" required
                               style="padding-left: 44px; height: 48px; border-radius: 12px; border: 1.5px solid #e2e8f0; font-size: 15px;">
                    </div>
                </div>

                <div id="login-error" style="color: #ef4444; font-size: 13px; margin-bottom: 16px; display: none; background: #fef2f2; padding: 10px; border-radius: 8px; text-align: center; border: 1px solid #fee2e2;">
                    Invalid email or password. Please try again.
                </div>

                <div style="display: flex; justify-content: flex-end; align-items: center; margin-bottom: 32px;">
                    <a href="#/forgot-password" style="font-size: 14px; color: #128c7e; text-decoration: none; font-weight: 600;">Forgot password?</a>
                </div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: 16px; background: #128c7e; box-shadow: 0 10px 15px -3px rgba(18, 140, 126, 0.3);">
                    Sign In
                </button>

                <div style="margin-top: 32px; text-align: center; font-size: 15px; color: #667781;">
                    New to WorkSupply? <a href="#/register" style="color: #128c7e; text-decoration: none; font-weight: 700;">Create Account</a>
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
                    err.style.display = 'block';
                }
            });
        }
    }
};
