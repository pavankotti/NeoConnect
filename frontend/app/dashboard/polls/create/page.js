

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';

function CreatePollContent() {
  const router = useRouter();
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addOption = () => {
    setOptions([...options, '']);
  };

  const removeOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');


    if (!question.trim()) {
      setError('Question is required');
      return;
    }

    const filledOptions = options.filter(opt => opt.trim() !== '');
    if (filledOptions.length < 2) {
      setError('At least 2 options are required');
      return;
    }

    setLoading(true);

    try {
      await api.post('/polls', {
        question,
        options: filledOptions
      });

      alert('Poll created successfully!');
      router.push('/dashboard/polls');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create poll');
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
            <CardTitle className="text-2xl">Create New Poll</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <Label>Poll Question</Label>
                <Input
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., What improvement would you like to see first?"
                  required
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <Label>Options</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                  >
                    Add Option
                  </Button>
                </div>

                {options.map((option, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={option}
                      onChange={(e) => updateOption(index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      required
                    />
                    {options.length > 2 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeOption(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading}>
                  {loading ? 'Creating...' : 'Create Poll'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/dashboard/polls')}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function CreatePollPage() {
  return (
    <ProtectedRoute allowedRoles={['secretariat', 'admin']}>
      <CreatePollContent />
    </ProtectedRoute>
  );
}
