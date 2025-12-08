import { ChevronRight } from "lucide-react";
import hero from "../../assets/hero.png";

const HeroSection = ({
    title = "About Us",
    breadcrumbs = [
        { label: "Home", href: "/" },
        { label: "About Us", href: "/about" },
    ],
    image = hero,
}) => {
    return (
        <section
            role="banner"
            aria-label={title}
            className="
                relative
                h-[260px]
                flex
                items-center
                justify-center
                bg-cover bg-no-repeat
                bg-center
                pt-10
            "
            style={{
                backgroundImage: `url(${image})`,
                backgroundPositionY: "30%",
            }}
        >
            {/* Overlay */}
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-black/50"
            />

            {/* Content */}
            <div className="relative z-10 text-left text-white px-4 ml-10">
                <h1 className="text-5xl font-bold mb-2">{title}</h1>

                {/* Breadcrumbs */}
                <nav
                    aria-label="Breadcrumb"
                    className="flex items-center justify-center text-sm"
                >
                    {breadcrumbs.map((crumb, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <div key={index} className="flex items-center">
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
                            </div>
                        );
                    })}
                </nav>
            </div>
        </section>
    );
};

export default HeroSection;

