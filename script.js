
const slides = [...document.querySelectorAll(".slide")];
const counter = document.getElementById("counter");
const progressBar = document.getElementById("progressBar");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const slideDots = document.getElementById("slideDots");
const fullscreenBtn = document.getElementById("fullscreenBtn");

let currentSlide = 0;
let isAnimating = false;

const totalSlides = slides.length;

// Create navigation dots automatically
slides.forEach((slide, index) => {
  const dot = document.createElement("button");
  dot.className = "dot-btn";
  dot.type = "button";
  dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
  dot.title = slide.dataset.title || `Slide ${index + 1}`;

  dot.addEventListener("click", () => {
    showSlide(index);
  });

  slideDots.appendChild(dot);
});

const dots = [...slideDots.querySelectorAll(".dot-btn")];

function showSlide(index) {
  if (isAnimating || index < 0 || index >= totalSlides) return;
  if (index === currentSlide) return;

  isAnimating = true;

  const oldSlide = slides[currentSlide];
  const newSlide = slides[index];
  const direction = index > currentSlide ? 1 : -1;

  oldSlide.classList.remove("active");
  oldSlide.classList.toggle("exit-left", direction > 0);

  newSlide.classList.remove("exit-left");
  newSlide.classList.add("active");

  currentSlide = index;
  updateNavigation();

  // Allow the CSS transition to finish
  window.setTimeout(() => {
    oldSlide.classList.remove("exit-left");
    isAnimating = false;
  }, 420);
}

function updateNavigation() {
  counter.textContent =
    `${String(currentSlide + 1).padStart(2, "0")} / ${String(totalSlides).padStart(2, "0")}`;

  progressBar.style.width =
    `${((currentSlide + 1) / totalSlides) * 100}%`;

  prevBtn.disabled = currentSlide === 0;
  nextBtn.disabled = currentSlide === totalSlides - 1;

  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
    dot.setAttribute(
      "aria-current",
      index === currentSlide ? "step" : "false"
    );
  });

  nextBtn.innerHTML =
    currentSlide === totalSlides - 1
      ? "Finished ✓"
      : "<span>Next</span> →";
}

function nextSlide() {
  if (currentSlide < totalSlides - 1) {
    showSlide(currentSlide + 1);
  }
}

function previousSlide() {
  if (currentSlide > 0) {
    showSlide(currentSlide - 1);
  }
}

nextBtn.addEventListener("click", nextSlide);
prevBtn.addEventListener("click", previousSlide);

// Buttons inside slides with data-next
document.querySelectorAll("[data-next]").forEach(button => {
  button.addEventListener("click", nextSlide);
});

// Keyboard controls
document.addEventListener("keydown", event => {
  const tag = document.activeElement?.tagName;

  if (["INPUT", "TEXTAREA", "SELECT"].includes(tag)) return;

  if (event.key === "ArrowRight" || event.key === "PageDown") {
    event.preventDefault();
    nextSlide();
  }

  if (event.key === "ArrowLeft" || event.key === "PageUp") {
    event.preventDefault();
    previousSlide();
  }

  if (event.key === "Home") {
    showSlide(0);
  }

  if (event.key === "End") {
    showSlide(totalSlides - 1);
  }

  if (event.key.toLowerCase() === "f") {
    toggleFullscreen();
  }
});

// Fullscreen support
async function toggleFullscreen() {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
    } else {
      await document.exitFullscreen();
    }
  } catch (error) {
    console.warn("Fullscreen is not supported in this browser.", error);
  }
}

fullscreenBtn.addEventListener("click", toggleFullscreen);

document.addEventListener("fullscreenchange", () => {
  fullscreenBtn.innerHTML = document.fullscreenElement
    ? '⛶ <span class="hide-small">Exit Fullscreen</span>'
    : '⛶ <span class="hide-small">Fullscreen</span>';
});

// ================================
// INTERACTIVE SCIENCE QUIZ
// ================================

const questions = [
  {
    question: "1. Why does refrigeration slow food spoilage?",
    answers: [
      "It removes every microorganism",
      "It slows the growth of many microorganisms",
      "It adds preservatives to food",
      "It makes food completely sterile"
    ],
    correct: 1,
    explanation:
      "Correct! Low temperatures slow the growth of many microorganisms and slow some chemical changes."
  },
  {
    question: "2. What is the recommended maximum refrigerator temperature?",
    answers: [
      "15°C (59°F)",
      "10°C (50°F)",
      "4°C (40°F)",
      "25°C (77°F)"
    ],
    correct: 2,
    explanation:
      "Correct! Keep your refrigerator at 4°C (40°F) or below to help keep perishable food safe."
  },
  {
    question: "3. Does refrigeration kill every harmful microorganism?",
    answers: [
      "Yes, all of them",
      "Yes, after one hour",
      "Only if the door stays closed",
      "No, some can survive and some can still grow"
    ],
    correct: 3,
    explanation:
      "Correct! Refrigeration is not sterilization. Some microorganisms survive, and certain types can grow in cold conditions."
  },
  {
    question: "4. How does drying help preserve food?",
    answers: [
      "It increases moisture",
      "It reduces available water for microbial growth",
      "It freezes the food",
      "It removes all bacteria instantly"
    ],
    correct: 1,
    explanation:
      "Correct! Drying reduces available moisture, making conditions less suitable for many microorganisms."
  },
  {
    question: "5. Which is a safe food-storage practice?",
    answers: [
      "Leave cooked food out overnight",
      "Taste food to check if it is safe",
      "Store perishable food promptly in a refrigerator",
      "Keep raw meat uncovered above ready-to-eat food"
    ],
    correct: 2,
    explanation:
      "Correct! Refrigerate perishable food promptly, use covered containers, and keep raw meat separate from ready-to-eat food."
  }
];

