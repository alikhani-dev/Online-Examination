import { useState } from 'react'
import Examination from './Examination'

const Home = () => {
	const [start, setStart] = useState(false)

	const handleStart = () => {
		setStart(true)
	}

	return (
		<div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
			{start ? (
				<Examination />
			) : (
				<button
					className='bg-green-500 hover:bg-green-700 text-white py-2 px-4 rounded-md shadow-md transition-all duration-300'
					onClick={handleStart}>
					start
				</button>
			)}
		</div>
	)
}

export default Home
