// Overview page data structure
const overviewData = {
    // User's financial summary
    summary: {
        totalBalance: 5200,
        totalIncome: 3500,
        totalExpenses: 1700,
        monthlyBudget: 3000,
        savingsGoal: 1000,
        savingsProgress: 45 // percentage
    },

    // Recent transactions
    recentTransactions: [
        {
            id: 1,
            description: "Grocery Shopping",
            category: "Food",
            amount: -120.00,
            date: "2024-04-15",
            type: "expense"
        },
        {
            id: 2,
            description: "Salary",
            category: "Income",
            amount: 3500.00,
            date: "2024-04-10",
            type: "income"
        },
        {
            id: 3,
            description: "Electric Bill",
            category: "Utilities",
            amount: -85.00,
            date: "2024-04-05",
            type: "expense"
        },
        {
            id: 4,
            description: "Freelance Work",
            category: "Income",
            amount: 500.00,
            date: "2024-04-01",
            type: "income"
        }
    ],

    // Budget goals
    budgetGoals: [
        {
            id: 1,
            title: "Save $500 for vacation",
            target: 500,
            current: 500,
            deadline: "2024-06-30",
            status: "completed"
        },
        {
            id: 2,
            title: "Pay off credit card",
            target: 1000,
            current: 1000,
            deadline: "2024-05-31",
            status: "completed"
        },
        {
            id: 3,
            title: "Emergency fund ($1000)",
            target: 1000,
            current: 450,
            deadline: "2024-07-31",
            status: "in-progress"
        },
        {
            id: 4,
            title: "New laptop savings",
            target: 1200,
            current: 300,
            deadline: "2024-08-31",
            status: "in-progress"
        }
    ],

    // Monthly spending by category
    spendingByCategory: {
        income: {
            "Salary": 3500,
            "Freelance": 500,
            "Investments": 200
        },
        expenses: {
            "Food": 450,
            "Utilities": 250,
            "Transportation": 300,
            "Entertainment": 200,
            "Shopping": 500
        }
    },

    // Monthly trends
    monthlyTrends: {
        income: [3200, 3500, 3800, 3500, 4000, 4200],
        expenses: [1500, 1700, 1600, 1800, 1700, 1900],
        savings: [1700, 1800, 2200, 1700, 2300, 2300]
    }
};

// Export the data
export default overviewData; 