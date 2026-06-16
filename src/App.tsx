import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import About from './pages/About';
import Founder from './pages/Founder';
import Gallery from './pages/Gallery';
import Causes from './pages/Causes';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import DonateLanding from './pages/DonateLanding';
import DonateItems from './pages/DonateItems';
import Volunteer from './pages/Volunteer';
import Partner from './pages/Partner';
import DonateReturn from './pages/DonateReturn';
import PurchaseReturn from './pages/PurchaseReturn';
import Home from './pages/Home';
import Therapy from './pages/Therapy';
import UburuHome from './pages/UburuHome';
import UburuVillage from './pages/UburuVillage';
import MaasaiMaraPackage from './pages/MaasaiMaraPackage';
import Checkout from './pages/Checkout';
import TherapyTerms from './pages/TherapyTerms';
import TravelTerms from './pages/TravelTerms';


import ScrollToTop from './components/shared/ScrollToTop';


function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/founder" element={<Founder />} />
                    <Route path="/causes" element={<Causes />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/donate" element={<DonateLanding />} />
                    <Route path="/donate/money" element={<Donate />} />
                    <Route path="/donate/items" element={<DonateItems />} />
                    <Route path="/donate/return" element={<DonateReturn />} />
                    <Route path="/purchase/return" element={<PurchaseReturn />} />
                    <Route path="/volunteer" element={<Volunteer />} />
                    <Route path="/partner" element={<Partner />} />
                    <Route path="/get/therapy" element={<Therapy />} />
                    <Route path="/get/therapy/terms" element={<TherapyTerms />} />
                    <Route path="/get/home" element={<UburuHome />} />
                    <Route path="/get/village" element={<UburuVillage />} />
                    <Route path="/get/village/maasai-mara" element={<MaasaiMaraPackage />} />
                    <Route path="/get/village/terms" element={<TravelTerms />} />
                    <Route path="/checkout" element={<Checkout />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;
