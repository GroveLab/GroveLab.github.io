// This file contains JavaScript code that implements the functionality for the slideshow feature on the website, including image transitions and dynamic loading of images.

let currentSlide = 0;
let slides = [];

// Function to load images from the slideshow folder
function loadSlideshow() {
    const slideshow = document.getElementById('slideshow');
    const imageNames = ['image1.jpg', 'image2.jpg', 'image3.jpg'];
    
    imageNames.forEach((imageName, index) => {
        const img = document.createElement('img');
        img.src = `assets/images/slideshow/${imageName}`;
        img.alt = `Slide ${index + 1}`;
        if (index === 0) img.classList.add('active');
        slideshow.appendChild(img);
        slides.push(img);
    });
}

function showSlide(n) {
    slides[currentSlide].classList.remove('active');
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Load the slideshow when the page is ready
document.addEventListener('DOMContentLoaded', () => {
    loadSlideshow();
    setInterval(nextSlide, 5000); // Change slide every 5 seconds
});