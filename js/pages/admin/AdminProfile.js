import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const AdminProfile = {
    async render() {
        const user = Store.getCurrentUser() || {};

        const content = `
            <div style="max-width: 960px; margin: 0 auto;">
                <div class="page-header">
                    <div>
                        <h1>Admin Settings</h1>
                        <p>Update your account preferences, security settings, and quick session management in one place.</p>
                    </div>
                </div>

                <div class="profile-grid">
                    <div class="profile-card card" style="padding: 28px;">
                        <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
                            <div class="avatar-large">${user.firstName?.charAt(0) || 'A'}${user.lastName?.charAt(0) || 'P'}</div>
                            <div>
                                <h3 style="margin: 0; font-size: 18px;">Personal Information</h3>
                                <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">Your admin profile details are stored locally in the browser.</p>
                            </div>
                        </div>
                        <form id="admin-profile-form" style="display: grid; gap: 18px;">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                                <div>
                                    <label class="form-label">First Name</label>
                                    <input type="text" id="adm-fn" value="${user.firstName || ''}" required class="form-control">
                                </div>
                                <div>
                                    <label class="form-label">Last Name</label>
                                    <input type="text" id="adm-ln" value="${user.lastName || ''}" required class="form-control">
                                </div>
                            </div>
                            <div>
                                <label class="form-label">Email Address</label>
                                <input type="email" id="adm-email" value="${user.email || ''}" required class="form-control">
                            </div>
                            <button type="submit" class="btn btn-primary btn-pill" style="width: 180px;">Update Profile</button>
                        </form>
                    </div>

                    <div style="display: grid; gap: 20px;">
                        <div class="profile-card card" style="padding: 28px;">
                            <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 24px;">
                                <div style="width: 40px; height: 40px; border-radius: 14px; background: #fef3c7; color: #92400e; display: flex; align-items: center; justify-content: center;"><i data-lucide="lock" style="width: 20px;"></i></div>
                                <div>
                                    <h3 style="margin: 0; font-size: 18px;">Security</h3>
                                    <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">Change your password and keep your access secured.</p>
                                </div>
                            </div>
                            <form id="admin-password-form" style="display: grid; gap: 18px;">
                                <div style="display: grid; gap: 12px;">
                                    <label class="form-label">New Password</label>
                                    <input type="password" id="adm-new-pw" placeholder="••••••••" required class="form-control">
                                </div>
                                <div style="display: grid; gap: 12px;">
                                    <label class="form-label">Confirm Password</label>
                                    <input type="password" id="adm-confirm-pw" placeholder="••••••••" required class="form-control">
                                </div>
                                <button type="submit" class="btn btn-outline btn-pill" style="width: 180px;">Change Password</button>
                            </form>
                        </div>

                        <div class="card" style="padding: 24px; background: #eff6ff; border: 1px solid #dbeafe;">
                            <h3 style="margin-top: 0; font-size: 18px;">Session Control</h3>
                            <p style="margin: 10px 0 18px 0; color: #475569;">Use the button below to safely end your current admin session.</p>
                            <button id="btn-logout" class="btn btn-ghost btn-pill" style="width: 100%;">Logout from System</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/profile', 'Admin Profile');
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

        const logoutBtn = document.getElementById('btn-logout');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
                window.location.hash = '/login';
            });
        }


        const profileForm = document.getElementById('admin-profile-form');
        if (profileForm) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = Store.getCurrentUser();
                Store.updateUser(user.id, {
                    firstName: document.getElementById('adm-fn').value,
                    lastName: document.getElementById('adm-ln').value,
                    email: document.getElementById('adm-email').value
                });
                alert('Admin profile updated!');
                window.dispatchEvent(new Event('hashchange'));
            });
        }

        const pwForm = document.getElementById('admin-password-form');
        if (pwForm) {
            pwForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPw = document.getElementById('adm-new-pw').value;
                const confirmPw = document.getElementById('adm-confirm-pw').value;

                if (newPw !== confirmPw) {
                    alert('Passwords do not match!');
                    return;
                }

                const user = Store.getCurrentUser();
                Store.updateUser(user.id, { password: newPw });
                alert('Admin password updated successfully!');
                pwForm.reset();
            });
        }
    }
};
