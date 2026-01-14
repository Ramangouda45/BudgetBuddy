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

    function updateUserInfoCard(user) {
        const userInfoCard = document.getElementById('userInfoCard');
        if (!userInfoCard) return;

        if (!user) {
            userInfoCard.style.display = 'none';
            return;
        }

        // Show the card
        userInfoCard.style.display = 'block';

        // Update user avatar (first letter of name)
        const userAvatar = document.getElementById('userAvatar');
        const fullName = user.fullName || user.email || 'User';
        if (userAvatar) {
            userAvatar.textContent = fullName.charAt(0).toUpperCase();
        }

        // Update full name
        const userFullNameEl = document.getElementById('userFullName');
        if (userFullNameEl) {
            userFullNameEl.textContent = fullName;
        }

        // Update email
        const userEmailEl = document.getElementById('userEmail');
        if (userEmailEl) {
            userEmailEl.textContent = user.email || 'user@budgetbuddy.com';
        }

        // Update expense count (from recent list)
        const userExpenseCount = document.getElementById('userExpenseCount');
        if (userExpenseCount) {
            const recentItems = document.querySelectorAll('.recent-item');
            userExpenseCount.textContent = recentItems.length;
        }

        // Update join date
        const userJoinDate = document.getElementById('userJoinDate');
        if (userJoinDate) {
            const joinDate = user.joinDate || new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            userJoinDate.textContent = joinDate;
        }

        // Update last login
        const userLastLogin = document.getElementById('userLastLogin');
        if (userLastLogin) {
            const now = new Date();
            const today = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            userLastLogin.textContent = `Today, ${time}`;
        }

        // Update days active
        const userDaysActive = document.getElementById('userDaysActive');
        if (userDaysActive) {
            const daysActive = user.daysActive || calculateDaysActive(user.joinDate);
            userDaysActive.textContent = daysActive;
        }

        // Update savings
        const userSavings = document.getElementById('userSavings');
        if (userSavings) {
            const savings = user.savings || '7,000';
            userSavings.textContent = `₹${savings}`;
        }
    }

    function calculateDaysActive(joinDate) {
        if (!joinDate) return 1;
        const join = new Date(joinDate);
        const now = new Date();
        const diffTime = Math.abs(now - join);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays || 1;
    }

    function setUserName() {
        const currentUserRaw = sessionStorage.getItem('currentUser');
        if (!currentUserRaw) {
            userMenu.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
            nameNode.textContent = '';
            badge.title = '';
            updateSummaryValues();
            updateUserInfoCard(null);
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
            updateUserInfoCard(user);
        } catch (err) {
            console.error('Could not parse currentUser from sessionStorage', err);
            userMenu.style.display = 'none';
            if (navLinks) navLinks.style.display = 'flex';
            nameNode.textContent = '';
            badge.title = '';
            updateSummaryValues();
            updateUserInfoCard(null);
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

    // Expose function to update expense count when new expenses are added
    window.updateUserExpenseCount = function() {
        const currentUserRaw = sessionStorage.getItem('currentUser');
        if (currentUserRaw) {
            const userExpenseCount = document.getElementById('userExpenseCount');
            if (userExpenseCount) {
                const recentItems = document.querySelectorAll('.recent-item');
                userExpenseCount.textContent = recentItems.length;
            }
        }
    };
})();
// User Profile Actions
(function initUserProfileActions() {
    const editProfileBtn = document.getElementById('editProfileBtn');
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');

    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', function() {
            const currentUserRaw = sessionStorage.getItem('currentUser');
            if (!currentUserRaw) {
                alert('Please login to edit your profile.');
                return;
            }

            try {
                const user = JSON.parse(currentUserRaw);
                const newName = prompt('Edit Full Name:', user.fullName || user.email || '');
                
                if (newName && newName.trim()) {
                    user.fullName = newName.trim();
                    sessionStorage.setItem('currentUser', JSON.stringify(user));
                    
                    // Refresh user display
                    const userFullNameEl = document.getElementById('userFullName');
                    const userNameText = document.getElementById('userNameText');
                    const userAvatar = document.getElementById('userAvatar');
                    
                    if (userFullNameEl) userFullNameEl.textContent = newName;
                    if (userNameText) userNameText.textContent = newName;
                    if (userAvatar) userAvatar.textContent = newName.charAt(0).toUpperCase();
                    
                    alert('✅ Profile updated successfully!');
                }
            } catch (err) {
                console.error('Error updating profile:', err);
            }
        });
    }

    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', function() {
            const recentItems = document.querySelectorAll('.recent-item');
            
            if (recentItems.length === 0) {
                alert('📊 Expense History\n\nNo expenses recorded yet.\nStart tracking your expenses to see your history!');
                return;
            }

            let historyText = '📊 Your Expense History\n\n';
            recentItems.forEach((item, index) => {
                const title = item.querySelector('.recent-title')?.textContent || 'Unknown';
                const meta = item.querySelector('.recent-meta')?.textContent || '';
                const amount = item.querySelector('.recent-amount')?.textContent || '₹0';
                historyText += `${index + 1}. ${title} - ${amount}\n   ${meta}\n\n`;
            });

            historyText += `\nTotal Expenses: ${recentItems.length}\n\nExport feature coming soon!`;
            alert(historyText);
        });
    }
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
            // Update user expense count
            if (window.updateUserExpenseCount) {
                window.updateUserExpenseCount();
            }
        });

        // Insert at the beginning of the list
        recentList.insertBefore(newExpense, recentList.firstChild);

        // Update the summary display
        updateExpenseSummary();

        // Update user expense count in user info card
        if (window.updateUserExpenseCount) {
            window.updateUserExpenseCount();
        }

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

