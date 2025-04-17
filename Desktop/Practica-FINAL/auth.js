// Password validation requirements
const passwordRequirements = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

// Show message function
function showMessage(elementId, message, isError = true) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
        if (isError) {
            element.className = 'error-message';
        } else {
            element.className = 'success-message';
        }
        setTimeout(() => {
            element.style.display = 'none';
        }, 5000);
    }
}

// Simple password hashing function (for demo purposes only)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Check if user is already logged in
function checkAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const currentUser = localStorage.getItem('currentUser');
    
    // Update UI to show logged in user
    const profileElement = document.querySelector('.profile');
    if (profileElement && currentUser) {
        profileElement.innerHTML = `
            <span class="username">${currentUser}</span>
            <i class='bx bxs-user-circle'></i>
        `;
    }

    if (isLoggedIn && window.location.pathname.includes('login.html')) {
        window.location.href = 'index.html';
    } else if (!isLoggedIn && !window.location.pathname.includes('login.html') && !window.location.pathname.includes('register.html')) {
        window.location.href = 'login.html';
    }
}

// Validate password requirements
function validatePassword(password) {
    const requirements = {
        length: passwordRequirements.length.test(password),
        uppercase: passwordRequirements.uppercase.test(password),
        lowercase: passwordRequirements.lowercase.test(password),
        number: passwordRequirements.number.test(password),
        special: passwordRequirements.special.test(password)
    };

    // Update UI to show which requirements are met
    Object.keys(requirements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.classList.toggle('valid', requirements[key]);
        }
    });

    return Object.values(requirements).every(requirement => requirement);
}

// Handle registration form submission
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate username
    if (username.length < 3) {
        showMessage('errorMessage', 'Username must be at least 3 characters long.');
        return;
    }

    // Validate password
    if (!validatePassword(password)) {
        showMessage('errorMessage', 'Please ensure your password meets all requirements.');
        return;
    }

    // Check if passwords match
    if (password !== confirmPassword) {
        showMessage('errorMessage', 'Passwords do not match.');
        return;
    }

    // Check if username already exists
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        showMessage('errorMessage', 'Username already exists. Please choose another.');
        return;
    }

    // Create new user with hashed password
    const newUser = {
        username,
        password: simpleHash(password) // Simple hashing for demo purposes
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('successMessage', 'Registration successful! Redirecting to login...', false);
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Handle login form submission
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(user => 
        user.username === username && 
        user.password === simpleHash(password)
    );

    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        showMessage('errorMessage', 'Login successful! Redirecting...', false);
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1000);
    } else {
        showMessage('errorMessage', 'Invalid username or password.');
    }
}

// Handle logout
function handleLogout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

// Initialize event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication status
    checkAuth();

    // Password validation on input
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }

    // Register form submission
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Login form submission
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Logout button
    const logoutButton = document.querySelector('.logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            handleLogout();
        });
    }
}); 