import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const AdminProfile = {
    async render() {
        const user = Store.getCurrentUser() || {};

        const content = `
            <div style="max-width: 800px; margin: 0 auto;">
                <div style="margin-bottom: 32px;">
                    <h1 style="margin: 0; font-weight: 800; font-size: 28px; color: #0f172a;">Admin Settings</h1>
                    <p style="color: #64748b; margin-top: 4px;">Manage your account credentials and system data.</p>
                </div>

                <div style="display: grid; grid-template-columns: 1fr; gap: 24px;">
                    <!-- Personal Info Card -->
                    <div class="card" style="border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); background: white; padding: 32px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: #f0f9ff; color: #0ea5e9; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="user" style="width: 20px;"></i>
                            </div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Personal Information</h3>
                        </div>

                        <form id="admin-profile-form">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                                <div class="form-group">
                                    <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">First Name</label>
                                    <input type="text" id="adm-fn" value="${user.firstName || ''}" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                                </div>
                                <div class="form-group">
                                    <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Last Name</label>
                                    <input type="text" id="adm-ln" value="${user.lastName || ''}" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                                </div>
                            </div>
                            <div class="form-group" style="margin-bottom: 24px;">
                                <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Email Address</label>
                                <input type="email" id="adm-email" value="${user.email || ''}" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                            </div>
                            <button type="submit" class="btn btn-primary" style="height: 48px; border-radius: 12px; font-weight: 700; background: #0ea5e9; width: 200px;">
                                Update Profile
                            </button>
                        </form>
                    </div>

                    <!-- Password Card -->
                    <div class="card" style="border-radius: 20px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); background: white; padding: 32px;">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
                            <div style="width: 40px; height: 40px; border-radius: 10px; background: #fefce8; color: #ca8a04; display: flex; align-items: center; justify-content: center;">
                                <i data-lucide="lock" style="width: 20px;"></i>
                            </div>
                            <h3 style="margin: 0; font-size: 18px; font-weight: 700;">Security</h3>
                        </div>

                        <form id="admin-password-form">
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px;">
                                <div class="form-group">
                                    <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">New Password</label>
                                    <input type="password" id="adm-new-pw" placeholder="••••••••" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                                </div>
                                <div class="form-group">
                                    <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; margin-bottom: 8px;">Confirm Password</label>
                                    <input type="password" id="adm-confirm-pw" placeholder="••••••••" required style="height: 44px; border-radius: 10px; border: 1.5px solid #e2e8f0; font-size: 14px;">
                                </div>
                            </div>
                            <button type="submit" class="btn btn-outline" style="height: 48px; border-radius: 12px; font-weight: 700; color: #0ea5e9; border-color: #0ea5e9; width: 200px;">
                                Change Password
                            </button>
                        </form>
                    </div>


                    <div style="text-align: center; padding: 20px;">
                         <button id="btn-logout" class="btn btn-ghost" style="color: #64748b; font-weight: 600;">
                            <i data-lucide="log-out" style="width: 18px;"></i> Logout from System
                         </button>
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
