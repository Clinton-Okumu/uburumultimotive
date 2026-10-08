import { BrowserRouter, Route, Routes, Outlet } from 'react-router-dom';
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
import CategoryDetail from './pages/CategoryDetail';
import UburuVillage from './pages/UburuVillage';
import MaasaiMaraPackage from './pages/MaasaiMaraPackage';
import Checkout from './pages/Checkout';
import TherapyTerms from './pages/TherapyTerms';
import TravelTerms from './pages/TravelTerms';
import EventDetail from './pages/EventDetail';
import Pricing from './pages/Pricing';
import ScrollToTop from './components/shared/ScrollToTop';

// Standalone Admin Panel imports (Uburu Home Admin)
import AdminLayout from './admin/AdminLayout';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminCategories from './admin/pages/AdminCategories';
import AdminItems from './admin/pages/AdminItems';
import AdminAddItem from './admin/pages/AdminAddItem';
import AdminAddCategory from './admin/pages/AdminAddCategory';

// Public layout wrapper (includes website Navbar, Footer, and Cart)
function PublicSiteLayout() {
    return (
        <Layout>
            <Outlet />
        </Layout>
    );
}

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <Routes>
                {/* Dedicated Uburu Home Admin Panel routes - Standalone Layout */}
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<AdminDashboard />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="items" element={<AdminItems />} />
                    <Route path="add-item" element={<AdminAddItem />} />
                    <Route path="add-category" element={<AdminAddCategory />} />
                </Route>


                {/* Public Website Routes */}
                <Route element={<PublicSiteLayout />}>
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
                    <Route path="/get/home/category/:categoryId" element={<CategoryDetail />} />
                    <Route path="/get/village" element={<UburuVillage />} />
                    <Route path="/get/village/event/:eventId" element={<EventDetail />} />
                    <Route path="/get/village/event" element={<EventDetail />} />
                    <Route path="/get/village/maasai-mara" element={<MaasaiMaraPackage />} />
                    <Route path="/get/village/terms" element={<TravelTerms />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/checkout/home" element={<Checkout forcedSource="home" />} />
                    <Route path="/checkout/village" element={<Checkout forcedSource="village" />} />
                    <Route path="/pricing" element={<Pricing />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
