// Theme Toggle Functionality with System Preference Detection
(function() {
    'use strict';
    
    // Detect system preference for dark mode
    function getSystemPreference() {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    
    // Get saved theme from localStorage, or use system preference
    const savedTheme = localStorage.getItem('theme') || getSystemPreference();
    
    // Apply saved theme immediately to avoid flash
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Wait for DOM to be ready
    document.addEventListener('DOMContentLoaded', function() {
        // Create theme toggle button
        const toggleButton = document.createElement('button');
        toggleButton.className = 'theme-toggle';
        toggleButton.setAttribute('aria-label', 'テーマ切り替え');
        toggleButton.setAttribute('title', 'ライト/ダークモード切り替え (Ctrl+Shift+D)');
        toggleButton.innerHTML = `
            <span class="icon-sun"><i class="fas fa-sun"></i></span>
            <span class="icon-moon"><i class="fas fa-moon"></i></span>
        `;
        
        // Add button to body
        document.body.appendChild(toggleButton);
        
        // Toggle theme function
        function toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            // Update theme
            document.documentElement.setAttribute('data-theme', newTheme);
            
            // Save to localStorage
            localStorage.setItem('theme', newTheme);
            
            // Update button tooltip
            const modeText = newTheme === 'dark' ? 'ダークモード' : 'ライトモード';
            toggleButton.setAttribute('title', `ライト/ダークモード切り替え (Ctrl+Shift+D) - 現在: ${modeText}`);
            
            // Optional: Add haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate(10);
            }
        }
        
        // Add click event listener
        toggleButton.addEventListener('click', toggleTheme);
        
        // Keyboard shortcut (Ctrl/Cmd + Shift + D for Dark mode)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'D') {
                e.preventDefault();
                toggleTheme();
            }
        });
        
        // Detect system preference change (only if user hasn't manually set a preference)
        const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // Track if user has manually changed the theme
        let userHasSetPreference = localStorage.getItem('theme') !== null;
        
        toggleButton.addEventListener('click', function() {
            userHasSetPreference = true;
        });
        
        darkModeQuery.addEventListener('change', function(e) {
            // Only auto-switch if user hasn't manually set a preference
            if (!userHasSetPreference) {
                const newTheme = e.matches ? 'dark' : 'light';
                document.documentElement.setAttribute('data-theme', newTheme);
            }
        });
        
        // Set initial tooltip text
        const currentMode = savedTheme === 'dark' ? 'ダークモード' : 'ライトモード';
        toggleButton.setAttribute('title', `ライト/ダークモード切り替え (Ctrl+Shift+D) - 現在: ${currentMode}`);
    });
    
    // --- Mobile nav menu toggle ---
    document.addEventListener('DOMContentLoaded', function() {
        const menu = document.getElementById('menu');
        const icon = document.querySelector('.menu-icon');
        
        if (!menu || !icon) return;
        
        function openMenu() {
            menu.classList.add('show');
            icon.setAttribute('aria-expanded', 'true');
        }
        
        function closeMenu() {
            menu.classList.remove('show');
            icon.setAttribute('aria-expanded', 'false');
        }
        
        function toggleMenu() {
            if (menu.classList.contains('show')) {
                closeMenu();
            } else {
                openMenu();
            }
        }
        
        // Keep working with existing onclick="toggleMenu()" in HTML,
        // and also bind directly here so the inline attribute can be removed later.
        window.toggleMenu = toggleMenu;
        icon.addEventListener('click', toggleMenu);
        
        // Close when tapping outside the menu
        document.addEventListener('click', function(e) {
            if (menu.classList.contains('show') && !menu.contains(e.target) && !icon.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Close when a menu link is clicked (mobile UX)
        menu.querySelectorAll('a').forEach(function(link) {
            link.addEventListener('click', closeMenu);
        });
        
        // Close on Escape
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') closeMenu();
        });
    });
})();
