

'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';

function AssignedCasesContent() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updatingCase, setUpdatingCase] = useState(null);

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    try {
      const { data } = await api.get('/cases');
      setCases(data.cases);
    } catch (err) {
      setError('Failed to load cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (caseId, status, response) => {
    try {
      await api.put(`/cases/${caseId}/status`, { status, response });
      alert('Case updated successfully!');
      setUpdatingCase(null);
      fetchCases();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update case');
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
          <div className="text-lg">Loading assigned cases...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Assigned Cases</h1>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {cases.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No cases assigned yet.</p>
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
                    {!caseItem.isAnonymous && caseItem.submittedBy && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">Submitted By</p>
                        <p className="text-sm text-gray-900">
                          {caseItem.submittedBy.name || caseItem.submittedBy.email}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Description</p>
                    <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded">
                      {caseItem.description}
                    </p>
                  </div>

                  {caseItem.attachmentUrl && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Attachment</p>
                      <a
                        href={`http://localhost:5000/${caseItem.attachmentUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        View attachment
                      </a>
                    </div>
                  )}

                  {}
                  {caseItem.status !== 'Resolved' && (
                    <div className="mt-6 pt-6 border-t">
                      <h4 className="text-sm font-semibold text-gray-900 mb-4">
                        Update Case Status
                      </h4>

                      {updatingCase === caseItem._id ? (
                        <div className="space-y-4">
                          <div>
                            <Label>New Status</Label>
                            <Select
                              onValueChange={(value) => {
                                const input = document.getElementById(`status-${caseItem._id}`);
                                input.value = value;
                              }}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="In Progress">In Progress</SelectItem>
                                <SelectItem value="Pending">Pending</SelectItem>
                                <SelectItem value="Resolved">Resolved</SelectItem>
                                <SelectItem value="Escalated">Escalated</SelectItem>
                              </SelectContent>
                            </Select>
                            <input
                              type="hidden"
                              id={`status-${caseItem._id}`}
                            />
                          </div>

                          <div>
                            <Label>Response/Notes</Label>
                            <Textarea
                              id={`response-${caseItem._id}`}
                              placeholder="Enter your response or notes..."
                              rows={4}
                            />
                          </div>

                          <div className="flex gap-2">
                            <Button
                              onClick={() => {
                                const statusInput = document.getElementById(`status-${caseItem._id}`);
                                const responseInput = document.getElementById(`response-${caseItem._id}`);

                                if (!statusInput.value) {
                                  alert('Please select a status');
                                  return;
                                }

                                handleStatusUpdate(
                                  caseItem._id,
                                  statusInput.value,
                                  responseInput.value
                                );
                              }}
                            >
                              Update Case
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => setUpdatingCase(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <Button onClick={() => setUpdatingCase(caseItem._id)}>
                          Update Status
                        </Button>
                      )}
                    </div>
                  )}

                  {}
                  {caseItem.response && (
                    <div className="mt-6 bg-blue-50 p-4 rounded-md">
                      <p className="text-sm font-medium text-blue-900 mb-1">Your Response</p>
                      <p className="text-sm text-blue-800">{caseItem.response}</p>
                      {caseItem.lastResponseAt && (
                        <p className="text-xs text-blue-600 mt-2">
                          Updated on {new Date(caseItem.lastResponseAt).toLocaleDateString()}
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

export default function AssignedCasesPage() {
  return (
    <ProtectedRoute allowedRoles={['case_manager']}>
      <AssignedCasesContent />
    </ProtectedRoute>
  );
}
