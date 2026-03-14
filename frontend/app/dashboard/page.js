

'use client';

import { useAuth } from '@/context/AuthContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

function DashboardContent() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Welcome, {user?.name}!
        </h1>

        {}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {}
          {user?.role === 'staff' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Submit Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Report issues or share feedback anonymously or with your name.
                  </p>
                  <Link href="/dashboard/submit">
                    <Button className="w-full">Submit Now</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Track the status of your submitted feedback.
                  </p>
                  <Link href="/dashboard/my-cases">
                    <Button variant="outline" className="w-full">View Cases</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Active Polls</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Vote on company polls and see results.
                  </p>
                  <Link href="/dashboard/polls">
                    <Button variant="outline" className="w-full">View Polls</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {}
          {(user?.role === 'secretariat' || user?.role === 'admin') && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>Manage Cases</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    View all cases and assign to Case Managers.
                  </p>
                  <Link href="/dashboard/cases">
                    <Button className="w-full">View All Cases</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Create Poll</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    Create polls for staff to vote on.
                  </p>
                  <Link href="/dashboard/polls/create">
                    <Button className="w-full">Create Poll</Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">
                    View department heatmaps and case statistics.
                  </p>
                  <Link href="/dashboard/analytics">
                    <Button variant="outline" className="w-full">View Analytics</Button>
                  </Link>
                </CardContent>
              </Card>
            </>
          )}

          {}
          {user?.role === 'case_manager' && (
            <Card>
              <CardHeader>
                <CardTitle>Assigned Cases</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  View and update cases assigned to you.
                </p>
                <Link href="/dashboard/assigned">
                  <Button className="w-full">View Assigned Cases</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        {}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600">Fast</div>
                <div className="text-gray-600">Response Time</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600">Safe</div>
                <div className="text-gray-600">Anonymous Option</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600">Tracked</div>
                <div className="text-gray-600">Every Case</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-orange-600">7 Days</div>
                <div className="text-gray-600">Response SLA</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
