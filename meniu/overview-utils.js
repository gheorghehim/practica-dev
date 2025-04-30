// Utility functions for overview data processing
export const calculateProgress = (current, target) => {
    return Math.min(Math.round((current / target) * 100), 100);
};

export const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
    }).format(amount);
};

export const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

export const getCategoryTotal = (transactions, category) => {
    return transactions
        .filter(t => t.category === category)
        .reduce((sum, t) => sum + t.amount, 0);
};

export const getMonthlyTotal = (transactions, type) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return transactions
        .filter(t => {
            const date = new Date(t.date);
            return date.getMonth() === currentMonth && 
                   date.getFullYear() === currentYear &&
                   t.type === type;
        })
        .reduce((sum, t) => sum + t.amount, 0);
};

export const getTopCategories = (spendingByCategory, type, limit = 3) => {
    const categories = type === 'income' ? 
        spendingByCategory.income : 
        spendingByCategory.expenses;
    
    return Object.entries(categories)
        .sort(([, a], [, b]) => b - a)
        .slice(0, limit)
        .map(([category, amount]) => ({
            category,
            amount,
            percentage: calculateProgress(amount, Object.values(categories).reduce((a, b) => a + b, 0))
        }));
};

export const getUpcomingGoals = (goals) => {
    const today = new Date();
    return goals
        .filter(goal => new Date(goal.deadline) > today)
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
};

export const calculateSavingsRate = (income, expenses) => {
    if (income === 0) return 0;
    return Math.round(((income - expenses) / income) * 100);
}; 