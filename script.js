// Event data
const eventData = {
    haldi: {
        title: "Haldi Ceremony",
        details: [
            { label: "Date", value: "25th March" },
            { label: "Time", value: "Morning" },
            { label: "Venue", value: "Pilani" },
            { label: "Dress Code", value: "Yellow" }
        ],
        images: [
            "1.jpeg",
            "2.jpeg",
            "3.jpeg",
            "4.jpeg",
            "5-1.jpeg"
        ]
    },
    mehandi: {
        title: "Mehandi Ceremony",
        details: [
            { label: "Date", value: "25th March" },
            { label: "Time", value: "Afternoon" },
            { label: "Venue", value: "Pilani" },
            { label: "Dress Code", value: "Green/Pink" }
        ],
        images: [
            "6.jpeg",
            "7.jpeg",
            "8.jpeg",
            "9.jpeg",
            "10.jpeg",
            "10-1.jpeg"
        ]
    },
    sangeet: {
        title: "Sangeet Night",
        details: [
            { label: "Date", value: "25th March" },
            { label: "Time", value: "Evening" },
            { label: "Venue", value: "Pilani" },
            { label: "Dress Code", value: "Traditional/Party Wear" }
        ],
        images: [
            "11.jpeg",
            "12.jpeg",
            "13.jpeg",
            "14.jpeg",
            "15.jpeg",
            "15-1.jpeg"
        ]
    },
    phere: {
        title: "Phere Ceremony",
        details: [
            { label: "Date", value: "26th Mach" },
            { label: "Time", value: "Evening" },
            { label: "Venue", value: "Pilani" },
            { label: "Dress Code", value: "Traditional Red/Gold" }
        ],
        images: [
            "16.jpeg",
            "17.jpeg",
            "18.jpeg",
            "19.jpeg",
            "20.jpeg",
            "20-1.jpeg"
        ]
    }
};

// DOM Elements
const homePage = document.getElementById('homePage');
const eventOverlay = document.getElementById('eventOverlay');
const closeBtn = document.getElementById('closeBtn');
const eventTitle = document.getElementById('eventTitle');
const eventDetails = document.getElementById('eventDetails');
const eventImages = document.getElementById('eventImages');
const eventCorners = document.querySelectorAll('.event-corner');

