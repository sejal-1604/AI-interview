import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from '@/lib/api';
import { Calendar, ChevronRight, History as HistoryIcon } from 'lucide-react';

const History = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await api.get('/interviews/history');
        setSessions(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse">
        Loading your interview history…
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-10">
        <div className="p-2 rounded-xl bg-slate-900 text-white shadow-md">
          <HistoryIcon size={20} />
        </div>
        <h1 className="text-3xl font-semibold text-slate-900">
          Practice History
        </h1>
      </div>

      {sessions.length === 0 ? (
        <Card className="text-center p-14 bg-white border border-slate-200 shadow-sm">
          <p className="text-slate-500 mb-6">
            You haven’t completed any interviews yet.
          </p>
          <Button
            onClick={() => navigate('/')}
            className="relative overflow-hidden rounded-xl px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 shadow-lg transition-all"
          >
            Start Your First Session
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6">
          {sessions.map((session) => {
            const avgScore =
              session.responses.length > 0
                ? (
                    session.responses.reduce(
                      (acc, r) => acc + r.evaluation.score,
                      0
                    ) / session.responses.length
                  ).toFixed(1)
                : 'N/A';

            return (
              <div
                key={session._id}
                className="relative group"
                onClick={() =>
                  navigate(`/interview/${session._id}/summary`)
                }
              >
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500/40 to-purple-500/40 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />

                <Card className="relative bg-white rounded-2xl border border-slate-200 shadow-sm transition-all duration-500 cursor-pointer group-hover:shadow-xl group-hover:-translate-y-1">
                  <CardContent className="p-6 flex items-center justify-between">
                    {/* Left */}
                    <div className="flex items-center gap-6">
                      {/* Score */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 blur opacity-40 group-hover:opacity-70 transition-all" />
                        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-slate-900 to-slate-700 text-white font-semibold text-xl flex items-center justify-center shadow-inner">
                          {avgScore}
                        </div>
                      </div>

                      {/* Info */}
                      <div>
                        <h3 className="text-lg font-semibold text-slate-900">
                          {session.type} Interview
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                          <Calendar size={14} />
                          {new Date(session.createdAt).toLocaleDateString()}
                          <span className="mx-1">•</span>
                          <Badge
                            variant="secondary"
                            className="uppercase text-[10px] tracking-wide"
                          >
                            {session.difficulty}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-2 text-slate-600 font-medium transition-all duration-300 group-hover:text-slate-900">
                      View Report
                      <ChevronRight
                        size={18}
                        className="transition-transform duration-300 group-hover:translate-x-1"
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default History;
