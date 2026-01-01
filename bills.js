function loadBills() {
    return JSON.parse(localStorage.getItem('bills')) || [];
}

function saveBills(bills) {
    localStorage.setItem('bills', JSON.stringify(bills));
}

function displayBills() {
    const bills = loadBills();
    const billList = document.getElementById('billList');
    const billCount = document.getElementById('billCount');

    if (!billList || !billCount) return;

    if (bills.length === 0) {
        billList.innerHTML = '<div class="empty-state">No bills added yet. Add your first bill using the form on the left.</div>';
        billCount.textContent = '0 bills';
    } else {
        billCount.textContent = `${bills.length} bill${bills.length > 1 ? 's' : ''}`;
        billList.innerHTML = bills.map((bill, index) => {
            const dueDate = new Date(bill.dueDate);
            const today = new Date();
            const isOverdue = dueDate < today && bill.status === 'pending';
            const statusClass = isOverdue ? 'overdue' : bill.status;
            const statusText = isOverdue ? 'Overdue' : bill.status.charAt(0).toUpperCase() + bill.status.slice(1);
            return `
                <div class="bill-item">
                    <div class="bill-left">
                        <div class="bill-name">${bill.name}</div>
                        <div class="bill-meta">${bill.category} • Due: ${dueDate.toLocaleDateString()}</div>
                    </div>
                    <div class="bill-right">
                        <div class="bill-amount">₹ ${bill.amount.toLocaleString()}</div>
                        <div class="bill-status ${statusClass}">${statusText}</div>
                        <button class="btn-delete" onclick="deleteBill(${index})">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }
    updateSummary();
}

function updateSummary() {
    const bills = loadBills();
    document.getElementById('totalBills').textContent = bills.length;
    document.getElementById('paidBills').textContent = bills.filter(b => b.status === 'paid').length;
    document.getElementById('pendingBills').textContent = bills.filter(b => b.status === 'pending').length;
}

document.getElementById('billForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const newBill = {
        name: document.getElementById('billName').value,
        amount: parseFloat(document.getElementById('billAmount').value),
        dueDate: document.getElementById('billDueDate').value,
        category: document.getElementById('billCategory').value,
        status: document.getElementById('billStatus').value,
        createdAt: new Date().toISOString()
    };
    const bills = loadBills();
    bills.push(newBill);
    saveBills(bills);
    this.reset();
    displayBills();
    alert('Bill added successfully!');
});

function deleteBill(index) {
    if (confirm('Are you sure you want to delete this bill?')) {
        const bills = loadBills();
        bills.splice(index, 1);
        saveBills(bills);
        displayBills();
    }
}

window.addEventListener('load', displayBills);
