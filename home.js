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

// Add Expense functionality
(function initAddExpense() {
    const addBtn = document.getElementById('addExpenseBtn');
    const modal = document.getElementById('expenseModal');
    const closeBtn = document.querySelector('.expense-modal-close');
    const cancelBtn = document.querySelector('.btn-cancel');
    const form = document.getElementById('expenseForm');
    const recentList = document.querySelector('.recent-list');

    if (!addBtn || !modal) return;

    // Open modal
    addBtn.addEventListener('click', function() {
        modal.classList.add('show');
        document.getElementById('expenseName').focus();
    });

    // Close modal
    function closeModal() {
        modal.classList.remove('show');
        form.reset();
    }

    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('expenseName').value;
        const category = document.getElementById('expenseCategory').value;
        const amount = document.getElementById('expenseAmount').value;

        // Create new expense item
        const newExpense = document.createElement('div');
        newExpense.className = 'recent-item';
        const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        newExpense.innerHTML = `
            <div class="recent-left">
                <span class="recent-title">${name}</span>
                <span class="recent-meta">Today · ${category}</span>
            </div>
            <span class="recent-amount negative">- ₹ ${parseFloat(amount).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}</span>
            <button class="delete-expense-btn" type="button" title="Delete expense">✕</button>
        `;

        // Add delete functionality to the button
        const deleteBtn = newExpense.querySelector('.delete-expense-btn');
        deleteBtn.addEventListener('click', function() {
            newExpense.remove();
            updateExpenseSummary();
        });

        // Insert at the beginning of the list
        recentList.insertBefore(newExpense, recentList.firstChild);

        // Update the summary display
        updateExpenseSummary();

        // Reset summary values to 0
        const summaryValues = document.querySelectorAll('.summary-value');
        summaryValues.forEach(value => {
            value.textContent = '₹ 0';
        });

        // Close modal and reset form
        closeModal();
    });

    // Function to update expense summary
    function updateExpenseSummary() {
        const summaryContent = document.getElementById('expensesSummary');
        const items = recentList.querySelectorAll('.recent-item');
        
        if (items.length === 0) {
            summaryContent.innerHTML = '<p class="empty-summary">No expenses added yet. Click + to add your first expense!</p>';
            return;
        }

        let summaryHTML = '';
        items.forEach(item => {
            const titleEl = item.querySelector('.recent-title');
            const metaEl = item.querySelector('.recent-meta');
            const amountEl = item.querySelector('.recent-amount');
            
            if (titleEl && metaEl && amountEl) {
                const title = titleEl.textContent;
                const meta = metaEl.textContent;
                const amount = amountEl.textContent;
                summaryHTML += `<div class="expense-summary-item"><strong>${title}</strong> (${meta}) - ${amount}</div>`;
            }
        });

        summaryContent.innerHTML = summaryHTML;
    }
})();
