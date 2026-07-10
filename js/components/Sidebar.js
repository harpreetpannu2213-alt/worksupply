import { Store } from '../services/Store.js';

export const Sidebar = {
    render(role = 'employee', currentPath = '') {
        const container = document.createElement('div');
        container.className = 'sidebar';
        
        let links = [];
        const user = Store.getCurrentUser();
        let userName = user ? `${user.firstName} ${user.lastName}` : (role === 'admin' ? 'Sarah Admin' : 'Alex Rivera');
        let userRole = user ? (user.role === 'admin' ? 'System Administrator' : 'Employee') : (role === 'admin' ? 'System Administrator' : 'Software Engineer');
        
        if (role === 'admin') {
            links = [
                { name: 'Employee Directory', path: '/admin/directory', icon: 'users' },
                { name: 'Weekly Reports', path: '/admin/reports', icon: 'file-spreadsheet' },
                { name: 'Manage Projects', path: '/admin/projects', icon: 'folder' },
                { name: 'Admin Profile', path: '/admin/profile', icon: 'settings' }
            ];
        } else {
            links = [
                { name: 'Dashboard', path: '/employee/dashboard', icon: 'layout-dashboard' },
                { name: 'Submit Hours', path: '/employee/submit', icon: 'clock' },
                { name: 'My Profile', path: '/employee/dashboard', icon: 'user' },
                { name: 'WhatsApp Support', path: 'https://wa.me/15550000000', icon: 'message-circle', external: true }
            ];
        }

        const linksHtml = links.map(link => `
            <a href="${link.external ? link.path : '#' + link.path}"
               ${link.external ? 'target="_blank"' : ''}
               class="nav-item ${currentPath === link.path ? 'active' : ''}"
               style="${link.external ? 'margin-top: auto; color: #25D366; font-weight: 700;' : ''}">
                <i data-lucide="${link.icon}"></i>
                ${link.name}
            </a>
        `).join('');

        container.innerHTML = `
            <div class="sidebar-brand">
                WORK<span>SUPPLY</span>
            </div>
            <nav class="sidebar-nav">
                ${linksHtml}
            </nav>
            <div class="sidebar-user">
                <div class="sidebar-user-card">
                    <div class="sidebar-user-avatar">
                        ${userName.charAt(0)}
                    </div>
                    <div class="sidebar-user-info">
                        <div>${userName}</div>
                        <span>${userRole}</span>
                    </div>
                </div>
            </div>
        `;
        return container;
    }
};
