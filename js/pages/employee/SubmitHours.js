import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

const getWeekStart = (date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);
    start.setHours(0, 0, 0, 0);
    return start;
};

const formatWeekDate = (date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

export const SubmitHours = {
    async render() {
        const user = Store.getCurrentUser() || {};
        const projectsData = Store.getProjects();
        const projects = projectsData.map(p => `<option value="${p.name}" ${user.project === p.name ? 'selected' : ''}>${p.name}</option>`).join('');
        const weekStart = getWeekStart(new Date());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
        const dayIds = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const days = dayNames.map((label, index) => {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + index);
            const isWeekend = index >= 5;
            return {
                id: dayIds[index],
                label,
                date: formatWeekDate(date),
                isWeekend,
                hours: isWeekend ? '0.00' : '8.00',
                notes: ''
            };
        });

        let content = `
            <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 24px; flex-wrap: wrap; gap: 16px;">
                <div>
                    <h1 style="margin-bottom: 8px;">Submit Weekly Hours</h1>
                    <p>Current Week: ${formatWeekDate(weekStart)} - ${formatWeekDate(weekEnd)}, ${weekEnd.getFullYear()}</p>
                </div>
                <div style="display: flex; gap: 12px;">
                    <button class="btn btn-primary" id="btn-submit-ts" style="padding: 12px 24px; font-weight: 600;">
                        <i data-lucide="send"></i> Submit Timesheet
                    </button>
                </div>
            </div>

            <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 24px;">
                <div style="padding: 20px; border-bottom: 1px solid var(--border-light); background: var(--bg-main); display: flex; flex-wrap: wrap; gap: 24px;">
                    <div style="flex: 1; min-width: 200px;">
                        <label style="font-size: 13px; font-weight: 600; color: var(--text-main); margin-bottom: 6px; display: block;">Project / Client</label>
                        <select id="ts-project" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: var(--border-radius-md); font-size: 14px; background: white;">
                            ${projects || '<option value="">No projects</option>'}
                        </select>
                    </div>
                </div>

                <div class="time-grid-header time-grid" style="padding-top: 16px; grid-template-columns: 1fr 1fr 2fr;">
                    <div>Day</div>
                    <div>Hours</div>
                    <div>Notes</div>
                </div>
        `;

        days.forEach(day => {
            content += `
                <div class="time-grid" style="background-color: ${day.isWeekend ? 'var(--bg-main)' : 'white'}; grid-template-columns: 1fr 1fr 2fr; align-items: center; border-bottom: 1px solid var(--border-light); padding: 12px 16px;">
                    <div>
                        <div class="day-label ${day.isWeekend ? 'weekend' : ''}" style="font-weight: 600; color: var(--text-main);">${day.label}</div>
                        <div style="font-size: 12px; color: var(--text-muted);">${day.date}</div>
                    </div>
                    <div>
                        <input type="number" step="0.5" min="0" max="24" value="${day.hours}"
                            class="ts-hours-input"
                            style="width: 80px; padding: 10px; border: 1px solid var(--border-light); border-radius: 6px; font-size: 16px; font-weight: 600; color: var(--brand-blue); text-align: center;"
                            data-day="${day.id}">
                    </div>
                    <div>
                        <input type="text" placeholder="Add note..." class="ts-notes-input" style="width: 100%; padding: 10px; border: 1px solid var(--border-light); border-radius: 6px; font-size: 14px;" data-day="${day.id}">
                    </div>
                </div>
            `;
        });

        content += `
                <div style="padding: 24px; background: var(--bg-main); display: flex; justify-content: flex-end; align-items: center; gap: 16px; border-top: 1px solid var(--border-light);">
                    <div style="font-size: 14px; color: var(--text-muted); font-weight: 600;">WEEKLY TOTAL:</div>
                    <div style="font-size: 28px; font-weight: 800; color: var(--brand-blue);" id="ts-grand-total">40.00</div>
                    <div style="font-size: 14px; font-weight: 600; color: var(--text-muted);">HRS</div>
                </div>
            </div>
            
            <div class="card bg-warning-bg" style="border-left: 4px solid var(--warning);">
                <div style="display: flex; gap: 12px; color: var(--warning);">
                    <i data-lucide="info"></i>
                    <div>
                        <h4 style="margin-bottom: 4px; color: var(--warning);">Important Note</h4>
                        <p style="color: var(--text-main); font-size: 13px; opacity: 0.9;">Please ensure your total weekly hours are accurate before submitting. Submitted timesheets are sent directly to management for approval.</p>
                    </div>
                </div>
            </div>
        `;

        return Layout.render(content, 'employee', '/employee/submit', 'Submit Hours');
    },

    async afterRender() {
        if (window.lucide) {
            window.lucide.createIcons();
        }

        const inputs = document.querySelectorAll('.ts-hours-input');
        const totalDisplay = document.getElementById('ts-grand-total');

        const updateTotal = () => {
            let total = 0;
            inputs.forEach(input => {
                total += parseFloat(input.value || 0);
            });
            totalDisplay.textContent = total.toFixed(2);
        };

        inputs.forEach(input => {
            input.addEventListener('input', updateTotal);
        });

        updateTotal(); // Initial calculation

        const btn = document.getElementById('btn-submit-ts');
        if (btn) {
            btn.addEventListener('click', () => {
                const user = Store.getCurrentUser();
                if(!user) return;
                
                const hours = [];
                inputs.forEach(input => hours.push(parseFloat(input.value || 0)));

                Store.addTimesheet({
                    userId: user.id,
                    userName: `${user.firstName} ${user.lastName}`,
                    project: document.getElementById('ts-project').value,
                    hours: hours,
                    total: parseFloat(totalDisplay.textContent)
                });
                
                alert('Timesheet successfully submitted!');
                window.location.hash = '/employee/dashboard';
            });
        }
    }
};
