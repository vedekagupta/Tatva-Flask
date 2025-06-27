// quiz.js - Handles Quiz functionality

document.addEventListener('DOMContentLoaded', function() {
    // Initialize quiz when interactive tab is active
    const interactiveTab = document.querySelector('[data-tab="interactive"]');
    if (interactiveTab) {
        interactiveTab.addEventListener('click', initQuiz);
    }
    
    // If the interactive tab is active on page load, initialize
    if (document.getElementById('interactive') && document.getElementById('interactive').classList.contains('active')) {
        initQuiz();
    }
});

// Quiz state
let currentQuiz = {
    questions: [],
    currentQuestionIndex: 0,
    score: 0,
    answers: []
};

// Initialize quiz
function initQuiz() {
    const startButton = document.getElementById('start-quiz');
    if (!startButton) return; // Safety check
    
    // Clear existing event listeners
    startButton.removeEventListener('click', startQuiz);
    
    // Add event listener
    startButton.addEventListener('click', startQuiz);
}

// Start quiz
function startQuiz() {
    // Reset quiz state
    currentQuiz = {
        questions: [],
        currentQuestionIndex: 0,
        score: 0,
        answers: []
    };
    
    const quizIntro = document.querySelector('.quiz-intro');
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    
    if (!quizIntro || !quizQuestions || !quizResults) return; // Safety check
    
    // Show loading state
    quizQuestions.innerHTML = '<div class="loading">Loading quiz questions...</div>';
    quizIntro.classList.add('hidden');
    quizQuestions.classList.remove('hidden');
    quizResults.classList.add('hidden');
    
    // Fetch quiz questions from API
    fetch('/api/quiz?limit=5')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(questions => {
            if (questions.length === 0) {
                quizQuestions.innerHTML = '<div class="no-results">No quiz questions available.</div>';
                return;
            }
            
            currentQuiz.questions = questions;
            showQuestion(0);
        })
        .catch(error => {
            console.error('Error fetching quiz questions:', error);
            quizQuestions.innerHTML = `<div class="error">Failed to load quiz. Please try again later.</div>`;
        });
}

// Show question at the given index
function showQuestion(index) {
    const quizQuestions = document.querySelector('.quiz-questions');
    if (!quizQuestions) return; // Safety check
    
    const question = currentQuiz.questions[index];
    if (!question) {
        showQuizResults();
        return;
    }
    
    // Update current question index
    currentQuiz.currentQuestionIndex = index;
    
    // Shuffle answers
    const answers = [...question.answers];
    shuffleArray(answers);
    
    quizQuestions.innerHTML = `
        <div class="quiz-progress">Question ${index + 1} of ${currentQuiz.questions.length}</div>
        <div class="quiz-question">
            <h4>${question.question}</h4>
            <div class="quiz-answers">
                ${answers.map((answer, i) => `
                    <div class="quiz-answer">
                        <input type="radio" name="answer" id="answer-${i}" value="${answer.id}">
                        <label for="answer-${i}">${answer.answer_text}</label>
                    </div>
                `).join('')}
            </div>
            <div class="quiz-feedback"></div>
            <div class="quiz-buttons">
                <button class="btn submit-answer">Submit Answer</button>
            </div>
        </div>
    `;
    
    // Add submit button event listener
    const submitButton = quizQuestions.querySelector('.submit-answer');
    submitButton.addEventListener('click', () => submitAnswer(question));
}

