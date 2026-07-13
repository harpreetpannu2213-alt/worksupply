import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';
import { ProfileModal } from '../../components/ProfileModal.js';

export const Directory = {
    selectedUser: null,
    searchTerm: '',

    async render() {
        const isMobile = window.innerWidth < 900;
        const users = Store.getUsersByRole('employee').filter(u => {
            const search = this.searchTerm.toLowerCase();
            return u.firstName.toLowerCase().includes(search) ||
                   u.lastName.toLowerCase().includes(search) ||
                   u.email.toLowerCase().includes(search) ||
                   (u.project && u.project.toLowerCase().includes(search));
        });

        if (this.selectedUser && !users.some(u => u.id === this.selectedUser.id)) {
            this.selectedUser = null;
        }

        if (users.length > 0 && !this.selectedUser && !isMobile) {
            this.selectedUser = users[0];
        }

        const userItems = users.map(user => `
            <div class="directory-item fade-in${this.selectedUser && this.selectedUser.id === user.id ? ' active' : ''}" data-id="${user.id}">
                <div class="directory-item-avatar" style="background: ${user.status === 'Active' ? 'var(--accent-gradient)' : 'var(--text-light)'};">
                    ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                </div>
                <div class="directory-item-meta">
                    <h4>${user.firstName} ${user.lastName}</h4>
                    <p>${user.project || 'Unassigned'} • ${user.status}</p>
                </div>
            </div>
        `).join('');

        const userTimesheets = this.selectedUser ? Store.getTimesheetsByUser(this.selectedUser.id) : [];
        const totalHours = userTimesheets.reduce((acc, ts) => {
            const entryHours = Array.isArray(ts.hours) ? ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0) : parseFloat(ts.hours || 0);
            return acc + entryHours;
        }, 0).toFixed(1);

        const directoryEmptyMessage = this.searchTerm
            ? 'No matching team members found. Try a different name or email.'
            : 'Add your first employee from the Create Employee page to start building your directory.';

        const selectedHtml = this.selectedUser ? `
            <div class="directory-details">
                <div class="detail-card card">
                    <div class="card-header">
                        <div>
                            <h2>${this.selectedUser.firstName} ${this.selectedUser.lastName}</h2>
                            <p style="margin: 6px 0 0; color: var(--text-muted);">${this.selectedUser.role} • ${this.selectedUser.status}</p>
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap; justify-content: flex-end;">
                            <button id="view-full-profile" class="btn btn-outline" style="font-size: 13px;">View Profile</button>
                            <button class="btn btn-primary" style="padding: 10px 18px; font-size: 13px;">Edit</button>
                        </div>
                    </div>
                    <div class="detail-grid">
                        <div class="detail-row"><strong>${totalHours}h</strong><span>Total Hours</span></div>
                        <div class="detail-row"><strong>${userTimesheets.length}</strong><span>Timesheets</span></div>
                        <div class="detail-row"><strong>${this.selectedUser.project || 'Unassigned'}</strong><span>Project</span></div>
                        <div class="detail-row"><strong>${this.selectedUser.niff || 'Pending'}</strong><span>NIFF</span></div>
                    </div>
                </div>

                <div class="detail-card card detail-section">
                    <div>
                        <h3 style="margin-bottom: 16px; font-size: 16px;">Contact Info</h3>
                        <div class="detail-grid">
                            <div class="detail-row"><span>Email</span><strong>${this.selectedUser.email}</strong></div>
                            <div class="detail-row"><span>Phone</span><strong>${this.selectedUser.phone || 'Not provided'}</strong></div>
                            <div class="detail-row"><span>Location</span><strong>${this.selectedUser.location || 'Remote'}</strong></div>
                            <div class="detail-row"><span>Status</span><strong>${this.selectedUser.status}</strong></div>
                        </div>
                    </div>
                </div>

                <div class="detail-card card detail-section">
                    <div>
                        <h3 style="margin-bottom: 16px; font-size: 16px;">Recent Activity</h3>
                        ${userTimesheets.length > 0 ? userTimesheets.slice(-3).reverse().map(ts => `
                            <div class="activity-entry">
                                <div style="display: flex; justify-content: space-between; gap: 16px; align-items: center;">
                                    <div>
                                        <div style="font-size: 14px; font-weight: 600; color: var(--text-main);">${ts.project || 'Timesheet Submitted'}</div>
                                        <div style="font-size: 13px; color: var(--text-muted); margin-top: 4px;">${new Date(ts.submittedAt).toLocaleDateString()} • ${ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0)}h</div>
                                    </div>
                                    <span class="badge ${ts.status === 'Approved' ? 'success' : 'neutral'}">${ts.status}</span>
                                </div>
                            </div>
                        `).join('') : `
                            <div class="empty-state">No activity recorded yet for this team member.</div>
                        `}
                    </div>
                </div>

                <div style="display: flex; gap: 12px; flex-wrap: wrap;">
                    <button id="reset-pwd-btn" class="btn btn-outline" style="flex: 1; min-width: 140px;">Reset Password</button>
                    <button id="del-user-btn" class="btn btn-ghost" style="flex: 1; min-width: 140px; color: var(--danger); background: var(--danger-bg);" data-id="${this.selectedUser.id}">Deactivate</button>
                </div>
            </div>
        ` : `
            <div class="empty-state" style="min-height: 320px; display: flex; align-items: center; justify-content: center; flex-direction: column; gap: 14px;">
                <div style="font-size: 18px; font-weight: 700; color: var(--text-main);">${users.length === 0 ? 'No team members yet' : 'No team members match your search'}</div>
                <div style="max-width: 400px; color: var(--text-muted); text-align: center;">${directoryEmptyMessage}</div>
            </div>
        `;

        const content = `
            <div class="fade-in" style="max-width: 1200px; margin: 0 auto; height: 100%; display: flex; flex-direction: column;">
                <div class="page-header">
                    <div>
                        <h1>Team Directory</h1>
                        <p>${users.length > 0 ? `Manage your ${users.length} team members with a clean, modern directory experience.` : 'Your team directory is currently empty. Add employees to get started.'}</p>
                    </div>
                    <div class="directory-stats">
                        <div class="stat-card"><span>${users.length}</span><small>Team Members</small></div>
                        <div class="stat-card"><span>${Store.getTimesheets().length}</span><small>Total Submissions</small></div>
                        <div class="stat-card"><span>${users.filter(u => u.status === 'Active').length}</span><small>Active Members</small></div>
                    </div>
                </div>

                <div class="directory-layout">
                    <aside class="directory-sidebar card">
                        <div class="directory-sidebar-header">
                            <h2>People</h2>
                            <p style="margin: 0; color: var(--text-muted); font-size: 13px;">Search, filter and select team members from the roster.</p>
                            <div style="position: relative; margin-top: 12px;">
                                <i data-lucide="search" style="position: absolute; left: 14px; top: 50%; transform: translateY(-50%); width: 16px; color: var(--text-light);"></i>
                                <input id="dir-search" type="text" placeholder="Search members..." value="${this.searchTerm}"
                                       style="width: 100%; padding: 12px 14px 12px 42px; border-radius: var(--border-radius-md); border: 1px solid var(--border-light); background: var(--bg-card); font-size: 14px;">
                            </div>
                        </div>
                        <div class="directory-list" style="margin-top: 12px;">
                            ${userItems || `<div class="empty-state">No members found</div>`}
                        </div>
                    </aside>
                    <section class="directory-details">
                        ${selectedHtml}
                    </section>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/directory', 'Team Directory');
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

        const backBtn = document.getElementById('back-to-list');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectedUser = null;
                window.dispatchEvent(new Event('hashchange'));
            });
        }

        const searchInput = document.getElementById('dir-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hashchange'));
                }, 150);
            });
        }

        const items = document.querySelectorAll('.directory-item');
        items.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.getAttribute('data-id');
                const user = Store.getUsers().find(u => u.id === id);
                if (user) {
                    this.selectedUser = user;
                    window.dispatchEvent(new Event('hashchange'));
                }
            });
        });

        const resetBtn = document.getElementById('reset-pwd-btn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                alert(`Password reset link sent to ${this.selectedUser.firstName}`);
            });
        }
        
        const delBtn = document.getElementById('del-user-btn');
        if (delBtn) {
            delBtn.addEventListener('click', () => {
                if(confirm(`Deactivate ${this.selectedUser.firstName}?`)) {
                    Store.deleteUser(delBtn.getAttribute('data-id'));
                    this.selectedUser = null;
                    window.dispatchEvent(new Event('hashchange'));
                }
            });
        }

        const viewProfileBtn = document.getElementById('view-full-profile');
        if (viewProfileBtn && this.selectedUser) {
            viewProfileBtn.addEventListener('click', () => {
                const modalHtml = ProfileModal.render(this.selectedUser);
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                ProfileModal.attachEvents(this.selectedUser);
            });
        }

    }
};
