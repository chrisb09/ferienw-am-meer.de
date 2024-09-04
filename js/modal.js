function openModal(img) {
    // Get the modal and modal image elements
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    // Get the position and size of the clicked image
    const rect = img.getBoundingClientRect();

    // Set the source of the modal image before starting the transition
    modalImg.src = img.src;

    // Set the initial position and size of the modal image
    modalImg.style.width = rect.width + 'px';
    modalImg.style.height = rect.height + 'px';
    modalImg.style.left = rect.left + 'px';
    modalImg.style.top = rect.top + 'px';

    // Calculate the aspect ratio of the image
    const aspectRatio = img.naturalWidth / img.naturalHeight;

    // Calculate the target width and height while maintaining aspect ratio
    let targetWidth = window.innerWidth * 0.8;
    let targetHeight = targetWidth / aspectRatio;

    // Check if the calculated height exceeds 80% of the viewport height
    if (targetHeight > window.innerHeight * 0.8) {
        targetHeight = window.innerHeight * 0.8;
        targetWidth = targetHeight * aspectRatio;
    }

    // Set the transition effect
    modalImg.style.transition = "all 0.6s ease"; // Adjust timing as needed

    // Display the modal
    modal.style.display = "block";

    // Use a small timeout to ensure the transition effect works
    setTimeout(() => {
        // Transition to the calculated size and centered position
        modalImg.style.width = targetWidth + 'px';
        modalImg.style.height = targetHeight + 'px';
        modalImg.style.left = '50%';
        modalImg.style.top = '50%';
        modalImg.style.transform = 'translate(-50%, -50%)';
    }, 10);
}

function closeModal() {
    const modal = document.getElementById("imageModal");
    const modalImg = document.getElementById("modalImage");

    // Get the current size and position of the modal image
    const rect = modalImg.getBoundingClientRect();

    // Find the original image element that was clicked (you'll need to track this)

    const originalSrc = modalImg.src.split('/').pop(); // Get only the filename
    const originalImg = Array.from(document.querySelectorAll('.clickable-image')).find(img => img.src.includes(originalSrc));
    const originalRect = originalImg.getBoundingClientRect();

    // Set the transition effect for closing
    modalImg.style.transition = "all 0.6s ease";

    // Transition back to the original size and position
    modalImg.style.width = originalRect.width + 'px';
    modalImg.style.height = originalRect.height + 'px';
    modalImg.style.left = originalRect.left + 'px';
    modalImg.style.top = originalRect.top + 'px';
    modalImg.style.transform = ''; // Reset the transform

    // Hide the modal after the transition
    setTimeout(() => {
        modal.style.display = "none";
    }, 600); // Match the timeout with the transition duration
}



// Close the modal when clicking outside of the image
window.onclick = function(event) {
    const modal = document.getElementById("imageModal");
    if (event.target === modal) {
        closeModal();
    }
}
