

'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

function MyCasesContent() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      setCases(data.cases);
    } catch (err) {
      setError('Failed to load cases');
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
    const colors = {
      'New': 'bg-blue-100 text-blue-800',
      'Assigned': 'bg-purple-100 text-purple-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'Pending': 'bg-orange-100 text-orange-800',
      'Resolved': 'bg-green-100 text-green-800',
      'Escalated': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getSeverityColor = (severity) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800'
    };
    return colors[severity] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading cases...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Cases</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {cases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No cases found. Submit your first feedback!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <Card key={caseItem._id}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {caseItem.trackingId}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Submitted on {new Date(caseItem.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(caseItem.severity)}`}>
                        {caseItem.severity}
                      </span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Category</p>
                      <p className="text-sm text-gray-900">{caseItem.category}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Department</p>
                      <p className="text-sm text-gray-900">{caseItem.department}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Location</p>
                      <p className="text-sm text-gray-900">{caseItem.location}</p>
                    </div>
                    {caseItem.assignedTo && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Assigned To</p>
                        <p className="text-sm text-gray-900">{caseItem.assignedTo.name}</p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {caseItem.description}
                    </p>
                  </div>

                  {caseItem.response && (
                    <div className="bg-blue-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-blue-900 mb-1">Response</p>
                      <p className="text-sm text-blue-800">{caseItem.response}</p>
                      {caseItem.lastResponseAt && (
                        <p className="text-xs text-blue-600 mt-2">
                          Responded on {new Date(caseItem.lastResponseAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MyCasesPage() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <MyCasesContent />
    </ProtectedRoute>
  );
}
