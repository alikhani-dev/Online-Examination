import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Home from '../pages/Home'
import Examination from '../pages/Examination'

const RouterPage: React.FC = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path='/' element={<Home />} />
				<Route path='/examination' element={<Examination />} />
			</Routes>
		</BrowserRouter>
	)
}

export default RouterPage
