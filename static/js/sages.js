// sages.js - Handles Sages functionality with search and filtering

document.addEventListener('DOMContentLoaded', function() {
    // Initialize search and filters when sages tab is active
    const sagesTab = document.querySelector('[data-tab="sages"]');
    if (sagesTab) {
        sagesTab.addEventListener('click', initSageSearch);
    }
    
    // If the sages tab is active on page load, initialize
    if (document.getElementById('sages') && document.getElementById('sages').classList.contains('active')) {
        initSageSearch();
    }
});

// Initialize sage search and filtering
function initSageSearch() {
    loadSages();
    setupSearchAndFilters();
}

// Load all sages initially
function loadSages() {
    const gallery = document.querySelector('.sage-gallery');
    
    if (!gallery) return; // Safety check
    
    // Show loading state
    gallery.innerHTML = '<div class="loading">Loading sages...</div>';
    
    // Fetch sages from API
    fetch('/api/sages')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(sages => {
            if (sages.length === 0) {
                gallery.innerHTML = '<div class="no-results">No sages found.</div>';
                return;
            }
            
            displaySages(sages);
        })
        .catch(error => {
            console.error('Error fetching sages:', error);
            gallery.innerHTML = `<div class="error">Failed to load sages. Please try again later.</div>`;
        });
}

// Setup search and filter event handlers
function setupSearchAndFilters() {
    const searchInput = document.getElementById('sage-search');
    const contributionFilter = document.getElementById('filter-contribution');
    const eraFilter = document.getElementById('filter-era');
    
    if (!searchInput || !contributionFilter || !eraFilter) return; // safety check
    
    // Clear existing event listeners (if any)
    searchInput.removeEventListener('input', performSearch);
    contributionFilter.removeEventListener('change', performSearch);
    eraFilter.removeEventListener('change', performSearch);
    
    // Add event listeners
    searchInput.addEventListener('input', performSearch);
    contributionFilter.addEventListener('change', performSearch);
    eraFilter.addEventListener('change', performSearch);
    
    // Setup modal close handlers
    const sageModal = document.getElementById('sage-modal');
    if (sageModal) {
        const closeBtn = sageModal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', closeSageModal);
        }
        
        sageModal.addEventListener('click', (e) => {
            if (e.target === sageModal) closeSageModal();
        });
    }
}

// Perform search with current filters
function performSearch() {
    const searchTerm = document.getElementById('sage-search').value.trim();
    const contribution = document.getElementById('filter-contribution').value;
    const era = document.getElementById('filter-era').value;
    
    // Construct API URL with filters
    let apiUrl = '/api/sages?';
    const params = [];
    
    if (searchTerm) {
        params.push(`search=${encodeURIComponent(searchTerm)}`);
    }
    
    if (contribution) {
        params.push(`contribution=${encodeURIComponent(contribution)}`);
    }
    
    if (era) {
        params.push(`era=${encodeURIComponent(era)}`);
    }
    
    apiUrl += params.join('&');
    
    // Show loading state
    const gallery = document.querySelector('.sage-gallery');
    gallery.innerHTML = '<div class="loading">Searching...</div>';
    
    // Fetch filtered sages
    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(sages => {
            displaySages(sages);
        })
        .catch(error => {
            console.error('Error searching sages:', error);
            gallery.innerHTML = `<div class="error">Search failed. Please try again later.</div>`;
        });
}

// Display sages in the gallery
function displaySages(sages) {
    const gallery = document.querySelector('.sage-gallery');
    
    if (!gallery) return; // Safety check
    
    if (sages.length === 0) {
        gallery.innerHTML = '<p class="no-results">No sages match your search criteria.</p>';
        return;
    }
    
    gallery.innerHTML = '';
    
    sages.forEach(sage => {
        const sageCard = createSageCard(sage);
        gallery.appendChild(sageCard);
    });
}

// Create sage card element
function createSageCard(sage) {
    const sageCard = document.createElement('div');
    sageCard.className = 'sage-card';
    sageCard.dataset.id = sage.id;

    sageCard.innerHTML = `
        <div class="sage-image" style="background-image: url('${sage.image_path}')"></div>
        <div class="sage-info">
            <h3>${sage.name}</h3>
            <p class="sage-era">${sage.period}</p>
            <p class="sage-contribution">${sage.contribution}</p>
        </div>
    `;

    sageCard.addEventListener('click', () => showSageDetail(sage.id));
    return sageCard;
}

// Show sage detail modal
function showSageDetail(sageId) {
    // Fetch specific sage details
    fetch(`/api/sages/${sageId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(sage => {
            displaySageModal(sage);
        })
        .catch(error => {
            console.error('Error fetching sage details:', error);
            alert('Failed to load sage details. Please try again later.');
        });
}

// Display sage detail in modal
function displaySageModal(sage) {
    const modal = document.getElementById('sage-modal');
    const content = modal.querySelector('.sage-detail');
    
    if (!content) return; // Safety check
    
    // Format works list
    let worksList = '<ul><li>No known works</li></ul>';
    if (sage.works && sage.works.length > 0) {
        worksList = `<ul>${sage.works.map(work => 
            `<li>${work.work_title}${work.description ? ` - ${work.description}` : ''}</li>`
        ).join('')}</ul>`;
    }

    content.innerHTML = `
        <div class="sage-detail-header">
            <div class="sage-detail-image" style="background-image: url('${sage.image_path}')"></div>
            <div class="sage-detail-info">
                <h3>${sage.name}</h3>
                <p>${sage.period}</p>
                <p><strong>Era:</strong> ${sage.era}</p>
                <p><strong>Main Contributions:</strong> ${sage.contribution}</p>
            </div>
        </div>
        <div class="sage-detail-content">${sage.biography}</div>
        <div class="sage-works">
            <h4>Notable Works</h4>
            ${worksList}
        </div>
    `;

    modal.classList.add('active');
}

// Close sage modal
function closeSageModal() {
    const modal = document.getElementById('sage-modal');
    if (modal) {
        modal.classList.remove('active');
    }
}