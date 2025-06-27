document.addEventListener('DOMContentLoaded', function() {
    initDynastyTabs();
    initDynastyCategories();
    initDynastyScrollToTop();
    initFlashcards();
    initGenealogy();
    initTimeline();
    initContributions();
});

/* 1. Tab Navigation */
function initDynastyTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all tabs
            document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab panes
            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));
            
            // Show selected tab pane
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
            
            // Initialize specific content based on tab
            if (tabId === 'ancient-dynasties') {
                // Already initialized on page load
            } else if (tabId === 'timeline') {
                refreshTimeline();
            } else if (tabId === 'dynasty-card') {
                // Flashcards already initialized
            } else if (tabId === 'genealogy') {
                // Genealogy already initialized
            } else if (tabId === 'contributions') {
                loadAllContributions();
            }
        });
    });
}

/* 2. Dynasty Category Buttons */
function initDynastyCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');
    
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.getAttribute('data-category');
            loadDynastyByCategory(category);
        });
    });
    
    // Load default category
    loadDynastyByCategory('mauryan');
}

/* 3. Load Dynasties by Category */
function loadDynastyByCategory(category) {
    const container = document.querySelector('.texts-container');
    if (!container) return;
    
    // Show loading indicator
    container.innerHTML = '<div class="loading">Loading dynasties...</div>';
    
    // Fetch data from API
    fetch(`/api/dynasties?category=${category}`)
        .then(response => response.json())
        .then(dynasties => {
            container.innerHTML = '';
            
            if (dynasties.length === 0) {
                container.innerHTML = '<p class="no-results">No dynasties found in this category.</p>';
                return;
            }
            
            dynasties.forEach(dynasty => {
                const card = createDynastyCard(dynasty);
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading dynasties:', error);
            container.innerHTML = '<p class="error">Error loading dynasties. Please try again later.</p>';
        });
}

/* 4. Create Dynasty Card */
function createDynastyCard(dynasty) {
    
    const card = document.createElement('div');
    card.className = 'text-card';
    
    card.innerHTML = `
        <div class="text-card-img" style="background-image: url('${dynasty.image}')"></div>
        <div class="text-card-content">
            <h3>${dynasty.name}</h3>
            <p class="dynasty-period">${dynasty.period}</p>
            <p>${dynasty.description}</p>
            <button class="btn text-detail-btn" data-id="${dynasty.id}">Learn More</button>
        </div>
    `;
    
    // Add event listener to the button
    card.querySelector('.text-detail-btn').addEventListener('click', () => {
        showDynastyDetail(dynasty);
    });
    
    return card;
    
}

/* 5. Show Dynasty Detail Modal */
function showDynastyDetail(dynasty) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="dynasty-detail">
                <h2>${dynasty.name}</h2>
                <p class="dynasty-period">${dynasty.period}</p>
                <div class="dynasty-image" style="background-image: url('${dynasty.image}')"></div>
                <div class="dynasty-detail-content">${dynasty.full_description}</div>
                <div class="dynasty-significance">
                    <h3>Historical Significance</h3>
                    <p>${dynasty.significance}</p>
                </div>
                <div class="dynasty-rulers">
                    <h3>Notable Rulers</h3>
                    <div class="rulers-container">Loading rulers...</div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Close modal event handlers
    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Load rulers for this dynasty
    loadRulers(dynasty.id, modal.querySelector('.rulers-container'));
}

/* 6. Load Rulers for a Dynasty */
function loadRulers(dynastyId, container) {
    fetch(`/api/rulers?dynasty_id=${dynastyId}`)
        .then(response => response.json())
        .then(rulers => {
            container.innerHTML = '';
            
            if (rulers.length === 0) {
                container.innerHTML = '<p>No notable rulers found for this dynasty.</p>';
                return;
            }
            
            rulers.forEach(ruler => {
                const rulerCard = document.createElement('div');
                rulerCard.className = 'ruler-card';
                rulerCard.innerHTML = `
                    <h4>${ruler.name}</h4>
                    <p class="ruler-period">${ruler.reign_period}</p>
                    ${ruler.image ? `<div class="ruler-image" style="background-image: url('${ruler.image}')"></div>` : ''}
                    <p>${ruler.biography}</p>
                    <p><strong>Key Achievements:</strong> ${ruler.achievements}</p>
                `;
                container.appendChild(rulerCard);
            });
        })
        .catch(error => {
            console.error('Error loading rulers:', error);
            container.innerHTML = '<p class="error">Error loading rulers. Please try again later.</p>';
        });
}


/* 7. Close Modal */
function closeModal(modal) {
    modal.style.display = 'none';
    setTimeout(() => modal.remove(), 300);
}



/* 8. Scroll to Top Button */
function initDynastyScrollToTop() {
    const btn = document.getElementById('scroll-top');
    if (!btn) return;
    
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    
    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 300);
    });
}

