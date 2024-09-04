document.addEventListener("DOMContentLoaded", function() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li a');
    
    // Toggle nav
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    // Collapse navbar on link click
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    // Collapse navbar on outside click
    document.addEventListener('click', (event) => {
        if (!navLinks.contains(event.target) && !hamburger.contains(event.target)) {
            navLinks.classList.remove('active');
        }
    });

    // Collapse/open navbar on swipe
    let startX = 0;

    document.addEventListener('touchstart', (event) => {
        startX = event.touches[0].clientX;
    });

    document.addEventListener('touchend', (event) => {
        const endX = event.changedTouches[0].clientX;
        const diffX = endX - startX;

        if (diffX > 50) {
            if (startX < window.innerWidth / 10){
                navLinks.classList.add('active'); 
            }
        } else if (diffX < -50) {
            navLinks.classList.remove('active');
        }
    });
});


function leftScrollButtonClick(sectionId) {
    const container = document.getElementById(`${sectionId}-scroll`);
    const scrollAmount = container.clientHeight; // Scroll by the height of one item
    container.scrollBy({
        left: -scrollAmount,
        behavior: 'smooth'
    });
}

function rightScrollButtonClick(sectionId) {
    const container = document.getElementById(`${sectionId}-scroll`);
    const scrollAmount = container.clientHeight; // Scroll by the height of one item
    container.scrollBy({
        left: scrollAmount,
        behavior: 'smooth'
    });
}

function jumpToSlide(sectionId, index) {
    const container = document.getElementById(`${sectionId}-scroll`);
    const itemWidth = container.clientWidth;
    container.scrollTo({
        left: index * itemWidth,
        behavior: 'smooth'
    });
    updateActiveDot(sectionId, index);
}

function updateActiveDot(sectionId, index) {
    const dots = document.querySelectorAll(`#${sectionId}-dots .dot`);
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
}


function setupScrollListeners() {
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        const container = section.querySelector('.scroll-content');
        const sectionId = section.id;
        const itemWidth = container.clientWidth;

        container.addEventListener('scroll', () => {
            const scrollLeft = container.scrollLeft;
            const index = Math.round(scrollLeft / itemWidth);
            updateActiveDot(sectionId, index);
        });
    });
}


// Call this function once your DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    setupScrollListeners();

    // <div class="pagination-dots" id="wohnung-105-dots"></div>
    const dotDivs = document.querySelectorAll('.pagination-dots');
    dotDivs.forEach(section => {
        const sectionId = section.id;
        updateActiveDot(sectionId.replace("-dots", ""), 0);
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelector('.navbar .nav-links');
    const initialTop = 8; // in vw // convert vw to px

    window.addEventListener('scroll', function() {
        const initialTopPx = window.innerWidth * initialTop / 100;
        const scrollTop = window.scrollY;

        // Calculate the new top position
        let newTop = initialTopPx - scrollTop;

        // If scroll exceeds the initial top, cap the top position at 0
        if (newTop < 0) {
            newTop = 0;
        }

        // Set the top position, converting back to vw units
        navLinks.style.top = `calc(${newTop}px)`;
    });
});
