    // ------------------ Destination Slider ------------------
let slideIndex = 0;
const slides = document.querySelector('.slides');
const totalSlides = document.querySelectorAll('.slide').length;
const next = document.querySelector('.next');
const prev = document.querySelector('.prev');

function updateSlider() {
    slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

next?.addEventListener('click', () => {
    slideIndex = (slideIndex + 1) % totalSlides;
    updateSlider();
});

prev?.addEventListener('click', () => {
    slideIndex = (slideIndex - 1 + totalSlides) % totalSlides;
    updateSlider();
});

setInterval(() => {
    slideIndex = (slideIndex + 1) % totalSlides;
    updateSlider();
}, 5000);

// ------------------ Testimonial Slider ------------------
let testimonialIndex = 0;
const testimonialSlides = document.querySelector('.testimonial-slides');
const totalTestimonials = document.querySelectorAll('.testimonial').length;
const dots = document.querySelectorAll('.dot');

function updateTestimonialSlider() {
    testimonialSlides.style.transform = `translateX(-${testimonialIndex * 100}%)`;
}

function updateDots() {
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === testimonialIndex);
    });
}

dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        testimonialIndex = index;
        updateTestimonialSlider();
        updateDots();
    });
});

setInterval(() => {
    testimonialIndex = (testimonialIndex + 1) % totalTestimonials;
    updateTestimonialSlider();
    updateDots();
}, 7000);

// ------------------ Smooth Scroll for Navigation ------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// ------------------ Header Scroll Animation ------------------
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    header.classList.toggle('scrolled', window.scrollY > 50);
});

// ------------------ Reveal Sections on Scroll ------------------
const revealElements = document.querySelectorAll('.section');

function revealSection() {
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        if (elementTop < windowHeight - 100) {
            element.classList.add('revealed');
        }
    });
}

window.addEventListener('scroll', revealSection);
window.addEventListener('load', revealSection);

// ------------------ Temple Story Toggle ------------------
document.querySelectorAll('.read-story-btn').forEach(button => {
    button.addEventListener('click', function () {
        const targetStory = this.getAttribute('data-target');
        const storyElement = document.querySelector(`.temple-story[data-story="${targetStory}"]`);
        if (storyElement.style.display === 'block') {
            storyElement.style.display = 'none';
            this.textContent = 'Read the Legend';
        } else {
            storyElement.style.display = 'block';
            this.textContent = 'Hide the Legend';
        }
    });
});

// ------------------ Interactive Heritage Map ------------------

const map = L.map('heritage-sites-map').setView([22.5937, 78.9629], 5);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '© OpenStreetMap contributors'
}).addTo(map);

