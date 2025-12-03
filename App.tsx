
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { Auth, UserProfile } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { Hero } from './components/Hero';

const App: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [view, setView] = useState<'landing' | 'auth'>('landing');
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('reva_evote_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        localStorage.removeItem('reva_evote_user');
      }
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    localStorage.setItem('reva_evote_user', JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    if (confirm("Are you sure you want to logout?")) {
      setUser(null);
      localStorage.removeItem('reva_evote_user');
      setView('landing');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="animate-pulse flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-reva-orange/20"></div>
           <div className="h-4 w-32 bg-gray-200 dark:bg-zinc-800 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-gray-100 transition-colors duration-300 selection:bg-reva-orange/30">
       
       {user ? (
         // Authenticated View
         <div className="relative z-10 w-full animate-in fade-in duration-500">
            <Dashboard user={user} onLogout={handleLogout} />
            {/* Footer for Dashboard */}
            <footer className="text-center text-[10px] text-gray-400 dark:text-gray-600 w-full py-6">
              Reva University Student E-Voting Platform © {new Date().getFullYear()}
            </footer>
         </div>
       ) : (
         // Non-Authenticated Views
         <div className="relative z-10 w-full">
            {view === 'landing' ? (
              <Hero onStart={() => setView('auth')} />
            ) : (
              <div className="min-h-screen flex items-center justify-center p-4 animate-in zoom-in-95 duration-300">
                <div className="w-full max-w-md">
                   <button 
                     onClick={() => setView('landing')}
                     className="mb-8 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
                   >
                     ← Back to Home
                   </button>
                   <Auth onLogin={handleLogin} />
                </div>
              </div>
            )}
         </div>
       )}
    </div>
  );
};

export default App;
