// Initialize Chart.js charts
let monthlyChart;
let categoryChart;

// Load charts when page loads
document.addEventListener('DOMContentLoaded', function() {
    const currentDate = new Date();
    document.getElementById('monthSelect').value = currentDate.getMonth() + 1;
    document.getElementById('yearSelect').value = currentDate.getFullYear();
    
    initializeCharts();
    loadTransactionHistory();
    
    // Add event listeners for filters
    document.getElementById('monthSelect').addEventListener('change', updateCharts);
    document.getElementById('yearSelect').addEventListener('change', updateCharts);
    document.getElementById('chartType').addEventListener('change', updateCategoryChart);
});

// Initialize charts
function initializeCharts() {
    // Monthly Overview Chart
    const monthlyCtx = document.getElementById('monthlyChart').getContext('2d');
    monthlyChart = new Chart(monthlyCtx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [
                {
                    label: 'Income',
                    backgroundColor: '#2ecc71',
                    data: []
                },
                {
                    label: 'Expenses',
                    backgroundColor: '#e74c3c',
                    data: []
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Category Breakdown Chart
    const categoryCtx = document.getElementById('categoryChart').getContext('2d');
    categoryChart = new Chart(categoryCtx, {
        type: 'doughnut',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: [
                    '#3498db',
                    '#2ecc71',
                    '#e74c3c',
                    '#f1c40f',
                    '#9b59b6',
                    '#e67e22'
                ]
            }]
        },
        options: {
            responsive: true
        }
    });
    
    updateCharts();
}

// Update all charts
function updateCharts() {
    const month = parseInt(document.getElementById('monthSelect').value);
    const year = parseInt(document.getElementById('yearSelect').value);
    
    updateMonthlyChart(month, year);
    updateCategoryChart();
}

// Update monthly overview chart
function updateMonthlyChart(month, year) {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    
    // Filter transactions for current user and selected month/year
    const filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        return t.userId === currentUser && 
               date.getMonth() + 1 === month && 
               date.getFullYear() === year;
    });
    
    // Group by day
    const dailyData = {};
    filteredTransactions.forEach(t => {
        const day = new Date(t.date).getDate();
        if (!dailyData[day]) {
            dailyData[day] = { income: 0, expenses: 0 };
        }
        if (t.amount > 0) {
            dailyData[day].income += t.amount;
        } else {
            dailyData[day].expenses += Math.abs(t.amount);
        }
    });
    
    // Prepare chart data
    const days = Object.keys(dailyData).sort((a, b) => a - b);
    const incomeData = days.map(day => dailyData[day].income);
    const expenseData = days.map(day => dailyData[day].expenses);
    
    // Update chart
    monthlyChart.data.labels = days;
    monthlyChart.data.datasets[0].data = incomeData;
    monthlyChart.data.datasets[1].data = expenseData;
    monthlyChart.update();
}

// Update category breakdown chart
function updateCategoryChart() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    const chartType = document.getElementById('chartType').value;
    
    // Filter transactions
    const filteredTransactions = transactions.filter(t => 
        t.userId === currentUser && 
        (chartType === 'expense' ? t.amount < 0 : t.amount > 0)
    );
    
    // Group by category
    const categoryData = {};
    filteredTransactions.forEach(t => {
        if (!categoryData[t.category]) {
            categoryData[t.category] = 0;
        }
        categoryData[t.category] += Math.abs(t.amount);
    });
    
    // Prepare chart data
    const categories = Object.keys(categoryData);
    const amounts = categories.map(cat => categoryData[cat]);
    
    // Update chart
    categoryChart.data.labels = categories;
    categoryChart.data.datasets[0].data = amounts;
    categoryChart.update();
}

// Load transaction history
function loadTransactionHistory() {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const currentUser = localStorage.getItem('currentUser');
    const tbody = document.getElementById('transactionHistory');
    
    // Clear existing content
    tbody.innerHTML = '';
    
    // Filter and sort transactions
    const userTransactions = transactions
        .filter(t => t.userId === currentUser)
        .sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Add transactions to table
    userTransactions.forEach(t => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${new Date(t.date).toLocaleDateString()}</td>
            <td>${t.description}</td>
            <td>${t.category}</td>
            <td class="${t.amount > 0 ? 'income' : 'expense'}">
                ${t.amount > 0 ? '+' : ''}$${Math.abs(t.amount).toFixed(2)}
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Export report as PDF
function exportReport() {
    alert('Export functionality will be implemented here');
    // TODO: Implement PDF export functionality
} 