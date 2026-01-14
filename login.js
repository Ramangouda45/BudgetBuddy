document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Debug: Check if users exist
    if (users.length === 0) {
        alert('No registered users found. Please sign up first!');
        return;
    }
    
    // Find user with matching email and password
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        alert('Login successful! Welcome ' + user.fullName);
        window.location.href = 'home.html';
    } else {
        // Check if email exists but password is wrong
        const emailExists = users.find(u => u.email === email);
        if (emailExists) {
            alert('Invalid password!');
        } else {
            alert('Email not found. Please sign up first!');
        }
    }
});
