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

        if (users.length > 0 && !this.selectedUser && !isMobile) {
            this.selectedUser = users[0];
        }

        const userItems = users.map(user => `
            <div class="dir-item fade-in" data-id="${user.id}"
                 style="padding: 12px; border-radius: 12px; background: ${this.selectedUser && this.selectedUser.id === user.id ? 'var(--brand-blue-light)' : 'white'};
                        cursor: pointer; transition: var(--transition); display: flex; align-items: center; gap: 12px;
                        border: 1px solid ${this.selectedUser && this.selectedUser.id === user.id ? 'var(--brand-blue)' : 'var(--border-light)'};
                        box-shadow: ${this.selectedUser && this.selectedUser.id === user.id ? 'var(--shadow-md)' : 'var(--shadow-sm)'};
                        min-width: 200px; text-align: left;">
                <div class="avatar" style="width: 40px; height: 40px; background: ${user.status === 'Active' ? 'var(--brand-blue)' : 'var(--text-muted)'}; color: white; flex-shrink: 0; font-size: 14px; font-weight: 600;">
                    ${user.firstName.charAt(0)}${user.lastName.charAt(0)}
                </div>
                <div style="flex: 1; min-width: 0;">
                    <div style="font-weight: 600; color: var(--text-main); font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: flex; align-items: center; gap: 6px;">
                        ${user.firstName} ${user.lastName}
                        ${user.status === 'Active' ? '<span style="width: 6px; height: 6px; border-radius: 50%; background: var(--success);"></span>' : ''}
                    </div>
                    <div style="font-size: 12px; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                        ${user.project || 'Unassigned'}
                    </div>
                </div>
            </div>
        `).join('');

        const userTimesheets = this.selectedUser ? Store.getTimesheetsByUser(this.selectedUser.id) : [];
        const totalHours = userTimesheets.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

        const selectedHtml = this.selectedUser ? `
            <div style="height: 100%; display: flex; flex-direction: column; background: var(--bg-main);">
                <!-- Profile Header -->
                <div style="background: white; padding: 24px; border-bottom: 1px solid var(--border-light);">
                    <div style="display: flex; align-items: flex-start; justify-content: space-between; flex-wrap: wrap; gap: 16px;">
                        <div style="display: flex; align-items: center; gap: 20px;">
                            <div class="avatar" style="width: 72px; height: 72px; font-size: 24px; background: var(--brand-blue-light); color: var(--brand-blue); border: 2px solid white; font-weight: 700; box-shadow: var(--shadow-md);">
                                ${this.selectedUser.firstName.charAt(0)}${this.selectedUser.lastName.charAt(0)}
                            </div>
                            <div>
                                <h2 style="margin: 0; font-weight: 700; color: var(--text-main); font-size: 24px;">${this.selectedUser.firstName} ${this.selectedUser.lastName}</h2>
                                <div style="display: flex; align-items: center; gap: 8px; margin-top: 4px;">
                                    <span class="badge ${this.selectedUser.status === 'Active' ? 'success' : 'warning'}" style="font-size: 11px;">
                                        ${this.selectedUser.status}
                                    </span>
                                    <span style="font-size: 13px; color: var(--text-muted); font-weight: 500;">${this.selectedUser.role}</span>
                                </div>
                            </div>
                        </div>
                        <div style="display: flex; gap: 8px;">
                            <button id="view-full-profile" class="btn btn-outline" style="font-size: 13px;">
                                <i data-lucide="user" style="width: 16px;"></i> View Profile
                            </button>
                            <button class="btn btn-primary" style="padding: 10px;">
                                <i data-lucide="edit-2" style="width: 18px;"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Quick Stats -->
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 16px; margin-top: 24px;">
                        <div class="card" style="padding: 16px; background: var(--bg-main); border: none;">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Total Hours</div>
                            <div style="font-size: 20px; font-weight: 700; color: var(--brand-blue); margin-top: 4px;">${totalHours}h</div>
                        </div>
                        <div class="card" style="padding: 16px; background: var(--bg-main); border: none;">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Timesheets</div>
                            <div style="font-size: 20px; font-weight: 700; color: var(--text-main); margin-top: 4px;">${userTimesheets.length}</div>
                        </div>
                        <div class="card" style="padding: 16px; background: var(--bg-main); border: none;">
                            <div style="font-size: 11px; color: var(--text-muted); font-weight: 600; text-transform: uppercase;">Project</div>
                            <div style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-top: 4px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${this.selectedUser.project || 'Unassigned'}</div>
                        </div>
                    </div>
                </div>

                <!-- Detailed Content -->
                <div style="flex: 1; overflow-y: auto; padding: 24px;">
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                        <section class="card" style="padding: 20px;">
                            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="mail" style="width: 18px; color: var(--brand-blue);"></i> Contact Info
                            </h3>
                            <div style="display: flex; flex-direction: column; gap: 12px;">
                                <div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Email Address</div>
                                    <div style="font-size: 14px; font-weight: 500;">${this.selectedUser.email}</div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Phone Number</div>
                                    <div style="font-size: 14px; font-weight: 500; display: flex; align-items: center; justify-content: space-between;">
                                        ${this.selectedUser.phone || 'Not provided'}
                                        ${this.selectedUser.phone ? `
                                        <a href="https://wa.me/${this.selectedUser.phone.replace(/[^0-9]/g, '')}" target="_blank"
                                           style="color: var(--success); text-decoration: none; font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 4px;">
                                           <i data-lucide="message-circle" style="width: 14px;"></i> CHAT
                                        </a>` : ''}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section class="card" style="padding: 20px;">
                            <h3 style="font-size: 14px; font-weight: 600; margin-bottom: 16px; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="briefcase" style="width: 18px; color: var(--brand-blue);"></i> Employment
                            </h3>
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                                <div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">NIFF</div>
                                    <div style="font-size: 14px; font-weight: 600;">${this.selectedUser.niff || 'Pending'}</div>
                                </div>
                                <div>
                                    <div style="font-size: 11px; color: var(--text-muted); text-transform: uppercase;">Location</div>
                                    <div style="font-size: 14px; font-weight: 600;">${this.selectedUser.location || 'Remote'}</div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <!-- Recent Activity -->
                    <section class="card" style="margin-top: 24px; padding: 0; overflow: hidden;">
                        <div style="padding: 16px 20px; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; gap: 8px;">
                            <i data-lucide="clock" style="width: 18px; color: var(--brand-blue);"></i>
                            <h3 style="font-size: 14px; font-weight: 600; margin: 0;">Recent Activity</h3>
                        </div>
                        <div>
                            ${userTimesheets.length > 0 ? userTimesheets.slice(-3).reverse().map(ts => `
                                <div style="padding: 12px 20px; border-bottom: 1px solid var(--border-light); display: flex; justify-content: space-between; align-items: center;">
                                    <div>
                                        <div style="font-size: 13px; font-weight: 500;">Timesheet Submitted</div>
                                        <div style="font-size: 12px; color: var(--text-muted);">${new Date(ts.submittedAt).toLocaleDateString()} • ${ts.hours}h</div>
                                    </div>
                                    <span class="badge ${ts.status === 'Approved' ? 'success' : 'neutral'}" style="font-size: 10px;">${ts.status}</span>
                                </div>
                            `).join('') : `
                                <div style="padding: 32px; text-align: center; color: var(--text-muted); font-size: 13px;">
                                    No activity recorded
                                </div>
                            `}
                        </div>
                    </section>
                </div>

                <!-- Footer Actions -->
                <div style="background: white; padding: 16px 24px; border-top: 1px solid var(--border-light); display: flex; gap: 12px;">
                    <button id="reset-pwd-btn" class="btn btn-outline" style="flex: 1;">
                        <i data-lucide="key" style="width: 16px;"></i> Reset Password
                    </button>
                    <button class="btn btn-ghost" style="flex: 1; color: var(--danger); background: var(--danger-bg);" id="del-user-btn" data-id="${this.selectedUser.id}">
                        <i data-lucide="user-x" style="width: 16px;"></i> Deactivate
                    </button>
                </div>
            </div>
        ` : `
            <div style="height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #94a3b8; text-align: center; padding: 40px;">
                <i data-lucide="user" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                <p>Select an employee to view details</p>
            </div>
        `;

        const showList = !isMobile || !this.selectedUser;
        const showDetails = !isMobile || !!this.selectedUser;

        const content = `
            <div style="max-width: 1200px; margin: 0 auto; height: 100%; display: flex; flex-direction: column;">
                <div style="margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-end;">
                    <div>
                        <h1 style="margin: 0; font-weight: 800; font-size: 24px; color: #0f172a;">Team Directory</h1>
                        <p style="margin: 4px 0 0 0; color: #64748b;">Manage your ${users.length} team members</p>
                    </div>
                </div>

                <div style="display: flex; flex-direction: column; background: white; border-radius: var(--border-radius-lg); overflow: hidden; border: 1px solid var(--border-light); flex: 1; min-height: 0; box-shadow: var(--shadow-sm);">
                    <!-- Horizontal List Area -->
                    <div style="${showList ? '' : 'display: none;'} border-bottom: 1px solid var(--border-light); display: flex; flex-direction: column; background: var(--bg-main);">
                        <div style="padding: 16px; border-bottom: 1px solid var(--border-light); display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
                            <div style="position: relative; flex: 1; min-width: 200px;">
                                <i data-lucide="search" style="position: absolute; left: 12px; top: 10px; width: 14px; color: var(--text-muted);"></i>
                                <input type="text" id="dir-search" placeholder="Search team members..."
                                       value="${this.searchTerm}"
                                       style="width: 100%; padding: 8px 12px 8px 34px; border-radius: var(--border-radius-md); border: 1px solid var(--border-light); background: white; font-size: 13px; height: 36px;">
                            </div>
                            <div style="font-size: 11px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Team Quick Select</div>
                        </div>
                        <div style="overflow-x: auto; padding: 12px 16px; display: flex; gap: 12px; scrollbar-width: none; -ms-overflow-style: none;">
                            <style>
                                div::-webkit-scrollbar { display: none; }
                            </style>
                            ${userItems || `<div style="text-align: center; padding: 20px; color: var(--text-muted); font-size: 13px;">No members found</div>`}
                        </div>
                    </div>

                    <!-- Details Area -->
                    <div style="${showDetails ? '' : 'display: none;'} background: white; display: flex; flex-direction: column; flex: 1; min-height: 0;">
                        ${isMobile && this.selectedUser ? `
                            <div style="padding: 12px 20px; border-bottom: 1px solid var(--border-light); flex-shrink: 0; background: white;">
                                <button id="back-to-list" class="btn btn-ghost" style="color: var(--brand-blue); font-weight: 600; font-size: 13px; padding: 0; display: flex; align-items: center; gap: 4px;">
                                    <i data-lucide="arrow-left" style="width: 16px;"></i> Back to List
                                </button>
                            </div>
                        ` : ''}
                        <div style="flex: 1; min-height: 0;">
                            ${selectedHtml}
                        </div>
                    </div>
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

        const items = document.querySelectorAll('.dir-item');
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
