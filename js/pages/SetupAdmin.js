import { Store } from '../services/Store.js';

export const SetupAdmin = {
    async render() {
        // If an admin already exists, don't allow access to this page
        const admins = Store.getUsersByRole('admin');
        if (admins.length > 0) {
            window.location.hash = '/login';
            return document.createElement('div');
        }

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
            max-width: 450px;
            padding: 40px;
            z-index: 10;
            margin: 20px;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 28px; font-weight: 900; letter-spacing: -1px; color: var(--text-main); margin-bottom: 8px; font-family: 'Outfit', sans-serif;">
                    WORK<span style="background: var(--accent-gradient); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">SUPPLY</span>
                </div>
                <h3 style="color: var(--accent-hover); margin-bottom: 8px;">Initial Setup</h3>
                <p style="color: var(--text-muted); font-size: 14px;">Create your primary Administrator account. This can only be done once.</p>
            </div>

            <form id="setup-admin-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>First Name</label>
                        <input type="text" id="set-fn" placeholder="Admin" required style="height: 44px;">
                    </div>
                    <div class="form-group" style="margin-bottom: 0;">
                        <label>Last Name</label>
                        <input type="text" id="set-ln" placeholder="User" required style="height: 44px;">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Admin Email</label>
                    <input type="email" id="set-email" placeholder="admin@worksupply.com" required style="height: 44px;">
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label>Create Password</label>
                    <input type="password" id="set-password" placeholder="••••••••" required minlength="6" style="height: 44px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label>Confirm Password</label>
                    <input type="password" id="set-confirm" placeholder="••••••••" required style="height: 44px;">
                </div>

                <div id="setup-error" class="badge danger" style="width: 100%; display: none; margin-bottom: 16px; justify-content: center; padding: 10px; border-radius: 8px;"></div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: var(--border-radius-md);">
                    Finalize Setup
                </button>
            </form>
        `;

        container.appendChild(card);
        return container;
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

        const form = document.getElementById('setup-admin-form');
        const err = document.getElementById('setup-error');

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();

                // Double check if an admin was created while the page was open
                if (Store.getUsersByRole('admin').length > 0) {
                    alert('An administrator already exists.');
                    window.location.hash = '/login';
                    return;
                }

                const fn = document.getElementById('set-fn').value;
                const ln = document.getElementById('set-ln').value;
                const email = document.getElementById('set-email').value;
                const pass = document.getElementById('set-password').value;
                const confirm = document.getElementById('set-confirm').value;

                if (pass !== confirm) {
                    err.textContent = 'Passwords do not match';
                    err.style.display = 'inline-flex';
                    return;
                }

                Store.addUser({
                    firstName: fn,
                    lastName: ln,
                    email: email,
                    password: pass,
                    role: 'admin',
                    status: 'Active',
                    project: 'Management',
                    phone: '',
                    location: 'HQ'
                });

                alert('Admin account created successfully! Please log in.');
                window.location.hash = '/login';
            });
        }
    }
};
