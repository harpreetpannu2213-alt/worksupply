import { Router } from './router.js';
import { Login } from './pages/Login.js';
import { Register } from './pages/Register.js';
import { SetupAdmin } from './pages/SetupAdmin.js';
import { ForgotPassword } from './pages/ForgotPassword.js';
import { EmployeeDashboard } from './pages/employee/Dashboard.js';
import { EmployeeProfile } from './pages/employee/Profile.js';
import { SubmitHours } from './pages/employee/SubmitHours.js';
import { CreateEmployee } from './pages/admin/CreateEmployee.js';
import { WeeklyReports } from './pages/admin/WeeklyReports.js';
import { Directory } from './pages/admin/Directory.js';
import { ManageProjects } from './pages/admin/ManageProjects.js';
import { AdminProfile } from './pages/admin/AdminProfile.js';
import { Store } from './services/Store.js';

// Initialize the data store
Store.init();

// Redirect to setup if no admin exists
if (Store.getUsersByRole('admin').length === 0 && window.location.hash !== '#/setup-admin') {
    window.location.hash = '/setup-admin';
}

// Initialize the Lucide icons library manually on startup
if (window.lucide) {
    window.lucide.createIcons();
}

// Add the routes
Router.addRoute('/', Login);
Router.addRoute('/setup-admin', SetupAdmin);
Router.addRoute('/login', Login);
Router.addRoute('/register', Register);
Router.addRoute('/forgot-password', ForgotPassword);
Router.addRoute('/employee/dashboard', EmployeeDashboard);
Router.addRoute('/employee/profile', EmployeeProfile);
Router.addRoute('/employee/submit', SubmitHours);
Router.addRoute('/admin/create', CreateEmployee);
Router.addRoute('/admin/reports', WeeklyReports);
Router.addRoute('/admin/directory', Directory);
Router.addRoute('/admin/projects', ManageProjects);
Router.addRoute('/admin/profile', AdminProfile);

// Initialize router on the #app element
Router.init('app');
