import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Mic, Sparkles, History as HistoryIcon, BrainCircuit, Target, PlayCircle, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col font-sans overflow-x-hidden">
      <Navbar isLoggedIn={false} />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative py-20 sm:py-32 lg:py-40 bg-gradient-to-b from-white to-slate-100">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
            <div className="text-center space-y-8 sm:space-y-10">
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight leading-[1.15] max-w-4xl mx-auto">
                <span className="text-slate-800">
                  Practice Interviews Like the Real Thing.
                </span>
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-600 to-slate-800">
                  Get Clear, Honest Feedback — Not Guesswork.
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                Simulate real technical and behavioral interviews.  
                Receive structured, actionable feedback on clarity, depth, and confidence — instantly.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-6">
                <Button 
                  size="lg"
                  onClick={() => navigate('/register')}
                  className="w-full sm:w-auto h-12 px-7 rounded-lg text-base font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all"
                >
                  Start free interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  size="lg"
                  variant="outline"
                  onClick={() => navigate('/login')}
                  className="w-full sm:w-auto h-12 px-7 rounded-lg bg-white hover:bg-slate-50 text-slate-600 font-medium text-base border-slate-200 shadow-sm transition-all"
                >
                  Sign in
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Combined Section: What Makes Us Different */}
        <section className="py-20 bg-gradient-to-b from-white to-slate-50">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 text-slate-900">
        See What Makes Us Different
      </h2>
      <p className="text-slate-500 text-base sm:text-lg mb-12">
        Our AI-powered analysis reveals insights you might be missing in your interview performance
      </p>
    </div>

    {/* Evaluation Preview Card */}
    <div className="mb-16">
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xl relative overflow-hidden max-w-4xl mx-auto">
        
        {/* soft highlight */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-slate-100 opacity-60" />

        <div className="flex items-center justify-between mb-8 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-sm">
              <Mic className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-medium text-slate-900">
                Evaluation Preview
              </h3>
              <p className="text-xs text-slate-400">
                Sample AI feedback report
              </p>
            </div>
          </div>
          <div className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-500 text-[10px] font-medium uppercase tracking-wider border border-slate-200">
            Demo
          </div>
        </div>

        <div className="flex items-center justify-center py-12 relative z-10">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
              <Sparkles className="h-8 w-8 text-slate-900" />
            </div>

            <div className="space-y-2 px-4">
              <h4 className="text-xl font-semibold text-slate-900">
                AI-Driven Interview Evaluation
              </h4>
              <p className="text-slate-500 text-sm max-w-xs leading-relaxed mx-auto">
                Your answers are analyzed for communication clarity, technical accuracy, and structure — highlighting strengths and improvement areas.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-200 relative z-10 text-center">
          <p className="text-xs text-slate-400">
            Instant scores and improvement tips generated after every response
          </p>
        </div>

      </div>
    </div>

  </div>
</section>


        {/* Features Section */}
        <section className="py-20 sm:py-32 bg-white">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-slate-900">
        Built to Improve Real Interview Performance
      </h2>
      <p className="text-slate-600 text-base sm:text-lg">
        Not just practice — measurable improvement across every session
      </p>
    </div>
    
    <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
      {[
        { 
          icon: <Mic className="h-5 w-5" />, 
          title: "Accurate Voice Transcription", 
          desc: "Your spoken answers are captured precisely, ensuring feedback is based on what you actually say."
        },
        { 
          icon: <Sparkles className="h-5 w-5" />, 
          title: "Specific, Actionable Feedback", 
          desc: "Understand exactly why an answer worked or failed, with suggestions you can apply immediately."
        },
        { 
          icon: <HistoryIcon className="h-5 w-5" />, 
          title: "Track Interview Progress", 
          desc: "Review past sessions, spot recurring mistakes, and measure improvement over time."
        }
      ].map((feature, i) => (
        <div
          key={i}
          className="
            p-8 rounded-2xl 
            bg-slate-50 
            border border-slate-200 
            hover:bg-white 
            hover:border-slate-300 
            hover:shadow-lg 
            transition-all
          "
        >
          <div className="w-11 h-11 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm mb-6">
            {feature.icon}
          </div>
          <h3 className="text-lg font-semibold text-slate-900 mb-3">
            {feature.title}
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            {feature.desc}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>

        
        <section className="py-20 sm:py-28 relative overflow-hidden bg-white">
  {/* Subtle background */}
  <div className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white" />
  <div className="absolute inset-0 pointer-events-none opacity-[0.035]"
    style={{
      backgroundImage:
        "radial-gradient(circle at 1px 1px, rgb(100 116 139) 1px, transparent 1px)",
      backgroundSize: "48px 48px",
    }}
  />

  <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
    {/* Header */}
    <div className="text-center mb-16">
      <h2 className="text-4xl sm:text-5xl font-semibold text-slate-900 mb-4">
        How It Works
      </h2>
      <p className="text-slate-600 text-lg max-w-2xl mx-auto">
        A simple, focused workflow designed to improve interview performance.
      </p>
    </div>

    {/* Steps */}
    <div className="space-y-6">
      {[
        {
          step: "01",
          title: "Practice Real Interview Questions",
          text:
            "Answer carefully curated technical and behavioral questions based on real hiring scenarios.",
        },
        {
          step: "02",
          title: "Get AI-Powered Evaluation",
          text:
            "Receive instant feedback on clarity, structure, confidence, and technical accuracy.",
        },
        {
          step: "03",
          title: "Review Insights & Improve",
          text:
            "Track progress over time with actionable insights and improvement suggestions.",
        },
      ].map((item, i) => (
        <div
          key={i}
          className="group mx-auto w-full max-w-3xl
                     flex items-start gap-5
                     p-5 sm:p-6
                     rounded-xl
                     bg-white
                     border border-slate-200
                     hover:border-slate-300 hover:shadow-md
                     transition-all duration-300"
        >
          {/* Step number */}
          <div className="flex-shrink-0">
            <div className="w-9 h-9 rounded-full bg-slate-900 text-white
                            flex items-center justify-center
                            text-xs font-medium
                            shadow-sm">
              {item.step}
            </div>
          </div>

          {/* Content */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              {item.title}
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              {item.text}
            </p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>



      
      {/* Footer */}
      <footer className="bg-white border-t border-slate-200">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
      
      {/* Brand */}
      <div className="flex items-center gap-2 text-sm font-medium text-slate-900">
        <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
          <BrainCircuit className="h-4 w-4 text-white" />
        </div>
        <span>IntervuAI</span>
      </div>

      {/* Tagline */}
      <p className="text-xs text-slate-500 text-center">
        Built to help you walk into interviews with confidence.
      </p>

      {/* Links */}
      <div className="flex gap-6 text-xs">
        <a
          href="#"
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          Privacy
        </a>
        <a
          href="#"
          className="text-slate-500 hover:text-slate-900 transition-colors"
        >
          Terms
        </a>
      </div>

    </div>
  </div>
</footer>


      </main>
    </div>
  );
};

export default Landing;
