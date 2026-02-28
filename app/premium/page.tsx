import { getUser } from '@/lib/auth0';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { shouldEnforceEmailVerification, markFirstLoginComplete } from '@/lib/email-verification';

export default async function PremiumPage() {
  const user = await getUser();

  if (!user) {
    redirect('/api/auth/login?returnTo=/premium');
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

  if (!isPremium) {
    // User is authenticated but doesn't have premium role
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Premium Access Required
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              This content is only available to Premium members.
            </p>
            <p className="text-gray-700 mb-8">
              Upgrade your membership to access exclusive workout videos, personalized training plans, and more!
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/members/upgrade"
                className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-lg"
              >
                Upgrade to Premium
              </Link>
              <Link
                href="/members"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold text-lg"
              >
                Back to Members Area
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // User has premium role - show premium content
  const premiumVideos = [
    {
      id: 1,
      title: 'Advanced HIIT Workout',
      description: '30-minute high-intensity interval training for maximum fat burn',
      duration: '30 min',
      level: 'Advanced',
      videoUrl: '/videos/hiit-advanced.mp4',
    },
    {
      id: 2,
      title: 'Yoga for Flexibility',
      description: 'Deep stretching and flexibility routine for all levels',
      duration: '45 min',
      level: 'All Levels',
      videoUrl: '/videos/yoga-flexibility.mp4',
    },
    {
      id: 3,
      title: 'Strength Building Essentials',
      description: 'Build muscle and increase strength with this targeted workout',
      duration: '40 min',
      level: 'Intermediate',
      videoUrl: '/videos/strength-building.mp4',
    },
    {
      id: 4,
      title: 'Core Power Routine',
      description: 'Strengthen your core with this focused ab and back workout',
      duration: '25 min',
      level: 'All Levels',
      videoUrl: '/videos/core-power.mp4',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">Premium Content</h1>
              <p className="text-purple-600 mt-2 font-semibold">
                ⭐ Premium Member
              </p>
            </div>
            <div className="flex gap-4">
              <Link
                href="/members"
                className="px-4 py-2 text-gray-700 hover:text-gray-900 transition"
              >
                Members Area
              </Link>
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
        </div>

        {/* Welcome Message */}
        <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white mb-8">
          <h2 className="text-2xl font-bold mb-2">Welcome to Premium, {user.name || user.email?.split('@')[0]}!</h2>
          <p className="text-lg">
            Enjoy unlimited access to our exclusive workout library, personalized training plans, and premium features.
          </p>
        </div>

        {/* Video Library */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Exclusive Workout Videos</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {premiumVideos.map((video) => (
              <div key={video.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition">
                <div className="aspect-video bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center">
                  <div className="text-white text-6xl">▶️</div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{video.title}</h3>
                  <p className="text-gray-700 mb-4">{video.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4 text-sm text-gray-700">
                      <span>⏱️ {video.duration}</span>
                      <span>📊 {video.level}</span>
                    </div>
                    <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold">
                      Watch Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Premium Features */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📅</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Personal Training</h3>
            <p className="text-gray-700 mb-4">
              Schedule one-on-one sessions with certified trainers
            </p>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition">
              Book Session →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">🥗</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Nutrition Plans</h3>
            <p className="text-gray-700 mb-4">
              Customized meal plans tailored to your fitness goals
            </p>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition">
              View Plans →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">Progress Tracking</h3>
            <p className="text-gray-700 mb-4">
              Advanced analytics and insights on your fitness journey
            </p>
            <button className="text-purple-600 font-semibold hover:text-purple-700 transition">
              View Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
