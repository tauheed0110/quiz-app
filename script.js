const sections = document.getElementsByClassName('section');
const quizContainer = document.getElementById('quiz-container');
const questionSection = document.getElementById('question-container');
const score = document.getElementById('score');
const questionDiv = document.getElementById('question');
const optionsDiv = document.getElementById('options');
const next = document.getElementById('next-button');
const answer = document.getElementById('answer');
const feedback = document.getElementById('feedback');

let sectionNumber = null;
let curr_score = 0;
let count = 0;

// get to know which section is clicked;
for (let section of sections) {
    section.addEventListener('click', (event) => {
        sectionNumber = Number(event.target.getAttribute('data-section'));
        quizContainer.style.display = 'none';
        feedback.style.display = 'none';
        questionSection.style.display = 'block';
        renderQuiz(sectionNumber);
    })
}

// fetch json data from the same directory;
let jsonData = {};
const fetchData = async () => {
    const response = await fetch('data.json');
    const data = await response.json();
    jsonData = data;
}
fetchData();

// start rendering the question
function renderQuiz(sectionNumber) {
    rendnerQuestion(jsonData.sections[sectionNumber].questions[count], count);
}

// next button click hanlde
next.addEventListener('click', () => {
    count++;
    optionsDiv.style.pointerEvents = 'auto';
    const numberOfQues = jsonData.sections[sectionNumber].questions.length
    rendnerQuestion(jsonData.sections[sectionNumber].questions[count], count);

})

// handle clik go home button;
document.getElementById('go-home').addEventListener('click', () => {
    quizContainer.style.display = 'grid';
    feedback.style.display = 'none';
    questionSection.style.display = 'none';
    count = 0;
    curr_score = 0;
    score.textContent = 'Score: 0';
})


// render the question if no question left to display, show feedback;
function rendnerQuestion(queObj, count) {
    optionsDiv.innerHTML = '';
    // questionDiv.textContent = '';
    answer.textContent = '';
    const numberOfQues = jsonData.sections[sectionNumber].questions.length
    if (count >= numberOfQues) {
        questionSection.style.display = 'none';
        feedback.style.display = 'block';
        document.getElementById('total-score').textContent = `Your score is: ${curr_score}/${numberOfQues}`;
    } else {
        switch (queObj.questionType) {
            case 'mcq':
                questionDiv.textContent = queObj.question;
                for (let option of queObj.options) {
                    const divEle = document.createElement('div');
                    divEle.textContent = option;
                    optionsDiv.appendChild(divEle);
                    // add event listener
                    divEle.addEventListener('click', (event) => {
                        event.target.style.cssText = `
                    background-color: blue;
                    color: white;
                    `;
                        checkAnswer(queObj.answer, event.target.textContent);
                        // disable to all which is not selected;
                        optionsDiv.style.pointerEvents = 'none';
                    });
                }
                break;
            case 'text':
                questionDiv.textContent = queObj.question;
                const inputEle = document.createElement('input');
                inputEle.setAttribute('type', 'text');
                inputEle.setAttribute('placeholder', 'Answer please');
                inputEle.textContent = queObj.question;
                optionsDiv.appendChild(inputEle);
                optionsDiv.addEventListener('change', (event) => {
                    checkAnswer(queObj.answer, event.target.value);
                });
                break;
            case 'number':
                questionDiv.textContent = queObj.question;
                const input = document.createElement('input');
                input.setAttribute('type', 'number');
                input.setAttribute('placeholder', 'Answer please');
                input.textContent = queObj.question;
                optionsDiv.appendChild(input);
                optionsDiv.addEventListener('change', (event) => {
                    checkAnswer(queObj.answer, event.target.value);
                });
                break;
        }
    }
}

// check answer if the answer is correct increase it by one;
function checkAnswer(correctAns, markedAnswer) {
    answer.textContent = '';
    answer.removeAttribute('class');
    if(typeof correctAns === 'number' && Number(markedAnswer) === correctAns){
        curr_score++;
        answer.setAttribute('class', 'correct');
        answer.textContent = `Correct: ${correctAns}`;
        score.textContent = `Score: ${curr_score}`;
    }
    else if (typeof correctAns === 'string' && correctAns.toLowerCase() == markedAnswer.toLowerCase()) {
        curr_score++;
        answer.setAttribute('class', 'correct');
        answer.textContent = `Correct: ${correctAns}`;
        score.textContent = `Score: ${curr_score}`;
    } else {
        answer.setAttribute('class', 'wrong');
        answer.textContent = `Wrong: ${correctAns}`;
    }
}