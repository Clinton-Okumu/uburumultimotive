import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Home from './pages/Home';
import Therapy from './pages/Therapy';


function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/About" element={<About />} />
                    <Route path="/Causes" element={<Causes />} />
                    <Route path="/Gallery" element={<Gallery />} />
                    <Route path="/Contact" element={<Contact />} />
                    <Route path="/donate" element={<Donate />} />
                    <Route path="/get/therapy" element={<Therapy />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
