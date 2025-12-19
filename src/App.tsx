import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Blog from './pages/Blog';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Home from './pages/Home';
const NotFound = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center">
            <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
            <p className="text-xl text-gray-600 mb-8">Page not found</p>
            <a href="/" className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full transition-all duration-300 inline-block">
                Go Home
            </a>
        </div>
    </div>
);

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Causes" element={<Causes />} />
                    <Route path="/Blogs" element={<Blog />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
