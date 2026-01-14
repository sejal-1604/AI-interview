import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BrainCircuit, History as HistoryIcon, LogOut } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = ({ isLoggedIn = false, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/50 transition-all duration-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 font-medium text-lg tracking-tight text-slate-900 cursor-pointer group" 
          onClick={() => navigate('/')}
        >
          <div className="bg-gradient-to-br from-slate-900 to-slate-700 p-2.5 rounded-xl group-hover:scale-105 transition-transform duration-300">
            <BrainCircuit className="h-5 w-5 text-white" />
          </div>
          <span className="hidden sm:inline group-hover:text-slate-700 transition-colors duration-300">IntervuAI</span>
        </div>
        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/history')} 
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 font-normal transition-all duration-300 backdrop-blur-sm"
                size="sm"
              >
                <HistoryIcon className="h-4 w-4 sm:mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="hidden sm:inline">History</span>
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                  console.log('Logout button clicked');
                  if (onLogout) {
                    onLogout();
                  } else {
                    console.error('onLogout prop not provided');
                  }
                }} 
                className="text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 transition-all duration-300 backdrop-blur-sm"
              >
                <LogOut className="h-4 w-4 hover:scale-110 transition-transform duration-300" />
              </Button>
            </>
          ) : (
            <>
              <Button 
                variant="ghost" 
                onClick={() => navigate('/login')} 
                className="font-normal text-slate-500 hover:text-slate-900 hover:bg-slate-50/80 transition-all duration-300 backdrop-blur-sm"
                size="sm"
              >
                Sign in
              </Button>
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <Button 
                  onClick={() => navigate('/register')}
                  className="relative bg-slate-900 hover:bg-slate-800 text-white font-normal transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-lg border-0"
                  size="sm"
                >
                  Get started
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;