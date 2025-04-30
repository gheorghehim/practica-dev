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

document.addEventListener('DOMContentLoaded', () => {
    const addCategoryForm = document.getElementById('addCategoryForm');
    const incomeCategoryList = document.getElementById('incomeCategoryList');
    const expenseCategoryList = document.getElementById('expenseCategoryList');

    // Function to get categories from localStorage
    function getCategories() {
        return JSON.parse(localStorage.getItem('categories')) || [];
    }

    // Function to save categories to localStorage
    function saveCategories(categories) {
        localStorage.setItem('categories', JSON.stringify(categories));
    }

    // Function to render categories in the lists
    function renderCategories() {
        const categories = getCategories();
        incomeCategoryList.innerHTML = ''; // Clear existing items
        expenseCategoryList.innerHTML = ''; // Clear existing items

        const incomeCategories = categories.filter(cat => cat.type === 'income');
        const expenseCategories = categories.filter(cat => cat.type === 'expense');

        if (incomeCategories.length === 0) {
            incomeCategoryList.innerHTML = '<li><span>No income categories yet.</span></li>';
        } else {
            incomeCategories.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${cat.name}</span> <i class='bx bx-trash' data-name="${cat.name}" data-type="${cat.type}"></i>`; // Add delete icon
                incomeCategoryList.appendChild(li);
            });
        }

        if (expenseCategories.length === 0) {
            expenseCategoryList.innerHTML = '<li><span>No expense categories yet.</span></li>';
        } else {
            expenseCategories.forEach(cat => {
                const li = document.createElement('li');
                li.innerHTML = `<span>${cat.name}</span> <i class='bx bx-trash' data-name="${cat.name}" data-type="${cat.type}"></i>`; // Add delete icon
                expenseCategoryList.appendChild(li);
            });
        }
        
        // Add event listeners to delete icons
        addDeleteEventListeners();
    }

    // Function to handle adding a new category
    function handleAddCategory(event) {
        event.preventDefault();
        const categoryNameInput = document.getElementById('categoryName');
        const categoryTypeSelect = document.getElementById('categoryType');
        
        const categoryName = categoryNameInput.value.trim();
        const categoryType = categoryTypeSelect.value;

        if (!categoryName) {
            alert('Please enter a category name.');
            return;
        }

        const categories = getCategories();

        // Check if category already exists for the type
        const exists = categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase() && cat.type === categoryType);

        if (exists) {
            alert(`Category '${categoryName}' already exists for ${categoryType}.`);
            return;
        }

        // Add the new category
        categories.push({ name: categoryName, type: categoryType });
        saveCategories(categories);

        // Re-render the lists and clear the form
        renderCategories();
        categoryNameInput.value = ''; 
        // showMessage('Category added successfully!', false); // Optional: Use showMessage like in transactions.js
        alert('Category added successfully!'); // Simple feedback
    }
    
    // Function to handle deleting a category
    function handleDeleteCategory(event) {
        if (event.target.classList.contains('bx-trash')) {
            const categoryName = event.target.getAttribute('data-name');
            const categoryType = event.target.getAttribute('data-type');
            
            if (confirm(`Are you sure you want to delete the category '${categoryName}' (${categoryType})?`)) {
                let categories = getCategories();
                categories = categories.filter(cat => !(cat.name === categoryName && cat.type === categoryType));
                saveCategories(categories);
                renderCategories();
                alert('Category deleted.');
            }
        }
    }
    
    // Function to add delete event listeners
    function addDeleteEventListeners() {
         const deleteIcons = document.querySelectorAll('.bx-trash');
         deleteIcons.forEach(icon => {
            // Remove existing listener before adding a new one to prevent duplicates
            icon.removeEventListener('click', handleDeleteCategory);
            icon.addEventListener('click', handleDeleteCategory);
         });
    }

    // Initial rendering of categories
    renderCategories();

    // Add submit event listener to the form
    if (addCategoryForm) {
        addCategoryForm.addEventListener('submit', handleAddCategory);
    }
}); 