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
            max-width: 500px;
            padding: 40px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 32px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            z-index: 10;
            margin: 20px;
            overflow-y: auto;
            max-height: 90vh;
        `;

        card.innerHTML = `
            <div style="text-align: center; margin-bottom: 32px;">
                <div style="font-size: 28px; font-weight: 900; letter-spacing: -1px; color: #111b21; margin-bottom: 8px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <i data-lucide="user-plus" style="width: 28px; height: 28px; color: #25d366;"></i>
                    WORK<span style="color: #128c7e;">SUPPLY</span>
                </div>
                <h3 style="font-weight: 800; color: #1e293b; margin-top: 16px;">Create Account</h3>
                <p style="color: #667781; font-size: 14px; font-weight: 500;">Join the team and start tracking your hours.</p>
            </div>

            <form id="register-form">
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px;">
                    <div class="form-group">
                        <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">First Name</label>
                        <input type="text" id="reg-fn" placeholder="John" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                    </div>
                    <div class="form-group">
                        <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Last Name</label>
                        <input type="text" id="reg-ln" placeholder="Doe" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                    </div>
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Email Address</label>
                    <input type="email" id="reg-email" placeholder="john.doe@worksupply.com" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Phone Number (WhatsApp)</label>
                    <input type="text" id="reg-phone" placeholder="+15551234567" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">NIFF Number</label>
                    <input type="text" id="reg-niff" placeholder="e.g. PT-123456789" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                </div>

                <div class="form-group" style="margin-bottom: 20px;">
                    <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Project / Department</label>
                    <select id="reg-project" required style="width: 100%; height: 44px; padding: 0 12px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px; background: white;">
                        <option value="">-- Select Project --</option>
                        ${projects}
                    </select>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
                    <div class="form-group">
                        <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Password</label>
                        <input type="password" id="reg-password" placeholder="••••••••" required minlength="6" style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                    </div>
                    <div class="form-group">
                        <label style="font-weight: 700; font-size: 12px; text-transform: uppercase; color: #64748b; margin-bottom: 6px; display: block;">Confirm</label>
                        <input type="password" id="reg-confirm" placeholder="••••••••" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                    </div>
                </div>

                <div id="reg-error" style="color: #ef4444; font-size: 13px; margin-bottom: 16px; display: none; background: #fef2f2; padding: 10px; border-radius: 8px; text-align: center;"></div>

                <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 52px; font-size: 16px; font-weight: 700; border-radius: 16px; background: #128c7e; box-shadow: 0 10px 15px -3px rgba(18, 140, 126, 0.3);">
                    Create Account
                </button>

                <div style="margin-top: 32px; text-align: center; font-size: 15px; color: #667781;">
                    Already have an account? <a href="#/login" style="color: #128c7e; text-decoration: none; font-weight: 700;">Sign In</a>
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
                    err.style.display = 'block';
                    return;
                }

                // Check if email already exists
                const existing = Store.getUsers().find(u => u.email === email);
                if (existing) {
                    err.textContent = 'Email already registered';
                    err.style.display = 'block';
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
