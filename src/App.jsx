import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';
import InfoChatbot from './components/InfoChatbot';
import PvcDetector from './components/PvcDetector';



function AppInner() {
	const navigate = useNavigate();


	useEffect(() => {
		const goContact = () => navigate('/contact');
		window.addEventListener('goToContact', goContact);
		return () => window.removeEventListener('goToContact', goContact);
	}, [navigate]);

	const location = useLocation();
	return (
		<div>
			<Header />
			<Routes location={location}>
				<Route path="/" element={<Dashboard />} />
				<Route path="/dashboard" element={<Dashboard />} />
				<Route path="/about" element={<About />} />
				<Route path="/contact" element={<Contact />} />
			</Routes>
			<DemoModal />
			<PvcDetector />
			<InfoChatbot />
			<Footer />
		</div>
	);
}

export default function App() {
	return (
		<Router>
			<AppInner />
		</Router>
	);
}


const styles = {
	header: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '1rem 2rem',
		borderBottom: '1px solid #f1f5f9',
		background: 'linear-gradient(180deg, rgba(255,255,255,0.6), rgba(255,255,255,0.88))',
		position: 'sticky',
		top: 0,
		zIndex: 20,
		backdropFilter: 'saturate(180%) blur(4px)'
	},
	nav: {
		display: 'flex',
		gap: '0.5rem',
	},
};
