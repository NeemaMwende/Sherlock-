import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-purple-700">
            Sherlock Law Firm
          </h1>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-purple-600 hover:text-purple-800"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to Sherlock
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your trusted legal partner. Access your secure client portal to
            manage cases, documents, and communicate with our legal team.
          </p>
          <Link
            href="/login"
            className="inline-block bg-purple-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700 transition"
          >
            Access Portal
          </Link>
        </div>
      </main>
    </div>
  );
}
