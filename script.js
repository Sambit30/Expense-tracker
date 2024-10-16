document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('expense-form');
    const expensesList = document.getElementById('expenses');
    const remainingBudget = document.getElementById('remaining-budget');
    const budgetInput = document.getElementById('budget');
    let expenses = [];
    let budget = 0;

    // Open and close settings modal
    const settingsModal = document.getElementById('settings-modal');
    const openSettingsBtn = document.getElementById('open-settings');
    const closeSettingsBtn = document.getElementById('close-settings');

    openSettingsBtn.addEventListener('click', function () {
        settingsModal.style.display = 'block';
    });

    closeSettingsBtn.addEventListener('click', function () {
        settingsModal.style.display = 'none';
    });

    window.addEventListener('click', function (e) {
        if (e.target === settingsModal) {
            settingsModal.style.display = 'none';
        }
    });

    // Add new expense
    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const date = document.getElementById('date').value;
        const category = document.getElementById('category').value;
        const description = document.getElementById('description').value;
        const amount = parseFloat(document.getElementById('amount').value);

        const expense = { date, category, description, amount };
        expenses.push(expense);
        updateExpenses();
        updateCharts();
        updateRemainingBudget();
        form.reset();
    });

    // Set monthly budget
    budgetInput.addEventListener('input', function () {
        budget = parseFloat(budgetInput.value);
        updateRemainingBudget();
    });

    // Update expense list
    function updateExpenses() {
        expensesList.innerHTML = '';
        expenses.forEach((expense, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                ${expense.date} - ${expense.category} - ${expense.description}: $${expense.amount.toFixed(2)}
                <button onclick="deleteExpense(${index})">Delete</button>
            `;
            expensesList.appendChild(li);
        });
    }

    // Delete an expense
    window.deleteExpense = function (index) {
        expenses.splice(index, 1);
        updateExpenses();
        updateCharts();
        updateRemainingBudget();
    };

    // Update remaining budget
    function updateRemainingBudget() {
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const remaining = budget - totalExpenses;
        remainingBudget.textContent = `$${remaining.toFixed(2)}`;
    }

    // Charts - Using Chart.js
    const barChart = new Chart(document.getElementById('barChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses by Category',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: { responsive: true }
    });

    const lineChart = new Chart(document.getElementById('lineChart').getContext('2d'), {
        type: 'line',
        data: {
            labels: [],
            datasets: [{
                label: 'Expenses Over Time',
                data: [],
                borderColor: 'rgba(75, 192, 192, 0.6)'
            }]
        },
        options: { responsive: true }
    });

    const pieChart = new Chart(document.getElementById('pieChart').getContext('2d'), {
        type: 'pie',
        data: {
            labels: [],
            datasets: [{
                data: [],
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']
            }]
        },
        options: { responsive: true }
    });

    // Update charts
    function updateCharts() {
        const categories = ['Food', 'Transport', 'Entertainment', 'Other'];
        const categoryTotals = categories.map(category => expenses
            .filter(expense => expense.category === category)
            .reduce((sum, expense) => sum + expense.amount, 0)
        );

        barChart.data.labels = categories;
        barChart.data.datasets[0].data = categoryTotals;
        barChart.update();

        const dates = [...new Set(expenses.map(expense => expense.date))];
        const dailyTotals = dates.map(date => expenses
            .filter(expense => expense.date === date)
            .reduce((sum, expense) => sum + expense.amount, 0)
        );

        lineChart.data.labels = dates;
        lineChart.data.datasets[0].data = dailyTotals;
        lineChart.update();

        pieChart.data.labels = categories;
        pieChart.data.datasets[0].data = categoryTotals;
        pieChart.update();
    }

    // Dark mode toggle in settings
    const darkModeToggle = document.getElementById('dark-mode');
    const body = document.body;

    // Load dark mode preference on page load
    if (localStorage.getItem('darkMode') === 'enabled') {
        body.classList.add('dark-mode');
        darkModeToggle.checked = true;
    }

    darkModeToggle.addEventListener('change', function () {
        if (darkModeToggle.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('darkMode', 'enabled');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('darkMode', 'disabled');
        }
    });
});