/* 9. Flashcards */
function initFlashcards() {
    const button = document.getElementById('load-dynasty-cards');
    const display = document.getElementById('card-display');

    if (!button || !display) return;

    button.addEventListener('click', () => {
        display.innerHTML = '<div class="loading">Loading flashcard...</div>';
        display.classList.remove('hidden');

        fetch('/api/flashcards?random=true')
            .then(response => response.json())
            .then(card => {
                const title = card?.title || 'Title not available';
                const dynastyName = card?.dynasty_name || 'Dynasty not available';
                const period = card?.period || 'Period not available';
                const description = card?.description || 'Description not available';
                const keyContribution = card?.key_contribution || 'Key contribution not available';

                display.innerHTML = `
                    <h3>${title}</h3>
                    <p class="dynasty-name">${dynastyName}</p>
                    <p class="pronunciation">${period}</p>
                    <div class="meaning">${description}</div>
                    <div class="context"><strong>Key Contribution:</strong> ${keyContribution}</div>
                `;
                display.classList.remove('hidden');
            })
            .catch(error => {
                console.error('Error loading flashcard:', error);
                display.innerHTML = '<p class="error">Error loading flashcard. Please try again.</p>';
            });
    });
}

/* 10. Genealogy */
function initGenealogy() {
    const words = document.querySelectorAll('.word');
    const treeImage = document.getElementById('tree-image');
    
    if (!words.length || !treeImage) return;
    
    words.forEach(word => {
        word.addEventListener('click', () => {
            const dynasty = word.getAttribute('data-dynasty');
            const dynastyName = word.textContent;
            
            // Get dynasty ID first
            fetch(`/api/dynasties?category=${dynasty}`)
                .then(response => response.json())
                .then(dynasties => {
                    if (dynasties.length > 0) {
                        const dynastyId = dynasties[0].id;
                        loadGenealogyData(dynastyId, dynastyName);
                    }
                })
                .catch(error => {
                    console.error('Error loading dynasty for genealogy:', error);
                });
        });
    });
    
    // Helper function to load genealogy data
    function loadGenealogyData(dynastyId, dynastyName) {
        const detail = document.querySelector('.word-detail');
        detail.innerHTML = '<div class="loading">Loading genealogy data for ' + dynastyName + '...</div>';
        
        fetch(`/api/genealogy?dynasty_id=${dynastyId}`)
            .then(response => response.json())
            .then(data => {
                if (data.rulers.length === 0) {
                    detail.innerHTML = `<p>No genealogy data available for ${dynastyName} dynasty.</p>`;
                    return;
                }
                
                // For now, we'll show a simple representation
                // In a real implementation, you might use a library like D3.js to create a tree visualization
                
                let html = `<h3>${dynastyName} Dynasty Lineage</h3>`;
                html += '<div class="genealogy-container">';
                
                // Show rulers
                html += '<div class="genealogy-rulers">';
                data.rulers.forEach(ruler => {
                    html += `
                        <div class="genealogy-ruler">
                            ${ruler.image ? `<div class="ruler-mini-image" style="background-image: url('${ruler.image}')"></div>` : ''}
                            <p class="ruler-name">${ruler.name}</p>
                            <p class="ruler-period">${ruler.reign_period}</p>
                        </div>
                    `;
                });
                html += '</div>';
                
                // Show relationships if available
                if (data.relationships.length > 0) {
                    html += '<div class="genealogy-relationships">';
                    html += '<h4>Relationships:</h4>';
                    html += '<ul>';
                    data.relationships.forEach(rel => {
                        html += `<li>${rel.ruler_name} - ${rel.relationship_type} of ${rel.parent_name || 'unknown'} ${rel.notes ? `(${rel.notes})` : ''}</li>`;
                    });
                    html += '</ul>';
                    html += '</div>';
                }
                
                html += '</div>';
                detail.innerHTML = html;
            })
            .catch(error => {
                console.error('Error loading genealogy:', error);
                detail.innerHTML = '<p class="error">Error loading genealogy data. Please try again later.</p>';
            });
    }
}

