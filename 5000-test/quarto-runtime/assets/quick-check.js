(() => {
  let quizNumber = 0;

  function makeButton(label, className = "btn btn-outline-primary btn-sm") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;
    button.textContent = label;
    return button;
  }

  function initializeQuiz(quiz) {
    quizNumber += 1;
    const answer = quiz.querySelector(":scope > .quick-check-answer");
    const options = quiz.querySelector(":scope > .quick-check-options");
    if (!answer) return;

    answer.hidden = true;
    const controls = document.createElement("div");
    controls.className = "quick-check-controls";
    const feedback = document.createElement("div");
    feedback.className = "quick-check-feedback";
    feedback.hidden = true;

    if (options) {
      const correct = Number(options.dataset.correct);
      const groupName = `quick-check-${quizNumber}`;
      [...options.children].forEach((item, index) => {
        const option = document.createElement("label");
        option.className = "quick-check-option";
        const input = document.createElement("input");
        input.type = "radio";
        input.name = groupName;
        input.value = String(index + 1);
        option.append(input, item);
        options.append(option);
      });

      const check = makeButton("Check answer");
      check.addEventListener("click", () => {
        const selected = options.querySelector("input:checked");
        feedback.hidden = false;
        answer.hidden = false;
        if (!selected) {
          feedback.textContent = "Choose an answer, then check it.";
          feedback.className = "quick-check-feedback is-incorrect";
        } else if (Number(selected.value) === correct) {
          feedback.textContent = "Correct.";
          feedback.className = "quick-check-feedback is-correct";
        } else {
          feedback.textContent = "Not quite. Review the explanation below.";
          feedback.className = "quick-check-feedback is-incorrect";
        }
      });
      controls.append(check);
    } else {
      const response = document.createElement("div");
      response.className = "quick-check-response";
      const label = document.createElement("label");
      const responseId = `quick-check-response-${quizNumber}`;
      label.htmlFor = responseId;
      label.textContent = "Your answer";
      const textarea = document.createElement("textarea");
      textarea.id = responseId;
      textarea.placeholder = "Write your answer before revealing the model answer.";
      response.append(label, textarea);
      answer.before(response);

      const reveal = makeButton("Reveal answer");
      reveal.addEventListener("click", () => {
        answer.hidden = false;
        feedback.hidden = false;
        feedback.textContent = "Compare your response with the model answer.";
        feedback.className = "quick-check-feedback is-correct";
      });
      controls.append(reveal);
    }

    quiz.append(controls, feedback);
  }

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".quick-check").forEach(initializeQuiz);
  });
})();
