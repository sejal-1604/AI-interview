import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, History as HistoryIcon, TrendingUp, Upload, FileText } from 'lucide-react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from '@/lib/api';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Dashboard = ({ onLogout }) => {
  const navigate = useNavigate();
  const [config, setConfig] = useState({ type: 'Technical', difficulty: 'Mid' });
  const [stats, setStats] = useState({ total: 0, avg: 0 });
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchQuickStats();
  }, []);

  const fetchQuickStats = async () => {
    try {
      const history = await api.get('/interviews/history');
      if (history.length > 0) {
        const scores = history.flatMap(s => s.responses.map(r => r.evaluation.score));
        const avg = scores.length ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : 0;
        setStats({ total: history.length, avg });
      }
    } catch {
      console.error("Stats fetch failed");
    }
  };

  const handleStart = async () => {
    try {
      const session = await api.post('/interviews/start', {
        ...config,
        resumeText: resumeText || null,
        jobRole: 'Software Engineer' // Can be made configurable
      });
      navigate(`/interview/${session._id}`);
    } catch {
      console.error("Unable to start interview");
    }
  };

  const handleResumeUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
      console.error("Please upload a PDF, Word document (.doc/.docx), or text file (.txt)");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      console.error("File size must be less than 5MB");
      return;
    }

    setResumeFile(file);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await api.postFile('/interviews/parse-resume', formData);
      setResumeText(response.parsedText);
      console.log("Resume uploaded successfully! Questions will be tailored to your experience.");
    } catch (error) {
      console.error("Failed to parse resume. You can still start the interview.");
      setResumeFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      <Navbar isLoggedIn onLogout={onLogout} />

      <main className="flex-grow">
        <div className="max-w-6xl mx-auto px-6 py-14 space-y-12">

          {/* HEADER */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold">Your Dashboard</h1>
            <p className="text-slate-500">
              Practice interviews, track progress, and improve consistently.
            </p>
          </div>

          {/* HERO PANEL */}
          <Card className="p-10 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-xl">
            <div className="grid md:grid-cols-2 gap-10 items-center">

              <div className="space-y-6">
                <h2 className="text-2xl font-semibold">
                  Start a New Mock Interview
                </h2>
                <p className="text-slate-300 leading-relaxed">
                  Simulate a real interview experience and receive structured AI feedback
                  on clarity, depth, and confidence.
                </p>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Select
                    value={config.type}
                    onValueChange={(v) => setConfig({ ...config, type: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Technical">Technical</SelectItem>
                      <SelectItem value="Behavioral">Behavioral</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={config.difficulty}
                    onValueChange={(v) => setConfig({ ...config, difficulty: v })}
                  >
                    <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Entry">Entry (0-2 years)</SelectItem>
                      <SelectItem value="Mid">Mid (2-5 years)</SelectItem>
                      <SelectItem value="Senior">Senior (5+ years)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Resume Upload Section */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Label className="text-white text-sm font-medium">Upload Resume (Optional)</Label>
                    {resumeFile && <FileText className="h-4 w-4 text-green-400" />}
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt"
                      onChange={handleResumeUpload}
                      className="bg-slate-800 border-slate-700 text-white file:text-white file:bg-slate-700 file:border-0"
                      disabled={isUploading}
                    />
                    {isUploading && (
                      <div className="text-white text-sm animate-pulse">Parsing...</div>
                    )}
                  </div>
                  
                  {resumeText && (
                    <div className="bg-slate-800/50 p-3 rounded-lg">
                      <p className="text-green-400 text-sm">
                        ✓ Resume uploaded successfully! Questions will be tailored to your experience.
                      </p>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleStart}
                  className="h-12 px-6 bg-white text-slate-900 hover:bg-slate-200 font-medium rounded-xl"
                >
                  <Play className="mr-2 h-4 w-4" />
                  Start Interview
                </Button>
              </div>

              {/* STATS */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-slate-800/70 p-6 rounded-2xl">
                  <p className="text-xs uppercase text-slate-400 mb-2">Sessions</p>
                  <p className="text-3xl font-semibold">{stats.total}</p>
                </div>

                <div className="bg-slate-800/70 p-6 rounded-2xl">
                  <p className="text-xs uppercase text-slate-400 mb-2">Avg Score</p>
                  <p className="text-3xl font-semibold">{stats.avg}</p>
                </div>
              </div>

            </div>
          </Card>

          {/* SECONDARY ACTIONS */}
          <div className="grid md:grid-cols-2 gap-8">

            <Card className="p-6 rounded-2xl border">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="h-5 w-5 text-slate-600" />
                <h3 className="font-semibold">Quick Tips</h3>
              </div>
              <ul className="text-sm text-slate-600 space-y-2">
                <li>• Structure answers using STAR</li>
                <li>• Speak clearly and concisely</li>
                <li>• Review feedback after every session</li>
              </ul>
            </Card>

            <Card className="p-6 rounded-2xl border flex items-center justify-between">
              <div>
                <h3 className="font-semibold">Interview History</h3>
                <p className="text-sm text-slate-500">
                  Review past sessions and track progress.
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/history')}
                className="rounded-xl"
              >
                <HistoryIcon className="mr-2 h-4 w-4" />
                View
              </Button>
            </Card>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
