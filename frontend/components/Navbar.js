

'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {}
          <div className="flex items-center space-x-8">
            <Link href="/dashboard" className="text-xl font-bold text-blue-600">
              NeoConnect
            </Link>

            {}
            <div className="hidden md:flex space-x-4">
              {user?.role === 'staff' && (
                <>
                  <Link href="/dashboard/submit" className="text-gray-700 hover:text-blue-600">
                    Submit Feedback
                  </Link>
                  <Link href="/dashboard/my-cases" className="text-gray-700 hover:text-blue-600">
                    My Cases
                  </Link>
                  <Link href="/dashboard/polls" className="text-gray-700 hover:text-blue-600">
                    Polls
                  </Link>
                </>
              )}

              {(user?.role === 'secretariat' || user?.role === 'admin') && (
                <>
                  <Link href="/dashboard/cases" className="text-gray-700 hover:text-blue-600">
                    All Cases
                  </Link>
                  <Link href="/dashboard/polls" className="text-gray-700 hover:text-blue-600">
                    Polls
                  </Link>
                  <Link href="/dashboard/analytics" className="text-gray-700 hover:text-blue-600">
                    Analytics
                  </Link>
                </>
              )}

              {user?.role === 'case_manager' && (
                <Link href="/dashboard/assigned" className="text-gray-700 hover:text-blue-600">
                  Assigned Cases
                </Link>
              )}

              {}
              <Link href="/public" className="text-gray-700 hover:text-blue-600">
                Public Hub
              </Link>
            </div>
          </div>

          {}
          <div className="flex items-center space-x-4">
            <div className="text-sm">
              <div className="font-medium text-gray-900">{user?.name}</div>
              <div className="text-gray-500 capitalize">{user?.role}</div>
            </div>
            <Button onClick={logout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
