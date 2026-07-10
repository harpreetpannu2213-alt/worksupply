import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const ManageProjects = {
    searchTerm: '',

    async render() {
        const projects = Store.getProjects().filter(p =>
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );

        const projectCards = projects.map(p => `
            <div class="project-card fade-in" data-id="${p.id}"
                 style="background: white; border-radius: 16px; padding: 20px; border: 1px solid #edf2f7;
                        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); display: flex; align-items: center;
                        justify-content: space-between; transition: all 0.2s ease;">
                <div style="flex: 1; display: flex; align-items: center; gap: 16px;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: rgba(18, 140, 126, 0.1);
                                color: var(--brand-blue); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        <i data-lucide="briefcase" style="width: 20px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <div class="project-display" style="font-weight: 700; color: #2d3748; font-size: 16px;">${p.name}</div>
                        <input type="text" class="project-edit-input form-control" value="${p.name}"
                               style="display: none; width: 100%; height: 36px; font-size: 15px; font-weight: 600;">
                        <div style="font-size: 12px; color: #a0aec0; margin-top: 2px;">Created: ${p.createdAt || 'N/A'}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-ghost edit-btn" title="Edit Name" style="color: #4a5568; padding: 8px;">
                        <i data-lucide="edit-3" style="width: 18px;"></i>
                    </button>
                    <button class="btn btn-ghost save-btn" title="Save Changes" style="display: none; color: var(--success); padding: 8px;">
                        <i data-lucide="check" style="width: 18px;"></i>
                    </button>
                    <button class="btn btn-ghost delete-btn" title="Delete Project" style="color: #e53e3e; padding: 8px;">
                        <i data-lucide="trash-2" style="width: 18px;"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const content = `
            <div style="margin-bottom: 32px; display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h1 style="margin-bottom: 4px; font-weight: 800;">Project Portfolio</h1>
                    <p style="color: #718096;">Manage site locations and client projects.</p>
                </div>
                <div class="card" style="margin: 0; padding: 8px 16px; background: white; border-radius: 12px; display: flex; align-items: center; gap: 12px; border: 1px solid #edf2f7;">
                    <div style="text-align: right;">
                        <div style="font-size: 20px; font-weight: 800; color: var(--brand-blue); line-height: 1;">${Store.getProjects().length}</div>
                        <div style="font-size: 10px; color: #a0aec0; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px;">Active Projects</div>
                    </div>
                    <div style="width: 1px; height: 24px; background: #edf2f7;"></div>
                    <i data-lucide="layers" style="color: #cbd5e0; width: 20px;"></i>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 350px 1fr; gap: 32px; align-items: start;">
                <!-- Add Project Sidebar -->
                <div class="card" style="border: none; box-shadow: 0 10px 25px rgba(0,0,0,0.05); border-radius: 20px; padding: 24px; position: sticky; top: 24px;">
                    <h3 style="margin-bottom: 20px; font-weight: 700; display: flex; align-items: center; gap: 10px;">
                        <i data-lucide="plus-circle" style="color: var(--brand-blue);"></i> New Project
                    </h3>
                    <form id="add-project-form">
                        <div class="form-group" style="margin-bottom: 20px;">
                            <label style="font-size: 12px; font-weight: 700; color: #a0aec0; text-transform: uppercase; margin-bottom: 8px; display: block;">Name</label>
                            <input type="text" id="new-project-name" placeholder="e.g. Central Plaza Phase 2"
                                   required style="width: 100%; border-radius: 12px; border: 1px solid #e2e8f0; padding: 12px 16px; font-size: 15px;">
                        </div>
                        <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; height: 48px; border-radius: 12px; font-weight: 700; font-size: 15px; gap: 8px;">
                            <i data-lucide="plus"></i> Create Project
                        </button>
                    </form>

                    <div style="margin-top: 32px; padding-top: 24px; border-top: 1px dashed #e2e8f0;">
                        <h4 style="font-size: 13px; color: #718096; margin-bottom: 12px;">Pro Tips:</h4>
                        <ul style="padding: 0; margin: 0; list-style: none; font-size: 13px; color: #a0aec0; line-height: 1.6;">
                            <li style="display: flex; gap: 8px; margin-bottom: 8px;"><i data-lucide="check" style="width: 14px; color: var(--success); flex-shrink: 0;"></i> Use distinct names for each site.</li>
                            <li style="display: flex; gap: 8px;"><i data-lucide="check" style="width: 14px; color: var(--success); flex-shrink: 0;"></i> Deleting a project won't erase history.</li>
                        </ul>
                    </div>
                </div>

                <!-- Main Project List -->
                <div style="display: flex; flex-direction: column; gap: 20px;">
                    <div style="position: relative; width: 100%;">
                        <i data-lucide="search" style="position: absolute; left: 16px; top: 14px; width: 18px; color: #a0aec0;"></i>
                        <input type="text" id="project-search" placeholder="Filter projects by name..."
                               value="${this.searchTerm}"
                               style="width: 100%; padding: 14px 14px 14px 48px; border-radius: 16px; border: 1px solid #edf2f7; background: white; font-size: 15px; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr; gap: 16px;">
                        ${projectCards || `
                            <div style="text-align: center; padding: 60px; background: white; border-radius: 20px; color: #a0aec0; border: 2px dashed #edf2f7;">
                                <i data-lucide="inbox" style="width: 48px; height: 48px; margin-bottom: 16px; opacity: 0.5;"></i>
                                <p>No projects found. Create your first one!</p>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/projects', 'Manage Projects');
    },

    async afterRender() {
        const searchInput = document.getElementById('project-search');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchTerm = e.target.value;
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    window.dispatchEvent(new Event('hashchange'));
                }, 300);
            });
        }

        const form = document.querySelector('#add-project-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = document.querySelector('#new-project-name').value;
                if (!name) return;
                Store.addProject(name);
                window.dispatchEvent(new Event('hashchange'));
            });
        }
        
        const cards = document.querySelectorAll('.project-card');
        cards.forEach(card => {
            const id = card.getAttribute('data-id');
            const editBtn = card.querySelector('.edit-btn');
            const saveBtn = card.querySelector('.save-btn');
            const deleteBtn = card.querySelector('.delete-btn');
            const display = card.querySelector('.project-display');
            const input = card.querySelector('.project-edit-input');

            editBtn.onclick = (e) => {
                e.stopPropagation();
                display.style.display = 'none';
                input.style.display = 'block';
                input.focus();
                editBtn.style.display = 'none';
                saveBtn.style.display = 'inline-flex';
                card.style.borderColor = 'var(--brand-blue)';
                card.style.boxShadow = '0 10px 15px -3px rgba(18, 140, 126, 0.1)';
            };

            saveBtn.onclick = (e) => {
                e.stopPropagation();
                if (input.value.trim()) {
                    Store.updateProject(id, input.value.trim());
                    window.dispatchEvent(new Event('hashchange'));
                }
            };

            deleteBtn.onclick = (e) => {
                e.stopPropagation();
                if (confirm('Are you sure you want to delete this project? Employees will no longer be able to select it for new timesheets.')) {
                    Store.deleteProject(id);
                    window.dispatchEvent(new Event('hashchange'));
                }
            };

            // Allow Enter to save
            input.onkeyup = (e) => {
                if (e.key === 'Enter') saveBtn.click();
                if (e.key === 'Escape') window.dispatchEvent(new Event('hashchange'));
            };
        });
    }
};
