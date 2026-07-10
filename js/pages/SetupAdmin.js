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
        container.style.display = 'flex';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.backgroundColor = 'var(--bg-main)';

        container.innerHTML = `
            <div class="card fade-in" style="width: 100%; max-width: 450px; padding: 40px;">
                <div style="text-align: center; margin-bottom: 32px;">
                    <div style="font-size: 28px; font-weight: 800; letter-spacing: 1px; color: var(--text-main); margin-bottom: 8px;">
                        WORK<span style="color: var(--brand-blue);">SUPPLY</span>
                    </div>
                    <h3 style="color: var(--brand-blue);">Initial Setup</h3>
                    <p>Create your primary Administrator account. This can only be done once.</p>
                </div>

                <form id="setup-admin-form">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" id="set-fn" placeholder="Admin" required>
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" id="set-ln" placeholder="User" required>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>Admin Email</label>
                        <input type="email" id="set-email" placeholder="admin@worksupply.com" required>
                    </div>

                    <div class="form-group">
                        <label>Create Password</label>
                        <input type="password" id="set-password" placeholder="••••••••" required minlength="6">
                    </div>

                    <div class="form-group">
                        <label>Confirm Password</label>
                        <input type="password" id="set-confirm" placeholder="••••••••" required>
                    </div>

                    <div id="setup-error" style="color: var(--danger); font-size: 13px; margin-bottom: 12px; display: none;"></div>

                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px; font-size: 16px; margin-top: 12px;">
                        Finalize Setup
                    </button>
                </form>
            </div>
        `;

        return container;
    },

    async afterRender() {
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
                    err.style.display = 'block';
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
