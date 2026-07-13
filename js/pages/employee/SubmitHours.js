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
            <div class="fade-in" style="max-width: 1000px; margin: 0 auto;">
                <div style="display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 32px; flex-wrap: wrap; gap: 16px;">
                    <div>
                        <h1 style="margin-bottom: 8px;">Submit Weekly Hours</h1>
                        <p style="color: var(--text-muted);">Current Week: ${formatWeekDate(weekStart)} - ${formatWeekDate(weekEnd)}, ${weekEnd.getFullYear()}</p>
                    </div>
                    <div>
                        <button class="btn btn-primary" id="btn-submit-ts" style="padding: 12px 24px;">
                            <i data-lucide="send"></i> Submit Timesheet
                        </button>
                    </div>
                </div>

                <div class="card" style="padding: 0; overflow: hidden; margin-bottom: 32px;">
                    <div style="padding: 24px; border-bottom: 1px solid var(--border-light); background: var(--bg-elevated); display: flex; flex-wrap: wrap; gap: 24px; align-items: center;">
                        <div style="flex: 1; min-width: 280px; max-width: 400px;">
                            <label style="margin-bottom: 8px; display: block;">Project / Client</label>
                            <select id="ts-project" style="width: 100%; padding: 12px; background: var(--bg-card);">
                                ${projects || '<option value="">No projects</option>'}
                            </select>
                        </div>
                    </div>

                    <div class="time-grid-header time-grid" style="grid-template-columns: 180px 140px 1fr;">
                        <div>Day</div>
                        <div>Hours</div>
                        <div>Notes</div>
                    </div>
        `;

        days.forEach(day => {
            content += `
                <div class="time-grid" style="background-color: ${day.isWeekend ? 'rgba(255,255,255,0.01)' : 'transparent'}; grid-template-columns: 180px 140px 1fr; align-items: center; border-bottom: 1px solid var(--border-light); padding: 16px 24px;">
                    <div>
                        <div class="day-label ${day.isWeekend ? 'weekend' : ''}">${day.label}</div>
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">${day.date}</div>
                    </div>
                    <div>
                        <input type="number" step="0.5" min="0" max="24" value="${day.hours}"
                            class="ts-hours-input"
                            style="width: 90px; padding: 10px; border: 1.5px solid var(--border-light); border-radius: var(--border-radius-sm); font-size: 16px; font-weight: 700; color: var(--accent-hover); text-align: center; background: var(--bg-glass);"
                            data-day="${day.id}">
                    </div>
                    <div>
                        <input type="text" placeholder="Add note..." class="ts-notes-input" style="width: 100%; padding: 10px 14px; border: 1.5px solid var(--border-light); border-radius: var(--border-radius-sm); font-size: 14px; background: var(--bg-glass);" data-day="${day.id}">
                    </div>
                </div>
            `;
        });

        content += `
                    <div style="padding: 24px 32px; background: var(--bg-elevated); display: flex; justify-content: flex-end; align-items: center; gap: 16px; border-top: 1px solid var(--border-light);">
                        <div style="font-size: 14px; color: var(--text-muted); font-weight: 700; letter-spacing: 0.05em;">WEEKLY TOTAL:</div>
                        <div style="font-size: 32px; font-weight: 900; color: var(--accent-hover); font-family: 'Outfit', sans-serif;" id="ts-grand-total">40.00</div>
                        <div style="font-size: 14px; font-weight: 700; color: var(--text-muted);">HRS</div>
                    </div>
                </div>
                
                <div class="card" style="border-left: 4px solid var(--warning); background: var(--warning-bg); border-color: var(--warning-border);">
                    <div style="display: flex; gap: 14px; color: var(--warning);">
                        <i data-lucide="info" style="margin-top: 2px;"></i>
                        <div>
                            <h4 style="margin-bottom: 6px; color: var(--warning); font-weight: 700;">Important Note</h4>
                            <p style="color: var(--text-main); font-size: 13.5px; opacity: 0.9; line-height: 1.5;">Please ensure your total weekly hours are accurate before submitting. Submitted timesheets are sent directly to management for approval.</p>
                        </div>
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
