const STORAGE_KEY = 'customers';

function loadCustomers() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

function saveCustomers(customers) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
}

function renderSummary(customers) {
    const totalCustomers = customers.length;
    const totalGave = customers
        .filter(c => c.type === 'gave')
        .reduce((sum, c) => sum + c.amount, 0);
    const totalGot = customers
        .filter(c => c.type === 'got')
        .reduce((sum, c) => sum + c.amount, 0);

    const format = v => '₹ ' + v.toLocaleString();

    document.getElementById('totalCustomers').textContent = totalCustomers;
    document.getElementById('totalGave').textContent = format(totalGave);
    document.getElementById('totalGot').textContent = format(totalGot);
    document.getElementById('customerCount').textContent = `${totalCustomers} record${totalCustomers === 1 ? '' : 's'}`;
}

function renderList(customers) {
    const list = document.getElementById('customerList');
    if (!list) return;

    if (customers.length === 0) {
        list.innerHTML = '<div class="empty-state">No customers yet. Add your first entry on the left.</div>';
        return;
    }

    list.innerHTML = customers.map((c, idx) => {
        const dateLabel = c.date ? new Date(c.date).toLocaleDateString() : '';
        const tagClass = c.type === 'gave' ? 'gave' : 'got';
        const tagText = c.type === 'gave' ? 'Gave' : 'You got';
        return `
            <div class="customer-item">
                <div class="customer-left">
                    <div class="customer-name">${c.name}</div>
                    <div class="customer-meta">${c.phone || 'No phone'} • ${dateLabel}</div>
                    <div class="customer-meta">${c.note || ''}</div>
                </div>
                <div class="customer-right">
                    <div class="tag ${tagClass}">${tagText}</div>
                    <div class="amount">₹ ${c.amount.toLocaleString()}</div>
                    <div class="actions">
                        <button class="btn-delete" onclick="deleteCustomer(${idx})">Delete</button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function refresh() {
    const customers = loadCustomers();
    renderSummary(customers);
    renderList(customers);
}

document.getElementById('customerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const customers = loadCustomers();
    const entry = {
        name: document.getElementById('customerName').value,
        phone: document.getElementById('customerPhone').value,
        amount: parseFloat(document.getElementById('customerAmount').value) || 0,
        type: document.getElementById('customerType').value,
        date: document.getElementById('customerDate').value,
        note: document.getElementById('customerNote').value,
        createdAt: new Date().toISOString()
    };
    customers.push(entry);
    saveCustomers(customers);
    this.reset();
    refresh();
});

function deleteCustomer(index) {
    const customers = loadCustomers();
    customers.splice(index, 1);
    saveCustomers(customers);
    refresh();
}

window.addEventListener('load', refresh);
