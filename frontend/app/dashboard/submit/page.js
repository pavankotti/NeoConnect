

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import api from '@/lib/api';

function SubmitCaseContent() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    category: '',
    department: '',
    location: '',
    severity: 'Low',
    description: '',
    isAnonymous: false
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];


    if (selectedFile && selectedFile.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB');
      e.target.value = '';
      return;
    }


    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (selectedFile && !allowedTypes.includes(selectedFile.type)) {
      setError('Only .jpg, .png, and .pdf files are allowed');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {

      const formDataToSend = new FormData();


      formDataToSend.append('category', formData.category);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('location', formData.location);
      formDataToSend.append('severity', formData.severity);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('isAnonymous', formData.isAnonymous);


      if (file) {
        formDataToSend.append('attachment', file);
      }


      const { data } = await api.post('/cases', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setSuccess(`Case submitted successfully! Tracking ID: ${data.case.trackingId}`);


      setFormData({
        category: '',
        department: '',
        location: '',
        severity: 'Low',
        description: '',
        isAnonymous: false
      });
      setFile(null);


      setTimeout(() => {
        router.push('/dashboard/my-cases');
      }, 2000);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit case');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Submit Feedback or Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">

              {}
              {success && (
                <div className="bg-green-50 text-green-700 p-4 rounded-md">
                  {success}
                </div>
              )}

              {}
              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-md">
                  {error}
                </div>
              )}

              {}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Safety">Safety</SelectItem>
                    <SelectItem value="Policy">Policy</SelectItem>
                    <SelectItem value="Facilities">Facilities</SelectItem>
                    <SelectItem value="HR">HR</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {}
              <div>
                <Label htmlFor="department">Department *</Label>
                <Input
                  id="department"
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Engineering, Sales, HR"
                />
              </div>

              {}
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="e.g., Building A, Floor 3"
                />
              </div>

              {}
              <div>
                <Label htmlFor="severity">Severity</Label>
                <Select
                  value={formData.severity}
                  onValueChange={(value) => setFormData({ ...formData, severity: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {}
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="Please provide detailed information about your feedback or complaint..."
                  className="resize-none"
                />
              </div>

              {}
              <div>
                <Label htmlFor="attachment">Attachment (Optional)</Label>
                <Input
                  id="attachment"
                  type="file"
                  onChange={handleFileChange}
                  accept=".jpg,.jpeg,.png,.pdf"
                  className="cursor-pointer"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Max 5MB. Allowed: .jpg, .png, .pdf
                </p>
                {file && (
                  <p className="text-sm text-green-600 mt-1">
                    Selected: {file.name}
                  </p>
                )}
              </div>

              {}
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isAnonymous"
                  name="isAnonymous"
                  checked={formData.isAnonymous}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 rounded"
                />
                <Label htmlFor="isAnonymous" className="cursor-pointer">
                  Submit anonymously
                </Label>
              </div>

              {}
              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Feedback'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SubmitCasePage() {
  return (
    <ProtectedRoute allowedRoles={['staff']}>
      <SubmitCaseContent />
    </ProtectedRoute>
  );
}
