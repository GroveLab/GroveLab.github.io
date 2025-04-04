function initCarousel(carouselElement) {
    const images = carouselElement.getElementsByTagName('img');
    let currentIndex = 0;

    function showNextImage() {
        images[currentIndex].classList.remove('active');
        currentIndex = (currentIndex + 1) % images.length;
        images[currentIndex].classList.add('active');
    }

    images[0].classList.add('active');
    setInterval(showNextImage, 3000);
}

document.addEventListener('DOMContentLoaded', () => {
    const carousels = document.querySelectorAll('.carousel');
    carousels.forEach(carousel => initCarousel(carousel));
});