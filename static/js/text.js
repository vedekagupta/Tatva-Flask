// texts.js

// Data for each category (sample data, you can expand)
const textsData = {
  vedas: [
    {
      id: 1,
      name: "Rigveda",
      description: "The oldest of the Vedas, collection of hymns.",
      period: "c. 1500 BCE",
      details: "The Rigveda is one of the oldest sacred texts of India composed in Vedic Sanskrit..."
    },
    {
      id: 2,
      name: "Yajurveda",
      description: "Veda of rituals and sacrificial formulas.",
      period: "c. 1200 BCE",
      details: "The Yajurveda contains prose mantras for rituals."
    }
  ],
  upanishads: [
    {
      id: 1,
      name: "Isha Upanishad",
      description: "Focuses on the unity of life and renunciation.",
      period: "c. 800 BCE",
      details: "Discusses the concept of oneness and spiritual knowledge."
    }
  ],
  puranas: [
    {
      id: 1,
      name: "Bhagavata Purana",
      description: "Focuses on devotion to Vishnu and Krishna.",
      period: "c. 9th–10th century CE",
      details: "Contains stories of Lord Krishna and philosophical teachings."
    }
  ],
  vedangas: [
    {
      id: 1,
      name: "Shiksha",
      description: "Study of phonetics and pronunciation.",
      period: "Ancient",
      details: "Shiksha deals with the proper pronunciation of Vedic texts."
    }
  ],
  upavedas: [
    {
      id: 1,
      name: "Ayurveda",
      description: "Ancient Indian system of medicine.",
      period: "Ancient",
      details: "Ayurveda focuses on health, wellness and longevity."
    }
  ],
  itihasa: [
    {
      id: 1,
      name: "Mahabharata",
      description: "Epic narrative of the Kurukshetra War.",
      period: "c. 400 BCE – 400 CE",
      details: "One of the longest epics describing the battle and moral dilemmas."
    }
  ]
};

// Function to load text content dynamically in container
function loadTexts(category) {
  const container = document.querySelector('.texts-container');
  container.innerHTML = ''; // clear previous

  const items = textsData[category];
  if (!items || items.length === 0) {
    container.innerHTML = `<p>No data found for category "${category}"</p>`;
    return;
  }

  items.forEach(item => {
    const card = document.createElement('div');
    card.className = 'text-card';
    card.innerHTML = `
      <h3>${item.name}</h3>
      <p><em>${item.description}</em></p>
      <p><strong>Period:</strong> ${item.period}</p>
      <details>
        <summary>Read More</summary>
        <p>${item.details}</p>
      </details>
    `;
    container.appendChild(card);
  });
}

// Setup category button click handlers
document.addEventListener('DOMContentLoaded', () => {
  const buttons = document.querySelectorAll('.category-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all buttons
      buttons.forEach(b => b.classList.remove('active'));
      // Add active to clicked
      btn.classList.add('active');
      // Load content for selected category
      loadTexts(btn.dataset.category);
    });
  });

  // Load default active category content on page load
  const activeBtn = document.querySelector('.category-btn.active');
  if (activeBtn) loadTexts(activeBtn.dataset.category);
});
