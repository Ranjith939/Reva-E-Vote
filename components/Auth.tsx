
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { AcademicCapIcon, EnvelopeIcon, PhoneIcon, UserIcon, ShieldCheckIcon, IdentificationIcon } from '@heroicons/react/24/outline';

interface AuthProps {
  onLogin: (user: UserProfile) => void;
}

export interface UserProfile {
  name: string;
  rollNo: string;
  studentId: string;
  email: string;
  phone: string;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [step, setStep] = useState<'details' | 'otp'>('details');
  const [formData, setFormData] = useState({
    name: '',
    studentId: '',
    email: '',
    phone: ''
  });
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [timer, setTimer] = useState(60);

  // Timer countdown logic
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Regex for R"Year""Branch""RollNumber"
  // E.g., R23CS001, R24ME055
  const rollNoRegex = /^R\d{2}[A-Z0-9]{2,4}\d{3,4}$/i;
  
  // Regex for Reva Email
  const emailRegex = /^[a-zA-Z0-9._%+-]+@reva\.edu\.in$/;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validations
    if (!formData.name || !formData.studentId || !formData.email || !formData.phone) {
      setError("All fields are required.");
      return;
    }

    if (!rollNoRegex.test(formData.studentId)) {
      setError("Invalid Student ID format. Format: R[Year][Branch][Number] (e.g., R23CS001)");
      return;
    }

    if (!emailRegex.test(formData.email)) {
      setError("Please use your verified @reva.edu.in email address.");
      return;
    }

    if (formData.phone.length < 10) {
      setError("Please enter a valid contact number.");
      return;
    }

    // Simulate OTP sent
    setTimer(60);
    setStep('otp');
  };

  const handleResendOtp = () => {
    if (timer > 0) return;
    // Simulate resending OTP
    setTimer(60);
    alert(`OTP has been resent to ${formData.phone}`);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');
    if (otpString.length === 4) {
      // Allow any 4 digit OTP for demo purposes
      
      // Use studentId as rollNo for system compatibility
      const userProfile: UserProfile = {
        ...formData,
        rollNo: formData.studentId
      };
      
      onLogin(userProfile);
    } else {
      setError("Please enter the complete 4-digit OTP.");
    }
  };

  return (
    <div className="w-full">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-zinc-800">
        <div className="bg-reva-orange/10 dark:bg-reva-orange/5 p-6 text-center border-b border-reva-orange/10">
          <div className="w-16 h-16 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
             <img src="https://upload.wikimedia.org/wikipedia/commons/6/6f/Reva_University_logo.png" alt="Reva" className="w-10 h-10 object-contain" onError={(e) => { e.currentTarget.style.display='none'; }} />
             <AcademicCapIcon className="w-8 h-8 text-reva-orange" style={{display: 'none'}} /> 
             {/* Fallback Icon logic handled by hiding img on error and showing icon, simplistic approach here: just overlay icon if no image or standard icon */}
             <ShieldCheckIcon className="w-8 h-8 text-reva-orange" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Student Login</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Reva University E-Voting Portal</p>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}

          {step === 'details' ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Full Name</label>
                <div className="relative">
                  <UserIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange focus:border-transparent outline-none transition-all dark:text-white placeholder-gray-400"
                    placeholder="Enter your name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Student ID</label>
                <div className="relative">
                  <IdentificationIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="text"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange focus:border-transparent outline-none transition-all dark:text-white placeholder-gray-400 uppercase"
                    placeholder="R23CS001"
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1 ml-1">Format: R[Year][Branch][No]</p>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">University Email</label>
                <div className="relative">
                  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange focus:border-transparent outline-none transition-all dark:text-white placeholder-gray-400"
                    placeholder="name@reva.edu.in"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1 ml-1">Contact Number</label>
                <div className="relative">
                  <PhoneIcon className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-zinc-800/50 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange focus:border-transparent outline-none transition-all dark:text-white placeholder-gray-400"
                    placeholder="9999999999"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-gradient-to-r from-reva-orange to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-medium rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.02]"
              >
                Send Verification OTP
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Enter the 4-digit code sent to <br/>
                  <span className="font-medium text-gray-900 dark:text-white">{formData.phone}</span>
                </p>
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange focus:border-reva-orange outline-none dark:text-white"
                    />
                  ))}
                </div>
                
                {/* Resend OTP Logic */}
                <div className="mt-4">
                  {timer > 0 ? (
                    <p className="text-xs text-gray-400">
                      Resend OTP in <span className="font-mono text-gray-600 dark:text-gray-300 font-medium">{timer}s</span>
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      className="text-xs font-medium text-reva-blue hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
                    >
                      Resend OTP
                    </button>
                  )}
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-reva-blue hover:bg-blue-900 text-white font-medium rounded-lg shadow-lg shadow-blue-500/20 transition-all transform hover:scale-[1.02]"
              >
                Verify & Login
              </button>
              
              <button
                type="button"
                onClick={() => setStep('details')}
                className="w-full text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Back to Details
              </button>
            </form>
          )}
        </div>
        
        <div className="p-4 bg-gray-50 dark:bg-zinc-900/50 border-t border-gray-100 dark:border-zinc-800 text-center">
          <p className="text-xs text-gray-400">Restricted to Reva University Students only.</p>
        </div>
      </div>
    </div>
  );
};