/* 11. Timeline */
function initTimeline() {
    const timelineContainer = document.querySelector('.timeline');
    
    if (!timelineContainer) return;
    
    // First load all significant events
    loadTimelinePeriods(timelineContainer);
}

function loadTimelinePeriods(container) {
    container.innerHTML = '<div class="loading">Loading timeline...</div>';
    
    fetch('/api/timeline')
        .then(response => response.json())
        .then(events => {
            container.innerHTML = '';
            
            if (events.length === 0) {
                container.innerHTML = '<p class="no-results">No timeline events found.</p>';
                return;
            }
            
            // Group events by century/period
            const periods = groupEventsByPeriod(events);
            
            // Create period markers
            periods.forEach((events, period) => {
                const periodElement = document.createElement('div');
                periodElement.className = 'timeline-period';
                periodElement.textContent = period;
                periodElement.addEventListener('click', () => showTimelineEvents(period, events));
                container.appendChild(periodElement);
            });
            
            // Activate first period
            if (container.firstChild) {
                container.firstChild.click();
            }
        })
        .catch(error => {
            console.error('Error loading timeline:', error);
            container.innerHTML = '<p class="error">Error loading timeline. Please try again later.</p>';
        });
}

function groupEventsByPeriod(events) {
    const periods = new Map();
    
    events.forEach(event => {
        // Extract century or period from year
        const year = event.year;
        let period;
        
        if (year.includes('BCE')) {
            const century = Math.ceil(parseInt(year.replace(' BCE', '')) / 100);
            period = `${century}th Century BCE`;
        } else if (year.includes('CE')) {
            const century = Math.ceil(parseInt(year.replace(' CE', '')) / 100);
            period = `${century}${getOrdinalSuffix(century)} Century CE`;
        } else {
            // Try to parse as simple year
            const yearNum = parseInt(year);
            if (!isNaN(yearNum)) {
                const century = Math.ceil(yearNum / 100);
                period = `${century}${getOrdinalSuffix(century)} Century CE`;
            } else {
                // Use as is for complex periods
                period = year;
            }
        }
        
        if (!periods.has(period)) {
            periods.set(period, []);
        }
        
        periods.get(period).push(event);
    });
    
    // Sort periods chronologically
    return new Map([...periods.entries()].sort((a, b) => {
        // Extract century numbers for comparison
        const numA = parseInt(a[0].match(/\d+/)?.[0] || '0');
        const numB = parseInt(b[0].match(/\d+/)?.[0] || '0');
        
        // BCE comes before CE
        if (a[0].includes('BCE') && !b[0].includes('BCE')) return -1;
        if (!a[0].includes('BCE') && b[0].includes('BCE')) return 1;
        
        // Both BCE or both CE, compare century numbers
        if (a[0].includes('BCE') && b[0].includes('BCE')) {
            return numB - numA; // Reverse for BCE
        } else {
            return numA - numB;
        }
    }));
}

function getOrdinalSuffix(num) {
    const j = num % 10;
    const k = num % 100;
    if (j === 1 && k !== 11) return "st";
    if (j === 2 && k !== 12) return "nd";
    if (j === 3 && k !== 13) return "rd";
    return "th";
}

