export const Router = {
    routes: {},
    currentRoute: null,
    rootElement: null,

    init(rootElementId) {
        this.rootElement = document.getElementById(rootElementId);
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    addRoute(path, component) {
        this.routes[path] = component;
    },

    navigate(path) {
        window.location.hash = path;
    },

    async handleRoute() {
        const path = window.location.hash.slice(1) || '/';
        const component = this.routes[path] || this.routes['/login'];
        
        if (this.rootElement && component) {
            try {
                // Clear the DOM
                this.rootElement.innerHTML = '';
                // Render the component
                const el = await component.render();
                if (el) {
                    this.rootElement.appendChild(el);
                }
                if (component.afterRender) {
                    await component.afterRender();
                }
                // re-initialize lucide icons
                if (window.lucide) {
                    window.lucide.createIcons();
                }
            } catch (error) {
                console.error('Routing Error:', error);
                this.rootElement.innerHTML = `
                    <div style="padding: 40px; text-align: center; color: #ef4444;">
                        <h3>Oops! Something went wrong.</h3>
                        <p>${error.message}</p>
                        <button onclick="window.location.hash='/login'" style="margin-top: 20px; padding: 10px 20px; background: #128c7e; color: white; border: none; border-radius: 8px;">Back to Login</button>
                    </div>
                `;
            }
        }
    }
};
