'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function UpgradePage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/upgrade-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to submit request');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Request Submitted!
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              Thank you for your interest in Premium membership.
            </p>
            <p className="text-gray-600 mb-8">
              Our team will review your request and contact you within 24-48 hours to complete your upgrade.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                href="/members"
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold"
              >
                Back to Members Area
              </Link>
              <Link
                href="/"
                className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
              >
                Go Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/members"
            className="text-blue-600 hover:text-blue-700 transition mb-4 inline-block"
          >
            ← Back to Members Area
          </Link>
          <h1 className="text-4xl font-bold text-gray-900">Upgrade to Premium</h1>
          <p className="text-gray-600 mt-2">
            Unlock exclusive features and take your fitness to the next level
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Benefits */}
          <div>
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 rounded-lg shadow-lg p-8 text-white mb-6">
              <h2 className="text-2xl font-bold mb-4">Premium Benefits</h2>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>Unlimited class bookings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>100+ exclusive workout videos</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>Personal training sessions</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>Customized nutrition plans</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>Progress tracking & analytics</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2 text-xl">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
              <div className="mt-6 pt-6 border-t border-white/20">
                <p className="text-3xl font-bold">$49/month</p>
                <p className="text-sm mt-1 opacity-90">Cancel anytime, no commitment</p>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-900">
                <strong>Note:</strong> After submitting your request, our team will contact you to set up payment and activate your premium membership.
              </p>
            </div>
          </div>

          {/* Request Form */}
          <div>
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Request Premium Access</h2>
              
              <form onSubmit={handleSubmit}>
                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <p className="text-gray-600 mb-4">
                    Click below to submit your upgrade request. We'll use your account information to process your upgrade.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting...' : 'Submit Upgrade Request'}
                </button>

                <p className="text-sm text-gray-500 mt-4 text-center">
                  By submitting, you agree to our terms of service
                </p>
              </form>
            </div>

            {/* Testimonial */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="text-4xl">💬</div>
                <div>
                  <p className="text-gray-700 italic mb-2">
                    "Upgrading to Premium was the best decision for my fitness journey. The exclusive workouts and personal training have been game-changers!"
                  </p>
                  <p className="text-sm text-gray-600 font-semibold">
                    — Sarah M., Premium Member
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
