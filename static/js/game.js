
const gameArea = document.querySelector('.game-area');
const artifactCountDisplay = document.getElementById('artifact-count');
const riddleModal = document.getElementById('riddle-modal');
const riddleTitle = document.getElementById('riddle-title');
const riddleText = document.getElementById('riddle-text');
const riddleOptions = document.getElementById('riddle-options');
const closeRiddleBtn = document.getElementById('close-riddle');
const feedbackModal = document.getElementById('feedback-modal');
const feedbackMessage = document.getElementById('feedback-message');
const feedbackMedal = document.getElementById('feedback-medal');
const celebrationModal = document.getElementById('celebration-modal');
const celebrationMessage = document.getElementById('celebration-message');
const flowerBlast = document.getElementById('flower-blast');
const gameOverScreen = document.getElementById('game-over');
const silverMedal = document.getElementById('silver-medal');
const goldMedal = document.getElementById('gold-medal');
const platinumMedal = document.getElementById('platinum-medal');

let artifactsCollected = 0;

// Positive feedback messages
const feedbackMessages = [
    "Good Job!",
    "Great Work!",
    "Well Done!",
    "Excellent!",
    "Nice Work!",
    "Brilliant!",
    "Fantastic!",
    "Superb!",
    "Awesome!"
];

// Riddles and answers (tied to the 7 timeline milestones) 
const riddles = [
    {
        title: "Riddle of the Vedas",
        text: "What is the name of India's ancient language?",
        options: ["English", "Sanskrit", "French"],
        correct: "Sanskrit"
    },
    {
        title: "Riddle of the Ramayana",
        text: "What is ‘Tatva’ in Sanskrit?",
        options: ["Food", "Dance", "Element or Principle"],
        correct: "Element or Principle"
    },
    {
        title: "Riddle of Ashoka",
        text: "Who wrote the Sanskrit epic 'Mahabharata'?",
        options: ["Vyasa", "Valmiki", "Tulsidas"],
        correct: "Vyasa"
    },
    {
        title: "Riddle of the Gupta",
        text: "Which ancient university was a hub for learning language, logic, and philosophy?",
        options: ["Nalanda", "Oxford", "Amity"],
        correct: "Nalanda"
    },
    {
        title: "Riddle of Milestone 5",
        text: "What is the first age (Yuga)?",
        options: ["Dwapar Yug", "Satya Yug", "Treta Yug"],
        correct: "Satya Yug"
    },
    {
        title: "Riddle of Milestone 6",
        text: "In which Yuga was Lord Rama born, according to mythology?",
        options: ["Treta Yug", "Satya Yug", "Kal Yug"],
        correct: "Treta Yug"
    },
    {
        title: "Who lifted the Govardhan mountain?",
        text: "",
        options: ["Lord Hanuman", "Lord Krishna", "Lord Rama"],
        correct: "Lord Krishna"
    }
];

// Initialize game
function initGame() {
    artifactsCollected = 0;
    artifactCountDisplay.textContent = artifactsCollected;
    gameOverScreen.style.display = 'none';
    gameOverScreen.classList.remove('show');
    riddleModal.style.display = 'none';
    riddleModal.classList.remove('show');
    feedbackModal.style.display = 'none';
    feedbackModal.classList.remove('show');
    celebrationModal.style.display = 'none';
    celebrationModal.classList.remove('show');
    silverMedal.style.display = 'none';
    goldMedal.style.display = 'none';
    platinumMedal.style.display = 'none';

    document.querySelectorAll('.clickable-area').forEach(area => {
        area.classList.remove('found');
        area.addEventListener('click', showRiddle);
    });
}

// Show riddle when clicking an area
function showRiddle(event) {
    const area = event.target;
    if (area.classList.contains('found')) return;

    const riddleIndex = parseInt(area.dataset.riddle);
    const riddle = riddles[riddleIndex];

    riddleTitle.textContent = riddle.title;
    riddleText.textContent = riddle.text;
    riddleOptions.innerHTML = '';


riddle.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.addEventListener('click', () => checkAnswer(option, riddle.correct, area));
        riddleOptions.appendChild(button);
    });

    riddleModal.style.display = 'block';
    riddleModal.classList.add('show');
}

// Show feedback after each correct answer with medal preview
function showFeedback() {
    const randomMessage = feedbackMessages[Math.floor(Math.random() * feedbackMessages.length)];
    feedbackMessage.textContent = randomMessage;

    // Update medal preview based on artifacts collected
    feedbackMedal.className = 'feedback-medal'; // Reset classes
    if (artifactsCollected <= 3) {
        feedbackMedal.classList.add('silver');
    } else if (artifactsCollected <= 5) {
        feedbackMedal.classList.add('gold');
    } else {
        feedbackMedal.classList.add('platinum');
    }

    feedbackModal.style.display = 'block';
    feedbackModal.classList.add('show');
    setTimeout(() => {
        feedbackModal.style.display = 'none';
        feedbackModal.classList.remove('show');
    }, 1000);
}

