import { Calendar, User, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

// BlogCard Component
const BlogCard = ({ image, date, author, title, description, slug }) => {
    return (
        <article className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
            {/* Image */}
            <div className="relative h-64 overflow-hidden">
                <img
                    src={image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800"}
                    alt={title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Date & Author Badge */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="bg-white rounded-lg px-4 py-2 inline-flex items-center gap-4 shadow-lg">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Calendar className="w-4 h-4" />
                            <span>{date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User className="w-4 h-4" />
                            <span>{author}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {description}
                </p>
                <a
                    href={`/blog/${slug}`}
                    className="inline-flex items-center gap-2 text-gray-900 font-semibold hover:text-blue-600 transition-colors group/link"
                >
                    Read More
                    <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                </a>
            </div>
        </article>
    );
};

// Pagination Component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPageNumbers = () => {
        const pages = [];

        // Always show first page
        pages.push(1);

        // Show current page and neighbors
        if (currentPage > 3) {
            pages.push('...');
        }

        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }

        // Show last page
        if (currentPage < totalPages - 2) {
            pages.push('...');
        }
        if (totalPages > 1) {
            pages.push(totalPages);
        }

        return pages;
    };

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous page"
            >
                <ChevronLeft className="w-5 h-5" />
            </button>

            {/* Page Numbers */}
            {renderPageNumbers().map((page, index) => (
                <button
                    key={index}
                    onClick={() => typeof page === 'number' && onPageChange(page)}
                    disabled={page === '...'}
                    className={`min-w-[40px] h-10 rounded-lg font-medium transition-all ${page === currentPage
                            ? 'bg-yellow-400 text-gray-900'
                            : page === '...'
                                ? 'cursor-default'
                                : 'hover:bg-gray-100 text-gray-700'
                        }`}
                >
                    {page}
                </button>
            ))}

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Next page"
            >
                <ChevronRight className="w-5 h-5" />
            </button>
        </div>
    );
};

// Main BlogSection Component
const BlogSection = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const postsPerPage = 6;

    const blogPosts = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Stories from the Field: Firsthand Accounts of Disaster Relief",
            description: "Get inside look at the real-life experiences of our teams ground from emergency response.",
            slug: "stories-from-the-field",
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Tips for Disaster Preparedness: How to Stay Safe and Ready",
            description: "Disasters strike unexpectedly you prepared? Explore practical tips and guides to protect.",
            slug: "disaster-preparedness-tips",
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Partnering for Good: The Role of Collaboration in Crisis Relief",
            description: "Relief effort most effective we organization governments, & communities work together.",
            slug: "partnering-for-good",
        },
        {
            id: 4,
            image: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Inspiring Change: Stories of Hope, Impact, and Compassion",
            description: "At the core of our work lies the incredible stories of individuals, families, communities.",
            slug: "inspiring-change-stories",
        },
        {
            id: 5,
            image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Building a Better Future: The Power of Giving and Community Support",
            description: "At the core of every successful community is the power of giving, whether through time.",
            slug: "building-better-future",
        },
        {
            id: 6,
            image: "https://images.unsplash.com/photo-1509099836639-18ba1795216d?w=800",
            date: "16 October 2025",
            author: "Kyle Miller",
            title: "Empowering Change: Stories, Insights, and Updates from Our Mission",
            description: "Welcome to our blog, where every story and update is a testament to the difference.",
            slug: "empowering-change",
        },
        // Add more posts for pagination demo
        {
            id: 7,
            image: "https://images.unsplash.com/photo-1497375530661-5770c4f49eac?w=800",
            date: "15 October 2025",
            author: "Sarah Johnson",
            title: "Educational Initiatives: Empowering the Next Generation",
            description: "Discover how education transforms communities and creates lasting positive change.",
            slug: "educational-initiatives",
        },
        {
            id: 8,
            image: "https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?w=800",
            date: "14 October 2025",
            author: "Michael Chen",
            title: "Clean Water Projects: Transforming Lives One Well at a Time",
            description: "Learn about our clean water initiatives and their impact on rural communities.",
            slug: "clean-water-projects",
        },
    ];

    const totalPages = Math.ceil(blogPosts.length / postsPerPage);
    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPosts = blogPosts.slice(indexOfFirstPost, indexOfLastPost);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-7xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Latest News & Stories
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        Stay updated with our latest initiatives, success stories, and insights from the field.
                    </p>
                </div>

                {/* Blog Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {currentPosts.map((post) => (
                        <BlogCard key={post.id} {...post} />
                    ))}
                </div>

                {/* Pagination */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </section>
    );
};

export default BlogSection;
