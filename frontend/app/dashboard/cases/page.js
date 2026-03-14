

'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';

function AllCasesContent() {
  const [cases, setCases] = useState([]);
  const [caseManagers, setCaseManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedManagers, setSelectedManagers] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [casesRes, managersRes] = await Promise.all([
        api.get('/cases'),
        api.get('/auth/case-managers')
      ]);

      setCases(casesRes.data.cases);
      setCaseManagers(managersRes.data.caseManagers);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (caseId) => {
    const caseManagerId = selectedManagers[caseId];

    if (!caseManagerId) {
      alert('Please select a case manager');
      return;
    }

    try {
      await api.put(`/cases/${caseId}/assign`, { caseManagerId });
      alert('Case assigned successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign case');
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">All Cases</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {caseManagers.length === 0 && (
          <div className="bg-yellow-50 text-yellow-800 p-4 rounded-md mb-6">
            <p className="font-medium">No case managers found!</p>
            <p className="text-sm mt-1">
              Please create a user with role "case_manager" first.
            </p>
          </div>
        )}

        {cases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No cases found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {cases.map((caseItem) => (
              <Card key={caseItem._id}>
                <CardContent className="py-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {caseItem.trackingId}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(caseItem.status)}`}>
                          {caseItem.status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getSeverityColor(caseItem.severity)}`}>
                          {caseItem.severity}
                        </span>
                      </div>

                      <p className="text-sm text-gray-600 mb-3">{caseItem.description}</p>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                        <div>
                          <span className="font-medium text-gray-700">Category:</span>
                          <span className="ml-1 text-gray-900">{caseItem.category}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Department:</span>
                          <span className="ml-1 text-gray-900">{caseItem.department}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Location:</span>
                          <span className="ml-1 text-gray-900">{caseItem.location}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-700">Submitted:</span>
                          <span className="ml-1 text-gray-900">
                            {new Date(caseItem.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {caseItem.assignedTo && (
                        <div className="mt-3 bg-purple-50 p-3 rounded text-sm">
                          <span className="font-medium text-purple-900">Assigned to:</span>
                          <span className="ml-1 text-purple-800">
                            {caseItem.assignedTo.name} ({caseItem.assignedTo.email})
                          </span>
                        </div>
                      )}
                    </div>

                    {caseItem.status === 'New' && caseManagers.length > 0 && (
                      <div className="ml-4 flex gap-2 items-end">
                        <div className="w-64">
                          <Select
                            onValueChange={(value) => {
                              setSelectedManagers({
                                ...selectedManagers,
                                [caseItem._id]: value
                              });
                            }}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Case Manager" />
                            </SelectTrigger>
                            <SelectContent>
                              {caseManagers.map((manager) => (
                                <SelectItem key={manager._id} value={manager._id}>
                                  {manager.name} - {manager.email}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleAssign(caseItem._id)}
                        >
                          Assign
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function AllCasesPage() {
  return (
    <ProtectedRoute allowedRoles={['secretariat', 'admin']}>
      <AllCasesContent />
    </ProtectedRoute>
  );
}