const questionText = document.getElementById("questionText");
const answerList = document.getElementById("answerList");
const quizProgress = document.getElementById("quizProgress");
const quizFeedback = document.getElementById("quizFeedback");
const scoreText = document.getElementById("scoreText");
const nextQuestionBtn = document.getElementById("nextQuestionBtn");

let questionIndex = 0;
let score = 0;
let answerSelected = false;
let quizFinished = false;

function renderQuestion() {
  const question = questions[questionIndex];

  answerSelected = false;
  quizFinished = false;

  quizProgress.textContent =
    `QUESTION ${questionIndex + 1} OF ${questions.length}`;

  questionText.textContent = question.question;
  answerList.innerHTML = "";
  quizFeedback.textContent = "";
  quizFeedback.className = "quiz-feedback";

  nextQuestionBtn.disabled = true;
  nextQuestionBtn.textContent = "SELECT AN ANSWER FIRST";

  question.answers.forEach((answer, index) => {
    const button = document.createElement("button");

    button.type = "button";
    button.className = "answer-btn";
    button.textContent =
      `${String.fromCharCode(65 + index)}. ${answer}`;

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answerList.appendChild(button);
  });

  scoreText.textContent = `Score: ${score}`;
}

function selectAnswer(selectedIndex) {
  if (answerSelected || quizFinished) return;

  answerSelected = true;

  const question = questions[questionIndex];
  const answerButtons = [
    ...answerList.querySelectorAll(".answer-btn")
  ];

  answerButtons.forEach((button, index) => {
    button.disabled = true;

    if (index === question.correct) {
      button.classList.add("correct");
    }
  });

  if (selectedIndex === question.correct) {
    score++;

    quizFeedback.textContent =
      "✓ Correct! " + question.explanation;

    quizFeedback.classList.add("good");
  } else {
    answerButtons[selectedIndex].classList.add("wrong");

    quizFeedback.textContent =
      "Not quite. " + question.explanation;

    quizFeedback.classList.add("bad");
  }

  scoreText.textContent = `Score: ${score}`;

  nextQuestionBtn.disabled = false;
  nextQuestionBtn.textContent =
    questionIndex === questions.length - 1
      ? "VIEW FINAL SCORE →"
      : "NEXT QUESTION →";
}

function showFinalScore() {
  quizFinished = true;

  const percentage = Math.round(
    (score / questions.length) * 100
  );

  questionText.textContent = "Quiz completed!";

  quizProgress.textContent = "YOUR RESULTS";

  answerList.innerHTML = `
    <div class="result-panel">
      <div class="result-score">${score} / ${questions.length}</div>
      <div class="result-percent">${percentage}% CORRECT</div>
      <p>${
        percentage === 100
          ? "Excellent! You understood the key science concepts."
          : percentage >= 60
          ? "Good work! Review the explanations to strengthen your understanding."
          : "Keep learning! Review the slides and try the quiz again."
      }</p>
      <button type="button" class="answer-btn" id="retryQuizBtn">
        ↻ Try the quiz again
      </button>
    </div>
  `;

  quizFeedback.textContent =
    "Remember: refrigeration slows spoilage, but correct food handling is essential.";

  quizFeedback.className = "quiz-feedback good";

  nextQuestionBtn.textContent = "CONTINUE PRESENTATION →";
  nextQuestionBtn.disabled = false;

  document.getElementById("retryQuizBtn")
    .addEventListener("click", restartQuiz);
}

function restartQuiz() {
  questionIndex = 0;
  score = 0;
  answerSelected = false;
  quizFinished = false;

  renderQuestion();
}

nextQuestionBtn.addEventListener("click", () => {
  if (!answerSelected && !quizFinished) return;

  if (quizFinished) {
    nextSlide();
    return;
  }

  if (questionIndex < questions.length - 1) {
    questionIndex++;
    renderQuestion();
  } else {
    showFinalScore();
  }
});

// Start the presentation
updateNavigation();
renderQuestion();
