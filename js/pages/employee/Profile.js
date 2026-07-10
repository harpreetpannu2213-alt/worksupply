import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const EmployeeProfile = {
    async render() {
        const user = Store.getCurrentUser() || {};
        const content = `
            <div style="margin-bottom: 32px; text-align: center;">
                <div style="position: relative; display: inline-block; margin-bottom: 16px;">
                    <div class="avatar" id="avatar-container" style="width: 120px; height: 120px; font-size: 40px; background: var(--brand-blue-light); color: var(--brand-blue); border: 4px solid white; box-shadow: var(--shadow-md); overflow: hidden;">
                        ${user.photo ? `<img src="${user.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : (user.firstName || 'A').charAt(0) + (user.lastName || 'R').charAt(0)}
                    </div>
                    <label for="profile-pic-upload" style="position: absolute; bottom: 0; right: 0; background: var(--brand-blue); color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 2px solid white;">
                        <i data-lucide="camera" style="width: 16px; height: 16px;"></i>
                    </label>
                    <input type="file" id="profile-pic-upload" style="display: none;">
                </div>
                <h1 style="margin-bottom: 4px;">${user.firstName} ${user.lastName}</h1>
                <p style="color: var(--brand-blue); font-weight: 500;">${user.project || 'Unassigned Project'}</p>
            </div>

            <div style="max-width: 600px; margin: 0 auto 32px auto; display: flex; flex-direction: column; gap: 24px;">
                <div class="card">
                    <div class="card-header">
                        <h3>Edit Profile Info</h3>
                        <i data-lucide="user-cog" style="color: var(--brand-blue);"></i>
                    </div>
                    <form id="profile-form">
                        <div class="form-group">
                            <label>Full Name</label>
                            <div style="display: flex; gap: 12px;">
                                <input type="text" id="prof-fn" value="${user.firstName || ''}" placeholder="First Name" required>
                                <input type="text" id="prof-ln" value="${user.lastName || ''}" placeholder="Last Name" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="text" id="prof-phone" value="${user.phone || ''}" placeholder="+1 (555) 000-0000">
                        </div>
                        <div class="form-group">
                            <label>Project Name</label>
                            <input type="text" id="prof-proj" value="${user.project || ''}" placeholder="e.g. Engineering, Design">
                        </div>
                        <div class="form-group">
                            <label>Location (Current City/Country)</label>
                            <input type="text" id="prof-loc" value="${user.location || ''}" placeholder="e.g. New York, USA">
                        </div>

                        <div style="margin-top: 24px;">
                            <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; padding: 12px;">
                                <i data-lucide="save"></i> Save Profile Updates
                            </button>
                        </div>
                    </form>
                </div>

                <div class="card">
                    <div class="card-header">
                        <h3>Security</h3>
                        <i data-lucide="shield-lock" style="color: var(--brand-blue);"></i>
                    </div>
                    <form id="password-form">
                        <div class="form-group">
                            <label>New Password</label>
                            <input type="password" id="new-pw" placeholder="Enter new password" required>
                        </div>
                        <div class="form-group">
                            <label>Confirm New Password</label>
                            <input type="password" id="confirm-pw" placeholder="Confirm new password" required>
                        </div>
                        <div style="margin-top: 24px;">
                            <button type="submit" class="btn btn-outline" style="width: 100%; justify-content: center; padding: 12px; color: var(--brand-blue); border-color: var(--brand-blue);">
                                <i data-lucide="refresh-cw"></i> Reset Password
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        return Layout.render(content, 'employee', '/employee/profile', 'My Profile');
    },

    async afterRender() {
        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = Store.getCurrentUser();
                Store.updateUser(user.id, {
                    firstName: document.getElementById('prof-fn').value,
                    lastName: document.getElementById('prof-ln').value,
                    project: document.getElementById('prof-proj').value,
                    phone: document.getElementById('prof-phone').value,
                    location: document.getElementById('prof-loc').value
                });
                alert('Profile updated and saved!');
                window.dispatchEvent(new Event('hashchange'));
            });
        }

        const pwForm = document.getElementById('password-form');
        if (pwForm) {
            pwForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const newPw = document.getElementById('new-pw').value;
                const confirmPw = document.getElementById('confirm-pw').value;

                if (newPw !== confirmPw) {
                    alert('Passwords do not match!');
                    return;
                }

                if (newPw.length < 6) {
                    alert('Password must be at least 6 characters long.');
                    return;
                }

                const user = Store.getCurrentUser();
                Store.updateUser(user.id, { password: newPw });
                alert('Password reset successfully!');
                pwForm.reset();
            });
        }

        const uploadInput = document.getElementById('profile-pic-upload');
        if (uploadInput) {
            uploadInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                        const base64String = event.target.result;
                        const user = Store.getCurrentUser();
                        Store.updateUser(user.id, { photo: base64String });

                        const avatarContainer = document.getElementById('avatar-container');
                        if (avatarContainer) {
                            avatarContainer.innerHTML = `<img src="${base64String}" style="width: 100%; height: 100%; object-fit: cover;">`;
                        }
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }
};