// Submit answer for current question
function submitAnswer(question) {
    const selectedInput = document.querySelector('input[name="answer"]:checked');
    if (!selectedInput) {
        alert('Please select an answer');
        return;
    }
    
    const answerId = parseInt(selectedInput.value);
    const answerObj = question.answers.find(a => a.id === answerId);
    
    if (!answerObj) {
        console.error('Answer not found');
        return;
    }
    
    // Store answer
    currentQuiz.answers.push({
        questionId: question.id,
        answerId: answerId,
        isCorrect: answerObj.is_correct
    });
    
    // Update score
    if (answerObj.is_correct) {
        currentQuiz.score++;
    }
    
    // Show feedback
    const feedbackDiv = document.querySelector('.quiz-feedback');
    const submitButton = document.querySelector('.submit-answer');
    const nextButton = document.createElement('button');
    nextButton.className = 'btn next-question';
    nextButton.textContent = currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1 
        ? 'Show Results' 
        : 'Next Question';
    
    if (answerObj.is_correct) {
        feedbackDiv.innerHTML = `
            <div class="correct-answer">
                <span class="icon">✓</span> Correct!
                ${answerObj.explanation ? `<p>${answerObj.explanation}</p>` : ''}
            </div>
        `;
    } else {
        // Find correct answer
        const correctAnswer = question.answers.find(a => a.is_correct);
        feedbackDiv.innerHTML = `
            <div class="incorrect-answer">
                <span class="icon">✗</span> Incorrect.
                <p>The correct answer is: ${correctAnswer.answer_text}</p>
                ${correctAnswer.explanation ? `<p>${correctAnswer.explanation}</p>` : ''}
            </div>
        `;
    }
    
    // Disable radio buttons
    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.disabled = true;
    });
    
    // Replace submit button with next button
    submitButton.parentNode.replaceChild(nextButton, submitButton);
    
    // Add next button event listener
    nextButton.addEventListener('click', () => {
        if (currentQuiz.currentQuestionIndex === currentQuiz.questions.length - 1) {
            showQuizResults();
        } else {
            showQuestion(currentQuiz.currentQuestionIndex + 1);
        }
    });
}

// Show quiz results
function showQuizResults() {
    const quizQuestions = document.querySelector('.quiz-questions');
    const quizResults = document.querySelector('.quiz-results');
    
    if (!quizQuestions || !quizResults) return; // Safety check
    
    quizQuestions.classList.add('hidden');
    quizResults.classList.remove('hidden');
    
    const score = currentQuiz.score;
    const total = currentQuiz.questions.length;
    const percentage = Math.round((score / total) * 100);
    
    let resultMessage = '';
    if (percentage >= 90) {
        resultMessage = 'Outstanding! You have mastered this knowledge.';
    } else if (percentage >= 70) {
        resultMessage = 'Great job! You have good understanding.';
    } else if (percentage >= 50) {
        resultMessage = 'Good effort! Keep learning to improve.';
    } else {
        resultMessage = 'Keep practicing! There\'s more to learn.';
    }
    
    quizResults.innerHTML = `
        <h3>Quiz Results</h3>
        <div class="results-score">
            <div class="score-circle">
                <span class="score-number">${score}/${total}</span>
                <span class="score-percent">${percentage}%</span>
            </div>
            <p class="result-message">${resultMessage}</p>
        </div>
        <div class="results-summary">
            <h4>Question Summary</h4>
            <div class="questions-summary">
                ${currentQuiz.questions.map((question, index) => {
                    const answer = currentQuiz.answers[index];
                    return `
                        <div class="question-result ${answer.isCorrect ? 'correct' : 'incorrect'}">
                            <div class="question-number">${index + 1}</div>
                            <div class="question-text">${question.question}</div>
                            <div class="answer-result">
                                ${answer.isCorrect ? 
                                    '<span class="icon">✓</span> Correct' : 
                                    '<span class="icon">✗</span> Incorrect'}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
        <button class="btn try-again">Try Another Quiz</button>
    `;
    
    // Add try again button event listener
    const tryAgainButton = quizResults.querySelector('.try-again');
    tryAgainButton.addEventListener('click', () => {
        const quizIntro = document.querySelector('.quiz-intro');
        quizResults.classList.add('hidden');
        quizIntro.classList.remove('hidden');
    });
}

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initQuiz };
}