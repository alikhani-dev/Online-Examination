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

const loadTemplateStart = () => {
	const container = document.querySelector('.container')
	const content = `
        <div class="header">
            <span id="numberQuestion"></span>
            <span>آزمون ریاضی</span>
            <span id="timer">زمان باقی مانده</span>
        </div>
        <div class="question">
            <div class="question-title"></div>
            <div class="question-check"></div>
        </div>`
	const newContainer = newElement('section', { className: 'container', innerHTML: content })

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
		display.style.color = '#4081a2'
	} else {
		display.style.color = '#D83C1B'
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
	display.innerHTML = 'در حال دریافت'
	questionTitle.innerText = nowQuestion.question

	for (const answer of wrongAnswers) {
		const element = newElement('span', { className: 'question', innerText: toFarsiNumber(answer) })
		element.addEventListener('click', finishQuestion)
		allQuestions.push(element)
	}

	const answer = newElement('span', { className: 'question', innerText: toFarsiNumber(nowQuestion.answer) })
	answer.addEventListener('click', finishQuestion)
	allQuestions.push(answer)

	for (const n of randomNumber(0, wrongAnswers.length + 1)) {
		questionBox.appendChild(allQuestions[n])
	}

	numberQuestion.innerText = `سوال ${toFarsiNumber(currentIndexQuestion + 1)} از ${toFarsiNumber(questions.length)}`
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

const finishQuestion = (e) => {
	const data = e ? e.target.innerText : null
	clearInterval(timer)
	playerAnswer.push(data)
	if (data == toFarsiNumber(nowQuestion.answer)) {
		score += 1
	}
	if (questions.length - 1 == currentIndexQuestion) {
		loadTemplateFinish()
	} else {
		nowQuestion = questions[++currentIndexQuestion]
		showNewQuestion()
		timeElapsed = 0
		timer = setInterval(updateTimer, 1000)
	}
}
const showAnswers = () => {
	questionBox = document.querySelector('.question-check')
	questionTitle = document.querySelector('.question-title')
	questionTitle.innerText = nowQuestion.question
	const answer = playerAnswer[currentIndexQuestion]
	const checkAnswer = answer == toFarsiNumber(nowQuestion.answer)
	questionBox.innerHTML = `<span class='${checkAnswer ? 'right-answer' : 'wrong-answer'}'>پاسخ شما 
    ${checkAnswer ? `صحیح` : `غلط`} بوده است
    ( ${answer ? answer : 'پاسخی ثبت نشده است'} )
    </span>`
}
const goPage = (e) => {
	currentIndexQuestion += e
	if (currentIndexQuestion > questions.length - 1) {
		currentIndexQuestion = 0
	}
	if (currentIndexQuestion == -1) {
		currentIndexQuestion = questions.length - 1
	}
	nowQuestion = questions[currentIndexQuestion]
	showAnswers()
}
const loadTemplateFinish = () => {
	const container = document.querySelector('.container')
	const content = `
        <div class="header">
            <span id="prev">سوال قبل</span>
            <span>پایان آزمون ریاضی</span>
            <span id="next">سوال بعدی</span>
        </div>
        <div class="question">
            <div class="question-title"></div>
            <div class="question-check"></div>
        </div>`
	const newContainer = newElement('section', { className: 'container', innerHTML: content })
	container.replaceWith(newContainer)
	document.querySelector('#next').addEventListener('click', () => goPage(1))
	document.querySelector('#prev').addEventListener('click', () => goPage(-1))
	showAnswers()
}
