// Initialize budget goals from localStorage or create default ones
let budgetGoals = JSON.parse(localStorage.getItem('budgetGoals')) || [
    { id: 1, title: 'Save $500 for vacation', target: 500, current: 500, completed: true },
    { id: 2, title: 'Pay off credit card', target: 1000, current: 1000, completed: true },
    { id: 3, title: 'Emergency fund ($1000)', target: 1000, current: 500, completed: false },
    { id: 4, title: 'New laptop savings', target: 1500, current: 300, completed: false }
];

// Save goals to localStorage
function saveGoals() {
    localStorage.setItem('budgetGoals', JSON.stringify(budgetGoals));
}

// Add a new goal
function addGoal(title, target) {
    const newGoal = {
        id: Date.now(),
        title,
        target: parseFloat(target),
        current: 0,
        completed: false
    };
    budgetGoals.push(newGoal);
    saveGoals();
    updateGoalsDisplay();
}

// Update goal progress
function updateGoalProgress(goalId, amount) {
    const goal = budgetGoals.find(g => g.id === goalId);
    if (goal) {
        goal.current = Math.min(goal.current + amount, goal.target);
        goal.completed = goal.current >= goal.target;
        saveGoals();
        updateGoalsDisplay();
    }
}

// Delete a goal
function deleteGoal(goalId) {
    budgetGoals = budgetGoals.filter(goal => goal.id !== goalId);
    saveGoals();
    updateGoalsDisplay();
}

// Update the goals display
function updateGoalsDisplay() {
    const todoList = document.querySelector('.todo-list');
    if (!todoList) return;

    todoList.innerHTML = '';
    
    budgetGoals.forEach(goal => {
        const progress = (goal.current / goal.target) * 100;
        const li = document.createElement('li');
        li.className = goal.completed ? 'completed' : 'not-completed';
        li.innerHTML = `
            <div class="goal-progress">
                <p>${goal.title}</p>
                <div class="progress-bar">
                    <div class="progress" style="width: ${progress}%"></div>
                </div>
                <span class="progress-text">$${goal.current} / $${goal.target}</span>
            </div>
            <div class="goal-actions">
                <button class="edit-goal" data-id="${goal.id}">
                    <i class='bx bx-edit'></i>
                </button>
                <button class="delete-goal" data-id="${goal.id}">
                    <i class='bx bx-trash'></i>
                </button>
            </div>
        `;
        todoList.appendChild(li);
    });

    // Add event listeners for the new buttons
    document.querySelectorAll('.edit-goal').forEach(button => {
        button.addEventListener('click', (e) => {
            const goalId = parseInt(e.currentTarget.dataset.id);
            editGoal(goalId);
        });
    });

    document.querySelectorAll('.delete-goal').forEach(button => {
        button.addEventListener('click', (e) => {
            const goalId = parseInt(e.currentTarget.dataset.id);
            deleteGoal(goalId);
        });
    });
}

// Edit a goal
function editGoal(goalId) {
    const goal = budgetGoals.find(g => g.id === goalId);
    if (!goal) return;

    const newTitle = prompt('Enter new goal title:', goal.title);
    if (newTitle === null) return;

    const newTarget = prompt('Enter new target amount:', goal.target);
    if (newTarget === null) return;

    goal.title = newTitle;
    goal.target = parseFloat(newTarget);
    goal.completed = goal.current >= goal.target;
    saveGoals();
    updateGoalsDisplay();
}

// Initialize the goals when the page loads
document.addEventListener('DOMContentLoaded', () => {
    updateGoalsDisplay();

    // Add event listener for the "Add Goal" button
    const addGoalButton = document.querySelector('.todo .head .bx-plus');
    if (addGoalButton) {
        addGoalButton.addEventListener('click', () => {
            const title = prompt('Enter goal title:');
            if (!title) return;

            const target = prompt('Enter target amount:');
            if (!target) return;

            addGoal(title, target);
        });
    }
});

// Export functions for use in other files
window.budgetGoals = {
    addGoal,
    updateGoalProgress,
    deleteGoal,
    editGoal,
    updateGoalsDisplay
}; 