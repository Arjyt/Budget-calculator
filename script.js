function clk() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('No user is logged in');
        return;
    }

    const key = `budgetEntries_${username}`;
    const data = {
        desc: document.getElementById('description').value,
        amount: parseFloat(document.getElementById('amount').value),
        type: document.getElementById('type').value
    };

    let entries = JSON.parse(localStorage.getItem(key)) || [];
    entries.push(data);
    localStorage.setItem(key, JSON.stringify(entries));
    console.log("Entry saved successfully");

    updateTable();
    updatePieChart();
}

function updateTable() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('No user is logged in');
        return;
    }

    const key = `budgetEntries_${username}`;
    document.getElementById('income-list').innerHTML = '';
    document.getElementById('expense-list').innerHTML = '';

    const entries = JSON.parse(localStorage.getItem(key)) || [];

    let totalIncome = 0;
    let totalExpense = 0;
    let balance = 0;

    entries.forEach(item => {
        let table = item.type === 'income' ? document.getElementById('income-list') : document.getElementById('expense-list');
        table.innerHTML += `<tr><td>${item.desc}</td><td>${item.amount}</td></tr>`;

        if (item.type === 'income') {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }
        balance = totalIncome - totalExpense;
    });

    document.getElementById('img').innerHTML = totalIncome < totalExpense 
        ? `<img src="./assets/pngtree-cartoon-rising-red-twisted-arrow-png-image_2274523-removebg-preview.png" 
           alt="Downward Arrow" style="width: 200px; height: 200px; padding: 20px; margin-top: 150px">` 
        : `<img src="./assets/360_F_599773501_PuDhPTZ10fqoRIHpf3P3yG1OZeugNx8o-removebg-preview.png" 
           alt="Upward Arrow" style="width: 200px; height: 180px; padding: 20px; margin-top: 150px">`;

    document.getElementById('income-total').textContent = ` ${totalIncome}`;
    document.getElementById('expense-total').textContent = ` ${totalExpense}`;
    document.getElementById('balance-amount').textContent = `${balance}`;
}

function updatePieChart() {
    const username = localStorage.getItem('currentUser');
    if (!username) {
        alert('No user is logged in');
        return;
    }

    const key = `budgetEntries_${username}`;
    const entries = JSON.parse(localStorage.getItem(key)) || [];
    
    let totalIncome = 0;
    let totalExpense = 0;

    entries.forEach(item => {
        if (item.type === 'income') {
            totalIncome += item.amount;
        } else {
            totalExpense += item.amount;
        }
    });

    const data = {
        labels: ['Income', 'Expenses'],
        datasets: [{
            data: [totalIncome, totalExpense],
            backgroundColor: ['#36A2EB', '#FF6384'],
            borderColor: ['#FFF', '#FFF'],
            borderWidth: 1
        }]
    };

    const ctx = document.getElementById('budgetPieChart').getContext('2d');

    if (window.pieChart) {
        window.pieChart.destroy();
    }

    window.pieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top',
                },
                tooltip: {
                    callbacks: {
                        label: function (tooltipItem) {
                            return tooltipItem.label + ': ' + tooltipItem.raw;
                        }
                    }
                }
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    updateTable();
    updatePieChart();
});
function logout() {
    localStorage.removeItem('currentUser');
    window.location = './main.html'; // Redirect to the login page
}
