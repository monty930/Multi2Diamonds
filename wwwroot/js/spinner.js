window.addEventListener("DOMContentLoaded", function () {
    const image = document.getElementById('loading-img');
    const randomAngle = Math.floor(Math.random() * 360); // Generate a random angle between 0 and 359
    image.style.transform = 'rotate(' + randomAngle + 'deg)'; // Rotate the image
});