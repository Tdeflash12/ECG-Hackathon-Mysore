import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import Contact from './pages/Contact';
import Header from './components/Header';
import Footer from './components/Footer';
import DemoModal from './components/DemoModal';
import InfoChatbot from './components/InfoChatbot';



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


// styles removed - unused
