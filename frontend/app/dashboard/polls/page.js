

'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

function PollsContent() {
  const { user } = useAuth();
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPolls();
  }, []);

  const fetchPolls = async () => {
    try {
      const { data } = await api.get('/polls');
      setPolls(data.polls);
    } catch (err) {
      setError('Failed to load polls');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (pollId, optionIndex) => {
    try {
      await api.post(`/polls/${pollId}/vote`, { optionIndex });


      fetchPolls();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to vote');
    }
  };

  const hasVoted = (poll) => {
    return poll.votedBy.some(voterId => voterId === user._id);
  };

  const getTotalVotes = (poll) => {
    return poll.options.reduce((sum, opt) => sum + opt.votes, 0);
  };

  const getPercentage = (votes, total) => {
    if (total === 0) return 0;
    return ((votes / total) * 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-12">
          <div className="text-lg">Loading polls...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Polls</h1>
          {(user.role === 'secretariat' || user.role === 'admin') && (
            <Button onClick={() => window.location.href = '/dashboard/polls/create'}>
              Create Poll
            </Button>
          )}
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6">
            {error}
          </div>
        )}

        {polls.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-gray-600">No active polls at the moment.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {polls.map((poll) => {
              const totalVotes = getTotalVotes(poll);
              const userHasVoted = hasVoted(poll);

              return (
                <Card key={poll._id}>
                  <CardHeader>
                    <CardTitle>{poll.question}</CardTitle>
                    <p className="text-sm text-gray-500">
                      {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
                      {userHasVoted && ' • You voted'}
                    </p>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {poll.options.map((option, index) => {
                        const percentage = getPercentage(option.votes, totalVotes);

                        return (
                          <div key={index}>
                            {}
                            {!userHasVoted && user.role === 'staff' ? (
                              <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={() => handleVote(poll._id, index)}
                              >
                                {option.text}
                              </Button>
                            ) : (

                              <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                  <span className="font-medium">{option.text}</span>
                                  <span className="text-gray-600">
                                    {option.votes} ({percentage}%)
                                  </span>
                                </div>
                                {}
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                  <div
                                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default function PollsPage() {
  return (
    <ProtectedRoute>
      <PollsContent />
    </ProtectedRoute>
  );
}
