

'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

function AnalyticsContent() {
  const [stats, setStats] = useState({
    total: 0,
    byStatus: {},
    byCategory: {},
    byDepartment: {}
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await api.get('/cases');
      const cases = data.cases;


      const byStatus = {};
      const byCategory = {};
      const byDepartment = {};

      cases.forEach(c => {
        byStatus[c.status] = (byStatus[c.status] || 0) + 1;
        byCategory[c.category] = (byCategory[c.category] || 0) + 1;
        byDepartment[c.department] = (byDepartment[c.department] || 0) + 1;
      });

      setStats({
        total: cases.length,
        byStatus,
        byCategory,
        byDepartment
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Analytics</h1>

        <div className="grid md:grid-cols-3 gap-6">
          {}
          <Card>
            <CardHeader>
              <CardTitle>By Status</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(stats.byStatus).map(([status, count]) => (
                <div key={status} className="flex justify-between py-2 border-b">
                  <span>{status}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>By Category</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(stats.byCategory).map(([category, count]) => (
                <div key={category} className="flex justify-between py-2 border-b">
                  <span>{category}</span>
                  <span className="font-bold">{count}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          {}
          <Card>
            <CardHeader>
              <CardTitle>By Department (Hotspots)</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.entries(stats.byDepartment)
                .sort((a, b) => b[1] - a[1])
                .map(([dept, count]) => (
                  <div key={dept} className="flex justify-between py-2 border-b">
                    <span>{dept}</span>
                    <span className={`font-bold ${count >= 5 ? 'text-red-600' : ''}`}>
                      {count} {count >= 5 && '🔥'}
                    </span>
                  </div>
                ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  return (
    <ProtectedRoute allowedRoles={['secretariat', 'admin']}>
      <AnalyticsContent />
    </ProtectedRoute>
  );
}
