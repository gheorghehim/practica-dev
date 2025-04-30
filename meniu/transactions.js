// Initialize transactions from localStorage or create empty array
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// Initialize categories from localStorage or create default ones
let categories = JSON.parse(localStorage.getItem('categories')) || [
    { name: 'Food', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Utilities', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Salary', type: 'income' },
    { name: 'Other', type: 'both' }
];

// Save categories to localStorage
function saveCategories() {
    localStorage.setItem('categories', JSON.stringify(categories));
}

// Update category dropdown based on transaction type
function updateCategories() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Filter and add categories based on type
    const filteredCategories = categories.filter(cat => 
        cat.type === type || cat.type === 'both'
    );
    
    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name.toLowerCase();
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}

// Handle form submission
function handleTransactionSubmit(event) {
    event.preventDefault();
    
    // Get form values
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;
    
    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        showError('Please enter a valid amount');
        return;
    }
    
    // Create transaction object
    const transaction = {
        id: Date.now(),
        type,
        amount: type === 'expense' ? -Math.abs(amount) : Math.abs(amount),
        category,
        date,
        description,
        createdAt: new Date().toISOString()
    };
    
    // Save transaction
    saveTransaction(transaction);
    
    // Show success message
    showSuccess('Transaction added successfully!');
    
    // Reset form
    event.target.reset();
    document.getElementById('date').valueAsDate = new Date();
    
    // Update overview if it exists
    if (window.overview && typeof window.overview.handleTransactionUpdate === 'function') {
        window.overview.handleTransactionUpdate();
    }
    
    // Redirect to overview page after successful transaction
    setTimeout(() => {
        window.location.href = '../continut/index.html';
    }, 1500);
}

// Save transaction to localStorage
function saveTransaction(transaction) {
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const form = document.getElementById('transactionForm');
    const existingError = form.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    form.insertBefore(errorDiv, form.firstChild);
    
    setTimeout(() => {
        errorDiv.remove();
    }, 3000);
}

// Show success message
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    const form = document.getElementById('transactionForm');
    const existingSuccess = form.querySelector('.success-message');
    if (existingSuccess) {
        existingSuccess.remove();
    }
    
    form.insertBefore(successDiv, form.firstChild);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('type');
    
    // Set up event listeners
    transactionForm.addEventListener('submit', handleTransactionSubmit);
    typeSelect.addEventListener('change', updateCategories);
    
    // Set default date to today
    document.getElementById('date').valueAsDate = new Date();
    
    // Initialize categories
    updateCategories();
});

// Export functions for use in other files
window.transactions = {
    saveTransaction,
    getTransactions: () => transactions,
    updateCategories
}; 