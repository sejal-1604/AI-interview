import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { api } from '@/lib/api';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      console.log('Registering with data:', formData);
      const data = await api.post('/auth/register', formData);
      console.log('Registration response:', data);
      
      console.log("Account created successfully! Please login.");
      navigate('/login');
    } catch (error) {
      console.error('Registration error:', error);
      console.log("Registration failed.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 p-4 relative overflow-hidden">
      {/* Subtle animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/20 via-purple-50/20 to-slate-50/20"></div>
      
      <Card className="w-full max-w-md bg-white/60 backdrop-blur-sm border-slate-200/50 hover:bg-white/80 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative z-10">
        <CardHeader className="space-y-4">
          <div className="text-center space-y-2">
            <CardTitle className="text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">Create Account</CardTitle>
            <CardDescription className="text-slate-500">Join our platform and improve your interview skills</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">First Name</label>
                <Input 
                  value={formData.firstName} 
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})} 
                  required 
                  className="h-11 rounded-xl border-slate-200/50 bg-white/80 backdrop-blur-sm hover:bg-white focus:border-slate-400 focus:ring-0 transition-colors duration-300"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-600">Last Name</label>
                <Input 
                  value={formData.lastName} 
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})} 
                  required 
                  className="h-11 rounded-xl border-slate-200/50 bg-white/80 backdrop-blur-sm hover:bg-white focus:border-slate-400 focus:ring-0 transition-colors duration-300"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Email</label>
              <Input 
                type="email" 
                value={formData.email} 
                onChange={(e) => setFormData({...formData, email: e.target.value})} 
                required 
                className="h-11 rounded-xl border-slate-200/50 bg-white/80 backdrop-blur-sm hover:bg-white focus:border-slate-400 focus:ring-0 transition-colors duration-300"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-600">Password</label>
              <Input 
                type="password" 
                value={formData.password} 
                onChange={(e) => setFormData({...formData, password: e.target.value})} 
                required 
                className="h-11 rounded-xl border-slate-200/50 bg-white/80 backdrop-blur-sm hover:bg-white focus:border-slate-400 focus:ring-0 transition-colors duration-300"
              />
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
              <Button 
                type="submit" 
                className="relative w-full h-12 rounded-xl text-base font-normal bg-slate-900 hover:bg-slate-800 text-white transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-2xl border-0"
              >
                Sign Up
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-slate-600">
            Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300">Login</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Register;