// Updated heritageSites with lat/lng
const heritageSites = [
  {
    id: 1,
    name: "Taj Mahal",
    lat: 27.1751,
    lng: 78.0421,
    type: "monument",
    image: "https://via.placeholder.com/300x200",
    description: "Ivory-white marble mausoleum commissioned by Shah Jahan.",
    period: "17th Century",
    dynasty: "Mughal Empire",
    unesco: "World Heritage Site (1983)"
  },
  {
    id: 2,
    name: "Khajuraho Temples",
    lat: 24.8318,
    lng: 79.9199,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "Nagara-style Hindu and Jain temples with intricate carvings.",
    period: "950-1050 CE",
    dynasty: "Chandela Dynasty",
    unesco: "World Heritage Site (1986)"
  },
  {
    id: 3,
    name: "Ajanta Caves",
    lat: 20.5525,
    lng: 75.7033,
    type: "cave",
    image: "https://via.placeholder.com/300x200",
    description: "Buddhist caves with murals and sculptures.",
    period: "2nd BCE - 5th CE",
    dynasty: "Satavahana and Vakataka",
    unesco: "World Heritage Site (1983)"
  },
  {
    id: 4,
    name: "Amber Fort",
    lat: 26.9855,
    lng: 75.8507,
    type: "fort",
    image: "https://via.placeholder.com/300x200",
    description: "Hindu-style fort with hilltop views.",
    period: "16th Century",
    dynasty: "Rajput Kingdom",
    unesco: "Hill Forts of Rajasthan (2013)"
  },
  {
    id: 5,
    name: "Brihadeeswarar Temple",
    lat: 10.7828,
    lng: 79.1319,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "Chola-era temple known for its massive vimana and granite construction.",
    period: "11th Century",
    dynasty: "Chola Dynasty",
    unesco: "Great Living Chola Temples (1987)"
  },
  {
    id: 6,
    name: "Sun Temple, Konark",
    lat: 19.8876,
    lng: 86.0945,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "13th-century chariot-shaped Sun temple with carved stone wheels.",
    period: "13th Century",
    dynasty: "Eastern Ganga Dynasty",
    unesco: "World Heritage Site (1984)"
  },
  {
    id: 7,
    name: "Meenakshi Temple",
    lat: 9.9195,
    lng: 78.1194,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "Dravidian-style temple known for towering gopurams and vibrant carvings.",
    period: "6th Century (rebuilt in 17th Century)",
    dynasty: "Pandya & Nayak",
    unesco: "Nominee"
  },
  {
    id: 8,
    name: "Ellora Caves",
    lat: 20.0268,
    lng: 75.1787,
    type: "cave",
    image: "https://via.placeholder.com/300x200",
    description: "Rock-cut temples and monasteries from Hindu, Buddhist, and Jain traditions.",
    period: "600–1000 CE",
    dynasty: "Rashtrakuta",
    unesco: "World Heritage Site (1983)"
  },
  {
    id: 9,
    name: "Shore Temple, Mahabalipuram",
    lat: 12.6133,
    lng: 80.1946,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "Seaside Pallava temple showcasing early South Indian stone architecture.",
    period: "8th Century",
    dynasty: "Pallava Dynasty",
    unesco: "Group of Monuments at Mahabalipuram (1984)"
  },
  {
    id: 10,
    name: "Virupaksha Temple, Hampi",
    lat: 15.3350,
    lng: 76.4600,
    type: "temple",
    image: "https://via.placeholder.com/300x200",
    description: "Ancient temple part of Hampi's UNESCO heritage site.",
    period: "7th Century (expanded in Vijayanagara period)",
    dynasty: "Vijayanagara Empire",
    unesco: "Group of Monuments at Hampi (1986)"
  },
  {
    id: 11,
    name: "Fatehpur Sikri",
    lat: 27.0937,
    lng: 77.6600,
    type: "monument",
    image: "https://via.placeholder.com/300x200",
    description: "Mughal capital built by Akbar, known for red sandstone architecture.",
    period: "16th Century",
    dynasty: "Mughal Empire",
    unesco: "World Heritage Site (1986)"
  }
];


// Store markers with reference to site ID
const markers = {};

// Add markers to map
heritageSites.forEach(site => {
  const marker = L.marker([site.lat, site.lng]).addTo(map);
  marker.siteType = site.type; // attach type
  marker.siteId = site.id;

  marker.on('click', () => showSiteInfo(site));
  marker.bindPopup(`<strong>${site.name}</strong>`);

  markers[site.id] = marker;
});

function showSiteInfo(site) {
  document.querySelector('.site-info-default').style.display = 'none';
  const contentPanel = document.querySelector('.site-info-content');
  contentPanel.style.display = 'block';
  document.querySelector('.site-title').textContent = site.name;
  document.querySelector('.site-info-content img').src = site.image;
  document.querySelector('.site-description').textContent = site.description;
  document.querySelector('.site-period').textContent = site.period;
  document.querySelector('.site-dynasty').textContent = site.dynasty;
  document.querySelector('.site-unesco').textContent = site.unesco;
}

// Filter Logic
const checkboxes = document.querySelectorAll('.filter-checkbox');
checkboxes.forEach(cb => {
  cb.addEventListener('change', () => {
    const activeTypes = Array.from(checkboxes)
      .filter(c => c.checked)
      .map(c => c.value);

    // Show/hide markers
    heritageSites.forEach(site => {
      const marker = markers[site.id];
      if (activeTypes.includes(site.type)) {
        marker.addTo(map);
      } else {
        map.removeLayer(marker);
      }
    });
  });
});

// Initialize everything on load
window.addEventListener('load', () => {
    createMarkers();
    revealSection();
});






const slidss = document.querySelector('.slides');
    const slide = document.querySelectorAll('.slide');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentIndex = 0;

    function updateSlidePosition() {
        slides.style.transform = `translateX(-${currentIndex * 100}%)`;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex === 0) ? slide.length - 1 : currentIndex - 1;
        updateSlidePosition();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slide.length;
        updateSlidePosition();
    });

    // Optional: Auto-slide every 5 seconds
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slide.length;
        updateSlidePosition();
    }, 5000);
