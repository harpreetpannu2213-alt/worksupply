import { Store } from '../services/Store.js';

export const ProfileModal = {
    render(user) {
        if (!user) return '';

        const timesheets = Store.getTimesheetsByUser(user.id);
        const totalHours = timesheets.reduce((acc, curr) => acc + (parseFloat(curr.hours) || 0), 0);

        return `
            <div class="modal-overlay" id="profile-modal" style="background: rgba(15, 23, 42, 0.9); backdrop-filter: blur(8px);">
                <div class="modal-content fade-in" style="max-width: 600px; width: 95%; position: relative; padding: 0; overflow: hidden; border: none; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);">
                    <button id="close-modal" style="position: absolute; right: 16px; top: 16px; background: white; border: none; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 10; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <i data-lucide="x" style="width: 18px; color: #64748b;"></i>
                    </button>

                    <div style="background: linear-gradient(135deg, #0ea5e9, #0284c7); height: 100px;"></div>

                    <div style="padding: 0 32px 32px 32px; margin-top: -40px;">
                        <div style="display: flex; align-items: flex-end; gap: 20px; margin-bottom: 24px;">
                            <div class="avatar" style="width: 100px; height: 100px; font-size: 36px; background: white; color: #0ea5e9; border: 4px solid white; font-weight: 800; box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);">
                                ${user.photo ? `<img src="${user.photo}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">` : (user.firstName.charAt(0) + user.lastName.charAt(0))}
                            </div>
                            <div style="padding-bottom: 8px;">
                                <h2 style="margin: 0; font-size: 24px; font-weight: 800; color: #0f172a;">${user.firstName} ${user.lastName}</h2>
                                <span class="badge ${user.status === 'Active' ? 'success' : 'warning'}" style="margin-top: 4px;">${user.status}</span>
                            </div>
                        </div>

                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 32px;">
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Total Hours Logged</div>
                                <div style="font-size: 20px; font-weight: 800; color: #0ea5e9; margin-top: 4px;">${totalHours}h</div>
                            </div>
                            <div style="background: #f8fafc; padding: 16px; border-radius: 12px; border: 1px solid #e2e8f0;">
                                <div style="font-size: 11px; color: #64748b; font-weight: 700; text-transform: uppercase;">Current Project</div>
                                <div style="font-size: 18px; font-weight: 700; color: #0f172a; margin-top: 4px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${user.project || 'Unassigned'}</div>
                            </div>
                        </div>

                        <div style="display: flex; flex-direction: column; gap: 20px;">
                            <section>
                                <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="mail" style="width: 16px; color: #0ea5e9;"></i> Contact Details
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b;">Email Address</span>
                                        <span style="font-weight: 600; color: #1e293b;">${user.email}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b;">Phone Number</span>
                                        <span style="font-weight: 600; color: #1e293b;">${user.phone || 'Not provided'}</span>
                                    </div>
                                </div>
                            </section>

                            <section>
                                <h3 style="font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 12px; display: flex; align-items: center; gap: 8px;">
                                    <i data-lucide="briefcase" style="width: 16px; color: #0ea5e9;"></i> Employment info
                                </h3>
                                <div style="display: flex; flex-direction: column; gap: 8px; font-size: 14px;">
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b;">NIFF Identification</span>
                                        <span style="font-weight: 700; color: #0ea5e9; font-family: monospace;">${user.niff || 'Pending'}</span>
                                    </div>
                                    <div style="display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f1f5f9;">
                                        <span style="color: #64748b;">Base Location</span>
                                        <span style="font-weight: 600; color: #1e293b;">${user.location || 'Remote'}</span>
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
