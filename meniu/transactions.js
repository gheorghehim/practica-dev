// Initializeaza tranzactiile din localStorage sau creeaza un array gol
let transactions = JSON.parse(localStorage.getItem('transactions') || '[]');

// Initializeaza categoriile initiale in localStorage daca nu exista
const initialCategories = [
    { name: 'Salary', type: 'income' },
    { name: 'Donation', type: 'income' },
    { name: 'Groceries', type: 'expense' },
    { name: 'Presents', type: 'expense' },
    { name: 'Bills', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Entertainment', type: 'expense' },
    { name: 'Other', type: 'expense' },
    { name: 'Other', type: 'income' }
];

// Functie pentru initializarea categoriilor in localStorage daca nu exista
function initializeCategories() {
    if (!localStorage.getItem('categories')) {
        localStorage.setItem('categories', JSON.stringify(initialCategories));
    }
}

// Functie pentru gestionarea tranzactiilor
document.addEventListener('DOMContentLoaded', () => {
    const transactionForm = document.getElementById('transactionForm');
    const typeSelect = document.getElementById('type');
    const categorySelect = document.getElementById('category');
    
    // Actualizeaza categoriile in functie de tipul tranzactiei
    typeSelect.addEventListener('change', updateCategories);
    
    // Initializeaza categoriile
    updateCategories();
    
    // Gestioneaza submitul formularului
    transactionForm.addEventListener('submit', handleTransactionSubmit);
    
    // Seteaza data implicita la data curenta
    document.getElementById('date').valueAsDate = new Date();
});

// Actualizeaza categoriile in functie de tipul tranzactiei
function updateCategories() {
    const type = document.getElementById('type').value;
    const categorySelect = document.getElementById('category');
    
    // Sterge optiunile existente
    categorySelect.innerHTML = '';
    
    // Adauga categoriile corespunzatoare tipului
    if (type === 'expense') {
        addCategories([
            { value: 'food', text: 'Food' },
            { value: 'transport', text: 'Transport' },
            { value: 'utilities', text: 'Utilities' },
            { value: 'entertainment', text: 'Entertainment' },
            { value: 'shopping', text: 'Shopping' },
            { value: 'health', text: 'Health' },
            { value: 'education', text: 'Education' },
            { value: 'other', text: 'Other' }
        ]);
    } else {
        addCategories([
            { value: 'salary', text: 'Salary' },
            { value: 'freelance', text: 'Freelance' },
            { value: 'investments', text: 'Investments' },
            { value: 'gifts', text: 'Gifts' },
            { value: 'other', text: 'Other' }
        ]);
    }
}

// Functie pentru adaugarea categoriilor la selectare
function addCategories(categories) {
    const categorySelect = document.getElementById('category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.value;
        option.textContent = category.text;
        categorySelect.appendChild(option);
    });
}

// Gestioneaza submitul formularului
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

// Salveaza tranzactia in localStorage
function saveTransaction(transaction) {
    let transactions = JSON.parse(localStorage.getItem('transactions')) || [];
    transactions.push(transaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));
}

// Afiseaza mesajul de eroare
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

// Afiseaza mesajul de succes
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

function getTransactions() {
    return JSON.parse(localStorage.getItem('transactions')) || [];
}

// Functie pentru afisarea mesajelor
function showMessage(message, isError = true) {
    const messageDiv = document.createElement('div');
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    
    const form = document.getElementById('transactionForm');
    if (form && form.parentNode) {
        form.parentNode.insertBefore(messageDiv, form);
    } else {
        document.body.appendChild(messageDiv);
    }

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
} 