import { Sidebar } from './Sidebar.js';
import { Topbar } from './Topbar.js';
import { AIChat } from './AIChat.js';

export const Layout = {
    render(contentHtml, role = 'employee', currentPath = '', topbarTitle = 'Dashboard') {
        const container = document.createElement('div');
        // Let container match parent #app which is display flex
        container.style.display = 'flex';
        container.style.width = '100%';
        container.style.height = '100%';

        const sidebarElement = Sidebar.render(role, currentPath);
        
        const contentContainer = document.createElement('div');
        contentContainer.className = 'layout-content';
        
        const topbarElement = Topbar.render(topbarTitle);
        
        const mainElement = document.createElement('main');
        mainElement.className = 'main-scroll fade-in';
        mainElement.innerHTML = contentHtml;

        contentContainer.appendChild(topbarElement);
        contentContainer.appendChild(mainElement);

        container.appendChild(sidebarElement);
        container.appendChild(contentContainer);

        // Append floating AI chat assistant
        const aiChatElement = AIChat.render();
        container.appendChild(aiChatElement);

        return container;
    }
};
