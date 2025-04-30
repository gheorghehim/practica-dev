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
const menuBar = document.querySelector('#content nav .bx.bx-menu');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
	sidebar.classList.toggle('hide');
	
	// Add transition class to content
	const content = document.getElementById('content');
	content.classList.add('transitioning');
	
	// Remove transition class after animation completes
	setTimeout(() => {
		content.classList.remove('transitioning');
	}, 300);
	
	// Save sidebar state to localStorage
	const isHidden = sidebar.classList.contains('hide');
	localStorage.setItem('sidebarHidden', isHidden);
}

// Convert menu icon to button and add click handler
if (menuBar) {
	const menuButton = document.createElement('button');
	menuButton.className = 'menu-toggle';
	menuButton.setAttribute('aria-label', 'Toggle Sidebar');
	menuButton.setAttribute('aria-expanded', 'true');
	menuButton.innerHTML = '<i class="bx bx-menu"></i>';
	
	// Replace the icon with the button
	menuBar.parentNode.replaceChild(menuButton, menuBar);
	
	// Add click event listener to the new button
	menuButton.addEventListener('click', () => {
		toggleSidebar();
		// Update aria-expanded state
		const isHidden = sidebar.classList.contains('hide');
		menuButton.setAttribute('aria-expanded', !isHidden);
	});
}

// Initialize sidebar state
function initializeSidebar() {
	const isHidden = localStorage.getItem('sidebarHidden') === 'true';
	const isMobile = window.innerWidth <= 768;
	
	// On mobile, sidebar starts hidden
	if (isMobile) {
		sidebar.classList.add('hide');
	} else if (isHidden) {
		sidebar.classList.add('hide');
	}
	
	// Update button state if it exists
	const menuButton = document.querySelector('.menu-toggle');
	if (menuButton) {
		menuButton.setAttribute('aria-expanded', !isHidden && !isMobile);
	}
}

// Check for saved sidebar state on page load
document.addEventListener('DOMContentLoaded', initializeSidebar);

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
	// Debounce resize event
	clearTimeout(resizeTimeout);
	resizeTimeout = setTimeout(() => {
		const isMobile = window.innerWidth <= 768;
		if (isMobile) {
			sidebar.classList.add('hide');
			const menuButton = document.querySelector('.menu-toggle');
			if (menuButton) {
				menuButton.setAttribute('aria-expanded', 'false');
			}
		}
	}, 250);
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
	if (this.checked) {
		document.body.classList.add('dark');
		localStorage.setItem('darkMode', 'enabled');
	} else {
		document.body.classList.remove('dark');
		localStorage.setItem('darkMode', 'disabled');
	}
});

// Check for saved dark mode preference
if (localStorage.getItem('darkMode') === 'enabled') {
	switchMode.checked = true;
	document.body.classList.add('dark');
}

// Handle active state for sidebar menu items
const sideMenuItems = document.querySelectorAll('.side-menu.top li');
const currentPath = window.location.pathname;

sideMenuItems.forEach(item => {
	const link = item.querySelector('a');
	if (link.getAttribute('href') === currentPath.split('/').pop()) {
		item.classList.add('active');
	} else {
		item.classList.remove('active');
	}
});

// Handle window resize
function handleResize() {
	if (window.innerWidth <= 768) {
		sidebar.classList.add('hide');
	}
}

window.addEventListener('resize', handleResize);

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

if (quickActionsBtn && quickActionsDropdown) {
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
}

// Handle Logout Button Click
document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', (event) => {
            event.preventDefault(); // Prevent the default link behavior
            
            // Check if the logout function exists (it should be defined in auth.js)
            if (typeof logout === 'function') {
                logout(); // Call the logout function from auth.js
            } else {
                console.error('Logout function not found. Make sure auth.js is loaded correctly.');
                // Fallback: redirect manually if function is missing, though state won't be cleared
                // window.location.href = '/autentificare/login.html'; 
            }
        });
    }
});