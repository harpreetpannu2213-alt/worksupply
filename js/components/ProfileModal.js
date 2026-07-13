import { Store } from '../services/Store.js';

export const ProfileModal = {
    render(user) {
        if (!user) return '';

        const timesheets = Store.getTimesheetsByUser(user.id);
        const totalHours = timesheets.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

        return `
            <div class="modal-overlay" id="profile-modal">
                <div class="modal-content fade-in" style="max-width: 600px; width: 95%; position: relative; padding: 0; overflow: hidden; border: 1px solid var(--border-light); box-shadow: var(--shadow-lg);">
                    <button id="close-modal" style="position: absolute; right: 16px; top: 16px; background: rgba(255,255,255,0.06); border: 1px solid var(--border-light); width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; transition: var(--transition);">
                        <i data-lucide="x" style="width: 18px; color: var(--text-main);"></i>
                    </button>

                    <div style="background: var(--accent-gradient); height: 100px;"></div>

                    <div style="padding: 0 32px 32px 32px; margin-top: -40px;">
                        <div style="display: flex; align-items: flex-end; gap: 20px; margin-bottom: 24px;">
                            <div class="avatar" style="width: 100px; height: 100px; font-size: 36px; background: var(--bg-card); color: var(--accent-hover); border: 4px solid var(--bg-card); font-weight: 800; box-shadow: var(--shadow-md); border-radius: 50%; display: flex; align-items: center; justify-content: center; overflow: hidden;">
                                ${user.photo ? `<img src="${user.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` : (user.firstName.charAt(0) + user.lastName.charAt(0))}
                            </div>
                            <div style="padding-bottom: 8px;">
                                <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: var(--text-main); font-family: 'Outfit', sans-serif;">${user.firstName} ${user.lastName}</h2>
                                <span class="badge ${user.status === 'Active' ? 'success' : 'warning'}" style="margin-top: 6px;">${user.status}</span>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
                            <div style="background: var(--bg-elevated); padding: 16px; border-radius: 12px; border: 1px solid var(--border-light);">
                                <div style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Total Hours Logged</div>
                                <div style="font-size: 20px; font-weight: 800; color: var(--accent-hover); margin-top: 4px; font-family: 'Outfit', sans-serif;">${totalHours.toFixed(1)}h</div>
                            </div>
                            <div style="background: var(--bg-elevated); padding: 16px; border-radius: 12px; border: 1px solid var(--border-light);">
                                <div style="font-size: 11px; color: var(--text-muted); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em;">Current Project</div>
                                <div style="font-size: 16px; font-weight: 700; color: var(--text-main); margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.project || 'Unassigned'}</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 20px;">
                            <section>
                                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                                    <i data-lucide="mail" style="width: 16px; color: var(--accent-hover);"></i> Contact Details
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                        <span style="color: var(--text-muted);">Email Address</span>
                                        <span style="font-weight: 600; color: var(--text-main);">${user.email}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                        <span style="color: var(--text-muted);">Phone Number</span>
                                        <span style="font-weight: 600; color: var(--text-main);">${user.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 style="font-size: 13px; font-weight: 700; color: var(--text-main); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.05em;">
                                    <i data-lucide="briefcase" style="width: 16px; color: var(--accent-hover);"></i> Employment info
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                        <span style="color: var(--text-muted);">NIFF Identification</span>
                                        <span style="font-weight: 700; color: var(--accent-hover); font-family: monospace;">${user.niff || 'Pending'}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid var(--border-light);">
                                        <span style="color: var(--text-muted);">Base Location</span>
                                        <span style="font-weight: 600; color: var(--text-main);">${user.location || 'Remote'}</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div style="margin-top: 32px;">
                             <button class="btn btn-primary" style="width: 100%; height: 48px; border-radius: 12px; font-weight: 700;" id="modal-whatsapp">
                                <i data-lucide="message-circle" style="width: 20px;"></i> Contact via WhatsApp
                             </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    },

    attachEvents(user) {
        const closeBtn = document.getElementById('close-modal');
        const modal = document.getElementById('profile-modal');
        const whatsappBtn = document.getElementById('modal-whatsapp');

        if (closeBtn && modal) {
            closeBtn.onclick = () => modal.remove();
            modal.onclick = (e) => {
                if (e.target === modal) modal.remove();
            };
        }

        if (whatsappBtn && user.phone) {
            whatsappBtn.onclick = () => {
                window.open(`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}`, '_blank');
            };
        } else if (whatsappBtn) {
            whatsappBtn.onclick = () => alert('No phone number available for this employee.');
        }

        if (window.lucide) window.lucide.createIcons();
    }
};
