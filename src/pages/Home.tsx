const Home = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-700 px-6">
            <div className="text-center max-w-4xl">
                <h1 className="text-6xl font-bold text-white mb-6">Welcome to Uburumultimotive</h1>
                <p className="text-xl text-white/90 mb-8">
                    Making a difference in communities through innovative programs and dedicated service.
                </p>
                <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-4 rounded-full transition-all duration-300">
                    Get Started
                </button>
            </div>
        </div>
    );
};

export default Home;
