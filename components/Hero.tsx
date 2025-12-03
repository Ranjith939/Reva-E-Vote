
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';
import { 
  ShieldCheckIcon, 
  ChartBarIcon, 
  UserGroupIcon, 
  AcademicCapIcon, 
  FingerPrintIcon, 
  DevicePhoneMobileIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface HeroProps {
  onStart: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <nav className="w-full px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full z-20 relative">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-reva-orange rounded-lg flex items-center justify-center text-white">
            <AcademicCapIcon className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Reva<span className="text-reva-orange">Vote</span>
          </span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600 dark:text-gray-400">
          <a href="#" className="hover:text-reva-orange transition-colors">How it works</a>
          <a href="#" className="hover:text-reva-orange transition-colors">Candidates</a>
          <a href="#" className="hover:text-reva-orange transition-colors">Results</a>
        </div>
        <button 
          onClick={onStart}
          className="px-5 py-2 text-sm font-semibold text-white bg-gray-900 dark:bg-white dark:text-gray-900 rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all"
        >
          Student Login
        </button>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 py-20 relative overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-reva-orange/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 dark:bg-orange-900/20 text-reva-orange text-xs font-bold uppercase tracking-wider mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <span className="w-2 h-2 rounded-full bg-reva-orange animate-pulse"></span>
          Elections 2025 are Live
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto leading-[1.1] animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
          Your Voice, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-reva-orange to-red-600">
            Your Campus Future.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200">
          The official digital voting platform for Reva University. <br className="hidden md:block" />
          Secure, transparent, and paperless student council elections.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-300">
          <button 
            onClick={onStart}
            className="group relative px-8 py-4 bg-reva-orange text-white font-bold text-lg rounded-xl shadow-xl shadow-orange-500/30 hover:bg-orange-600 hover:scale-105 transition-all duration-300 flex items-center gap-3"
          >
            Vote Now
            <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
          <button className="px-8 py-4 bg-white dark:bg-zinc-800 text-gray-700 dark:text-gray-200 font-semibold text-lg rounded-xl border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-700 transition-all">
            View Manifesto
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 max-w-6xl mx-auto w-full px-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <FeatureCard 
            icon={FingerPrintIcon}
            title="Verified Access"
            description="Login securely using your official Reva University credentials and OTP verification."
          />
          <FeatureCard 
            icon={ChartBarIcon}
            title="Real-time Results"
            description="Watch the democracy in action with live vote counting and transparency dashboards."
          />
          <FeatureCard 
            icon={DevicePhoneMobileIcon}
            title="Vote from Anywhere"
            description="Access the polling booth from your smartphone, tablet, or laptop within the campus network."
          />
        </div>
      </main>

      <footer className="w-full py-8 border-t border-gray-100 dark:border-zinc-800 text-center text-sm text-gray-400">
        <p>© {new Date().getFullYear()} Reva University. All rights reserved.</p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }: { icon: React.ElementType, title: string, description: string }) => (
  <div className="flex flex-col items-center p-6 bg-white dark:bg-zinc-900/50 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-shadow">
    <div className="w-12 h-12 bg-blue-50 dark:bg-zinc-800 rounded-xl flex items-center justify-center text-reva-blue mb-4">
      <Icon className="w-6 h-6" />
    </div>
    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
);
