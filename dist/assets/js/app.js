'use strict'
//!--- Variabales
const $ = document
const questionBox = selector('.questionBox')
const questions = [
  { question: '2 x 1', answer: '2', fake: '5,6,7', time: 10 },
  { question: '3 x 2', answer: '6', fake: '5', time: 10 },
  { question: '7 x 4', answer: '28', fake: '5,7', time: 15 },
  { question: '6 x 9 + 8', answer: '62', fake: '64,66,60,58', time: 20 },
  { question: '9 x 5 + 8', answer: '53', fake: '8,50,52,54', time: 3 }
]
let [index, score, indexAnswer, time, playerAnswer] = [0, 0, 0, null, []]
let nowQuestion = questions[index]
//!--- Event
selector('#start').addEventListener('click', startQuestion)
//!--- Functions
//--- select element by querySelector
function selector (text) {
  return $.querySelector(`${text}`)
}
//--- Start question with click in BUTTON
function startQuestion (e) {
  e.target.hidden = true
  e.target.removeEventListener('click', startQuestion)
  completingQuestion()
}
//--- Set timer for each question
function startTimer () {
  let [timer, minutes, seconds] = [nowQuestion.time, 0, 0]
  const display = selector('.timer')
  time = setInterval(countDown, 1000)
  function countDown () {
    if(timer > 15){
      (display.style.color = 'black')
    }else if(timer < 15 && timer > 10){
      (display.style.color = 'orange')
    }else if(timer <= 10){
      (display.style.color = 'red')
    }
    minutes = parseInt(timer / 60, 10)
    seconds = parseInt(timer % 60, 10)
    minutes = minutes < 10 ? '0' + minutes : minutes
    seconds = seconds < 10 ? '0' + seconds : seconds
    display.textContent =
      'زمان باقی مانده ' + toFarsiNumber(minutes) + ':' + toFarsiNumber(seconds)
    if (timer === 0) {
      clearInterval(time)
      if (questions.length - 1 === index) return finish()
      nowQuestion = questions[++index]
      playerAnswer.push('null')
      return completingQuestion()
    }
    --timer
  }
}
//--- Comleting question check (create a span for each quetion)
function completingQuestion () {
  startTimer()
  const allquestionElement = []
  const wrongAnswer = nowQuestion.fake.split(',')
  questionBox.children !== 0 && (questionBox.innerHTML = '')
  selector('p').textContent = nowQuestion.question
  for (const elem of wrongAnswer){
    allquestionElement.push(createNewElement('span', 'question', toFarsiNumber(elem)))
  }
  // create Element main answer
  allquestionElement.push(createNewElement('span', 'question', toFarsiNumber(nowQuestion.answer)))
  for (const number of randomNumber(0, wrongAnswer.length + 1)){
    questionBox.appendChild(allquestionElement[number])
  }
  for (const item of $.querySelectorAll('.question')){
    item.addEventListener('click', checkAnswer)
    selector('.numberQuestion').innerHTML = `<i class="fas fa-question-circle"></i> سوال ${toFarsiNumber(index + 1)} از ${toFarsiNumber(questions.length)}`
  }
}
//--- Generating non-repeating random numbers
function randomNumber (minimum, maximum) {
  let ar
  for (minimum, ar = []; minimum < maximum; minimum++) ar[minimum] = minimum
  return ar.sort(() => Math.random() - 0.5)
}
//--- Create Element & add Class and TextContent
function createNewElement (elem, classElem = '', html = '') {
  const element = $.createElement(`${elem}`)
  element.classList = `${classElem}`
  element.innerHTML = `${html}`
  return element
}
//--- Convert english numbers to persian
function toFarsiNumber (n) {
  const farsiDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']
  return n.toString().split('').map(x => farsiDigits[x]).join('')
}
//--- Check Event click answer
function checkAnswer (e) {
  playerAnswer.push(e.target.textContent)
  selector('.timer').textContent = ''
  e.target.textContent === toFarsiNumber(nowQuestion.answer) && ++score
  time && clearInterval(time)
  if (questions.length - 1 === index) return finish()
  nowQuestion = questions[++index]
  completingQuestion()
}
//--- show Player Answer
function createElementForSohwAnswer () {
  selector('#start').classList.add('changelocation')
  selector('#showAnswer').hidden = true
  //--------------------------------------
  let arr = []
  for (const item of questions) {
    toFarsiNumber(item.answer) === playerAnswer[indexAnswer]
      ? arr.push(true)
      : arr.push(playerAnswer[indexAnswer])
    ++indexAnswer
  }
  //--------------------------------------
  const btnNext = createNewElement('button','changePage right','<i class="fas fa-caret-right"></i>')
  const btnPrev = createNewElement('button','changePage left','<i class="fas fa-caret-left"></i>')
  btnNext.addEventListener('click', ()=>{
    ++indexAnswer  
    if (indexAnswer > questions.length - 1) indexAnswer = 0
    else if (indexAnswer < 0) indexAnswer = questions.length - 1    
    show(arr)
  })
  btnPrev.addEventListener('click', ()=>{
    --indexAnswer
    if (indexAnswer > questions.length - 1) indexAnswer = 0
    else if (indexAnswer < 0) indexAnswer = questions.length - 1    
    show(arr)
  })
  selector('#wrapper').appendChild(btnNext)
  selector('#wrapper').appendChild(btnPrev)
  indexAnswer=0
  show(arr)
}
//--- Create page for show Answer Player
function show (value) {
  const paragraph = selector('p')
  const numberQuestion = selector('.numberQuestion')
  const boxanswer = selector('.questionBox')
  
  paragraph.textContent = `${questions[indexAnswer].question}`
  numberQuestion.textContent = `سوال ${indexAnswer + 1} از ${questions.length}`
  if(value[indexAnswer] === true){
    boxanswer.textContent = `پاسخ شما صحیح بوده است \n (${toFarsiNumber(questions[indexAnswer].answer)})`
  }else{
    if(value[indexAnswer]===undefined){
      boxanswer.textContent = `شما پاسخی به این سوال نداده اید!`
    }else{
      boxanswer.textContent = `پاسخ شما اشتباه بوده است \n (پاسخ شما : ${value[indexAnswer]})`
    }
  } 
}
function finish () {
  selector('.timer').textContent = ''
  selector('.numberQuestion').textContent = ''
  selector('p').textContent = `آزمون به پایان رسید`
  selector('.questionBox').textContent = `تعداد پاسخ های صحیح شما ${toFarsiNumber(score)} از ${toFarsiNumber(questions.length)}`
  //------------- Create button for show answer
  const btn = selector('button')
  const btnShowAnswer = selector('#showAnswer')
  btnShowAnswer.textContent = 'نمایش پاسخ ها'
  btnShowAnswer.hidden = false
  btnShowAnswer.addEventListener('click', createElementForSohwAnswer)
  //-----------------------
  btn.classList.add('btnReload')
  btn.hidden = false
  btn.addEventListener('click', () => window.location.reload())
  btn.innerHTML = 'آزمون مجدد <i class="fas fa-sync-alt"></i>'
}