function showTimelineEvents(period, events) {
    const timelineContainer = document.querySelector('.timeline');
    const detailContainer = document.querySelector('.timeline-detail');
    
    if (!timelineContainer || !detailContainer) return;
    
    // Highlight selected period
    timelineContainer.querySelectorAll('.timeline-period').forEach(el => {
        el.classList.toggle('active', el.textContent === period);
    });
    
    // Sort events chronologically within the period
    events.sort((a, b) => {
        // Extract year numbers
        const yearA = parseInt(a.year.match(/\d+/)?.[0] || '0');
        const yearB = parseInt(b.year.match(/\d+/)?.[0] || '0');
        
        if (a.year.includes('BCE') && b.year.includes('BCE')) {
            return yearB - yearA; // Reverse for BCE
        } else if (!a.year.includes('BCE') && !b.year.includes('BCE')) {
            return yearA - yearB;
        } else if (a.year.includes('BCE')) {
            return -1; // BCE comes before CE
        } else {
            return 1;
        }
    });
    
    // Build HTML for events
    let html = `<h3>${period}</h3>`;
    html += '<ul class="timeline-events">';
    
    events.forEach(event => {
        html += `
            <li class="timeline-event ${event.event_type}">
                <div class="event-year">${event.year}</div>
                <div class="event-content">
                    <h4>${event.event_name}</h4>
                    <p>${event.description}</p>
                    ${event.dynasty_name ? `<p class="event-dynasty">Dynasty: ${event.dynasty_name}</p>` : ''}
                    ${event.significance ? `<p class="event-significance">Significance: ${event.significance}</p>` : ''}
                </div>
            </li>
        `;
    });
    
    html += '</ul>';
    detailContainer.innerHTML = html;
}

function refreshTimeline() {
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
        loadTimelinePeriods(timelineContainer);
    }
}

/* 12. Cultural Contributions */
function initContributions() {
    // We'll only load contributions when the tab is clicked
    const contributionsTab = document.querySelector('[data-tab="contributions"]');
    if (contributionsTab) {
        contributionsTab.addEventListener('click', loadAllContributions);
    }
}

function loadAllContributions() {
    const container = document.getElementById('contribution-cards');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading cultural contributions...</div>';
    
    fetch('/api/contributions')
        .then(response => response.json())
        .then(contributions => {
            container.innerHTML = '';
            
            if (contributions.length === 0) {
                container.innerHTML = '<p class="no-results">No cultural contributions found.</p>';
                return;
            }
            
            contributions.forEach(contribution => {
                const card = document.createElement('div');
                card.className = 'text-card';
                card.innerHTML = `
                    <div class="text-card-img" style="background-image: url('${contribution.image}')"></div>
                    <div class="text-card-content">
                        <h3>${contribution.title}</h3>
                        <p>${contribution.detail}</p>
                        <button class="btn contribution-detail-btn" data-id="${contribution.id}">Learn More</button>
                    </div>
                `;
                
                card.querySelector('.contribution-detail-btn').addEventListener('click', () => {
                    showContributionDetail(contribution);
                });
                
                container.appendChild(card);
            });
        })
        .catch(error => {
            console.error('Error loading contributions:', error);
            container.innerHTML = '<p class="error">Error loading cultural contributions. Please try again later.</p>';
        });
}

function showContributionDetail(contribution) {
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'modal';
    
    // Get dynasty name (need to fetch it)
    let dynastyName = "Loading...";
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="contribution-detail">
                <h2>${contribution.title}</h2>
                <div class="contribution-image" style="background-image: url('${contribution.image}')"></div>
                <p class="contribution-dynasty">Dynasty: <span id="dynasty-name-placeholder">${dynastyName}</span></p>
                <div class="contribution-category">Category: ${contribution.category}</div>
                <div class="contribution-detail-content">${contribution.detail}</div>
                <div class="contribution-significance">
                    <h3>Cultural Significance</h3>
                    <p>${contribution.significance}</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Show modal with animation
    setTimeout(() => modal.style.display = 'block', 10);
    
    // Close modal event handlers
    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
    });
    
    // Fetch dynasty name
    fetch(`/api/dynasties`)
        .then(response => response.json())
        .then(dynasties => {
            const dynasty = dynasties.find(d => d.id === contribution.dynasty_id);
            if (dynasty) {
                const placeholder = modal.querySelector('#dynasty-name-placeholder');
                if (placeholder) {
                    placeholder.textContent = dynasty.name;
                }
            }
        })
        .catch(error => {
            console.error('Error fetching dynasty name:', error);
        });
}