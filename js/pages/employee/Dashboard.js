import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const EmployeeDashboard = {
    async render() {
        const user = Store.getCurrentUser() || {};
        const timesheets = Store.getTimesheetsByUser(user.id);

        // Calculate stats
        const currentWeekHours = (timesheets.length > 0 && timesheets[0].hours) ?
            timesheets[0].hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1) : "0.0";

        const totalHours = timesheets.reduce((sum, ts) => {
            const rowTotal = (ts.hours && Array.isArray(ts.hours)) ?
                ts.hours.reduce((s, v) => s + parseFloat(v || 0), 0) : 0;
            return sum + rowTotal;
        }, 0).toFixed(1);

        const approvedTimesheets = timesheets.filter(t => t.status === 'Approved').length;

        const content = `
            <div class="fade-in" style="max-width: 1120px; margin: 0 auto;">
                <div class="page-header">
                    <div>
                        <h1>Dashboard</h1>
                        <p>Welcome back, ${user.firstName || 'team member'}. This view keeps your weekly performance and quick controls within reach.</p>
                    </div>
                    <div class="metric-card" style="background: linear-gradient(135deg, #0f766e, #14b8a6); color: white; border: none; box-shadow: none;">
                        <p style="margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.08em;">This week</p>
                        <strong>${currentWeekHours}h</strong>
                        <div style="margin-top: 10px; opacity: 0.85; font-size: 13px;">Hours logged</div>
                    </div>
                </div>

                <div class="dashboard-summary">
                    <div class="metric-card">
                        <p>Total Hours</p>
                        <strong>${totalHours}h</strong>
                    </div>
                    <div class="metric-card">
                        <p>Approved Timesheets</p>
                        <strong>${approvedTimesheets}</strong>
                    </div>
                    <div class="metric-card">
                        <p>Assigned Project</p>
                        <strong>${user.project || 'General Project'}</strong>
                    </div>
                </div>

                <div class="dashboard-grid">
                    <div style="display: grid; gap: 24px;">
                        <div class="card" style="padding: 28px;">
                            <div class="card-header">
                                <h3 style="margin: 0; font-size: 18px;">Activity Trend</h3>
                            </div>
                            <div style="height: 240px; width: 100%;">
                                <canvas id="hoursTrendChart"></canvas>
                            </div>
                        </div>

                        <div class="table-card">
                            <div class="card-header">
                                <h3 style="margin: 0; font-size: 18px;">Timesheet History</h3>
                                <a href="#/employee/submit" class="btn btn-primary btn-pill" style="font-size: 13px; padding: 10px 18px;">Submit Hours</a>
                            </div>
                            <div>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Period</th>
                                            <th>Total</th>
                                            <th>Status</th>
                                            <th style="text-align: right;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${timesheets.length > 0 ? timesheets.map(ts => {
                                            const total = ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1);
                                            const weekDate = new Date(ts.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                            return `
                                                <tr>
                                                    <td>
                                                        <div style="font-weight: 700; color: #334155;">Week of ${weekDate}</div>
                                                        <div style="font-size: 12px; color: #64748b; margin-top: 4px;">Submitted ${new Date(ts.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                    </td>
                                                    <td><span style="display:inline-flex; align-items:center; gap:6px; padding: 5px 10px; border-radius: 999px; background: #f1f5f9; color: #0f172a; font-weight: 700;">${total}h</span></td>
                                                    <td><span class="badge ${ts.status === 'Approved' ? 'success' : 'warning'}">${ts.status.toUpperCase()}</span></td>
                                                    <td style="text-align: right;"><button class="btn btn-ghost" style="padding: 8px;"><i data-lucide="arrow-right-circle" style="width: 20px;"></i></button></td>
                                                </tr>
                                            `;
                                        }).join('') : `
                                            <tr>
                                                <td colspan="4" style="text-align: center; padding: 60px; color: #94a3b8;">
                                                    <div style="margin: 0 auto 18px auto; width: 56px; height: 56px; border-radius: 50%; background: #eff6ff; display: grid; place-items: center;">
                                                        <i data-lucide="calendar-x" style="width: 26px; height: 26px; color: #3b82f6;"></i>
                                                    </div>
                                                    <div style="font-weight: 700; margin-bottom: 6px;">Good start, but empty.</div>
                                                    <div style="font-size: 13px;">Submit your first timesheet to see the report.</div>
                                                </td>
                                            </tr>
                                        `}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; gap: 24px;">
                        <div class="form-panel">
                            <div class="card-header">
                                <h3 style="margin: 0; font-size: 18px;">Profile Quick Actions</h3>
                                <span class="badge neutral">Account</span>
                            </div>
                            <form id="profile-form">
                                <div style="display: grid; gap: 16px;">
                                    <div>
                                        <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Full name</label>
                                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 8px;">
                                            <input type="text" id="prof-fn" value="${user.firstName || ''}" placeholder="First" class="form-control">
                                            <input type="text" id="prof-ln" value="${user.lastName || ''}" placeholder="Last" class="form-control">
                                        </div>
                                    </div>
                                    <div>
                                        <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">WhatsApp number</label>
                                        <input type="text" id="prof-phone" value="${user.phone || ''}" class="form-control" style="margin-top: 8px;">
                                    </div>
                                </div>
                                <button type="submit" class="btn btn-primary btn-pill" style="margin-top: 18px; width: 100%;">Save profile</button>
                            </form>
                        </div>

                        <div class="form-panel">
                            <div class="card-header">
                                <h3 style="margin: 0; font-size: 18px;">Security</h3>
                                <span class="badge neutral">Privacy</span>
                            </div>
                            <form id="password-form">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">New password</label>
                                    <input type="password" id="new-pw" placeholder="Enter new password" class="form-control" style="margin-top: 8px;">
                                </div>
                                <button type="submit" class="btn btn-outline btn-pill" style="margin-top: 18px; width: 100%;">Reset password</button>
                            </form>
                        </div>

                        <div class="card" style="padding: 20px; border-radius: 20px; background: #eff6ff; border: 1px solid #dbeafe;">
                            <div style="display: flex; gap: 12px; align-items: start;">
                                <i data-lucide="info" style="color: #2563eb; width: 20px; flex-shrink: 0;"></i>
                                <div>
                                    <strong style="display:block; margin-bottom: 8px; color: #0f172a;">Keep your profile current</strong>
                                    <p style="margin: 0; color: #475569; font-size: 13px; line-height: 1.6;">Updating your profile ensures project reporting and payouts stay accurate. Your data stays only in browser storage unless shared explicitly.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'employee', '/employee/dashboard', 'Dashboard');
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

        // Initialize Canvas Chart
        this.initChart();

        const form = document.getElementById('profile-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const user = Store.getCurrentUser();
                Store.updateUser(user.id, {
                    firstName: document.getElementById('prof-fn').value,
                    lastName: document.getElementById('prof-ln').value,
                    phone: document.getElementById('prof-phone').value
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
                if (newPw.length < 4) {
                    alert('Password too short!');
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
                        window.dispatchEvent(new Event('hashchange'));
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    },

    initChart() {
        const ctx = document.getElementById('hoursTrendChart');
        if (!ctx) return;

        const user = Store.getCurrentUser();
        const timesheets = Store.getTimesheetsByUser(user.id).slice(0, 5).reverse();

        const labels = timesheets.map(ts => {
            const date = new Date(ts.submittedAt);
            return `${date.getMonth() + 1}/${date.getDate()}`;
        });

        const data = timesheets.map(ts => {
            return ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0);
        });

        if (window.Chart) {
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: labels.length ? labels : ['No Data'],
                    datasets: [{
                        label: 'Weekly Hours',
                        data: data.length ? data : [0],
                        borderColor: '#128c7e',
                        backgroundColor: 'rgba(18, 140, 126, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#fff',
                        pointBorderColor: '#128c7e',
                        pointBorderWidth: 2,
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { display: false }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            grid: { display: false },
                            ticks: { font: { size: 10 } }
                        },
                        x: {
                            grid: { display: false },
                            ticks: { font: { size: 10 } }
                        }
                    }
                }
            });
        }
    }
};
