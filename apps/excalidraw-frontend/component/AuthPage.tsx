"use client"

export function AuthPage({isSignin}: {isSignin: boolean}) {
    return (
        <div className="grid grid-rows-[auto_1fr_auto] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-sans">
            <h1 className="text-3xl font-bold text-center text-white-800">
                {isSignin ? "Sign In" : "Sign Up"}
            </h1>

            <form
                className="flex flex-col items-center justify-center gap-6 w-full max-w-sm"
                onSubmit={(e) => {
                e.preventDefault();
                // handle form submit
                }}
            >
                <div className="w-full">
                <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">
                    Email
                </label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                <div className="w-full">
                <label htmlFor="password" className="block mb-1 text-sm font-medium text-gray-700">
                    Password
                </label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
                </div>

                <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition-colors"
                >
                {isSignin ? "Sign In" : "Sign Up"}
                </button>
            </form>
        </div>
    );
    }