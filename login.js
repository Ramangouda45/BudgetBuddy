document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.email === email && u.password === password);
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful! Welcome ' + user.fullName);
        window.location.href = 'home.html';
    } else {
        alert('Invalid email or password!');
    }
});
