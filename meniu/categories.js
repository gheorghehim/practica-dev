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

// Add a new category
function addCategory(name, type) {
    // Check if category already exists
    if (categories.some(cat => cat.name.toLowerCase() === name.toLowerCase())) {
        return false;
    }

    const newCategory = {
        name,
        type
    };

    categories.push(newCategory);
    saveCategories();
    return true;
}

// Update a category
function updateCategory(oldName, newName, type) {
    const index = categories.findIndex(cat => cat.name.toLowerCase() === oldName.toLowerCase());
    if (index === -1) return false;

    categories[index] = {
        name: newName,
        type
    };

    saveCategories();
    return true;
}

// Delete a category
function deleteCategory(name) {
    const index = categories.findIndex(cat => cat.name.toLowerCase() === name.toLowerCase());
    if (index === -1) return false;

    categories.splice(index, 1);
    saveCategories();
    return true;
}

// Get all categories
function getCategories() {
    return categories;
}

// Get categories by type
function getCategoriesByType(type) {
    return categories.filter(cat => cat.type === type || cat.type === 'both');
}

// Export functions for use in other files
window.categories = {
    addCategory,
    updateCategory,
    deleteCategory,
    getCategories,
    getCategoriesByType,
    saveCategories
}; 