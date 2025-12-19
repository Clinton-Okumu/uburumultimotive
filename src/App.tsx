import { BrowserRouter, Route, Routes } from 'react-router';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Blog from './pages/Blog';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Home from './pages/Home';


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
