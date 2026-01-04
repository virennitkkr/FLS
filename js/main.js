// FLS - Fun-Learn-Succeed JavaScript

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Start Learning button handler
function startLearning() {
    const topics = document.getElementById('topics');
    if (topics) {
        topics.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
        
        // Add a welcome message
        showNotification('Choose a topic to begin your learning journey! 🚀');
    }
}

// Topic button handlers
document.addEventListener('DOMContentLoaded', function() {
    const topicButtons = document.querySelectorAll('.topic-btn');
    
    topicButtons.forEach(button => {
        button.addEventListener('click', function() {
            const topicCard = this.closest('.topic-card');
            const topicName = topicCard.querySelector('h3').textContent;
            
            showNotification(`Coming soon: ${topicName} courses! Stay tuned! 📚`);
        });
    });
});

// Notification system
function showNotification(message) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.add('hide');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Track user progress (simple implementation)
let userProgress = {
    visits: 0,
    lastVisit: null
};

// Load progress from localStorage
function loadProgress() {
    const saved = localStorage.getItem('flsProgress');
    if (saved) {
        userProgress = JSON.parse(saved);
    }
}

// Save progress to localStorage
function saveProgress() {
    localStorage.setItem('flsProgress', JSON.stringify(userProgress));
}

// Update progress on page load
loadProgress();
userProgress.visits++;
userProgress.lastVisit = new Date().toISOString();
saveProgress();

// Welcome back! This is visit #${userProgress.visits}
if (userProgress.visits > 1) {
    setTimeout(() => {
        showNotification(`Welcome back! This is visit #${userProgress.visits} 🎉`);
    }, 1000);
}

// Add scroll reveal animation
function revealOnScroll() {
    const elements = document.querySelectorAll('.feature-card, .topic-card, .about-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        
        if (elementTop < window.innerHeight && elementBottom > 0) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize elements for scroll reveal
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.feature-card, .topic-card, .about-item');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    revealOnScroll();
});

// Listen for scroll events
window.addEventListener('scroll', revealOnScroll);

// Console message for developers
console.log('%cWelcome to FLS! 🚀', 'color: #4a90e2; font-size: 20px; font-weight: bold;');
console.log('%cFun • Learn • Succeed', 'color: #50c878; font-size: 14px;');
console.log('Interested in contributing? Visit: https://github.com/virennitkkr/FLS');
