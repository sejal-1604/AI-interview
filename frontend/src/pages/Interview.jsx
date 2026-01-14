import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Mic, Send, StopCircle, CheckCircle2, FileText, SkipForward } from 'lucide-react';
import { api } from '@/lib/api';
import { useMemo } from "react";


const Interview = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [answer, setAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState(null);
  const QUESTION_TIME = 90; // seconds
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME);

  const mediaRecorder = useRef(null);
  const chunks = useRef([]);

  useEffect(() => {
    fetchQuestion();
  }, [sessionId]);

  useEffect(() => {
  setTimeLeft(QUESTION_TIME);

  const interval = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(interval);
        console.log("Time is up! You can still submit your answer.");
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [currentQuestion?.currentIndex]);

const timerProgress = useMemo(() => {
  return (timeLeft / QUESTION_TIME) * 100;
}, [timeLeft]);


  const fetchQuestion = async () => {
    try {
      const data = await api.get(`/interviews/${sessionId}/next`);
      setCurrentQuestion(data);
      setFeedback(null);
      setAnswer('');
      setIsRecording(false);
    } catch {
      navigate('/');
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorder.current = new MediaRecorder(stream);
      mediaRecorder.current.ondataavailable = (e) => chunks.current.push(e.data);
      mediaRecorder.current.onstop = handleAudioSubmit;
      chunks.current = [];
      mediaRecorder.current.start();
      setIsRecording(true);
      console.log("Recording started…");
    } catch {
      console.error("Microphone access denied");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current?.state === 'recording') {
      mediaRecorder.current.stop();
      setIsRecording(false);
    }
  };

  const handleAudioSubmit = async () => {
    const audioBlob = new Blob(chunks.current, { type: 'audio/mpeg' });
    const formData = new FormData();
    formData.append('audio', audioBlob, 'response.mp3');

    setIsLoading(true);
    try {
      const updatedSession = await api.postFile(
        `/interviews/${sessionId}/answer-voice`,
        formData
      );
      setSession(updatedSession);
      fetchQuestion();
    } catch {
      console.error("Voice submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitText = async () => {
    if (!answer.trim()) return;
    setIsLoading(true);
    try {
      const updatedSession = await api.post(
        `/interviews/${sessionId}/answer`,
        { responseText: answer }
      );
      setSession(updatedSession);
      fetchQuestion();
    } catch {
      console.error("Submission failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkipQuestion = async () => {
  if (!window.confirm("Skip this question and move to the next one?")) return;
  setIsLoading(true);
  try {
    // Submit empty response to skip
    const updatedSession = await api.post(`/interviews/${sessionId}/answer`, {
      responseText: "Question skipped by user"
    });
    setSession(updatedSession);
    console.log("Question skipped");
    fetchQuestion();
  } catch {
    console.error("Could not skip question");
  } finally {
    setIsLoading(false);
  }
};

  const handleFinishInterview = async () => {
    if (!window.confirm("Finish interview and view results?")) return;
    try {
      await api.post(`/interviews/${sessionId}/answer`, {
        response: "Interview completed by user"
      });
      navigate(`/interview/${sessionId}/summary`);
    } catch {
      console.error("Could not finish interview");
    }
  };

  if (!currentQuestion) {
    return (
      <div className="p-16 text-center text-slate-500 animate-pulse">
        Preparing your interview…
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-5xl p-6 space-y-8">

  {/* HEADER */}
  <div className="flex items-center justify-between">
    <h1 className="text-2xl font-semibold text-slate-900">
      Interview Session
    </h1>

    {/* TIMER */}
    <div className="flex items-center gap-4">
      <div className="text-right">
        <p className="text-xs text-slate-500">Time left</p>
        <p className={`text-lg font-semibold ${timeLeft < 15 ? "text-red-600 animate-pulse" : "text-slate-900"}`}>
          {timeLeft}s
        </p>
      </div>
      <div className="w-32">
        <Progress value={timerProgress} />
      </div>
    </div>
  </div>

  {/* QUESTION CARD */}
  <Card className="relative rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 opacity-70" />

    <CardHeader className="relative z-10">
      <CardTitle className="text-sm text-slate-500">
        Question {currentQuestion.currentIndex + 1} / {currentQuestion.totalQuestions}
      </CardTitle>
    </CardHeader>

    <CardContent className="relative z-10 space-y-6">
      <div className="flex items-start gap-3">
        <p className="text-xl font-medium text-slate-900 leading-relaxed flex-1">
          {currentQuestion.question.text}
        </p>
        {session?.resumeText && (
          <div className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            <FileText className="h-3 w-3" />
            Resume-based
          </div>
        )}
      </div>

      {/* ANSWER INPUT */}
      <Textarea
        placeholder="Type your answer or use voice input…"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        className="min-h-[160px] text-base bg-white border-slate-300"
        disabled={isLoading}
      />

      {/* RECORDING WAVEFORM */}
      {isRecording && (
        <div className="flex items-center justify-center gap-1 h-10">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="w-1 bg-emerald-500 rounded-full animate-pulse"
              style={{
                height: `${Math.random() * 30 + 10}px`,
                animationDelay: `${i * 0.1}s`
              }}
            />
          ))}
        </div>
      )}

      {/* ACTION BAR */}
      <div className="flex items-center justify-between gap-4 pt-2">

        {/* LEFT ACTIONS */}
        <div className="flex gap-3">
          <Button
            onClick={handleSubmitText}
            disabled={isLoading || !answer.trim()}
            className="h-12 px-6 bg-slate-900 hover:bg-slate-800 text-white shadow-lg transition-all hover:-translate-y-0.5"
          >
            <Send className="mr-2 h-4 w-4" />
            Submit
          </Button>

          {!isRecording ? (
            <Button
              onClick={startRecording}
              className="h-12 px-6 bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg transition-all hover:scale-[1.03]"
            >
              <Mic className="mr-2 h-4 w-4" />
              Record
            </Button>
          ) : (
            <Button
              onClick={stopRecording}
              className="h-12 px-6 bg-red-600 hover:bg-red-700 text-white shadow-xl animate-pulse"
            >
              <StopCircle className="mr-2 h-4 w-4" />
              Stop
            </Button>
          )}

          <Button
            onClick={handleSkipQuestion}
            disabled={isLoading}
            className="h-12 px-6 bg-amber-50 text-amber-600 border border-amber-200 hover:bg-amber-100 hover:text-amber-700 transition-all"
            variant="outline"
          >
            <SkipForward className="mr-2 h-4 w-4" />
            Skip
          </Button>
        </div>

        {/* FINISH BUTTON (RIGHT) */}
        <Button
          onClick={handleFinishInterview}
          className="h-12 px-6 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 hover:text-red-700 transition-all"
          variant="outline"
        >
          Finish Interview
        </Button>
      </div>

      {isLoading && (
        <p className="text-center text-sm text-blue-600 animate-pulse">
          AI is analyzing your response…
        </p>
      )}
    </CardContent>
  </Card>
</div>

  );
};

export default Interview;
