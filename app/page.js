'use client';

import Navbar from './components/Navbar';

export default function Home() {
    return (
        <>
            <Navbar />
            <div className="bg-gray-100 min-h-screen p-20">
                {/* Hero Section */}
                <div className="flex flex-col items-center justify-center text-center py-20 bg-white">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-800">
                        View Barangays Development and Latest News
                    </h1>
                    <p className="text-gray-600 mt-4 text-lg">
                        Stay updated with the latest projects, events, and community services from your barangays.
                    </p>
                    <button
                        className="mt-6 px-6 py-3 bg-blue-600 text-white text-lg font-semibold rounded hover:bg-blue-700 transition"
                        onClick={() => window.location.href = '/barangays'}
                    >
                        Browse Barangays
                    </button>
                </div>

                {/* Browse Barangays Section */}
                <div className="py-16 px-6 md:px-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-800">
                        Explore Barangays
                    </h2>
                    <p className="text-center text-gray-600 mt-2">
                        Click on a barangay to learn more about its progress and updates.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Payatas
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Discover ongoing projects and services in Payatas.
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
                                onClick={() => window.location.href = '/barangay/payatas'}
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Bagong Silangan
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Stay informed about the latest news in Bagong Silangan.
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
                                onClick={() => window.location.href = '/barangay/bagong-silangan'}
                            >
                                Learn More
                            </button>
                        </div>
                        <div className="bg-white shadow rounded-lg p-6 text-center hover:shadow-lg transition">
                            <h3 className="text-xl font-semibold text-gray-800">
                                Other Barangays
                            </h3>
                            <p className="text-gray-600 mt-2">
                                Explore updates from other barangays in your area.
                            </p>
                            <button
                                className="mt-4 px-4 py-2 bg-blue-500 text-white text-sm font-semibold rounded hover:bg-blue-600 transition"
                                onClick={() => window.location.href = '/barangays'}
                            >
                                Learn More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
