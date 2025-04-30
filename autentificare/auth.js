// Criterii de validare a parolei
const passwordRequirements = {
    length: /.{8,}/,
    uppercase: /[A-Z]/,
    lowercase: /[a-z]/,
    number: /[0-9]/,
    special: /[!@#$%^&*(),.?":{}|<>]/
};

// Funcție pentru afișarea mesajelor
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

// Funcție simplă de hashare a parolei (doar pentru scopuri demonstrative)
function simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString();
}

// Authentication state
let currentUser = null;

// Check if user is logged in
function isLoggedIn() {
    const storedUser = localStorage.getItem('currentUser');
    console.log('Checking if logged in:', storedUser);
    return storedUser !== null;
}

// Get current user
function getCurrentUser() {
    return currentUser;
}

// Login function
function login(username, password) {
    console.log('Login attempt for:', username);
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
        currentUser = {
            name: user.name,
            username: user.username
        };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        localStorage.setItem('isLoggedIn', 'true');
        console.log('Login successful');
        return true;
    }
    console.log('Login failed');
    return false;
}

// Register function
function register(name, username, password) {
    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('users')) || [];
    
    // Check if username already exists
    if (users.some(u => u.username === username)) {
        return {
            success: false,
            message: 'Username already taken'
        };
    }
    
    // Create new user
    const newUser = {
        name,
        username,
        password
    };
    
    // Add user to users array
    users.push(newUser);
    
    // Save users to localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
        success: true,
        message: 'Registration successful'
    };
}

// Logout function
function logout() {
    console.log('Logout function called');
    // Clear current user
    currentUser = null;
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isLoggedIn');
    
    // Get the current path and base URL
    const currentPath = window.location.pathname;
    const baseUrl = window.location.origin;
    console.log('Current path:', currentPath);
    console.log('Base URL:', baseUrl);
    
    // Determine the correct path to login page
    let loginPath;
    if (currentPath.includes('/continut/')) {
        // If we're in the continut directory, go up one level to autentificare
        loginPath = '../autentificare/login.html';
    } else if (currentPath.includes('/autentificare/')) {
        // If we're already in autentificare directory, just use login.html
        loginPath = 'login.html';
    } else {
        // Default case, use absolute path
        loginPath = '/autentificare/login.html';
    }
    
    console.log('Redirecting to:', loginPath);
    
    // Redirect to login page
    window.location.href = loginPath;
}

// Check authentication on page load
function checkAuth() {
    console.log('Checking authentication');
    const storedUser = localStorage.getItem('currentUser');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    
    console.log('Stored user:', storedUser);
    console.log('Is logged in:', isLoggedIn);
    
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
    
    // Get current path for redirection logic
    const currentPath = window.location.pathname;
    console.log('Current path in checkAuth:', currentPath);
    
    // If on login/register page and user is logged in, redirect to dashboard
    if (currentUser && (currentPath.includes('login.html') || currentPath.includes('register.html'))) {
        console.log('User is logged in, redirecting to dashboard');
        window.location.href = '../continut/index.html';
    }
    
    // If not on login/register page and user is not logged in, redirect to login
    if (!currentUser && !currentPath.includes('login.html') && !currentPath.includes('register.html')) {
        console.log('User is not logged in, redirecting to login');
        let loginPath;
        if (currentPath.includes('/continut/')) {
            loginPath = '../autentificare/login.html';
        } else {
            loginPath = 'login.html';
        }
        console.log('Redirecting to login at:', loginPath);
        window.location.href = loginPath;
    }
}

// Initialize event listeners
function initializeAuth() {
    console.log('Initializing auth');
    
    // Check authentication
    checkAuth();
    
    // Add logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    console.log('Looking for logout button:', logoutButton);
    
    if (logoutButton) {
        console.log('Logout button found, adding event listener');
        // Remove any existing event listeners
        const newLogoutButton = logoutButton.cloneNode(true);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);
        
        // Add new event listener
        newLogoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Logout button clicked');
            logout();
        });
    } else {
        console.log('Logout button not found');
    }
    
    // Add login form event listener if on login page
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        console.log('Login form found');
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            if (login(username, password)) {
                window.location.href = '../continut/index.html';
            } else {
                alert('Invalid username or password');
            }
        });
    }
}

// Wait for DOM to be fully loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAuth);
} else {
    initializeAuth();
}

// Validează criteriile de parolă
function validatePassword(password) {
    const requirements = {
        length: passwordRequirements.length.test(password),
        uppercase: passwordRequirements.uppercase.test(password),
        lowercase: passwordRequirements.lowercase.test(password),
        number: passwordRequirements.number.test(password),
        special: passwordRequirements.special.test(password)
    };

    // Actualizează UI pentru a arăta care criterii sunt îndeplinite
    Object.keys(requirements).forEach(key => {
        const element = document.getElementById(key);
        if (element) {
            element.classList.toggle('valid', requirements[key]);
        }
    });

    return Object.values(requirements).every(requirement => requirement);
}

    // Responsabilitatea de a gestiona înregistrarea utilizatorului
function handleRegister(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validează numele de utilizator
    if (username.length < 3) {
        showMessage('errorMessage', 'Numele de utilizator trebuie să aibă cel puțin 3 caractere.');
        return;
    }

    // Validează parola
    if (!validatePassword(password)) {
        showMessage('errorMessage', 'Vă rugăm să vă asigurați că parola îndeplinește toate cerințele.');
        return;
    }

    // Verifică dacă parolele coincid
    if (password !== confirmPassword) {
        showMessage('errorMessage', 'Parolele nu coincid.');
        return;
    }

    // Verifică dacă numele de utilizator există deja
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.username === username)) {
        showMessage('errorMessage', 'Numele de utilizator există deja. Vă rugăm să alegeți altul.');
        return;
    }

    // Creează un nou utilizator cu parola hashată
    const newUser = {
        username,
        password: simpleHash(password) 
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    showMessage('successMessage', 'Registration successful! Redirecting to login...', false);
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 2000);
}

// Responsabilitatea de a gestiona înregistrarea utilizatorului
function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Obține utilizatorii din localStorage
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

// Initializeaza ascultatorii de evenimente
document.addEventListener('DOMContentLoaded', function() {
    // Verifică starea de autentificare
    checkAuth();

    // Validare a parolei la introducere
    const passwordInput = document.getElementById('password');
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            validatePassword(this.value);
        });
    }

    // Submitare formular de înregistrare
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }

    // Submitare formular de login
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Add logout button event listener
    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        console.log('Logout button found');
        logoutButton.addEventListener('click', function(e) {
            e.preventDefault();
            console.log('Logout button clicked');
            logout();
        });
    } else {
        console.log('Logout button not found');
    }
});  