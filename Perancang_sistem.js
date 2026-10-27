// State Management
let selectedRole = 'Mahasiswa';
let currentUser = null;
let currentRating = 5;
let feedbackCount = 2;

// Dark Mode Toggle Logic
const themeToggleBtn = document.getElementById('theme-toggle');
const darkIcon = document.getElementById('theme-toggle-dark-icon');
const lightIcon = document.getElementById('theme-toggle-light-icon');

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    lightIcon.classList.add('hidden');
    darkIcon.classList.remove('hidden');
} else {
    document.documentElement.classList.remove('dark');
    darkIcon.classList.add('hidden');
    lightIcon.classList.remove('hidden');
}

themeToggleBtn.addEventListener('click', function() {
    lightIcon.classList.toggle('hidden');
    darkIcon.classList.toggle('hidden');

    if (localStorage.getItem('color-theme')) {
        if (localStorage.getItem('color-theme') === 'light') {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        }
    } else {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
    }
});

// Modal Login Toggle
function toggleLoginModal(show) {
    const modal = document.getElementById('login-modal');
    if (show) {
        modal.classList.remove('hidden');
    } else {
        modal.classList.add('hidden');
    }
}

// Role Selection Logic
function selectRole(role) {
    selectedRole = role;
    const btnMhs = document.getElementById('role-mhs');
    const btnDosen = document.getElementById('role-dosen');

    if (role === 'Mahasiswa') {
        btnMhs.className = 'py-2.5 px-3 rounded-xl border border-brandRed bg-red-50 dark:bg-red-900/30 text-brandRed font-semibold text-xs flex items-center justify-center space-x-2 transition';
        btnDosen.className = 'py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-xs flex items-center justify-center space-x-2 transition';
    } else {
        btnDosen.className = 'py-2.5 px-3 rounded-xl border border-brandRed bg-red-50 dark:bg-red-900/30 text-brandRed font-semibold text-xs flex items-center justify-center space-x-2 transition';
        btnMhs.className = 'py-2.5 px-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-600 dark:text-gray-300 font-semibold text-xs flex items-center justify-center space-x-2 transition';
    }
}

// Handle Login Submission
function handleLoginSubmit(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const name = email.split('@')[0];
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);

    currentUser = {
        name: formattedName,
        role: selectedRole,
        email: email
    };

    // Update Navbar UI
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = `
        <div class="flex items-center space-x-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-xl shadow-sm">
            <div class="w-6 h-6 rounded-full ${selectedRole === 'Mahasiswa' ? 'bg-brandRed' : 'bg-brandGreen'} text-white text-[10px] font-bold flex items-center justify-center">
                ${formattedName.charAt(0)}
            </div>
            <div class="text-xs">
                <span class="font-bold block leading-none">${formattedName}</span>
                <span class="text-[10px] text-gray-500 dark:text-gray-400 leading-none">${selectedRole}</span>
            </div>
            <button onclick="handleLogout()" class="text-gray-400 hover:text-brandRed text-xs ml-1" title="Logout">
                <i class="fas fa-right-from-bracket"></i>
            </button>
        </div>
    `;

    // Auto-fill Feedback Form Name
    document.getElementById('fb-name').value = formattedName;

    // Close Modal
    toggleLoginModal(false);
}

// Handle Logout
function handleLogout() {
    currentUser = null;
    const authContainer = document.getElementById('auth-container');
    authContainer.innerHTML = `
        <button id="open-login-btn" onclick="toggleLoginModal(true)" class="bg-brandRed text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-700 shadow-md transition flex items-center space-x-2">
            <i class="fas fa-right-to-bracket"></i>
            <span>Login</span>
        </button>
    `;
    document.getElementById('fb-name').value = '';
}

// Star Rating Selection Logic
function setRating(rating) {
    currentRating = rating;
    document.getElementById('fb-rating').value = rating;
    const stars = document.getElementById('star-rating-container').children;

    for (let i = 0; i < stars.length; i++) {
        if (i < rating) {
            stars[i].className = 'fas fa-star cursor-pointer text-brandYellow transition';
        } else {
            stars[i].className = 'fas fa-star cursor-pointer text-gray-300 dark:text-gray-600 transition';
        }
    }
}

// Handle Feedback Submission
function handleFeedbackSubmit(event) {
    event.preventDefault();
    const name = document.getElementById('fb-name').value;
    const message = document.getElementById('fb-message').value;
    const rating = parseInt(document.getElementById('fb-rating').value);
    const userRole = currentUser ? currentUser.role : 'Mahasiswa';

    // Generate Star Icons HTML
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= rating) {
            starsHtml += '<i class="fas fa-star"></i>';
        } else {
            starsHtml += '<i class="far fa-star"></i>';
        }
    }

    // Create New Feedback Element
    const feedbackList = document.getElementById('feedback-list');
    const newFeedback = document.createElement('div');
    newFeedback.className = 'bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm space-y-2 animate-fade-in';
    newFeedback.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
                <div class="w-7 h-7 rounded-full ${userRole === 'Mahasiswa' ? 'bg-brandRed' : 'bg-brandGreen'} text-white text-xs font-bold flex items-center justify-center">${name.charAt(0).toUpperCase()}</div>
                <span class="text-sm font-bold">${name}</span>
                <span class="text-[10px] ${userRole === 'Mahasiswa' ? 'bg-red-100 dark:bg-red-900/40 text-brandRed' : 'bg-green-100 dark:bg-green-900/40 text-brandGreen'} px-2 py-0.5 rounded-full font-semibold">${userRole}</span>
            </div>
            <div class="text-brandYellow text-xs">
                ${starsHtml}
            </div>
        </div>
        <p class="text-xs text-gray-600 dark:text-gray-300">${message}</p>
        <span class="text-[10px] text-gray-400 block">Baru saja</span>
    `;

    // Insert to Top of List
    feedbackList.insertBefore(newFeedback, feedbackList.firstChild);

    // Update Counter
    feedbackCount++;
    document.getElementById('feedback-count').textContent = `${feedbackCount} Ulasan`;

    // Reset Message Input
    document.getElementById('fb-message').value = '';
    setRating(5);
}

// Initialize default star rating
setRating(5);