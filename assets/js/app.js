let questionBox
let questionTitle
let display
let numberQuestion

let timer = null
let timeElapsed = 0
let timeLeft = 0
let currentIndexQuestion = 0
let score = 0
let playerAnswer = []
let nowQuestion = questions[currentIndexQuestion]

const loadTemplate = () => {
	const container = document.querySelector('.container')
	const content = `
        <div class="header">
            <span id="numberQuestion"></span>
            <span>آزمون ریاضی</span>
            <span id="timer"></span>
        </div>
        <div class="question">
            <div class="question-title"></div>
            <div class="question-check"></div>
        </div>`
	const newContainer = newElement('div', { className: 'container', innerHTML: content })
	container.replaceWith(newContainer)
    
	questionBox = document.querySelector('.question-check')
	questionTitle = document.querySelector('.question-title')
	display = document.querySelector('#timer')
	numberQuestion = document.querySelector('#numberQuestion')
	timer = setInterval(updateTimer, 1000)
	showNewQuestion()
}

const updateTimer = () => {
	let [seconds, minutes] = [0, 0]
	timeLeft = nowQuestion.time - timeElapsed
	if (timeLeft > 15) {
		display.style.color = '#000'
	} else if (timeLeft <= 15 && timeLeft >= 10) {
		display.style.color = 'blue'
	} else {
		display.style.color = 'red'
	}
	minutes = parseInt(timeLeft / 60, 10)
	seconds = parseInt(timeLeft % 60, 10)
	minutes = minutes < 10 ? '0' + minutes : minutes
	seconds = seconds < 10 ? '0' + seconds : seconds
	display.innerText = `زمان باقی مانده ${toFarsiNumber(minutes)}:${toFarsiNumber(seconds)}`
	if (timeLeft == 0) {
		finishQuestion()
	}
	timeElapsed += 1
}

const toFarsiNumber = (n) => {
	const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
	return n
		.toString()
		.split('')
		.map((x) => farsiDigits[x])
		.join('')
}

const showNewQuestion = () => {
	const wrongAnswers = nowQuestion.fake.split(',')
	let allQuestions = []
	questionBox.innerHTML = ''
	questionTitle.innerText = nowQuestion.question

	for (const answer of wrongAnswers) {
		const element = newElement('span', { className: 'question', innerText: toFarsiNumber(answer) })
		element.addEventListener('click', checkAnswer)
		allQuestions.push(element)
	}

	const answer = newElement('span', { className: 'question', innerText: toFarsiNumber(nowQuestion.answer) })
	answer.addEventListener('click', checkAnswer)
	allQuestions.push(answer)

	for (const n of randomNumber(0, wrongAnswers.length + 1)) {
		questionBox.appendChild(allQuestions[n])
	}

	numberQuestion.innerText = `سوال ${toFarsiNumber(currentIndexQuestion + 1)} از ${toFarsiNumber(questions.length)}`
}

const checkAnswer = ({ target }) => {
	playerAnswer.push(target.innerText)
	if (target.innerText == toFarsiNumber(nowQuestion.answer)) {
		score += 1
	}
	if (questions.length - 1 == currentIndexQuestion) {
		finishTest()
	} else {
		finishQuestion()
	}
}

const randomNumber = (minimum, maximum) => {
	let arr = []
	for (arr; minimum < maximum; minimum++) {
		arr[minimum] = minimum
	}
	return arr.sort(() => Math.random() - 0.5)
}

function newElement(tag, property) {
	const elem = document.createElement(tag)
	if (property) {
		Object.keys(property).forEach((key) => {
			if (key !== 'className') {
				elem[key] = property[key]
			} else {
				elem.classList.add(property[key])
			}
		})
	}
	return elem
}

const finishQuestion = () => {
	clearInterval(timer)
	nowQuestion = questions[++currentIndexQuestion]
	if (questions.length - 1 == currentIndexQuestion) {
		finishTest()
	} else {
        showNewQuestion()
		timeElapsed = 0
        timer = setInterval(updateTimer, 1000)
	}
}

const finishTest = () => {
	console.log('finish')
}
