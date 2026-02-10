import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import DonateLanding from './pages/DonateLanding';
import DonateItems from './pages/DonateItems';
import Volunteer from './pages/Volunteer';
import DonateReturn from './pages/DonateReturn';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import UburuHome from './pages/UburuHome';
import UburuVillage from './pages/UburuVillage';


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
                    <Route path="/donate" element={<DonateLanding />} />
                    <Route path="/donate/money" element={<Donate />} />
                    <Route path="/donate/items" element={<DonateItems />} />
                    <Route path="/donate/return" element={<DonateReturn />} />
                    <Route path="/volunteer" element={<Volunteer />} />
                    <Route path="/get/therapy" element={<Therapy />} />
                    <Route path="/get/home" element={<UburuHome />} />
                    <Route path="/get/village" element={<UburuVillage />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
