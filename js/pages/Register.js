import { Store } from '../services/Store.js';

export const Register = {
    async render() {
        const projects = Store.getProjects().map(p => `<option value="${p.name}">${p.name}</option>`).join('');

        const container = document.createElement('div');
        container.className = 'register-page';
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
            max-width: 500px;
            padding: 40px;
            z-index: 10;
            margin: 20px;
            overflow-y: auto;
            max-height: 90vh;
            scrollbar-width: thin;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 28px; font-weight: 900; letter-spacing: -1px; color: var(--text-main); margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: 'Outfit', sans-serif;">
                    <i data-lucide="user-plus" style="width: 28px; height: 28px; color: var(--accent-hover);"></i>
                    WORK<span style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SUPPLY</span>
                </div>
                <h3 style="font-weight: 800; color: var(--text-main); margin-top: 16px;">Create Account</h3>
                <p style="color: var(--text-muted); font-size: 14px; font-weight: 500;">Join the team and start tracking your hours.</p>
            </div>

            <form id="register-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label>First Name</label>
                        <input type="text" id="reg-fn" placeholder="John" required style="height: 44px;">
                    </div>
                    <div class="form-group">
                        <label>Last Name</label>
                        <input type="text" id="reg-ln" placeholder="Doe" required style="height: 44px;">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Email Address</label>
                    <input type="email" id="reg-email" placeholder="john.doe@worksupply.com" required style="height: 44px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Phone Number (WhatsApp)</label>
                    <input type="text" id="reg-phone" placeholder="+15551234567" required style="height: 44px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>NIFF Number</label>
                    <input type="text" id="reg-niff" placeholder="e.g. PT-123456789" required style="height: 44px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Project / Department</label>
                    <select id="reg-project" required style="width: 100%; height: 44px; padding: 0 12px; background: var(--bg-card);">
                        <option value="">-- Select Project --</option>
                        ${projects}
                    </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div class="form-group">
                        <label>Password</label>
                        <input type="password" id="reg-password" placeholder="••••••••" required minlength="6" style="height: 44px;">
                    </div>
                    <div class="form-group">
                        <label>Confirm</label>
                        <input type="password" id="reg-confirm" placeholder="••••••••" required style="height: 44px;">
                    </div>
                </div>

                <div id="reg-error" class="badge danger" style="width: 100%; display: none; margin-bottom: 16px; justify-content: center; padding: 10px; border-radius: 8px;"></div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: var(--border-radius-md);">
                    Create Account
                </button>

                <div style="margin-top: 32px; text-align: center; font-size: 15px; color: var(--text-muted);">
                    Already have an account? <a href="#/login" style="color: var(--accent-hover); text-decoration: none; font-weight: 700;">Sign In</a>
                </div>
            </form>
        `;

        container.appendChild(card);
        return container;
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();
        const form = document.getElementById('register-form');
        const err = document.getElementById('reg-error');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                const fn = document.getElementById('reg-fn').value;
                const ln = document.getElementById('reg-ln').value;
                const email = document.getElementById('reg-email').value;
                const phone = document.getElementById('reg-phone').value;
                const niff = document.getElementById('reg-niff').value;
                const project = document.getElementById('reg-project').value;
                const pass = document.getElementById('reg-password').value;
                const confirm = document.getElementById('reg-confirm').value;

                if (pass !== confirm) {
                    err.textContent = 'Passwords do not match';
                    err.style.display = 'inline-flex';
                    return;
                }

                // Check if email already exists
                const existing = Store.getUsers().find(u => u.email === email);
                if (existing) {
                    err.textContent = 'Email already registered';
                    err.style.display = 'inline-flex';
                    return;
                }

                Store.addUser({
                    firstName: fn,
                    lastName: ln,
                    email: email,
                    password: pass,
                    role: 'employee',
                    phone: phone,
                    niff: niff,
                    project: project,
                    status: 'Active',
                    location: 'Remote'
                });

                alert('Account created successfully!');
                window.location.hash = '/login';
            });
        }
    }
};
