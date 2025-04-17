// Initialize transactions from localStorage or create empty array
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// Handle transaction form submission
document.getElementById('transactionForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const type = document.getElementById('type').value;
    const amount = parseFloat(document.getElementById('amount').value);
    const category = document.getElementById('category').value;
    const date = document.getElementById('date').value;
    const description = document.getElementById('description').value;

    const transaction = {
        id: Date.now(),
        type,
        amount: type === 'expense' ? -amount : amount,
        category,
        date,
        description,
        userId: localStorage.getItem('currentUser')
    };

    // Add transaction to array and save to localStorage
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Show success message
    showMessage('Transaction added successfully!', false);

    // Reset form
    e.target.reset();

    // Redirect to dashboard after short delay
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
});

// Helper function to show messages
function showMessage(message, isError = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    const form = document.getElementById('transactionForm');
    form.parentNode.insertBefore(messageDiv, form);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}

// Update category options based on transaction type
document.getElementById('type').addEventListener('change', function(e) {
    const categorySelect = document.getElementById('category');
    const type = e.target.value;
    
    // Clear existing options
    categorySelect.innerHTML = '';
    
    // Get categories from localStorage
    const categories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Filter categories by type
    const filteredCategories = categories.filter(cat => cat.type === type);
    
    // Add default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Select a category';
    categorySelect.appendChild(defaultOption);
    
    // Add filtered categories
    filteredCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.name;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
}); 