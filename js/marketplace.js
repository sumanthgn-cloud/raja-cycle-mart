// Marketplace logic
document.addEventListener('DOMContentLoaded', function () {
    const tabs = document.querySelectorAll('.mp-tab');
    const panels = document.querySelectorAll('.mp-panel');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Remove active class from all tabs
            tabs.forEach(t => t.classList.remove('active'));

            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all panels
            panels.forEach(panel => {
                panel.style.display = 'none';
            });

            // Show target panel
            const targetId = tab.getAttribute('data-target');
            const targetPanel = document.getElementById(targetId);
            if (targetPanel) {
                targetPanel.style.display = 'grid';
            }
        });
    });

    // Blog Read More Toggle
    const toggleBtn = document.getElementById('toggle-blog-btn');
    const blogContent = document.getElementById('blog-content-1');

    if (toggleBtn && blogContent) {
        toggleBtn.addEventListener('click', () => {
            if (blogContent.style.display === 'block') {
                blogContent.style.display = 'none';
                toggleBtn.textContent = 'Read guide →';
            } else {
                blogContent.style.display = 'block';
                toggleBtn.textContent = 'Show less ↑';
            }
        });
    }

    // Smooth Scroll to Marketplace
    const scrollBtn = document.getElementById('scroll-to-mp');
    if (scrollBtn) {
        scrollBtn.addEventListener('click', () => {
            const mpSection = document.querySelector('.mp-tabs'); // Scroll to tabs
            if (mpSection) {
                mpSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});
