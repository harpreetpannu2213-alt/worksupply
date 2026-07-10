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
            <div class="fade-in" style="max-width: 1000px; margin: 0 auto;">
                <!-- Modern Header with Profile Glassmorphism -->
                <div style="position: relative; margin-bottom: 40px; padding: 40px; border-radius: 32px; background: linear-gradient(135deg, #075e54 0%, #128c7e 100%); overflow: hidden; color: white;">
                    <div style="position: absolute; top: -50px; right: -50px; width: 200px; height: 200px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                    <div style="position: absolute; bottom: -20px; left: 10%; width: 100px; height: 100px; background: rgba(255,255,255,0.05); border-radius: 50%;"></div>

                    <div style="position: relative; display: flex; align-items: center; gap: 24px; flex-wrap: wrap;">
                        <div style="position: relative;">
                            <div class="avatar" id="avatar-container" style="width: 90px; height: 90px; font-size: 32px; background: white; color: var(--bg-wa-teal); border: 4px solid rgba(255,255,255,0.3); box-shadow: 0 10px 20px rgba(0,0,0,0.2); overflow: hidden; font-weight: 800;">
                                ${user.photo ? `<img src="${user.photo}" style="width: 100%; height: 100%; object-fit: cover;">` : (user.firstName || 'A').charAt(0) + (user.lastName || 'R').charAt(0)}
                            </div>
                            <label for="profile-pic-upload" style="position: absolute; bottom: 0; right: 0; background: #25d366; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; border: 3px solid #128c7e; box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: transform 0.2s;">
                                <i data-lucide="camera" style="width: 14px; height: 14px;"></i>
                            </label>
                            <input type="file" id="profile-pic-upload" style="display: none;">
                        </div>

                        <div style="flex: 1; min-width: 200px;">
                            <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 4px;">
                                <h1 style="color: white; font-size: 28px; margin: 0; font-weight: 800;">Hey, ${user.firstName}!</h1>
                                <span class="badge" style="background: rgba(255,255,255,0.2); color: white; backdrop-filter: blur(4px); font-size: 11px; font-weight: 700;">PRO MEMBER</span>
                            </div>
                            <p style="color: rgba(255,255,255,0.9); font-size: 15px; display: flex; align-items: center; gap: 8px;">
                                <i data-lucide="map-pin" style="width: 14px; opacity: 0.8;"></i> ${user.location || 'Remote Base'}
                                <span style="opacity: 0.5;">•</span>
                                <i data-lucide="briefcase" style="width: 14px; opacity: 0.8;"></i> ${user.project || 'General Project'}
                            </p>
                        </div>

                        <div style="background: rgba(255,255,255,0.15); backdrop-filter: blur(12px); padding: 16px 24px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.2); display: flex; gap: 32px;">
                            <div style="text-align: center;">
                                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; opacity: 0.7; letter-spacing: 1px; margin-bottom: 4px;">Weekly</div>
                                <div style="font-size: 24px; font-weight: 800;">${currentWeekHours}<span style="font-size: 14px; opacity: 0.7; margin-left: 2px;">h</span></div>
                            </div>
                            <div style="width: 1px; background: rgba(255,255,255,0.2);"></div>
                            <div style="text-align: center;">
                                <div style="font-size: 11px; text-transform: uppercase; font-weight: 700; opacity: 0.7; letter-spacing: 1px; margin-bottom: 4px;">Approved</div>
                                <div style="font-size: 24px; font-weight: 800;">${approvedTimesheets}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 320px; gap: 32px;">
                    <div style="display: flex; flex-direction: column; gap: 32px;">
                        <!-- Hours Trend Canvas Chart -->
                        <div class="card" style="border: none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: white; padding: 24px;">
                            <h3 style="margin: 0 0 20px 0; font-weight: 800; font-size: 18px; color: #1e293b; display: flex; align-items: center; gap: 10px;">
                                <i data-lucide="bar-chart-3" style="color: #10b981; width: 20px;"></i> Activity Trend
                            </h3>
                            <div style="height: 200px; width: 100%; position: relative;">
                                <canvas id="hoursTrendChart"></canvas>
                            </div>
                        </div>

                        <!-- Recent Activity Section -->
                        <div class="card" style="border: none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); overflow: hidden; padding: 0;">
                            <div style="padding: 24px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center; background: #fff;">
                                <h3 style="margin: 0; font-weight: 800; font-size: 18px; color: #1e293b;">Timesheet History</h3>
                                <a href="#/employee/submit" class="btn btn-primary" style="padding: 8px 16px; border-radius: 12px; font-weight: 700; font-size: 13px; text-decoration: none;">
                                    <i data-lucide="plus" style="width: 16px;"></i> SUBMIT HOURS
                                </a>
                            </div>
                            <div style="padding: 0;">
                                <div class="table-container">
                                    <table style="border: none;">
                                        <thead>
                                            <tr style="background: #f8fafc;">
                                                <th style="padding: 12px 24px; background: transparent; border: none;">PERIOD</th>
                                                <th style="padding: 12px 24px; background: transparent; border: none;">TOTAL</th>
                                                <th style="padding: 12px 24px; background: transparent; border: none;">STATUS</th>
                                                <th style="padding: 12px 24px; background: transparent; border: none; text-align: right;">ACTIONS</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${timesheets.length > 0 ? timesheets.map(ts => {
                                                const total = ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1);
                                                const weekDate = new Date(ts.submittedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                                                return `
                                                    <tr>
                                                        <td style="padding: 16px 24px;">
                                                            <div style="font-weight: 700; color: #334155;">Week of ${weekDate}</div>
                                                            <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">Submitted ${new Date(ts.submittedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                                                        </td>
                                                        <td style="padding: 16px 24px;">
                                                            <span style="font-weight: 800; color: #0f172a; background: #f1f5f9; padding: 4px 10px; border-radius: 8px;">${total}h</span>
                                                        </td>
                                                        <td style="padding: 16px 24px;">
                                                            <span class="badge ${ts.status === 'Approved' ? 'success' : 'warning'}" style="padding: 6px 12px; border-radius: 10px; font-weight: 700; font-size: 10px;">
                                                                ${ts.status.toUpperCase()}
                                                            </span>
                                                        </td>
                                                        <td style="padding: 16px 24px; text-align: right;">
                                                            <button class="btn btn-ghost" style="color: #64748b; padding: 8px;"><i data-lucide="arrow-right-circle" style="width: 20px;"></i></button>
                                                        </td>
                                                    </tr>
                                                `;
                                            }).join('') : `
                                                <tr>
                                                    <td colspan="4" style="text-align: center; padding: 60px; color: #94a3b8;">
                                                        <div style="background: #f8fafc; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto;">
                                                            <i data-lucide="calendar-x" style="width: 30px; height: 30px;"></i>
                                                        </div>
                                                        <p style="margin: 0; font-weight: 600;">No history found yet</p>
                                                        <p style="font-size: 12px;">Start by submitting your first timesheet!</p>
                                                    </td>
                                                </tr>
                                            `}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div style="display: flex; flex-direction: column; gap: 32px;">
                        <!-- Profile Quick Settings -->
                        <div class="card" style="border: none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: white;">
                            <h3 style="margin-bottom: 24px; font-weight: 800; display: flex; align-items: center; gap: 10px; color: #1e293b;">
                                <i data-lucide="user-cog" style="color: var(--bg-wa-teal); width: 20px;"></i> Account Settings
                            </h3>
                            <form id="profile-form">
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Full Name</label>
                                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                                        <input type="text" id="prof-fn" value="${user.firstName || ''}" placeholder="First" style="border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; height: 44px;">
                                        <input type="text" id="prof-ln" value="${user.lastName || ''}" placeholder="Last" style="border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; height: 44px;">
                                    </div>
                                </div>
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">WhatsApp Number</label>
                                    <input type="text" id="prof-phone" value="${user.phone || ''}" style="border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; height: 44px;">
                                </div>
                                <button type="submit" class="btn btn-primary" style="width: 100%; height: 48px; border-radius: 12px; font-weight: 700; background: #075e54;">
                                    SAVE PROFILE
                                </button>
                            </form>
                        </div>

                        <!-- Security -->
                        <div class="card" style="border: none; border-radius: 24px; box-shadow: 0 10px 30px rgba(0,0,0,0.04); background: white;">
                            <h3 style="margin-bottom: 24px; font-weight: 800; display: flex; align-items: center; gap: 10px; color: #1e293b;">
                                <i data-lucide="lock" style="color: #f59e0b; width: 20px;"></i> Security
                            </h3>
                            <form id="password-form">
                                <div class="form-group" style="margin-bottom: 20px;">
                                    <label style="font-size: 11px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.5px;">Update Password</label>
                                    <input type="password" id="new-pw" placeholder="Enter new password" style="border-radius: 12px; background: #f8fafc; border: 1px solid #e2e8f0; height: 44px;">
                                </div>
                                <button type="submit" class="btn btn-outline" style="width: 100%; height: 48px; border-radius: 12px; font-weight: 700; border-color: #e2e8f0; color: #64748b;">
                                    RESET PASSWORD
                                </button>
                            </form>
                        </div>

                        <div style="background: #fffbeb; border: 1px solid #fef3c7; padding: 16px; border-radius: 16px; display: flex; gap: 12px; align-items: flex-start;">
                            <i data-lucide="info" style="color: #d97706; width: 20px; flex-shrink: 0;"></i>
                            <p style="font-size: 12px; color: #92400e; margin: 0;">All hours are automatically audited. Please ensure your NIFF is up to date in the directory.</p>
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
