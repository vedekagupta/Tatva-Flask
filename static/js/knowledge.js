document.addEventListener('DOMContentLoaded', function() {
    initTabs();
    initTextCategories();
    initScrollToTop();
    initModals();
    initKnowledgeMap();
    initSageSearch();
});

// Tab Navigation
function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.tab-btn').forEach(tab => tab.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.remove('active'));

            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            if (tabId === 'ancient-texts') {
                // Already initialized
            } else if (tabId === 'sages') {
                initSageSearch();
            } else if (tabId === 'timeline') {
                initTimeline();
            } else if (tabId === 'interactive') {
                initWordCloud();
            }
        });
    });
}

// Ancient Texts Categories
function initTextCategories() {
    const categoryBtns = document.querySelectorAll('.category-btn');

    categoryBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.category-btn').forEach(cat => cat.classList.remove('active'));
            this.classList.add('active');

            const category = this.getAttribute('data-category');
            filterTexts(category);
        });
    });

    filterTexts('vedas'); // default
}

// Filter texts by category
function filterTexts(category) {
    const textsContainer = document.querySelector('.texts-container');
    textsContainer.innerHTML = '';

    const texts = getTextsByCategory(category);

    texts.forEach(text => {
        const card = createTextCard(text);
        textsContainer.appendChild(card);
    });
}

// Create text card element
function createTextCard(text) {
    const card = document.createElement('div');
    card.className = 'text-card';

    card.innerHTML = `
        <div class="text-card-img" style="background-image: url('${text.image}')"></div>
        <div class="text-card-content">
            <h3>${text.title}</h3>
            <p>${text.description}</p>
            <button class="btn text-detail-btn" data-id="${text.id}">Learn More</button>
        </div>
    `;

    card.querySelector('.text-detail-btn').addEventListener('click', () => showTextDetail(text));
    return card;
}

// Show text detail modal
function showTextDetail(text) {
    const modal = document.createElement('div');
    modal.className = 'modal';

    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="text-detail">
                <h2>${text.title}</h2>
                <p class="text-period">${text.period}</p>
                <div class="text-detail-content">${text.fullDescription}</div>
                <div class="text-significance">
                    <h3>Significance</h3>
                    <p>${text.significance}</p>
                </div>
                ${text.keyVerses ? `
                <div class="text-verses">
                    <h3>Key Verses</h3>
                    <div class="verse-container">
                        ${text.keyVerses.map(verse => `
                            <div class="verse">
                                <p class="sanskrit">${verse.sanskrit}</p>
                                <p class="translation">${verse.translation}</p>
                            </div>
                        `).join('')}
                    </div>
                </div>` : ''}
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    setTimeout(() => modal.style.display = 'block', 10);

    modal.querySelector('.close-modal').addEventListener('click', () => closeModal(modal));
    modal.addEventListener('click', e => {
        if (e.target === modal) closeModal(modal);
    });
}

function closeModal(modal) {
    modal.style.display = 'none';
    setTimeout(() => modal.remove(), 300);
}

// Knowledge Map Hotspots
function initKnowledgeMap() {
    const hotspots = [
        { x: 15, y: 30, title: 'Rigveda', content: 'The oldest and most significant of the Vedas, containing hymns dedicated to various deities.' },
        { x: 30, y: 20, title: 'Samaveda', content: 'Contains melodies and chants for rituals, largely derived from the Rigveda.' },
        { x: 45, y: 25, title: 'Yajurveda', content: 'Consists of prose mantras and formulas used in sacrificial ceremonies.' },
        { x: 60, y: 20, title: 'Atharvaveda', content: 'Contains spells, charms, and speculative hymns for various aspects of everyday life.' },
        { x: 75, y: 30, title: 'Upanishads', content: 'Philosophical texts discussing metaphysics, the nature of reality, consciousness, and liberation.' },
        { x: 40, y: 70, title: 'Vedangas', content: 'Six auxiliary disciplines that aid in the understanding and application of Vedic knowledge.' }
    ];

    const mapContainer = document.querySelector('.map-hotspots');
    const mapInfo = document.querySelector('.map-detail');

    hotspots.forEach(spot => {
        const hotspot = document.createElement('div');
        hotspot.className = 'map-hotspot';
        hotspot.style.left = `${spot.x}%`;
        hotspot.style.top = `${spot.y}%`;

        hotspot.addEventListener('click', () => {
            document.querySelectorAll('.map-hotspot').forEach(hs => hs.classList.remove('active'));
            hotspot.classList.add('active');

            mapInfo.innerHTML = `<h4>${spot.title}</h4><p>${spot.content}</p>`;
        });

        mapContainer.appendChild(hotspot);
    });
}

// Sage Search and Filter
let sagesToDisplay = [];

function initSageSearch() {
    const searchInput = document.getElementById('sage-search');
    const contributionFilter = document.getElementById('filter-contribution');
    const eraFilter = document.getElementById('filter-era');


    const sageModal = document.getElementById('sage-modal');
const closeBtn = sageModal.querySelector('.close-modal');

if (closeBtn && !closeBtn.classList.contains('listener-added')) {
    closeBtn.addEventListener('click', closeSageModal);
    closeBtn.classList.add('listener-added');
}

sageModal.addEventListener('click', (e) => {
    if (e.target === sageModal) closeSageModal();
});

    if (!searchInput || !contributionFilter || !eraFilter) return; // safety check

    searchInput.addEventListener('input', filterSages);
    contributionFilter.addEventListener('change', filterSages);
    eraFilter.addEventListener('change', filterSages);

    loadSages();
}

