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

            const seededEmployeeIds = new Set(['u_emp_1', 'u_emp_2']);
            const seededTimesheetIds = new Set(['t1', 't2', 't3']);
            const seededProjectIds = new Set(['p1', 'p2', 'p3']);
            const seededProjectNames = new Set(['Engineering', 'Design', 'Marketing']);

            // Clean up any previously seeded demo data without deleting valid user-created records.
            const storedSeededUsers = this.data.users.filter(u => seededEmployeeIds.has(u.id));
            if (storedSeededUsers.length > 0) {
                const seededUserIds = storedSeededUsers.map(u => u.id);
                this.data.users = this.data.users.filter(u => !seededEmployeeIds.has(u.id));
                this.data.timesheets = this.data.timesheets.filter(t => !seededUserIds.includes(t.userId) && !seededTimesheetIds.has(t.id));
            }

            if (this.data.projects.some(p => seededProjectIds.has(p.id) || seededProjectNames.has(p.name))) {
                this.data.projects = this.data.projects.filter(p => !seededProjectIds.has(p.id) && !seededProjectNames.has(p.name));
            }

            this.save();
        } else {
            // Seed initial mock data
            this.data.users = [
                {
                    id: 'admin_primary',
                    firstName: 'Work',
                    lastName: 'Supply',
                    email: 'admin@worksupply.com',
                    password: 'Admin@1313',
                    role: 'admin',
                    status: 'Active',
                    project: 'Management',
                    phone: '',
                    location: 'HQ'
                }
            ];
            this.data.projects = [];
            this.data.timesheets = [];
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
