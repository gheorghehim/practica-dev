const allSideMenu = document.querySelectorAll('#sidebar .side-menu.top li a');

allSideMenu.forEach(item=> {
	const li = item.parentElement;

	item.addEventListener('click', function () {
		allSideMenu.forEach(i=> {
			i.parentElement.classList.remove('active');
		})
		li.classList.add('active');
	})
});




// TOGGLE SIDEBAR
const menuBar = document.querySelector('.bx.bx-menu');
const sidebar = document.getElementById('sidebar');

menuBar.addEventListener('click', function () {
	sidebar.classList.toggle('hide');
});







const searchButton = document.querySelector('#content nav form .form-input button');
const searchButtonIcon = document.querySelector('#content nav form .form-input button .bx');
const searchForm = document.querySelector('#content nav form');

searchButton.addEventListener('click', function (e) {
	if(window.innerWidth < 576) {
		e.preventDefault();
		searchForm.classList.toggle('show');
		if(searchForm.classList.contains('show')) {
			searchButtonIcon.classList.replace('bx-search', 'bx-x');
		} else {
			searchButtonIcon.classList.replace('bx-x', 'bx-search');
		}
	}
})





if(window.innerWidth < 768) {
	sidebar.classList.add('hide');
} else if(window.innerWidth > 576) {
	searchButtonIcon.classList.replace('bx-x', 'bx-search');
	searchForm.classList.remove('show');
}


window.addEventListener('resize', function () {
	if(this.innerWidth > 576) {
		searchButtonIcon.classList.replace('bx-x', 'bx-search');
		searchForm.classList.remove('show');
	}
})



const switchMode = document.getElementById('switch-mode');

switchMode.addEventListener('change', function () {
	if(this.checked) {
		document.body.classList.add('dark');
	} else {
		document.body.classList.remove('dark');
	}
});

// Save dark mode state
function saveDarkModeState(isDark) {
    localStorage.setItem('darkMode', isDark);
}

// Load dark mode state
function loadDarkModeState() {
    const isDark = localStorage.getItem('darkMode') === 'true';
    if (isDark) {
        document.body.classList.add('dark');
        switchMode.checked = true;
    }
}

// Update dark mode state when changed
switchMode.addEventListener('change', function () {
    saveDarkModeState(this.checked);
});

// Load dark mode state when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadDarkModeState();
});

// Budget specific functionality
document.addEventListener('DOMContentLoaded', function() {
	// Toggle sidebar
	const allSideMenu = document.querySelectorAll('#sidebar .side-menu li a');
	allSideMenu.forEach(item => {
		item.addEventListener('click', function(e) {
			e.preventDefault();
			allSideMenu.forEach(i => i.parentElement.classList.remove('active'));
			this.parentElement.classList.add('active');
		});
	});

	// Toggle sidebar
	const menuBar = document.querySelector('#content nav .bx.bx-menu');
	const sidebar = document.getElementById('sidebar');
	menuBar.addEventListener('click', function() {
		sidebar.classList.toggle('hide');
	});

	// Dark mode toggle
	const switchMode = document.getElementById('switch-mode');
	switchMode.addEventListener('change', function() {
		if (this.checked) {
			document.body.classList.add('dark');
		} else {
			document.body.classList.remove('dark');
		}
	});

	// Add new transaction
	const addTransactionBtn = document.querySelector('.bx-plus');
	if (addTransactionBtn) {
		addTransactionBtn.addEventListener('click', function() {
			// TODO: Implement add transaction modal
			alert('Add transaction functionality coming soon!');
		});
	}

	// Calculate total balance
	function calculateBalance() {
		const incomeElements = document.querySelectorAll('.income');
		const expenseElements = document.querySelectorAll('.expense');
		
		let totalIncome = 0;
		let totalExpense = 0;
		
		incomeElements.forEach(el => {
			totalIncome += parseFloat(el.textContent.replace('+', '').replace('$', ''));
		});
		
		expenseElements.forEach(el => {
			totalExpense += parseFloat(el.textContent.replace('-', '').replace('$', ''));
		});
		
		const totalBalance = totalIncome - totalExpense;
		
		// Update the balance display
		const balanceElement = document.querySelector('.box-info li:nth-child(1) h3');
		if (balanceElement) {
			balanceElement.textContent = `$${totalBalance.toFixed(2)}`;
		}
	}

	// Initial calculation
	calculateBalance();
});

// Quick Actions Dropdown
const quickActionsBtn = document.getElementById('quickActionsBtn');
const quickActionsDropdown = document.getElementById('quickActionsDropdown');

quickActionsBtn.addEventListener('click', function(e) {
    e.preventDefault();
    quickActionsDropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', function(e) {
    if (!quickActionsBtn.contains(e.target) && !quickActionsDropdown.contains(e.target)) {
        quickActionsDropdown.classList.remove('show');
    }
});