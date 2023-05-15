import { Link } from 'react-router-dom'

const Home = () => {
	return (
		<div className='container'>
			<nav className='navigation'>
				<Link to='/'>Home</Link>
			</nav>
			<header className='header'>
				<Link to='/examination'>Online Examination</Link>
			</header>
		</div>
	)
}

export default Home
