export const Store = {
    data: {
        users: [],
        projects: [],
        timesheets: [],
        currentUser: null
    },

    init() {
        const stored = localStorage.getItem('worksupply_db');
        if (stored) {
            this.data = JSON.parse(stored);
        } else {
            // Seed initial mock data
            this.data.users = [
                {
                    id: 'admin_primary',
                    firstName: 'Work',
                    lastName: 'Supply',
                    email: 'admin@worksupply.com',
                    password: 'admin',
                    role: 'admin',
                    status: 'Active',
                    project: 'Management',
                    phone: '',
                    location: 'HQ'
                },
                {
                    id: 'u_emp_1',
                    firstName: 'John',
                    lastName: 'Doe',
                    email: 'john@example.com',
                    password: 'password123',
                    role: 'employee',
                    status: 'Active',
                    project: 'Engineering',
                    phone: '+1234567890',
                    location: 'New York',
                    niff: 'NY-88221'
                },
                {
                    id: 'u_emp_2',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    email: 'jane@example.com',
                    password: 'password123',
                    role: 'employee',
                    status: 'Active',
                    project: 'Design',
                    phone: '+1987654321',
                    location: 'London',
                    niff: 'LN-44332'
                }
            ];
            this.data.projects = [
                { id: 'p1', name: 'Engineering' },
                { id: 'p2', name: 'Design' },
                { id: 'p3', name: 'Marketing' }
            ];
            this.data.timesheets = [
                { id: 't1', userId: 'u_emp_1', hours: ['8', '0', '0', '0', '0', '0', '0'], project: 'Engineering', status: 'Approved', submittedAt: '2023-10-20T10:00:00Z' },
                { id: 't2', userId: 'u_emp_1', hours: ['7.5', '0', '0', '0', '0', '0', '0'], project: 'Engineering', status: 'Submitted', submittedAt: '2023-10-21T09:30:00Z' },
                { id: 't3', userId: 'u_emp_2', hours: ['8', '0', '0', '0', '0', '0', '0'], project: 'Design', status: 'Approved', submittedAt: '2023-10-20T11:00:00Z' }
            ];
            this.save();
        }
    },

    save() {
        localStorage.setItem('worksupply_db', JSON.stringify(this.data));
    },

    reset() {
        localStorage.removeItem('worksupply_db');
        this.init();
        window.location.hash = '/login';
        window.location.reload();
    },

    login(email, password) {
        const user = this.data.users.find(u => u.email === email && u.password === password);
        if (user) {
            this.data.currentUser = user;
            this.save();
            return user;
        }
        return null;
    },

    logout() {
        this.data.currentUser = null;
        this.save();
    },

    getCurrentUser() {
        return this.data.currentUser;
    },

    getUsers() { return this.data.users; },
    getUsersByRole(role) { return this.data.users.filter(u => u.role === role); },
    addUser(user) { 
        user.id = 'u' + Date.now();
        user.status = 'Pending Invite';
        this.data.users.push(user); 
        this.save(); 
    },
    updateUser(id, updates) {
        const idx = this.data.users.findIndex(u => u.id === id);
        if (idx !== -1) {
            this.data.users[idx] = { ...this.data.users[idx], ...updates };
            if (this.data.currentUser && this.data.currentUser.id === id) {
                this.data.currentUser = this.data.users[idx];
            }
            this.save();
        }
    },
    deleteUser(id) {
        this.data.users = this.data.users.filter(u => u.id !== id);
        this.save();
    },

    getProjects() { return this.data.projects; },
    addProject(name) {
        this.data.projects.push({ id: 'p' + Date.now(), name });
        this.save();
    },
    updateProject(id, name) {
        const p = this.data.projects.find(p => p.id === id);
        if (p) { p.name = name; this.save(); }
    },
    deleteProject(id) {
        this.data.projects = this.data.projects.filter(p => p.id !== id);
        this.save();
    },

    getTimesheets() { return this.data.timesheets; },
    getTimesheetsByUser(userId) { return this.data.timesheets.filter(t => t.userId === userId); },
    addTimesheet(data) {
        data.id = 't' + Date.now();
        data.status = 'Submitted';
        data.submittedAt = new Date().toISOString();
        this.data.timesheets.push(data);
        this.save();
    },
    updateTimesheetStatus(id, status) {
        const t = this.data.timesheets.find(t => t.id === id);
        if (t) { t.status = status; this.save(); }
    },
    clearTimesheets() {
        this.data.timesheets = [];
        this.save();
    }
};
