// Initialize categories from localStorage or create empty array
let categories = JSON.parse(localStorage.getItem('categories') || '[]');

// Load categories when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
});

// Load categories into tables
function loadCategories() {
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    const incomeCategories = categories.filter(cat => cat.type === 'income');
    
    const expenseTable = document.getElementById('expenseCategoriesTable');
    const incomeTable = document.getElementById('incomeCategoriesTable');
    
    // Clear existing content
    expenseTable.innerHTML = '';
    incomeTable.innerHTML = '';
    
    // Load expense categories
    expenseCategories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.type}</td>
            <td>$${category.budget || 0}</td>
            <td>
                <i class='bx bxs-edit' onclick="editCategory('${category.id}')"></i>
                <i class='bx bxs-trash' onclick="deleteCategory('${category.id}')"></i>
            </td>
        `;
        expenseTable.appendChild(row);
    });
    
    // Load income categories
    incomeCategories.forEach(category => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${category.name}</td>
            <td>${category.type}</td>
            <td>
                <i class='bx bxs-edit' onclick="editCategory('${category.id}')"></i>
                <i class='bx bxs-trash' onclick="deleteCategory('${category.id}')"></i>
            </td>
        `;
        incomeTable.appendChild(row);
    });
}

// Show add category modal
function showAddCategoryModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <h2>Add Category</h2>
            <form id="categoryForm">
                <div class="form-group">
                    <label for="categoryName">Category Name</label>
                    <input type="text" id="categoryName" required>
                </div>
                <div class="form-group">
                    <label for="categoryType">Type</label>
                    <select id="categoryType" required>
                        <option value="expense">Expense</option>
                        <option value="income">Income</option>
                    </select>
                </div>
                <div class="form-group" id="budgetGroup">
                    <label for="categoryBudget">Monthly Budget</label>
                    <input type="number" id="categoryBudget" step="0.01">
                </div>
                <button type="submit">Add Category</button>
                <button type="button" onclick="closeModal()">Cancel</button>
            </form>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Show/hide budget field based on category type
    document.getElementById('categoryType').addEventListener('change', function(e) {
        const budgetGroup = document.getElementById('budgetGroup');
        budgetGroup.style.display = e.target.value === 'expense' ? 'block' : 'none';
    });
    
    // Handle form submission
    document.getElementById('categoryForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const category = {
            id: Date.now().toString(),
            name: document.getElementById('categoryName').value,
            type: document.getElementById('categoryType').value,
            budget: document.getElementById('categoryBudget').value || 0,
            userId: localStorage.getItem('currentUser')
        };
        
        categories.push(category);
        localStorage.setItem('categories', JSON.stringify(categories));
        
        loadCategories();
        closeModal();
    });
}

// Close modal
function closeModal() {
    const modal = document.querySelector('.modal');
    if (modal) {
        modal.remove();
    }
}

// Edit category
function editCategory(categoryId) {
    const category = categories.find(cat => cat.id === categoryId);
    if (!category) return;
    
    showAddCategoryModal();
    document.querySelector('.modal-content h2').textContent = 'Edit Category';
    
    document.getElementById('categoryName').value = category.name;
    document.getElementById('categoryType').value = category.type;
    document.getElementById('categoryBudget').value = category.budget || '';
    
    const form = document.getElementById('categoryForm');
    form.onsubmit = function(e) {
        e.preventDefault();
        
        category.name = document.getElementById('categoryName').value;
        category.type = document.getElementById('categoryType').value;
        category.budget = document.getElementById('categoryBudget').value || 0;
        
        localStorage.setItem('categories', JSON.stringify(categories));
        loadCategories();
        closeModal();
    };
}

// Delete category
function deleteCategory(categoryId) {
    if (!confirm('Are you sure you want to delete this category?')) return;
    
    categories = categories.filter(cat => cat.id !== categoryId);
    localStorage.setItem('categories', JSON.stringify(categories));
    loadCategories();
} 