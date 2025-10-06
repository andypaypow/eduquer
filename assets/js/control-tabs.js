document.addEventListener('DOMContentLoaded', function() {
    // Get all tab navigation links
    const tabLinks = document.querySelectorAll('.control-tabs .tab-link');
    
    // Get all tab content panels
    const tabPanels = document.querySelectorAll('.control-tabs .tab-panel');
    
    // Add click event listener to each tab link
    tabLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get the target tab ID from the href attribute
            const targetTabId = this.getAttribute('href').substring(1);
            
            // Remove active class from all tab links and panels
            tabLinks.forEach(l => l.classList.remove('active'));
            tabPanels.forEach(p => p.classList.remove('active'));
            
            // Add active class to the clicked tab link and corresponding panel
            this.classList.add('active');
            document.getElementById(targetTabId).classList.add('active');
        });
    });
    
    // Initialize the first tab as active
    if (tabLinks.length > 0 && tabPanels.length > 0) {
        tabLinks[0].classList.add('active');
        tabPanels[0].classList.add('active');
    }
});