// Open event overlay
function openEvent(eventName) {
    const event = eventData[eventName];
    if (!event) return;

    // Set title
    eventTitle.textContent = event.title;

    // Set details
    eventDetails.innerHTML = '';
    event.details.forEach(detail => {
        const detailItem = document.createElement('div');
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
            <div class="detail-label">${detail.label}</div>
            <div class="detail-value">${detail.value}</div>
        `;
        eventDetails.appendChild(detailItem);
    });

    // Set scattered images with strategic positions to avoid center text box and overlaps
    eventImages.innerHTML = '';
    
    // Define zones to distribute images: corners and edges, avoiding center
    const zones = [
        // Top-left corner
        { top: () => Math.random() * 15 + 5, left: () => Math.random() * 8 + 2, right: null, bottom: null },
        // Top-right corner
        { top: () => Math.random() * 15 + 5, left: null, right: () => Math.random() * 8 + 2, bottom: null },
        // Bottom-left corner
        { top: null, left: () => Math.random() * 8 + 2, right: null, bottom: () => Math.random() * 15 + 5 },
        // Bottom-right corner
        { top: null, left: null, right: () => Math.random() * 8 + 2, bottom: () => Math.random() * 15 + 5 },
        // Top edge left
        { top: () => Math.random() * 12 + 3, left: () => Math.random() * 10 + 12, right: null, bottom: null },
        // Top edge right
        { top: () => Math.random() * 12 + 3, left: null, right: () => Math.random() * 10 + 12, bottom: null },
        // Bottom edge left
        { top: null, left: () => Math.random() * 10 + 12, right: null, bottom: () => Math.random() * 12 + 3 },
        // Bottom edge right
        { top: null, left: null, right: () => Math.random() * 10 + 12, bottom: () => Math.random() * 12 + 3 },
        // Far left edge (top area)
        { top: () => Math.random() * 20 + 5, left: () => Math.random() * 5 + 1, right: null, bottom: null },
        // Far left edge (bottom area)
        { top: null, left: () => Math.random() * 5 + 1, right: null, bottom: () => Math.random() * 20 + 5 },
        // Far right edge (top area)
        { top: () => Math.random() * 20 + 5, left: null, right: () => Math.random() * 5 + 1, bottom: null },
        // Far right edge (bottom area)
        { top: null, left: null, right: () => Math.random() * 5 + 1, bottom: () => Math.random() * 20 + 5 },
        // Top center edge
        { top: () => Math.random() * 8 + 2, left: () => Math.random() * 20 + 25, right: null, bottom: null },
        // Bottom center edge
        { top: null, left: () => Math.random() * 20 + 25, right: null, bottom: () => Math.random() * 8 + 2 },
        // Top far center
        { top: () => Math.random() * 10 + 3, left: null, right: () => Math.random() * 20 + 25, bottom: null }
    ];
    
    // Shuffle zones to randomize distribution
    const shuffledZones = zones.sort(() => Math.random() - 0.5);
    
    // Store placed positions to check for overlaps
    const placedPositions = [];
    const minDistance = 15; // Minimum distance in percentage to prevent overlap
    
    // Helper function to check if position is too close to existing images
    function isTooClose(newTop, newLeft, newRight, newBottom) {
        const newX = newLeft !== null ? newLeft : (100 - newRight);
        const newY = newTop !== null ? newTop : (100 - newBottom);
        
        for (const pos of placedPositions) {
            const distance = Math.sqrt(
                Math.pow(newX - pos.x, 2) + Math.pow(newY - pos.y, 2)
            );
            if (distance < minDistance) {
                return true;
            }
        }
        return false;
    }
    
    event.images.forEach((imageSrc, index) => {
        const img = document.createElement('img');
        img.src = imageSrc;
        img.alt = `${event.title} ${index + 1}`;
        img.className = 'scattered-image';
        
        // Try to find a non-overlapping position
        let attempts = 0;
        let positionFound = false;
        let finalTop, finalLeft, finalRight, finalBottom;
        
        while (!positionFound && attempts < 50) {
            // Assign to a zone (cycle through if more images than zones)
            const zone = shuffledZones[index % shuffledZones.length];
            
            if (zone.top) {
                finalTop = zone.top();
                finalBottom = null;
            } else {
                finalBottom = zone.bottom();
                finalTop = null;
            }
            
            if (zone.left) {
                finalLeft = zone.left();
                finalRight = null;
            } else {
                finalRight = zone.right();
                finalLeft = null;
            }
            
            // Check if this position is too close to existing images
            if (!isTooClose(finalTop, finalLeft, finalRight, finalBottom)) {
                positionFound = true;
                placedPositions.push({
                    x: finalLeft !== null ? finalLeft : (100 - finalRight),
                    y: finalTop !== null ? finalTop : (100 - finalBottom)
                });
            } else {
                attempts++;
                // Try a different zone
                const randomZone = shuffledZones[Math.floor(Math.random() * shuffledZones.length)];
                if (randomZone.top) {
                    finalTop = randomZone.top();
                    finalBottom = null;
                } else {
                    finalBottom = randomZone.bottom();
                    finalTop = null;
                }
                if (randomZone.left) {
                    finalLeft = randomZone.left();
                    finalRight = null;
                } else {
                    finalRight = randomZone.right();
                    finalLeft = null;
                }
            }
        }
        
        // Apply the position
        if (finalTop !== null && finalTop !== undefined) {
            img.style.top = `${finalTop}%`;
            img.style.bottom = 'auto';
        } else if (finalBottom !== null && finalBottom !== undefined) {
            img.style.bottom = `${finalBottom}%`;
            img.style.top = 'auto';
        }
        
        if (finalLeft !== null && finalLeft !== undefined) {
            img.style.left = `${finalLeft}%`;
            img.style.right = 'auto';
        } else if (finalRight !== null && finalRight !== undefined) {
            img.style.right = `${finalRight}%`;
            img.style.left = 'auto';
        }
        
        // Sequential delay - each image appears 1 second after the previous one
        const sequentialDelay = index * 2 + 2; // 0s, 1s, 2s, 3s, 4s...
        const randomDuration = 3 + Math.random() * 2; // 3-5 seconds
        img.style.animationDelay = `${sequentialDelay}s`;
        img.style.animationDuration = `${randomDuration}s`;
        
        eventImages.appendChild(img);
    });

    // Show overlay
    eventOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close event overlay
function closeEvent() {
    eventOverlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// Event listeners
eventCorners.forEach(corner => {
    corner.addEventListener('click', () => {
        const eventName = corner.getAttribute('data-event');
        openEvent(eventName);
    });
});

closeBtn.addEventListener('click', closeEvent);

// Close on overlay background click
eventOverlay.addEventListener('click', (e) => {
    if (e.target === eventOverlay || e.target.classList.contains('overlay-background-blur')) {
        closeEvent();
    }
});

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && eventOverlay.classList.contains('active')) {
        closeEvent();
    }
});

