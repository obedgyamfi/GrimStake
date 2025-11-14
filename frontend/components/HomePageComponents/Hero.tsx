export default function Hero() {
    return (
        <section
            className="relative min-h-screen flex flex-col items-center justify-center text-center
                 overflow-hidden px-6 py-20"
        >
            {/* Background gradient and animated glow */}
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
                      from-indigo-900 via-black to-black opacity-90" />
            <div className="absolute inset-0 -z-10">
                <div className="absolute w-[600px] h-[600px] bg-gradient-to-br from-cyan-500/40 to-pink-500/40 
                        blur-3xl rounded-full top-1/3 left-1/4 animate-pulse-slow"></div>
                <div className="absolute w-[400px] h-[400px] bg-gradient-to-tr from-purple-600/40 to-blue-500/40 
                        blur-2xl rounded-full bottom-1/4 right-1/4 animate-pulse-slow"></div>
            </div>

            {/* Glassy container */}
            <div className="relative backdrop-blur-xl bg-white/5 border border-white/10 rounded-3xl 
                      shadow-2xl p-10 max-w-3xl">
                <h1 className="text-6xl md:text-7xl font-extrabold mb-6 
                       bg-clip-text text-transparent bg-gradient-to-r 
                       from-cyan-400 via-purple-500 to-pink-500">
                    Stake. Earn. Evolve.
                </h1>
                <p className="text-gray-300 text-lg md:text-xl mb-10">
                    Welcome to <span className="text-cyan-400 font-semibold">Grim Stake</span> — a
                    decentralized staking platform built for the next era of finance.
                    Stake your tokens, earn passive yield, and watch your assets grow.
                </p>

                <div className="flex flex-wrap justify-center gap-4">
                    <a
                        href="#stake"
                        className="px-8 py-3 text-lg font-semibold rounded-xl 
                       bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 
                       text-white shadow-lg hover:opacity-90 transition-all"
                    >
                        Launch Stake App
                    </a>
                    <a
                        href="/analytics"
                        className="px-8 py-3 text-lg font-semibold rounded-xl border border-white/30 
                       hover:bg-white/10 transition-all text-gray-300"
                    >
                        View Analytics
                    </a>
                </div>
            </div>

            {/* Subtle animated grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_97%,rgba(255,255,255,0.05)_3%)] 
                      bg-[size:100%_40px] pointer-events-none"></div>
        </section>
    );
}