// Financial Tips Rotation
(function initFinancialTips() {
    const tips = [
        "Track your daily expenses to identify spending patterns and save up to 20% more each month!",
        "Use the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Balance is key!",
        "Set up automatic transfers to your savings account. Pay yourself first!",
        "Review your subscriptions monthly. Cancel what you don't use regularly.",
        "Cook at home more often. You can save ₹5,000+ per month on dining out.",
        "Create an emergency fund with 3-6 months of expenses. Financial security matters!",
        "Use cashback and reward programs wisely. Every rupee saved counts!",
        "Compare prices before making big purchases. Research saves money!",
        "Avoid impulse buying. Wait 24 hours before purchasing non-essentials.",
        "Track all expenses, even small ones. They add up faster than you think!",
        "Small daily savings create massive wealth over time. Start today, not tomorrow!",
        "Your future self will thank you for the financial discipline you practice today.",
        "Budgeting isn't about limiting yourself—it's about making the things that excite you possible.",
        "Every rupee you save is a step closer to financial freedom and peace of mind.",
        "Don't save what is left after spending; spend what is left after saving.",
        "Financial literacy is a superpower. Learn something new about money every week!",
        "Invest in yourself first—education and skills have the highest returns.",
        "A budget is telling your money where to go instead of wondering where it went.",
        "Build assets, not liabilities. Choose purchases that grow in value over time.",
        "Compound interest works magic when you start early. Time is your best friend!",
        "Track your net worth monthly. What gets measured gets improved!",
        "Living below your means today creates the freedom to live above them tomorrow.",
        "Make your money work as hard as you do. Invest wisely and consistently.",
        "Financial success is 20% knowledge and 80% behavior. Master your habits!",
        "Set specific financial goals with deadlines. Dreams with plans become reality!"
    ];

    let currentTipIndex = 0;
    const tipElement = document.getElementById('dailyTip');
    const nextBtn = document.getElementById('nextTipBtn');

    if (!tipElement || !nextBtn) return;

    nextBtn.addEventListener('click', function() {
        currentTipIndex = (currentTipIndex + 1) % tips.length;
        tipElement.style.opacity = '0';
        
        setTimeout(() => {
            tipElement.textContent = tips[currentTipIndex];
            tipElement.style.transition = 'opacity 0.3s ease';
            tipElement.style.opacity = '1';
        }, 150);
    });
})();

// (Removed) Quick Action Buttons

// View Demo Button
(function initDemoButton() {
    const viewDemoBtn = document.getElementById('viewDemoBtn');
    
    if (viewDemoBtn) {
        viewDemoBtn.addEventListener('click', function() {
            alert('🎬 Demo Mode\n\nThis would show you a guided tour of BudgetBuddy features:\n✓ Adding expenses\n✓ Setting budgets\n✓ Viewing reports\n✓ Managing categories\n\nFull demo coming soon!');
        });
    }
})();

// Download Report Button
(function initDownloadReport() {
    const downloadBtn = document.getElementById('downloadReportBtn');
    
    if (downloadBtn) {
        downloadBtn.addEventListener('click', function() {
            const format = confirm('Download Monthly Report?\n\nOK = PDF\nCancel = Excel');
            if (format !== null) {
                const fileType = format ? 'PDF' : 'Excel';
                alert(`📊 Generating ${fileType} report...\n\nYour monthly expense report will include:\n• Total spending\n• Category breakdown\n• Daily trends\n• Budget comparison\n\nDownload feature coming soon!`);
            }
        });
    }
})();

// More Insights Button
(function initMoreInsights() {
    const moreInsightsBtn = document.getElementById('moreInsightsBtn');
    
    if (moreInsightsBtn) {
        moreInsightsBtn.addEventListener('click', function() {
            alert('📈 Detailed Financial Analysis\n\n• Spending patterns over time\n• Category-wise breakdown\n• Budget vs actual comparison\n• Savings recommendations\n• Future projections\n• Smart alerts & notifications\n\nFull analysis dashboard coming soon!');
        });
    }
})();

// Add Goal Button
(function initAddGoal() {
    const addGoalBtn = document.getElementById('addGoalBtn');
    
    if (addGoalBtn) {
        addGoalBtn.addEventListener('click', function() {
            const goalName = prompt('Enter goal name:', 'Emergency Fund');
            if (goalName) {
                const goalAmount = prompt('Enter target amount (₹):', '50000');
                if (goalAmount && !isNaN(goalAmount)) {
                    alert(`✅ Goal created!\n\n${goalName}\nTarget: ₹${parseFloat(goalAmount).toLocaleString('en-IN')}\n\nStart tracking your progress in the Goals section!`);
                }
            }
        });
    }
})();

// Refresh page when clicking the logo
(function initLogoRefresh() {
    const logoIcon = document.querySelector('.logo-icon');
    const logo = document.querySelector('.logo');

    function refreshPage(event) {
        // Prevent any default behavior and stop propagation
        event.preventDefault();
        event.stopPropagation();
        // Refresh the page
        window.location.reload();
    }

    if (logoIcon) {
        logoIcon.title = 'Refresh';
        logoIcon.addEventListener('click', refreshPage);
    }
    if (logo) {
        logo.addEventListener('click', refreshPage);
    }
})();
