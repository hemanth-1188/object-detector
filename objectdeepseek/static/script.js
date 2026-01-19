// Simple JavaScript for interactivity
document.addEventListener('DOMContentLoaded', function() {
    // FPS counter simulation (would be real in actual implementation)
    let fps = 24;
    const fpsElement = document.getElementById('fps');
    
    // Update FPS counter every second
    setInterval(() => {
        // Simulate small FPS variations
        fps = 24 + Math.floor(Math.random() * 6);
        fpsElement.textContent = fps;
    }, 1000);
    
    // Object count simulation (would be real in actual implementation)
    const objectCountElement = document.getElementById('object-count');
    
    setInterval(() => {
        // Simulate random object count between 2 and 8
        const count = 2 + Math.floor(Math.random() * 7);
        objectCountElement.textContent = count;
    }, 1500);
    
    // Fullscreen functionality
    const fullscreenBtn = document.getElementById('fullscreen-btn');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    fullscreenBtn.addEventListener('click', function() {
        if (!document.fullscreenElement) {
            if (videoWrapper.requestFullscreen) {
                videoWrapper.requestFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i> Exit Fullscreen';
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i> Fullscreen';
        }
    });
    
    // Snapshot functionality
    const snapshotBtn = document.getElementById('snapshot-btn');
    const snapshotModal = document.getElementById('snapshot-modal');
    const snapshotImage = document.getElementById('snapshot-image');
    const closeModalBtn = document.querySelector('.close-modal');
    const closeModalBtn2 = document.getElementById('close-modal-btn');
    const downloadBtn = document.getElementById('download-btn');
    
    snapshotBtn.addEventListener('click', function() {
        // Get the current video feed image
        const videoFeed = document.querySelector('.video-feed');
        
        // Create a canvas to capture the image
        const canvas = document.createElement('canvas');
        canvas.width = videoFeed.videoWidth || videoFeed.naturalWidth || 640;
        canvas.height = videoFeed.videoHeight || videoFeed.naturalHeight || 480;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(videoFeed, 0, 0, canvas.width, canvas.height);
        
        // Convert to data URL and display in modal
        const dataUrl = canvas.toDataURL('image/jpeg');
        snapshotImage.src = dataUrl;
        
        // Show modal
        snapshotModal.classList.add('active');
        
        // Set up download
        downloadBtn.onclick = function() {
            const link = document.createElement('a');
            link.download = `object-detection-${new Date().getTime()}.jpg`;
            link.href = dataUrl;
            link.click();
        };
    });
    
    // Close modal functionality
    function closeModal() {
        snapshotModal.classList.remove('active');
    }
    
    closeModalBtn.addEventListener('click', closeModal);
    closeModalBtn2.addEventListener('click', closeModal);
    
    // Close modal when clicking outside
    snapshotModal.addEventListener('click', function(e) {
        if (e.target === snapshotModal) {
            closeModal();
        }
    });
});