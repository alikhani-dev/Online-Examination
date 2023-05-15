import { useState, useEffect, useCallback } from 'react'
import questions from '../constant/questions'

const Examination = () => {
	const [currentQuestion, setCurrentQuestion] = useState(0)
	const [score, setScore] = useState(0)
	const [showScore, setShowScore] = useState(false)
	const [timeLeft, setTimeLeft] = useState(10)

	const handleAnswerOptionClick = useCallback(
		(isCorrect: boolean) => {
			if (isCorrect) {
				setScore(score + 1)
			}

			const nextQuestion = currentQuestion + 1
			if (nextQuestion < questions.length) {
				setCurrentQuestion(nextQuestion)
				setTimeLeft(10)
			} else {
				setShowScore(true)
			}
		},
		[currentQuestion, score]
	)

	useEffect(() => {
		if (timeLeft === 0) {
			handleAnswerOptionClick(false)
		}
	}, [timeLeft, handleAnswerOptionClick])

	useEffect(() => {
		const timer = setTimeout(() => {
			setTimeLeft(timeLeft - 1)
		}, 1000)
		return () => clearTimeout(timer)
	}, [timeLeft])

	return (
		<div className='bg-white p-6 rounded-lg shadow-xl mb-8 mx-5'>
			{showScore ? (
				<>
					<h2 className='text-3xl font-bold text-center'>Your Score</h2>
					<p className='text-2xl font-medium text-center'>
						{score}/{questions.length}
					</p>
				</>
			) : (
				<>
					<h2 className='text-3xl font-bold text-center mb-2'>
						Question {currentQuestion + 1} / {questions.length}
					</h2>
					<p className='text-xl font-medium text-center mb-4'>{questions[currentQuestion].question}</p>
					<span className='text-lg font-medium block mb-2'>Time Left: {timeLeft}s</span>
					<div className='flex flex-col gap-3'>
						{questions[currentQuestion].options.map(option => (
							<button
								key={option}
								className='bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded-md shadow-md transition-all duration-300'
								onClick={() => handleAnswerOptionClick(option === questions[currentQuestion].answer)}>
								{option}
							</button>
						))}
					</div>
				</>
			)}
		</div>
	)
}

export default Examination
