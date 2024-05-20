document.addEventListener('DOMContentLoaded', function() {
    let questions = [];
    let currentQuestionIndex = 0;

    const startButton = document.getElementById('start-exam');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const answersList = document.getElementById('answers-list');
    const checkAnswersButton = document.getElementById('check-answers');
    const questionNumber = document.getElementById('question-number');
    const nextQuestionButton = document.getElementById('next-question');

    startButton.addEventListener('click', startExam);
    checkAnswersButton.addEventListener('click', checkAnswers);
    nextQuestionButton.addEventListener('click', nextQuestion);

    function startExam() {
        fetch('questions.json')
            .then(response => response.json())
            .then(data => {
                questions = data;
                shuffle(questions);  // Shuffle questions to ensure different order each time
                currentQuestionIndex = 0;
                loadQuestion();
                questionContainer.style.display = 'block';
                startButton.style.display = 'none';
            }).catch(error => {
                console.error('Failed to load questions:', error);
            });
    }

    function loadQuestion() {
        if (currentQuestionIndex >= questions.length) {
            alert("You have completed the exam!");
            endExam();
            return;
        }
        const question = questions[currentQuestionIndex];
        questionNumber.textContent = `Question ${currentQuestionIndex + 1} of ${questions.length}`;
        questionText.textContent = question.question;
        answersList.innerHTML = '';

        Object.entries(question.answers).forEach(([key, value]) => {
            const li = document.createElement('li');
            const button = document.createElement('button');
            button.textContent = `${key}: ${value}`;
            button.classList.add('answer-btn');
            button.onclick = () => button.classList.toggle('selected');
            li.appendChild(button);
            answersList.appendChild(li);
        });
    }

    function checkAnswers() {
        const selectedAnswers = Array.from(document.querySelectorAll('.answer-btn.selected')).map(btn => btn.textContent.charAt(0));
        const correctAnswers = questions[currentQuestionIndex].correct_answer;
        const isCorrect = selectedAnswers.length === correctAnswers.length &&
                          selectedAnswers.every(answer => correctAnswers.includes(answer));

        if (isCorrect) {
            alert('Correct Answer!');
        } else {
            alert(`Incorrect. Correct Answers are: ${correctAnswers.join(', ')}`);
        }
    }

    function nextQuestion() {
        if (currentQuestionIndex < questions.length - 1) {
            currentQuestionIndex++;
            loadQuestion();
        } else {
            alert("You have completed the exam!");
            questionContainer.style.display = 'none';
            startButton.style.display = 'block';
        }
    }

    function endExam() {
        questionContainer.style.display = 'none';
        startButton.style.display = 'block';
        currentQuestionIndex = 0;  // Reset the index for a new start
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
    }
});
