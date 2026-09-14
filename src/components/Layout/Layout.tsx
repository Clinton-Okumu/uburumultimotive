import Footer from './Footer';
import Navbar from './Navbar';
import { CartDrawer } from '../shared/CartDrawer';
import { FloatingCartButton } from '../shared/FloatingCartButton';

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    return (
        <>
            <Navbar />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />
            <CartDrawer />
            <FloatingCartButton />
        </>
    );
}
