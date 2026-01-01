// Default admin credentials
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

const adminLoginForm = document.getElementById('adminLoginForm');
const userListDiv = document.getElementById('userList');

function showAdminDashboard() {
    document.getElementById('adminLogin').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'block';
    loadUsers();
}

function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    if (!userListDiv) return;
    if (users.length === 0) {
        userListDiv.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No users registered yet.</p>';
        return;
    }
    userListDiv.innerHTML = users.map(user => `
        <div class="user-card">
            <h3>${user.fullName}</h3>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Role:</strong> ${user.role}</p>
            <p><strong>Registered:</strong> ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function logout() {
    sessionStorage.removeItem('adminLoggedIn');
    document.getElementById('adminLogin').style.display = 'block';
    document.getElementById('adminDashboard').style.display = 'none';
    if (adminLoginForm) adminLoginForm.reset();
}

if (adminLoginForm) {
    adminLoginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('adminUsername').value.trim();
        const password = document.getElementById('adminPassword').value.trim();
        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            sessionStorage.setItem('adminLoggedIn', 'true');
            alert('Admin login successful!');
            showAdminDashboard();
        } else {
            alert('Invalid admin credentials!\n\nPlease use:\nUsername: admin\nPassword: admin123');
        }
    });
}

window.addEventListener('load', function() {
    if (sessionStorage.getItem('adminLoggedIn') === 'true') {
        showAdminDashboard();
    }
});
