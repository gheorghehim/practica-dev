// Function to format currency
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
}

// Function to update the overview with latest transactions
function updateOverview() {
    const transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    
    // Calculate totals
    let totalIncome = 0;
    let totalExpense = 0;
    
    transactions.forEach(transaction => {
        if (transaction.type === 'income') {
            totalIncome += Math.abs(transaction.amount);
        } else {
            totalExpense += Math.abs(transaction.amount);
        }
    });
    
    const totalBalance = totalIncome - totalExpense;
    
    // Update the box-info section
    document.querySelector('.box-info li:nth-child(1) h3').textContent = formatCurrency(totalBalance);
    document.querySelector('.box-info li:nth-child(2) h3').textContent = formatCurrency(totalIncome);
    document.querySelector('.box-info li:nth-child(3) h3').textContent = formatCurrency(totalExpense);
    
    // Update the transactions table
    const tbody = document.querySelector('.table-data .order table tbody');
    tbody.innerHTML = ''; // Clear existing rows
    
    // Sort transactions by date (newest first)
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Show only the 5 most recent transactions
    const recentTransactions = sortedTransactions.slice(0, 5);
    
    recentTransactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.description}</td>
            <td>${transaction.category}</td>
            <td class="${transaction.type}">${formatCurrency(transaction.amount)}</td>
            <td>${new Date(transaction.date).toLocaleDateString()}</td>
        `;
        tbody.appendChild(row);
    });
}

// Function to handle transaction updates
function handleTransactionUpdate() {
    updateOverview();
}

// Initialize the overview when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateOverview();
    
    // Listen for storage events to update when transactions change
    window.addEventListener('storage', (e) => {
        if (e.key === 'transactions') {
            updateOverview();
        }
    });
});

// Export functions for use in other files
window.overview = {
    updateOverview,
    handleTransactionUpdate
}; 