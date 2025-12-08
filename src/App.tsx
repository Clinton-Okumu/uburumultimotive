import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Home from './pages/Home';

// Simple placeholder components for other routes
const Events = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Events</h1>
            <p className="text-xl text-gray-600 mb-8">
                Join us at our upcoming events and be part of the change.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-gray-600 leading-relaxed">
                    Stay tuned for our latest events, workshops, and community gatherings.
                </p>
            </div>
        </div>
    </div>
);

const Blogs = () => (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Blog</h1>
            <p className="text-xl text-gray-600 mb-8">
                Read stories, updates, and insights from our work in the community.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                    Follow our blog for the latest news, success stories, and ways to get involved.
                </p>
            </div>
        </div>
    </div>
);

const Pages = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
        <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Pages</h1>
            <p className="text-xl text-gray-600 mb-8">
                Explore our various pages and learn more about what we do.
            </p>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <p className="text-gray-600 leading-relaxed">
                    Navigate through our different sections to find the information you need.
                </p>
            </div>
        </div>
    </div>
);

const Causes = () => (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Our Causes</h1>
            <p className="text-xl text-gray-600 mb-8">
                Discover the causes we support and how you can contribute.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg">
                <p className="text-gray-600 leading-relaxed">
                    Learn about our various initiatives and the impact we're making together.
                </p>
            </div>
        </div>
    </div>
);

const Donate = () => (
    <div className="min-h-screen flex items-center justify-center bg-white px-6">
        <div className="text-center max-w-4xl">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">Donate</h1>
            <p className="text-xl text-gray-600 mb-8">
                Your generous donation helps us continue our important work.
            </p>
            <div className="bg-gray-50 p-8 rounded-lg mb-6">
                <p className="text-gray-600 leading-relaxed mb-6">
                    Every contribution makes a difference in the lives of those we serve.
                </p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full transition-all duration-300">
                    Donate Now
                </button>
            </div>
        </div>
    </div>
);

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
                    <Route path="/events" element={<Events />} />
                    <Route path="/blogs" element={<Blogs />} />
                    <Route path="/pages" element={<Pages />} />
                    <Route path="/causes" element={<Causes />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
