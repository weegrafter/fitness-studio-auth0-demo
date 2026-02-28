import { getUser } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { shouldEnforceEmailVerification, markFirstLoginComplete } from '@/lib/email-verification';

export default async function MembersPage() {
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login?returnTo=/members');
  }

  // Check email verification
  const { shouldEnforce, isFirstLogin } = await shouldEnforceEmailVerification();
  
  if (shouldEnforce) {
    redirect('/verify-email');
  }

  // Mark first login complete if this is the first time
  if (isFirstLogin && user.sub) {
    await markFirstLoginComplete(user.sub);
  }

  const isPremium = user.roles?.includes('premium');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold text-gray-900">Members Area</h1>
            <div className="flex gap-4">
              <Link
                href="/"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Home
              </Link>
              <a
                href="/api/auth/logout"
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
              >
                Logout
              </a>
            </div>
          </div>
          <p className="text-gray-700 mt-2">
            Welcome back, {user.name || user.email}!
          </p>
        </div>

        {/* Member Status Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Your Membership</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg">
                Status: <span className="font-semibold">{isPremium ? 'Premium Member' : 'Free Member'}</span>
              </p>
              <p className="text-gray-700 mt-1">
                Email: {user.email}
                {user.email_verified && (
                  <span className="ml-2 text-green-600 text-sm">✓ Verified</span>
                )}
              </p>
            </div>
            {!isPremium && (
              <Link
                href="/members/upgrade"
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold"
              >
                Upgrade to Premium
              </Link>
            )}
          </div>
        </div>

        {/* Class Schedule */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">This Week's Classes</h2>
          <div className="space-y-4">
            {[
              { day: 'Monday', time: '6:00 AM', class: 'Morning Yoga', spots: 5 },
              { day: 'Monday', time: '6:00 PM', class: 'HIIT Training', spots: 3 },
              { day: 'Wednesday', time: '7:00 AM', class: 'Spin Class', spots: 8 },
              { day: 'Wednesday', time: '7:00 PM', class: 'Pilates', spots: 2 },
              { day: 'Friday', time: '6:00 AM', class: 'Strength Training', spots: 6 },
              { day: 'Saturday', time: '9:00 AM', class: 'Yoga Flow', spots: 10 },
            ].map((session, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition">
                <div>
                  <p className="font-semibold text-gray-900">{session.class}</p>
                  <p className="text-gray-700 text-sm">{session.day} at {session.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-700">{session.spots} spots left</p>
                  <button className="mt-1 px-4 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition">
                    Book
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Premium CTA */}
        {!isPremium && (
          <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white">
            <h2 className="text-3xl font-bold mb-4">Unlock Premium Content</h2>
            <p className="text-lg mb-6">
              Get access to exclusive workout videos, unlimited class bookings, and personalized training plans for just $49/month
            </p>
            <ul className="space-y-2 mb-6">
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Unlimited class bookings</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>100+ exclusive workout videos</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Personal training sessions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">✓</span>
                <span>Nutrition planning & tracking</span>
              </li>
            </ul>
            <Link
              href="/members/upgrade"
              className="inline-block px-8 py-3 bg-white text-purple-600 rounded-lg hover:bg-gray-100 transition font-semibold text-lg"
            >
              Request Premium Access
            </Link>
          </div>
        )}

        {/* Premium Link */}
        {isPremium && (
          <div className="text-center">
            <Link
              href="/premium"
              className="inline-block px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
            >
              Access Premium Content →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
