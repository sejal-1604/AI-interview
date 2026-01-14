import React from 'react';
import { BrainCircuit } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12 sm:py-16">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl">
              <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3 font-medium text-base text-slate-900">
                  <div className="bg-slate-900 p-2 rounded-xl">
                    <BrainCircuit className="h-4 w-4 text-white" />
                  </div>
                  <span>IntervuAI</span>
                </div>
                <p className="text-slate-400 text-sm">
                  Built to help you walk into interviews with confidence.
                </p>
                <div className="flex gap-8">
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">
                    Privacy
                  </a>
                  <a href="#" className="text-slate-400 hover:text-slate-900 text-sm transition-colors">
                    Terms
                  </a>
                </div>
              </div>
            </div>
          </footer>
  );
};

export default Footer;