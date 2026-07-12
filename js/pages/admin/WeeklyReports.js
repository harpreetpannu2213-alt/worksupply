import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';
import { ProfileModal } from '../../components/ProfileModal.js';

export const WeeklyReports = {
    viewType: 'employee', // 'employee' or 'project'
    searchTerm: '',

    getWeekStart(date) {
        const start = new Date(date);
        const day = start.getDay();
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        start.setHours(0, 0, 0, 0);
        return start;
    },

    formatPeriodDate(date) {
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    },

    formatPayPeriod(startDate) {
        const endDate = new Date(startDate);
        endDate.setDate(startDate.getDate() + 6);
        return `${this.formatPeriodDate(startDate)} - ${this.formatPeriodDate(endDate)}, ${endDate.getFullYear()}`;
    },

    getPayPeriods() {
        const currentStart = this.getWeekStart(new Date());
        return [0, 1, 2].map(offset => {
            const start = new Date(currentStart);
            start.setDate(currentStart.getDate() - (offset * 7));
            return this.formatPayPeriod(start);
        });
    },

    async render() {
        const timesheets = Store.getTimesheets();
        const users = Store.getUsers();
        const payPeriods = this.getPayPeriods();
        
        let rowsHtml = '';
        if (timesheets.length === 0) {
            rowsHtml = '<tr><td colspan="12" style="text-align:center; padding: 30px; color: var(--text-muted);">No timesheets have been submitted yet.</td></tr>';
        } else {
            if (this.viewType === 'employee') {
                rowsHtml = timesheets
                    .filter(ts => {
                        const user = users.find(u => u.id === ts.userId) || {};
                        const search = this.searchTerm.toLowerCase();
                        return user.firstName?.toLowerCase().includes(search) ||
                               user.lastName?.toLowerCase().includes(search) ||
                               ts.project?.toLowerCase().includes(search) ||
                               user.niff?.toLowerCase().includes(search);
                    })
                    .map(ts => {
                        const user = users.find(u => u.id === ts.userId) || {};
                        const total = ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1);
                        return `
                            <tr>
                                <td class="view-profile-trigger" data-user-id="${user.id}" style="position: sticky; left: 0; background: var(--bg-card); z-index: 10; border-right: 1px solid var(--border-light); font-weight: 600; cursor: pointer; color: var(--brand-blue);">
                                    ${user.firstName} ${user.lastName}
                                </td>
                                <td><span class="badge" style="background: #e2e8f0; color: #4a5568;">${ts.project || '-'}</span></td>
                                <td style="${ts.hours[0] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[0] || '-'}</td>
                                <td style="${ts.hours[1] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[1] || '-'}</td>
                                <td style="${ts.hours[2] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[2] || '-'}</td>
                                <td style="${ts.hours[3] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[3] || '-'}</td>
                                <td style="${ts.hours[4] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[4] || '-'}</td>
                                <td style="${ts.hours[5] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[5] || '-'}</td>
                                <td style="${ts.hours[6] == 0 ? 'color: var(--text-muted);' : ''}">${ts.hours[6] || '-'}</td>
                                <td style="font-weight: 700; color: var(--brand-blue);">${total}</td>
                                <td style="font-family: monospace; color: #4a5568; font-weight: 600;">${user.niff || '-'}</td>
                                <td>
                                    <button class="btn btn-ghost approve-btn" data-id="${ts.id}" style="padding: 4px; color: ${ts.status === 'Approved' ? 'var(--text-muted)' : 'var(--success)'};" ${ts.status === 'Approved' ? 'disabled' : ''}>
                                        <i data-lucide="${ts.status === 'Approved' ? 'check-check' : 'check-circle'}" style="width: 18px;"></i>
                                    </button>
                                </td>
                            </tr>
                        `;
                    }).join('');
            } else {
                // Group by Project
                const projectGroups = {};
                timesheets.forEach(ts => {
                    const projectName = ts.project || 'Unassigned';
                    if (!projectGroups[projectName]) projectGroups[projectName] = [];
                    projectGroups[projectName].push(ts);
                });

                rowsHtml = Object.keys(projectGroups)
                    .filter(proj => proj.toLowerCase().includes(this.searchTerm.toLowerCase()))
                    .map(projectName => {
                    const group = projectGroups[projectName];
                    const projectTotal = group.reduce((sum, ts) => sum + ts.hours.reduce((s, h) => s + parseFloat(h || 0), 0), 0).toFixed(1);

                    const groupRows = group.map(ts => {
                        const user = users.find(u => u.id === ts.userId) || {};
                        const userTotal = ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1);
                        return `
                            <tr style="background: #fcfdfd;">
                                <td class="view-profile-trigger" data-user-id="${user.id}" style="padding-left: 32px; color: #4a5568; cursor: pointer; font-weight: 600;">${user.firstName} ${user.lastName}</td>
                                <td style="font-family: monospace; font-weight: 600; color: var(--brand-blue);">${user.niff || '-'}</td>
                                <td>${ts.hours[0] || '0'}</td>
                                <td>${ts.hours[1] || '0'}</td>
                                <td>${ts.hours[2] || '0'}</td>
                                <td>${ts.hours[3] || '0'}</td>
                                <td>${ts.hours[4] || '0'}</td>
                                <td>${ts.hours[5] || '0'}</td>
                                <td>${ts.hours[6] || '0'}</td>
                                <td style="font-weight: 700;">${userTotal}</td>
                                <td><span class="badge ${ts.status === 'Approved' ? 'success' : 'warning'}">${ts.status || 'Pending'}</span></td>
                            </tr>
                        `;
                    }).join('');

                    return `
                        <tr style="background: #f8fafc;">
                            <td colspan="9" style="font-weight: 800; color: #1a202c; border-left: 4px solid var(--brand-blue);">
                                <i data-lucide="folder" style="width: 16px; display: inline-block; vertical-align: middle; margin-right: 8px; color: var(--brand-blue);"></i>
                                ${projectName} (${group.length} Members)
                            </td>
                            <td style="font-weight: 800; color: var(--brand-blue);">${projectTotal}</td>
                            <td colspan="2"></td>
                        </tr>
                        ${groupRows}
                    `;
                }).join('');
            }
        }

        const tableHeader = this.viewType === 'employee' ? `
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="position: sticky; left: 0; background: #f8fafc; z-index: 10;">Employee</th>
                    <th>Project</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                    <th>Total</th>
                    <th>NIFF</th>
                    <th>Actions</th>
                </tr>
            </thead>
        ` : `
            <thead>
                <tr style="background: #f8fafc;">
                    <th style="padding-left: 32px;">Project / Employee</th>
                    <th>NIFF Number</th>
                    <th>Mon</th>
                    <th>Tue</th>
                    <th>Wed</th>
                    <th>Thu</th>
                    <th>Fri</th>
                    <th>Sat</th>
                    <th>Sun</th>
                    <th>Total</th>
                    <th>Status</th>
                </tr>
            </thead>
        `;

        const content = `
            <div style="max-width: 1120px; margin: 0 auto;">
                <div class="page-header">
                    <div>
                        <h1>Weekly Reports</h1>
                        <p>Track and approve time submissions with fast filtering and export tools.</p>
                    </div>
                    <div class="metric-card">
                        <p>Total Submissions</p>
                        <strong>${timesheets.length}</strong>
                    </div>
                </div>

                <div class="card" style="padding: 22px; margin-bottom: 24px;">
                    <div style="display: grid; gap: 18px;">
                        <div style="display: flex; flex-wrap: wrap; gap: 12px; justify-content: space-between; align-items: center;">
                            <div>
                                <h3 style="margin: 0; font-size: 18px;">Report Controls</h3>
                                <p style="margin: 6px 0 0 0; color: #64748b; font-size: 13px;">Switch views and export the current report quickly.</p>
                            </div>
                            <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                <button id="clear-reports-btn" class="btn btn-outline btn-pill" style="border-color: var(--danger); color: var(--danger);">Clear</button>
                                <button id="export-excel-btn" class="btn btn-outline btn-pill">CSV</button>
                                <button id="export-pdf-btn" class="btn btn-outline btn-pill">PDF</button>
                            </div>
                        </div>
                        <div style="display: grid; grid-template-columns: 1fr 1.4fr 1fr; gap: 16px;">
                            <div>
                                <label class="form-label">View Mode</label>
                                <div style="display: flex; gap: 8px; margin-top: 8px;">
                                    <button id="view-employee-btn" class="btn btn-pill ${this.viewType === 'employee' ? 'active' : ''}" style="flex: 1;">By Employee</button>
                                    <button id="view-project-btn" class="btn btn-pill ${this.viewType === 'project' ? 'active' : ''}" style="flex: 1;">By Project</button>
                                </div>
                            </div>
                            <div>
                                <label class="form-label">Search</label>
                                <div style="position: relative; margin-top: 8px;">
                                    <i data-lucide="search" style="position: absolute; left: 14px; top: 14px; width: 16px; color: #a0aec0;"></i>
                                    <input type="text" id="reports-search" placeholder="Search name, project or NIFF..." value="${this.searchTerm}" class="form-control" style="padding-left: 44px;">
                                </div>
                            </div>
                            <div>
                                <label class="form-label">Pay Period</label>
                                <select class="form-control" style="margin-top: 8px;">
                                    ${payPeriods.map(period => `<option>${period}</option>`).join('')}
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="table-card">
                    <div class="card-header">
                        <h3 style="margin: 0; font-size: 18px;">Submissions</h3>
                        <span class="badge neutral">${this.viewType === 'employee' ? 'Employee View' : 'Project View'}</span>
                    </div>
                    <div class="table-container" id="reports-table-container" style="overflow-x: auto;">
                        <table style="width: 100%; min-width: 860px;">
                            ${tableHeader}
                            <tbody id="reports-tbody">
                                ${rowsHtml}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/reports', 'Weekly Reports');
    },

    async afterRender() {
        const tbody = document.getElementById('reports-tbody');
        if (tbody) {
            tbody.addEventListener('click', (e) => {
                const btn = e.target.closest('.approve-btn');
                if (btn && !btn.disabled) {
                    const id = btn.getAttribute('data-id');
                    Store.updateTimesheetStatus(id, 'Approved');
                    window.dispatchEvent(new Event('hashchange'));
                    return;
                }

                const profileTrigger = e.target.closest('.view-profile-trigger');
                if (profileTrigger) {
                    const userId = profileTrigger.getAttribute('data-user-id');
                    const user = Store.getUsers().find(u => u.id === userId);
                    if (user) {
                        const modalHtml = ProfileModal.render(user);
                        document.body.insertAdjacentHTML('beforeend', modalHtml);
                        ProfileModal.attachEvents(user);
                    }
                }
            });
        }

        // Search logic
        const searchInput = document.getElementById('reports-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hashchange'));
                }, 300);
            });
        }

        // View toggle logic
        document.getElementById('view-employee-btn').onclick = () => {
            this.viewType = 'employee';
            window.dispatchEvent(new Event('hashchange'));
        };
        document.getElementById('view-project-btn').onclick = () => {
            this.viewType = 'project';
            window.dispatchEvent(new Event('hashchange'));
        };

        const clearBtn = document.getElementById('clear-reports-btn');
        if (clearBtn) {
            clearBtn.onclick = () => {
                const timesheets = Store.getTimesheets();
                if (timesheets.length === 0) {
                    alert('Weekly Reports is already clear.');
                    return;
                }

                if (confirm('Clear all weekly report submissions and start fresh?')) {
                    Store.clearTimesheets();
                    this.searchTerm = '';
                    this.viewType = 'employee';
                    window.dispatchEvent(new Event('hashchange'));
                }
            };
        }

        // CSV/Excel Export
        const excelBtn = document.getElementById('export-excel-btn');
        if (excelBtn) {
            console.log('CSV Export: Found button in afterRender');
            excelBtn.onclick = () => {
                console.log('CSV Export: Button clicked via onclick');
                const timesheets = Store.getTimesheets();
                if (timesheets.length === 0) {
                    alert('No data to export.');
                    return;
                }

                const users = Store.getUsers();
                let csv = 'Employee,Project,Mon,Tue,Wed,Thu,Fri,Sat,Sun,Total,NIFF\n';

                timesheets.forEach(ts => {
                    const user = users.find(u => u.id === ts.userId) || {};
                    const total = ts.hours.reduce((sum, val) => sum + parseFloat(val || 0), 0).toFixed(1);
                    const row = [
                        `"${user.firstName} ${user.lastName}"`,
                        `"${ts.project || ''}"`,
                        ...ts.hours,
                        total,
                        `"${user.niff || ''}"`
                    ].join(',');
                    csv += row + '\n';
                });

                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
                console.log('CSV Export: Blob created');

                if (window.AndroidBridge) {
                    console.log('CSV Export: Using AndroidBridge');
                    const reader = new FileReader();
                    reader.onload = function() {
                        console.log('CSV Export: FileReader loaded, calling saveFile');
                        window.AndroidBridge.saveFile(reader.result, 'weekly_reports.csv', 'text/csv');
                    };
                    reader.readAsDataURL(blob);
                } else {
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    link.setAttribute('href', url);
                    link.setAttribute('download', 'weekly_reports.csv');
                    link.style.visibility = 'hidden';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                }
            };
        }

        // PDF Export
        const pdfBtn = document.getElementById('export-pdf-btn');
        if (pdfBtn) {
            console.log('PDF Export: Found button in afterRender');
            pdfBtn.onclick = () => {
                console.log('PDF Export: Button clicked via onclick');
                const timesheets = Store.getTimesheets();
                if (timesheets.length === 0) {
                    alert('No data to export.');
                    return;
                }

                const originalBtnText = pdfBtn.innerHTML;
                pdfBtn.innerHTML = 'Generating...';
                pdfBtn.disabled = true;
                
                // Use a dedicated wrapper for PDF to ensure clean formatting
                const pdfContainer = document.createElement('div');
                pdfContainer.style.cssText = `
                    padding: 40px;
                    background: white;
                    color: black;
                    width: 1100px;
                    font-family: sans-serif;
                `;

                const headerHtml = `
                    <div style="display: flex; justify-content: space-between; margin-bottom: 30px; border-bottom: 2px solid #128c7e; padding-bottom: 20px;">
                        <div>
                            <h1 style="color: #128c7e; margin: 0; font-size: 24px;">WORKSUPPLY - Weekly Report</h1>
                            <p style="color: #666; margin: 5px 0 0 0;">Generated on ${new Date().toLocaleDateString()}</p>
                        </div>
                        <div style="text-align: right;">
                            <p style="margin: 0; font-weight: bold;">View Mode: ${this.viewType === 'employee' ? 'By Employee' : 'By Project'}</p>
                            <p style="margin: 5px 0 0 0; color: #666;">Total Records: ${timesheets.length}</p>
                        </div>
                    </div>
                `;

                // Clone the table but strip out UI-only elements like actions
                const tableClone = document.getElementById('reports-table-container').querySelector('table').cloneNode(true);

                // Remove the "Actions" column if it exists (Employee View)
                const actionHeader = tableClone.querySelector('th:last-child');
                if (actionHeader && actionHeader.textContent.trim().toLowerCase() === 'actions') {
                    actionHeader.remove();
                    tableClone.querySelectorAll('tr').forEach(tr => {
                        const lastTd = tr.querySelector('td:last-child');
                        if (lastTd && lastTd.querySelector('.approve-btn')) {
                            lastTd.remove();
                        }
                    });
                }

                // Fix table styles for PDF
                tableClone.style.cssText = 'width: 100%; border-collapse: collapse; border: 1px solid #ddd;';
                tableClone.querySelectorAll('th, td').forEach(cell => {
                    cell.style.cssText += 'border: 1px solid #ddd; padding: 10px; text-align: left; font-size: 12px; background: white !important; color: black !important; position: static !important;';
                });
                tableClone.querySelectorAll('th').forEach(th => {
                    th.style.backgroundColor = '#f8fafc';
                    th.style.fontWeight = 'bold';
                });

                pdfContainer.innerHTML = headerHtml;
                pdfContainer.appendChild(tableClone);

                // Hidden append to body for rendering
                document.body.appendChild(pdfContainer);

                const fileName = `WorkSupply_Report_${new Date().getTime()}.pdf`;
                const opt = {
                    margin:       [0.3, 0.3],
                    filename:     fileName,
                    image:        { type: 'jpeg', quality: 0.98 },
                    html2canvas:  {
                        scale: 2,
                        useCORS: true,
                        logging: false,
                        letterRendering: true
                    },
                    jsPDF:        { unit: 'in', format: 'a4', orientation: 'landscape' }
                };
                
                if (window.html2pdf) {
                    console.log('PDF Export: html2pdf found, starting worker');
                    const worker = window.html2pdf().set(opt).from(pdfContainer);

                    if (window.AndroidBridge) {
                        console.log('PDF Export: Using AndroidBridge');
                        worker.outputPdf('datauristring').then((pdfBase64) => {
                            console.log('PDF Export: PDF generated, calling saveFile');
                            window.AndroidBridge.saveFile(pdfBase64, fileName, 'application/pdf');
                            cleanup();
                        });
                    } else {
                        worker.save().then(() => {
                            cleanup();
                        });
                    }

                    function cleanup() {
                        document.body.removeChild(pdfContainer);
                        pdfBtn.innerHTML = originalBtnText;
                        pdfBtn.disabled = false;
                        if(window.lucide) window.lucide.createIcons();
                    }

                    worker.catch(err => {
                        console.error('PDF Error:', err);
                        document.body.removeChild(pdfContainer);
                        pdfBtn.innerHTML = originalBtnText;
                        pdfBtn.disabled = false;
                        alert('Could not generate PDF. Please try again.');
                    });
                } else {
                    document.body.removeChild(pdfContainer);
                    pdfBtn.innerHTML = originalBtnText;
                    pdfBtn.disabled = false;
                    alert('PDF library is still loading. Please wait a moment.');
                }
            };
        }
    }
};
