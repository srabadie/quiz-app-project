const score = JSON.parse(localStorage.getItem("score"));
const highScore = JSON.parse(localStorage.getItem("highScore")) || [];

const scorePoint = document.querySelector("p");
const input = document.querySelector("input");
const saveButton = document.querySelector("button");

scorePoint.innerText = score;

const saveButtonHandeler = () => {
  if (!input.value || !score) {
    alert("invalid username or score");
  } else {
    const finalScore = { name: input.value, score };
    highScore.push(finalScore);
    highScore.sort((a, b) => b.score - a.score);
    highScore.splice(10);
    localStorage.setItem("highScore", JSON.stringify(highScore));
    localStorage.removeItem("score");
    window.location.assign("/");
  }
};

saveButton.addEventListener("click", saveButtonHandeler);
