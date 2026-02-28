import { getUser } from '@/lib/auth0';
import Link from 'next/link';

export default async function Home() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            FitFlow Studio
          </h1>
          <p className="text-xl text-gray-700">
            Your journey to wellness starts here
          </p>
        </header>

        {/* Auth Status */}
        <div className="max-w-2xl mx-auto mb-12 p-6 bg-white rounded-lg shadow-md">
          {user ? (
            <div className="text-center">
              <p className="text-lg text-gray-900 mb-4">
                Welcome back, <span className="font-semibold">{user.name || user.email}</span>!
              </p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/members"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Members Area
                </Link>
                {user.roles?.includes('premium') && (
                  <Link
                    href="/premium"
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                  >
                    Premium Content
                  </Link>
                )}
                <a
                  href="/api/auth/logout"
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
                >
                  Logout
                </a>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-lg text-gray-900 mb-4">Ready to transform your fitness journey?</p>
              <a
                href="/api/auth/login"
                className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
              >
                Sign In / Sign Up
              </a>
            </div>
          )}
        </div>

        {/* Membership Tiers */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-gray-900">
            Membership Tiers
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier */}
            <div className="bg-white p-8 rounded-lg shadow-md">
              <h3 className="text-2xl font-bold mb-4 text-blue-600">Free Member</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span class="text-gray-900">Access to class schedules</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span class="text-gray-900">Book up to 3 classes per week</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span class="text-gray-900">Community forum access</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  <span class="text-gray-900">Monthly wellness newsletter</span>
                </li>
              </ul>
              <p className="text-3xl font-bold text-gray-900">Free</p>
            </div>

            {/* Premium Tier */}
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-8 rounded-lg shadow-lg text-white">
              <h3 className="text-2xl font-bold mb-4">Premium Member</h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Unlimited class bookings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Exclusive workout videos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Personal training sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">✓</span>
                  <span>Nutrition planning tools</span>
                </li>
              </ul>
              <p className="text-3xl font-bold">$49/month</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        {!user && (
          <div className="max-w-2xl mx-auto mt-16 text-center">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">
              Join Our Community Today
            </h2>
            <p className="text-gray-700 mb-6">
              Start with a free membership and upgrade anytime to unlock premium features
            </p>
            <a
              href="/api/auth/login"
              className="inline-block px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-lg font-semibold"
            >
              Get Started Free
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
