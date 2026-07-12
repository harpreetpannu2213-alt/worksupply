import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const CreateEmployee = {
    async render() {
        const users = Store.getUsersByRole('employee');
        const recentRows = [...users].reverse().slice(0, 5).map(u => `
            <tr>
                <td>
                    <div style="font-weight: 500;">${u.firstName} ${u.lastName}</div>
                    <div style="font-size: 12px; color: var(--text-muted);">${u.email}</div>
                </td>
                <td>${u.project || 'Unassigned'}</td>
                <td>Just now</td>
                <td><span class="badge ${u.status === 'Active' ? 'success' : 'warning'}">${u.status}</span></td>
            </tr>
        `).join('');

        const projectOptions = Store.getProjects();
        const projectSelect = projectOptions.length > 0
            ? projectOptions.map(p => `<option value="${p.name}">${p.name}</option>`).join('')
            : `<option value="" disabled>No projects available yet</option>`;

        const content = `
            <div style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin-bottom: 8px;">Create Employee Account</h1>
                    <p>Provision new accounts for staff members to track time.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 2fr; gap: 32px;">
                <div class="card" style="height: fit-content;">
                    <div class="card-header">
                        <h3>Account Details</h3>
                    </div>
                    <form id="create-emp-form">
                        <div class="form-group">
                            <label>First Name</label>
                            <input type="text" id="emp-fn" placeholder="e.g. John" required>
                        </div>
                        <div class="form-group">
                            <label>Last Name</label>
                            <input type="text" id="emp-ln" placeholder="e.g. Doe" required>
                        </div>
                        <div class="form-group">
                            <label>Personal Email</label>
                            <input type="email" id="emp-email" placeholder="john.doe@example.com" required>
                        </div>
                        <div class="form-group">
                            <label>NIFF Number</label>
                            <input type="text" id="emp-niff" placeholder="e.g. PT-123456789" required>
                        </div>
                        <div class="form-group">
                            <label>Employee Phone (for WhatsApp)</label>
                            <input type="text" id="emp-phone" placeholder="e.g. +15551234567" required>
                        </div>
                        <div class="form-group">
                            <label>Project Name</label>
                            <select id="emp-proj-custom" style="width: 100%; padding: 10px; border-radius: var(--border-radius-md); border: 1px solid var(--border-light);">
                                <option value="">Unassigned</option>
                                ${projectSelect}
                            </select>
                        </div>
                        <div class="form-group" style="margin-bottom: 24px;">
                            <label>Primary Location</label>
                            <input type="text" id="emp-loc-custom" placeholder="e.g. New York, USA" required>
                        </div>
                        
                        <div style="background: var(--brand-blue-light); padding: 16px; border-radius: var(--border-radius-md); margin-bottom: 24px; display: flex; gap: 12px; color: var(--brand-blue-hover);">
                            <i data-lucide="message-circle"></i>
                            <div style="font-size: 13px;">
                                <strong style="display: block; margin-bottom: 4px;">WhatsApp Onboarding</strong>
                                You will have the option to send credentials directly via WhatsApp after clicking create.
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center;"><i data-lucide="user-plus"></i> Create Account</button>
                    </form>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>Recently Provisioned Accounts</h3>
                    </div>
                    <div class="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>Employee</th>
                                    <th>Project</th>
                                    <th>Created On</th>
                                    <th>Invite Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${recentRows || '<tr><td colspan="4" style="text-align:center; padding: 20px; color: var(--text-muted);">No accounts provisioned recently.</td></tr>'}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/create', 'Create Employee');
    },

    async afterRender() {
        const form = document.querySelector('#create-emp-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const fn = document.getElementById('emp-fn').value;
                const ln = document.getElementById('emp-ln').value;
                const email = document.getElementById('emp-email').value;
                const phone = document.getElementById('emp-phone').value;
                const project = document.getElementById('emp-proj-custom').value;
                const location = document.getElementById('emp-loc-custom').value;
                const password = 'WS' + Math.floor(1000 + Math.random() * 9000); // Random password

                Store.addUser({
                    firstName: fn,
                    lastName: ln,
                    email: email,
                    password: password,
                    role: 'employee',
                    niff: document.getElementById('emp-niff').value,
                    project: project,
                    phone: phone,
                    location: location
                });

                const msg = `Hello ${fn}, your WORKSUPPLY account is ready! %0A%0AEmail: ${email}%0APassword: ${password}%0A%0ALogin here: https://worksupply-app.com/login`;
                const waUrl = `https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${msg}`;

                alert(`Employee account created for ${fn} ${ln}!`);
                window.open(waUrl, '_blank');

                window.dispatchEvent(new Event('hashchange'));
            });
        }
    }
};
