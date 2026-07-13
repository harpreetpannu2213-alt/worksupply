import { Layout } from '../../components/Layout.js';
import { Store } from '../../services/Store.js';

export const ManageProjects = {
    searchTerm: '',

    async render() {
        const projects = Store.getProjects().filter(p =>
            p.name.toLowerCase().includes(this.searchTerm.toLowerCase())
        );
 
        const emptyProjectMessage = this.searchTerm
            ? 'No matching projects found. Try a different keyword.'
            : 'Create your first project to start assigning work and tracking progress.';
 
        const projectCards = projects.map(p => `
            <div class="project-card fade-in" data-id="${p.id}"
                 style="background: var(--bg-card); border-radius: 16px; padding: 20px; border: 1px solid var(--border-light);
                        box-shadow: var(--shadow-sm); display: flex; align-items: center;
                        justify-content: space-between; transition: var(--transition);">
                <div style="flex: 1; display: flex; align-items: center; gap: 16px;">
                    <div style="width: 44px; height: 44px; border-radius: 12px; background: var(--accent-glow);
                                color: var(--accent-hover); display: flex; align-items: center; justify-content: center; font-weight: 700;">
                        <i data-lucide="briefcase" style="width: 20px;"></i>
                    </div>
                    <div style="flex: 1;">
                        <div class="project-display" style="font-weight: 700; color: var(--text-main); font-size: 16px;">${p.name}</div>
                        <input type="text" class="project-edit-input form-control" value="${p.name}"
                               style="display: none; width: 100%; height: 36px; font-size: 15px; font-weight: 600; background: var(--bg-elevated);">
                        <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">Created: ${p.createdAt || 'N/A'}</div>
                    </div>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-ghost edit-btn" title="Edit Name" style="color: var(--text-muted); padding: 8px;">
                        <i data-lucide="edit-3" style="width: 18px;"></i>
                    </button>
                    <button class="btn btn-ghost save-btn" title="Save Changes" style="display: none; color: var(--success); padding: 8px;">
                        <i data-lucide="check" style="width: 18px;"></i>
                    </button>
                    <button class="btn btn-ghost delete-btn" title="Delete Project" style="color: var(--danger); padding: 8px;">
                        <i data-lucide="trash-2" style="width: 18px;"></i>
                    </button>
                </div>
            </div>
        `).join('');

        const content = `
            <div class="fade-in" style="max-width: 1120px; margin: 0 auto;">
                <div class="page-header">
                    <div>
                        <h1>Project Portfolio</h1>
                        <p>Manage site locations, client projects, and team assignments from a clean central view.</p>
                    </div>
                    <div class="metric-card">
                        <p>Active Projects</p>
                        <strong>${Store.getProjects().length}</strong>
                    </div>
                </div>

                <div class="split-grid">
                    <div class="form-panel">
                        <div class="card-header">
                            <h3 style="margin: 0; font-size: 18px;">New Project</h3>
                            <span class="badge neutral">Create</span>
                        </div>
                        <form id="add-project-form">
                            <div style="display: grid; gap: 16px;">
                                <div>
                                    <label style="font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em;">Project name</label>
                                    <input type="text" id="new-project-name" placeholder="e.g. Central Plaza Phase 2" required class="form-control" style="margin-top: 8px;">
                                </div>
                                <button type="submit" class="btn btn-primary btn-pill" style="width: 100%;">Create Project</button>
                            </div>
                        </form>

                        <div style="margin-top: 28px; padding: 20px; border-radius: 20px; background: var(--bg-elevated); border: 1px solid var(--border-light);">
                            <h4 style="margin-top: 0; font-size: 14px; color: var(--text-main);">Tips</h4>
                            <ul style="padding-left: 18px; margin: 12px 0 0 0; color: var(--text-muted); line-height: 1.7; font-size: 13px;">
                                <li>Use distinct project names for easy search.</li>
                                <li>Edits are preserved in local browser storage.</li>
                            </ul>
                        </div>
                    </div>

                    <div style="display: grid; gap: 20px;">
                        <div class="card" style="padding: 22px;">
                            <div class="card-header">
                                <h3 style="margin: 0; font-size: 18px;">Projects</h3>
                                <span class="badge neutral">Search</span>
                            </div>
                            <div style="position: relative; margin-top: 18px;">
                                <i data-lucide="search" style="position: absolute; left: 16px; top: 14px; width: 18px; color: var(--text-light);"></i>
                                <input type="text" id="project-search" placeholder="Filter projects by name..." value="${this.searchTerm}" class="form-control" style="width: 100%; padding-left: 46px; background: var(--bg-card);">
                            </div>
                        </div>

                        <div style="display: grid; gap: 16px;">
                            ${projectCards || `
                                <div class="card" style="text-align: center; padding: 48px; color: var(--text-light);">
                                    <i data-lucide="inbox" style="width: 48px; height: 48px; color: var(--text-light); margin-bottom: 16px;"></i>
                                    <h3 style="margin: 0 0 10px 0; font-size: 18px; color: var(--text-main);">${projects.length === 0 ? 'No active projects yet' : 'No matching projects found'}</h3>
                                    <p style="margin: 0;">${emptyProjectMessage}</p>
                                </div>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;
        return Layout.render(content, 'admin', '/admin/projects', 'Manage Projects');
    },

    async afterRender() {
        if (window.lucide) window.lucide.createIcons();

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
                card.style.borderColor = 'var(--accent)';
                card.style.boxShadow = '0 0 12px rgba(99, 102, 241, 0.15)';
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