function loadSages() {
    sagesToDisplay = [...sages]; // assuming global 'sages' array exists
    displaySages(sagesToDisplay);
}

function filterSages() {
    const searchTerm = document.getElementById('sage-search').value.toLowerCase();
    const contributionFilter = document.getElementById('filter-contribution').value;
    const eraFilter = document.getElementById('filter-era').value;

    const filtered = sagesToDisplay.filter(sage => {
        const matchesSearch = sage.name.toLowerCase().includes(searchTerm) ||
                              sage.contribution.toLowerCase().includes(searchTerm);
        const matchesContribution = !contributionFilter || sage.contribution.includes(contributionFilter);
        const matchesEra = !eraFilter || sage.era === eraFilter;
        return matchesSearch && matchesContribution && matchesEra;
    });

    displaySages(filtered);
}

function displaySages(sagesList) {
    const gallery = document.querySelector('.sage-gallery');
    gallery.innerHTML = '';

    if (!sagesList.length) {
        gallery.innerHTML = '<p class="no-results">No sages match your search criteria.</p>';
        return;
    }

    sagesList.forEach(sage => {
        const sageCard = document.createElement('div');
        sageCard.className = 'sage-card';
        sageCard.dataset.id = sage.id;

        sageCard.innerHTML = `
            <div class="sage-image" style="background-image: url('${sage.image}')"></div>
            <div class="sage-info">
                <h3>${sage.name}</h3>
                <p class="sage-era">${sage.period}</p>
                <p class="sage-contribution">${sage.contribution}</p>
            </div>
        `;

        sageCard.addEventListener('click', () => showSageDetail(sage));
        gallery.appendChild(sageCard);
    });
}

function showSageDetail(sage) {
    const modal = document.getElementById('sage-modal');
    const content = modal.querySelector('.sage-detail');

    content.innerHTML = `
        <div class="sage-detail-header">
            <div class="sage-detail-image" style="background-image: url('${sage.image}')"></div>
            <div class="sage-detail-info">
                <h3>${sage.name}</h3>
                <p>${sage.period}</p>
                <p><strong>Main Contributions:</strong> ${sage.contribution}</p>
            </div>
        </div>
        <div class="sage-detail-content">${sage.biography}</div>
        <div class="sage-works">
            <h4>Notable Works</h4>
            <ul>${sage.works.map(work => `<li>${work}</li>`).join('')}</ul>
        </div>
    `;

    modal.classList.add('active');

    // Close modal handlers
    modal.querySelector('.close-modal').addEventListener('click', () => closeSageModal());
    modal.addEventListener('click', e => {
        if (e.target === modal) closeSageModal();
    });
}

function closeSageModal() {
    const modal = document.getElementById('sage-modal');
    modal.classList.remove('active');
}




async function fetchSages() {
    const search = document.getElementById('search').value;
    const era = document.getElementById('era').value;
    const region = document.getElementById('region').value;

    let url = `/api/sages?search=${encodeURIComponent(search)}&era=${encodeURIComponent(era)}&region=${encodeURIComponent(region)}`;

    const response = await fetch(url);
    const sages = await response.json();

    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = "";

    if (sages.length === 0) {
        resultsDiv.innerHTML = "<p>No sages found.</p>";
        return;
    }

    sages.forEach(sage => {
        const div = document.createElement('div');
        div.innerHTML = `<h3>${sage.name}</h3><p>${sage.description}</p><p><b>Era:</b> ${sage.era} | <b>Region:</b> ${sage.region}</p>`;
        resultsDiv.appendChild(div);
    });
}


// Timeline Initialization
function initTimeline() {
    const timelineContainer = document.querySelector('.timeline');
    const timelineDetail = document.querySelector('.timeline-detail');
    timelineContainer.innerHTML = '';

    timelinePeriods.forEach(period => {
        const periodElement = document.createElement('div');
        periodElement.className = 'timeline-period';
        periodElement.textContent = period.name;

        periodElement.addEventListener('click', () => {
            timelineContainer.querySelectorAll('.timeline-period').forEach(el => el.classList.remove('active'));
            periodElement.classList.add('active');

            timelineDetail.innerHTML = `
                <h3>${period.name}</h3>
                <p>${period.description}</p>
                <ul>${period.keyEvents.map(event => `<li>${event}</li>`).join('')}</ul>
            `;
        });

        timelineContainer.appendChild(periodElement);
    });

    // Optionally select the first period by default
    if (timelinePeriods.length) {
        timelineContainer.firstChild.click();
    }
}

// Scroll to Top Button
function initScrollToTop() {
    const btn = document.getElementById('scrollToTopBtn');
    if (!btn) return;

    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.style.display = 'block';
        } else {
            btn.style.display = 'none';
        }
    });
}

// Placeholder for interactive tab initialization (e.g., word cloud)
function initWordCloud() {
    // TODO: Implement your word cloud or other interactive feature here
    // For now, just a placeholder
    const interactivePane = document.getElementById('interactive');
    if (!interactivePane) return;
    interactivePane.innerHTML = '<p>Interactive content coming soon...</p>';
}

// Helper: Get texts by category
function getTextsByCategory(category) {
    // Assuming global variable 'texts' is available, replace with your actual data source
    return texts.filter(text => text.category.toLowerCase() === category.toLowerCase());
}
