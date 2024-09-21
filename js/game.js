const level = localStorage.getItem("level") || "medium";

const URL = `https://opentdb.com/api.php?amount=10&difficulty=${level}&type=multiple`;

const loader = document.getElementById("loader");
const container = document.getElementById("container");
const questionText = document.getElementById("question-text");
const answersList = document.querySelectorAll(".answers");
const scoreText = document.getElementById("score");
const nextButton = document.getElementById("next-button");
const finishButton = document.getElementById("finish-button");
const questionNumber = document.getElementById("question-number");
const error = document.querySelector("h4");

let formattedData = null;
let questionIndex = 0;
let correctAnswers = null;
let score = 0;
let isAccepted = true;
const firstScore = 10;

const fetchData = async () => {
  try {
    const result = await fetch(URL);
    const data = await result.json();
    formattedData = formatData(data.results);
    start();
  } catch (err) {
    loader.style.display = "none";
    error.style.display = "block";
  }
};

const formatData = (questionData) => {
  const result = questionData.map((item) => {
    const questionObject = { question: item.question };
    const answers = [...item.incorrect_answers];
    const correctAnswerIndex = Math.floor(Math.random() * 4);
    answers.splice(correctAnswerIndex, 0, item.correct_answer);
    questionObject.answers = answers;
    questionObject.correctAnswerIndex = correctAnswerIndex;
    return questionObject;
  });
  return result;
};

const start = () => {
  showQuestion();
  loader.style.display = "none";
  container.style.display = "flex";
};

const showQuestion = () => {
  questionNumber.innerText = questionIndex + 1;
  const { question, answers, correctAnswerIndex } =
    formattedData[questionIndex];
  correctAnswers = correctAnswerIndex;
  questionText.innerText = question;
  answersList.forEach((button, index) => {
    button.innerText = answers[index];
  });
};

const checkAnswer = (event, index) => {
  if (!isAccepted) return;
  isAccepted = false;

  const isCorrect = index === correctAnswers ? true : false;
  if (isCorrect) {
    event.target.classList.add("correct");
    score += firstScore;
    scoreText.innerText = score;
  } else {
    event.target.classList.add("incorrect");
    answersList[correctAnswers].classList.add("correct");
  }
};

const nextButtonHandeler = () => {
  questionIndex++;
  if (questionIndex < formattedData.length) {
    removeClass();
    showQuestion();
    isAccepted = true;
  } else {
    localStorage.setItem("score", JSON.stringify(score));
    window.location.assign("./end.html");
  }
};

const removeClass = () => {
  answersList.forEach((button) => {
    button.className = "answers";
  });
};

const finishButtonHandeler = () => {
  localStorage.setItem("score", JSON.stringify(score));
  window.location.assign("./end.html");
};

window.addEventListener("load", fetchData);
nextButton.addEventListener("click", nextButtonHandeler);
finishButton.addEventListener("click", finishButtonHandeler);
answersList.forEach((button, index) => {
  const handeler = (event) => checkAnswer(event, index);
  button.addEventListener("click", handeler);
});
