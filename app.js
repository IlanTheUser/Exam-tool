document.addEventListener('DOMContentLoaded', function() {
    let questions = [];
    let selectedAnswers = new Set();  // Track selected answers

    fetch('questions.json')
        .then(response => response.json())
        .then(data => {
            questions = data;
            loadQuestion();
        });

    let currentQuestionIndex = 0;
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const answersList = document.getElementById('answers-list');
    const nextQuestionButton = document.getElementById('next-question');
    const checkAnswersButton = document.getElementById('check-answers'); // Button to check answers

    function loadQuestion() {
        currentQuestionIndex = Math.floor(Math.random() * questions.length);
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        answersList.innerHTML = '';
        selectedAnswers.clear();  // Clear previously selected answers

        for (const [key, value] of Object.entries(question.answers)) {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = `${key}: ${value}`;
            button.onclick = function() {
                button.classList.toggle('selected'); // Toggle selection visually
                if (selectedAnswers.has(key)) {
                    selectedAnswers.delete(key);
                } else {
                    selectedAnswers.add(key);
                }
            };
            li.appendChild(button);
            answersList.appendChild(li);
        }
    }

    checkAnswersButton.onclick = function() {
        const question = questions[currentQuestionIndex];
        const correctAnswers = new Set(question.correct_answer);
        if (compareAnswers(selectedAnswers, correctAnswers)) {
            alert('Correct Answer!');
        } else {
            alert(`Wrong Answer. Correct Answers are: ${question.correct_answer.join(', ')}`);
        }
    };

    function compareAnswers(selected, correct) {
        if (selected.size !== correct.size) return false;
        for (let item of selected) if (!correct.has(item)) return false;
        return true;
    }

    nextQuestionButton.onclick = function() {
        loadQuestion();
    };

    loadQuestion(); // Load the first random question
});
