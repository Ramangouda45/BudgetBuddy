(function initUserMenu() {
    const badge = document.getElementById('userNameDisplay');
    const nameNode = document.getElementById('userNameText');
    const dropdown = document.getElementById('userDropdown');
    const logoutBtn = document.getElementById('logoutButton');
    const userMenu = document.querySelector('.user-menu');
    const navLinks = document.querySelector('.nav-links');

    if (!badge || !nameNode || !dropdown || !logoutBtn || !userMenu) return;

    function updateSummaryValues() {
        const summaryValues = document.querySelectorAll('.summary-value');
        const currentUserRaw = sessionStorage.getItem('currentUser');
        
        if (!currentUserRaw) {
            // Show 000 when no user is logged in
            summaryValues.forEach(value => {
                value.textContent = '₹ 000';
            });
        } else {
            // Reset to actual values when user is logged in
            const actualValues = ['₹ 1,240', '₹ 18,430', '₹ 11,570'];
            summaryValues.forEach((value, index) => {
                if (index < actualValues.length) {
                    value.textContent = actualValues[index];
                }
            });
        }
    }

    function setUserName() {
        const currentUserRaw = sessionStorage.getItem('currentUser');
        if (!currentUserRaw) {
            userMenu.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
            nameNode.textContent = '';
            badge.title = '';
            updateSummaryValues();
            return;
        }

        try {
            const user = JSON.parse(currentUserRaw);
            const displayName = user.fullName || user.email || 'User';
            userMenu.style.display = 'flex';
            if (navLinks) navLinks.style.display = 'none';
            nameNode.textContent = displayName;
            badge.title = user.email ? `Logged in as ${user.email}` : `Logged in as ${displayName}`;
            updateSummaryValues();
        } catch (err) {
            console.error('Could not parse currentUser from sessionStorage', err);
            userMenu.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
            nameNode.textContent = '';
            badge.title = '';
            updateSummaryValues();
        }
    }

    function toggleDropdown(event) {
        event.stopPropagation();
        dropdown.classList.toggle('show');
    }

    function closeDropdown() {
        dropdown.classList.remove('show');
    }

    badge.addEventListener('click', toggleDropdown);
    document.addEventListener('click', closeDropdown);
    dropdown.addEventListener('click', function(event) {
        event.stopPropagation();
    });

    logoutBtn.addEventListener('click', function() {
        sessionStorage.removeItem('currentUser');
        closeDropdown();
        setUserName();
    });

    setUserName();
})();

// Splash quote screen
(function initSplash() {
    const splash = document.getElementById('splashScreen');
    if (!splash) return;

    const hideSplash = () => {
        const card = splash.querySelector('.splash-card');
        if (card) card.classList.add('hide-card');
        splash.classList.add('hide');
        setTimeout(() => {
            splash.style.display = 'none';
        }, 500);
    };

    window.addEventListener('load', () => {
        setTimeout(hideSplash, 2000);
    });

    splash.addEventListener('click', hideSplash);
})();
