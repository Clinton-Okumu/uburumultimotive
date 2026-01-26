import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import hero from "../../assets/hero.webp";

const HeroSection = ({
    title = "Contact",
    breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Contact", href: "/contact" },
    ],
    image = hero,
}) => {
    return (
        <section
            role="banner"
            aria-label={title}
            className="relative h-[340px] flex items-center bg-cover bg-no-repeat bg-[center_30%] pt-10"
            style={{ backgroundImage: `url(${image})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/60" />

            {/* Content */}
            <div className="relative z-10 text-white container mx-auto px-6 max-w-4xl">
                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb" className="mb-4">
                    <ol className="flex items-center text-sm">
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <li key={index} className="flex items-center">
                                    {!isLast ? (
                                        <>
                                            <Link
                                                to={crumb.href}
                                                className="text-white/90 hover:text-white transition-colors"
                                            >
                                                {crumb.label}
                                            </Link>
                                            <ChevronRight className="mx-2 w-4 h-4 text-white/60" />
                                        </>
                                    ) : (
                                        <span
                                            aria-current="page"
                                            className="text-white/70"
                                        >
                                            {crumb.label}
                                        </span>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                </nav>

                <h1 className="text-5xl font-bold mb-4 drop-shadow">
                    {title}
                </h1>
                <p className="text-lg text-white/90 max-w-2xl leading-relaxed">
                    Reach out with questions, support requests, or partnership ideas. We’ll respond as quickly as we can.
                </p>
            </div>
        </section>
    );
};

export default HeroSection;
