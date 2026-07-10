import { Store } from '../services/Store.js';

export const Topbar = {
    render(title = 'Dashboard') {
        const container = document.createElement('div');
        container.className = 'topbar';
        
        container.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <button id="toggle-sidebar" class="btn btn-ghost" style="padding: 8px;">
                    <i data-lucide="menu"></i>
                </button>
                <h2>${title}</h2>
            </div>
            <div class="topbar-right">
                <button class="btn btn-ghost">
                    <i data-lucide="bell"></i>
                </button>
                <a href="#/login" id="logout-btn" class="btn btn-outline" style="text-decoration:none;">
                    <i data-lucide="log-out"></i>
                    Logout
                </a>
            </div>
        `;

        const toggleBtn = container.querySelector('#toggle-sidebar');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.toggle('hidden');
                    // Small delay to let transition finish before updating icons if needed
                    setTimeout(() => {
                         if (window.lucide) window.lucide.createIcons();
                    }, 300);
                }
            });
        }

        const logoutBtn = container.querySelector('#logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                Store.logout();
            });
        }

        return container;
    }
};
