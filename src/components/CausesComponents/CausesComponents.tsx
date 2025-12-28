import { ChevronRight } from "lucide-react";
import hero from "../../assets/hero.webp";

const HeroSection = ({
    title = "Causes",
    breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "Causes", href: "/causes" },
    ],
    image = hero,
}) => {
    return (
        <section
            role="banner"
            aria-label={title}
            className="relative h-[260px] flex items-center bg-cover bg-no-repeat bg-[center_30%] pt-10"
            style={{ backgroundImage: `url(${image})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Content */}
            <div className="relative z-10 text-white container mx-auto px-6 max-w-4xl">
                <h1 className="text-5xl font-bold mb-3 drop-shadow">
                    {title}
                </h1>

                {/* Breadcrumbs */}
                <nav aria-label="Breadcrumb">
                    <ol className="flex items-center text-sm">
                        {breadcrumbs.map((crumb, index) => {
                            const isLast = index === breadcrumbs.length - 1;

                            return (
                                <li key={index} className="flex items-center">
                                    {!isLast ? (
                                        <>
                                            <a
                                                href={crumb.href}
                                                className="text-white/90 hover:text-white transition-colors"
                                            >
                                                {crumb.label}
                                            </a>
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
            </div>
        </section>
    );
};

export default HeroSection;