// Check if the selected answer is correct and handle medals
function checkAnswer(selected, correct, area) {
    if (selected === correct) {
        artifactsCollected++;
        artifactCountDisplay.textContent = artifactsCollected;
        area.classList.add('found');
        riddleModal.style.display = 'none';
        riddleModal.classList.remove('show');

        // Show feedback after every correct answer
        showFeedback();

        // Medal awards and celebrations with flower blast
        if (artifactsCollected === 3) {
            silverMedal.style.display = 'block';
            showCelebration('You’ve earned the Silver Medal!');
        } else if (artifactsCollected === 5) {
            goldMedal.style.display = 'block';
            showCelebration('You’ve earned the Gold Medal!');
        } else if (artifactsCollected === 7) {
            platinumMedal.style.display = 'block';
            endGame();
        }
    } else {
        alert('Incorrect! Try again.');
    }
}

// Show celebration with flower blast
function showCelebration(message) {
    celebrationMessage.textContent = message;
    celebrationModal.style.display = 'block';
    celebrationModal.classList.add('show');
    flowerBlast.innerHTML = ''; // Clear previous animation
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.classList.add('flower-petal');
        petal.style.left = '${Math.random() * 100}%';
        petal.style.animationDelay = '${Math.random() * 2}s';
        petal.style.setProperty('--drift', Math.random() > 0.5 ? 1 : -1);
        flowerBlast.appendChild(petal);
    }
    setTimeout(() => {
        celebrationModal.style.display = 'none';
        celebrationModal.classList.remove('show');
    }, 4000);
}

// Close riddle modal
closeRiddleBtn.addEventListener('click', () => {
    riddleModal.style.display = 'none';
    riddleModal.classList.remove('show');
});

// End game
function endGame() {
    gameOverScreen.style.display = 'block';
    gameOverScreen.classList.add('show');
    const finalFlowerBlast = document.getElementById('final-flower-blast');
    finalFlowerBlast.innerHTML = '';
    for (let i = 0; i < 30; i++) {
        const petal = document.createElement('div');
        petal.classList.add('flower-petal');
        petal.style.left = '${Math.random() * 100}%';
        petal.style.animationDelay = '${Math.random() * 2}s';
        petal.style.setProperty('--drift', Math.random() > 0.5 ? 1 : -1);
        finalFlowerBlast.appendChild(petal);
    }
}



function switchView(view) {
  document.querySelectorAll('.view').forEach(v => v.style.display = 'none');
  document.getElementById(`${view}-view`).style.display = 'block';
}

function signUp() {
  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  if (!username || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  let users = JSON.parse(localStorage.getItem('tatva-users') || '{}');
  if (users[username]) {
    alert("Username already exists");
    return;
  }

  users[username] = {
    email,
    password,
    badges: []
  };

  localStorage.setItem('tatva-users', JSON.stringify(users));
  alert("Signup successful!");
  switchView('login');
}

function login() {
  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;

  let users = JSON.parse(localStorage.getItem('tatva-users') || '{}');
  if (!users[username] || users[username].password !== password) {
    alert("Invalid credentials");
    return;
  }

  localStorage.setItem('tatva-current-user', username);
  document.getElementById('current-username').textContent = username;
  switchView('game');
  showBadges();
}

function logout() {
  localStorage.removeItem('tatva-current-user');
  switchView('login');
}

function showBadges() {
  const username = localStorage.getItem('tatva-current-user');
  const users = JSON.parse(localStorage.getItem('tatva-users') || '{}');
  const user = users[username];

  const badgeList = document.getElementById('badge-list');
  badgeList.innerHTML = "";

  user.badges.forEach(badge => {
    const li = document.createElement('li');
    li.textContent = badge;
    badgeList.appendChild(li);
  });
}

// Example: Call this function from the game when a badge is earned
function earnBadge(badgeName) {
  const username = localStorage.getItem('tatva-current-user');
  let users = JSON.parse(localStorage.getItem('tatva-users') || '{}');
  if (!users[username].badges.includes(badgeName)) {
    users[username].badges.push(badgeName);
    localStorage.setItem('tatva-users', JSON.stringify(users));
    showBadges();
    alert(`You've earned a new badge: ${badgeName}`);
  }
}



// Restart game
function restartGame() {
    initGame();
}

// Start the game
initGame();