import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { api } from '@/lib/api';
import {
  ChevronLeft,
  Award,
  Target,
  MessageSquare,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

const Summary = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const data = await api.get(`/interviews/${sessionId}/summary`);
        setSession(data);
      } catch {
        navigate('/');
      }
    };
    fetchSession();
  }, [sessionId]);

  if (!session) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse">
        Generating your performance report…
      </div>
    );
  }

  const averageScore =
    session.responses.reduce(
      (acc, curr) => acc + curr.evaluation.score,
      0
    ) / session.responses.length;

  return (
    <div className="container mx-auto max-w-6xl p-6 space-y-10">

      {/* TOP BAR */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Button>
        <Badge variant="outline">
          {session.type} • {session.difficulty}
        </Badge>
      </div>

      {/* PERFORMANCE OVERVIEW */}
      <Card className="rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
        <CardHeader>
          <CardTitle className="text-xl font-medium text-slate-200">
            Performance Overview
          </CardTitle>
        </CardHeader>

        <CardContent className="grid md:grid-cols-4 gap-6">
          {/* Avg Score */}
          <div className="bg-slate-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Award className="h-5 w-5 text-blue-400" />
              <p className="text-sm text-slate-400">Avg Score</p>
            </div>
            <p className="text-4xl font-semibold">
              {averageScore.toFixed(1)}
            </p>
          </div>

          {/* Questions */}
          <div className="bg-slate-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <Target className="h-5 w-5 text-emerald-400" />
              <p className="text-sm text-slate-400">Questions</p>
            </div>
            <p className="text-4xl font-semibold">
              {session.responses.length}
            </p>
          </div>

          {/* Status */}
          <div className="bg-slate-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <MessageSquare className="h-5 w-5 text-indigo-400" />
              <p className="text-sm text-slate-400">Session Status</p>
            </div>
            <p className="text-2xl font-medium capitalize">
              {session.status}
            </p>
          </div>

          {/* Confidence Indicator */}
          <div className="bg-slate-800/70 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="h-5 w-5 text-amber-400" />
              <p className="text-sm text-slate-400">Confidence</p>
            </div>
            <p className="text-2xl font-medium">
              {averageScore > 75 ? 'High' : averageScore > 50 ? 'Medium' : 'Low'}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* INSIGHTS */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-emerald-700">
              <TrendingUp className="h-4 w-4" />
              Strengths
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-2">
            <p>• Clear communication</p>
            <p>• Structured answers</p>
            <p>• Consistent reasoning</p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              Areas to Improve
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-slate-600 space-y-2">
            <p>• Provide more concrete examples</p>
            <p>• Reduce pauses between answers</p>
            <p>• Be more concise</p>
          </CardContent>
        </Card>
      </div>

      {/* BREAKDOWN */}
      <h3 className="text-2xl font-semibold pt-4">
        Question-by-Question Breakdown
      </h3>

      <div className="space-y-6">
        {session.responses.map((resp, idx) => {
          const questionText =
            session.questions.find(
              (q) => q.questionId === resp.questionId
            )?.text || 'Question';

          return (
            <Card
              key={idx}
              className="rounded-2xl border hover:shadow-lg transition-all"
            >
              <CardHeader className="bg-slate-50 border-b">
                <div className="flex justify-between items-start gap-4">
                  <CardTitle className="text-base">
                    Q{idx + 1}: {questionText}
                  </CardTitle>
                  <Badge className="bg-blue-600">
                    {resp.evaluation.score}/100
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="p-6 space-y-4">
                <div>
                  <p className="text-xs uppercase text-slate-400 mb-1">
                    Your Answer
                  </p>
                  <p className="italic text-slate-700">
                    “{resp.responseText}”
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6 border-t pt-4">
                  <div>
                    <p className="text-sm font-semibold text-emerald-700 mb-1">
                      AI Feedback
                    </p>
                    <p className="text-sm text-slate-600">
                      {resp.evaluation.feedback}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-amber-700 mb-1">
                      Improvements
                    </p>
                    <ul className="list-disc list-inside text-sm text-slate-600">
                      {resp.evaluation.improvements.map((imp, i) => (
                        <li key={i}>{imp}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Summary;
