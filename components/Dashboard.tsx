
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React, { useState, useEffect } from 'react';
import { UserProfile } from './Auth';
import { generateManifesto } from '../services/gemini';
import { 
  SparklesIcon, 
  CheckBadgeIcon, 
  UserPlusIcon, 
  QueueListIcon, 
  TrophyIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  CheckCircleIcon
} from '@heroicons/react/24/solid';

interface Candidate {
  id: string;
  name: string;
  rollNo: string;
  position: string;
  manifesto: string;
  votes: number;
}

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

const POSITIONS = [
  'President', 
  'Vice President', 
  'Secretary', 
  'Cultural Secretary', 
  'Sports Secretary'
];

const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: '1',
    name: 'Aarav Sharma',
    rollNo: 'R21CS104',
    position: 'President',
    manifesto: 'Focusing on better campus Wi-Fi, 24/7 library access, and more industry-connect workshops for CS students.',
    votes: 42
  },
  {
    id: '2',
    name: 'Priya Patel',
    rollNo: 'R22EC055',
    position: 'President',
    manifesto: 'Advocating for sustainable campus initiatives, mental health awareness weeks, and improved canteen hygiene.',
    votes: 38
  },
  {
    id: '3',
    name: 'Rohan Kumar',
    rollNo: 'R21ME201',
    position: 'Secretary',
    manifesto: 'I promise to streamline the event permissions process and bring more sports tournaments to Reva.',
    votes: 27
  },
  {
    id: '4',
    name: 'Ishaan Gupta',
    rollNo: 'R21CV033',
    position: 'Sports Secretary',
    manifesto: 'New equipment for the gym and regular inter-college leagues.',
    votes: 15
  },
  {
    id: '5',
    name: 'Ananya Singh',
    rollNo: 'R22BT012',
    position: 'Cultural Secretary',
    manifesto: 'More frequent cultural fests and funding for student clubs.',
    votes: 56
  }
];

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [activeTab, setActiveTab] = useState<'vote' | 'results' | 'register'>('vote');
  const [selectedPosition, setSelectedPosition] = useState<string>('President');
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [userVotes, setUserVotes] = useState<Record<string, string>>({}); // { position: candidateId }
  const [searchQuery, setSearchQuery] = useState('');
  
  // Registration State
  const [regForm, setRegForm] = useState({
    position: 'President',
    keyPoints: '',
    generatedManifesto: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Initialize Data from LocalStorage
  useEffect(() => {
    const savedCandidates = localStorage.getItem('reva_candidates');
    const savedVotes = localStorage.getItem(`reva_votes_${user.rollNo}`); // Unique votes per user

    if (savedCandidates) {
      setCandidates(JSON.parse(savedCandidates));
    } else {
      setCandidates(INITIAL_CANDIDATES);
      localStorage.setItem('reva_candidates', JSON.stringify(INITIAL_CANDIDATES));
    }

    if (savedVotes) {
      setUserVotes(JSON.parse(savedVotes));
    }
  }, [user.rollNo]);

  // Persist Candidates when they change
  useEffect(() => {
    if (candidates.length > 0) {
      localStorage.setItem('reva_candidates', JSON.stringify(candidates));
    }
  }, [candidates]);

  // Persist Votes when they change
  useEffect(() => {
    localStorage.setItem(`reva_votes_${user.rollNo}`, JSON.stringify(userVotes));
  }, [userVotes, user.rollNo]);


  const handleVote = (candidateId: string, position: string) => {
    if (userVotes[position]) return;
    
    if (confirm(`Cast your vote for ${position}? This cannot be changed.`)) {
      // update vote count
      setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, votes: c.votes + 1 } : c));
      // record user vote for this position
      setUserVotes(prev => ({ ...prev, [position]: candidateId }));
    }
  };

  const handleGenerateManifesto = async () => {
    if (!regForm.keyPoints) {
      alert("Please enter some key points first.");
      return;
    }
    setIsGenerating(true);
    try {
      const manifesto = await generateManifesto(user.name, regForm.position, regForm.keyPoints);
      setRegForm(prev => ({ ...prev, generatedManifesto: manifesto }));
    } catch (e) {
      alert("Failed to generate manifesto");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.generatedManifesto && !regForm.keyPoints) {
        alert("Please provide a manifesto.");
        return;
    }
    
    // Check if already registered for a position (optional rule, but good for demo)
    const existing = candidates.find(c => c.rollNo === user.rollNo);
    if (existing) {
        alert(`You are already registered as a candidate for ${existing.position}.`);
        return;
    }

    const newCandidate: Candidate = {
      id: crypto.randomUUID(),
      name: user.name,
      rollNo: user.rollNo,
      position: regForm.position,
      manifesto: regForm.generatedManifesto || regForm.keyPoints,
      votes: 0
    };

    setCandidates([...candidates, newCandidate]);
    setActiveTab('vote');
    setSelectedPosition(regForm.position);
    alert("Successfully registered! Good luck.");
  };

  // Filtering
  const filteredCandidates = candidates.filter(c => 
    c.position === selectedPosition && 
    (c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.rollNo.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const totalVotesCast = Object.keys(userVotes).length;
  const progressPercentage = (totalVotesCast / POSITIONS.length) * 100;

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800 gap-4">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-reva-orange to-red-500 flex items-center justify-center text-white font-bold text-xl">
               {user.name.charAt(0)}
           </div>
           <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">Welcome, {user.name}</h1>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 font-mono">
                 <span>{user.rollNo}</span>
                 <span>•</span>
                 <span>{user.email}</span>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="hidden md:block text-right mr-2">
                <p className="text-xs text-gray-500 dark:text-gray-400">Voting Progress</p>
                <div className="w-32 h-2 bg-gray-100 dark:bg-zinc-800 rounded-full mt-1 overflow-hidden">
                    <div className="h-full bg-green-500 transition-all duration-1000" style={{width: `${progressPercentage}%`}}></div>
                </div>
            </div>
            <button 
                onClick={onLogout}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
                Logout
            </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex flex-wrap justify-center gap-2 p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl max-w-fit mx-auto">
        <button
            onClick={() => setActiveTab('vote')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'vote' ? 'bg-white dark:bg-zinc-700 text-reva-orange shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
            <QueueListIcon className="w-4 h-4" />
            Ballot
        </button>
        <button
            onClick={() => setActiveTab('results')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'results' ? 'bg-white dark:bg-zinc-700 text-reva-orange shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
            <ChartBarIcon className="w-4 h-4" />
            Live Results
        </button>
        <button
            onClick={() => setActiveTab('register')}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'register' ? 'bg-white dark:bg-zinc-700 text-reva-orange shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'}`}
        >
            <UserPlusIcon className="w-4 h-4" />
            Nominate
        </button>
      </div>

      {/* Content Area */}
      <div className="min-h-[400px]">
        {activeTab === 'vote' && (
           <div className="flex flex-col lg:flex-row gap-6">
              {/* Sidebar Filters */}
              <div className="w-full lg:w-64 flex-shrink-0 space-y-2">
                 <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider px-2 mb-2">Positions</h3>
                 {POSITIONS.map(pos => (
                     <button
                        key={pos}
                        onClick={() => { setSelectedPosition(pos); setSearchQuery(''); }}
                        className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-all ${
                            selectedPosition === pos 
                            ? 'bg-reva-orange text-white shadow-lg shadow-orange-500/20' 
                            : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-zinc-800'
                        }`}
                     >
                        {pos}
                        {userVotes[pos] && <CheckCircleIcon className="w-5 h-5 text-white/80" />}
                     </button>
                 ))}
              </div>

              {/* Candidates Grid */}
              <div className="flex-1">
                 <div className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
                     <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            {selectedPosition} Candidates
                            {userVotes[selectedPosition] && (
                                <span className="text-xs bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-2 py-0.5 rounded-full font-medium">
                                    Voted
                                </span>
                            )}
                        </h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                           {filteredCandidates.length} candidates running
                        </p>
                     </div>
                     <div className="relative w-full sm:w-auto">
                        <MagnifyingGlassIcon className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input 
                            type="text" 
                            placeholder="Search candidates..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full sm:w-64 pl-9 pr-4 py-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-lg text-sm focus:ring-2 focus:ring-reva-orange outline-none dark:text-white"
                        />
                     </div>
                 </div>

                 {filteredCandidates.length === 0 ? (
                     <div className="flex flex-col items-center justify-center h-64 bg-white dark:bg-zinc-900 rounded-2xl border border-dashed border-gray-200 dark:border-zinc-800">
                         <div className="p-4 bg-gray-50 dark:bg-zinc-800 rounded-full mb-3">
                            <FunnelIcon className="w-6 h-6 text-gray-400" />
                         </div>
                         <p className="text-gray-500 dark:text-gray-400 font-medium">No candidates found for {selectedPosition}</p>
                         <button onClick={() => setActiveTab('register')} className="text-reva-orange text-sm mt-2 hover:underline">Be the first to register!</button>
                     </div>
                 ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredCandidates.map(candidate => {
                            const isVoted = userVotes[selectedPosition] === candidate.id;
                            const isDisabled = !!userVotes[selectedPosition];

                            return (
                                <div key={candidate.id} className={`relative overflow-hidden bg-white dark:bg-zinc-900 rounded-xl p-6 border transition-all hover:shadow-lg ${isVoted ? 'border-green-500 ring-1 ring-green-500 bg-green-50/50 dark:bg-green-900/10' : 'border-gray-100 dark:border-zinc-800 hover:border-reva-orange/50'}`}>
                                    {isVoted && (
                                        <div className="absolute top-0 right-0 bg-green-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg">
                                            YOUR VOTE
                                        </div>
                                    )}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-zinc-800 flex items-center justify-center text-gray-500 font-bold">
                                                {candidate.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{candidate.name}</h3>
                                                <p className="text-xs text-gray-500 font-mono">{candidate.rollNo}</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-lg mb-6">
                                        <p className="text-sm text-gray-600 dark:text-gray-300 italic leading-relaxed">
                                            "{candidate.manifesto}"
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleVote(candidate.id, candidate.position)}
                                        disabled={isDisabled}
                                        className={`w-full py-2.5 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2
                                            ${isVoted 
                                                ? 'bg-green-500 text-white cursor-default' 
                                                : isDisabled 
                                                    ? 'bg-gray-100 dark:bg-zinc-800 text-gray-400 cursor-not-allowed' 
                                                    : 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-reva-orange dark:hover:bg-reva-orange dark:hover:text-white shadow-lg shadow-gray-200 dark:shadow-none'
                                            }
                                        `}
                                    >
                                        {isVoted ? (
                                            <>
                                                <CheckBadgeIcon className="w-4 h-4" /> Voted
                                            </>
                                        ) : isDisabled ? (
                                            'Vote Cast for Another'
                                        ) : (
                                            'Vote for Candidate'
                                        )}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                 )}
              </div>
           </div>
        )}

        {activeTab === 'results' && (
            <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Live Election Results</h2>
                    <p className="text-gray-500 dark:text-gray-400">Real-time vote counting updates</p>
                </div>
                
                {POSITIONS.map(pos => {
                    const posCandidates = candidates.filter(c => c.position === pos).sort((a, b) => b.votes - a.votes);
                    const totalPosVotes = posCandidates.reduce((acc, curr) => acc + curr.votes, 0);
                    
                    if (posCandidates.length === 0) return null;

                    return (
                        <div key={pos} className="bg-white dark:bg-zinc-900 rounded-xl p-6 border border-gray-100 dark:border-zinc-800 shadow-sm">
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                                {pos}
                            </h3>
                            <div className="space-y-4">
                                {posCandidates.map((candidate, index) => {
                                    const percentage = totalPosVotes > 0 ? ((candidate.votes / totalPosVotes) * 100).toFixed(1) : '0';
                                    const isLeader = index === 0 && candidate.votes > 0;
                                    
                                    return (
                                        <div key={candidate.id} className="relative">
                                            <div className="flex justify-between items-end mb-1 text-sm">
                                                <span className="font-medium text-gray-700 dark:text-gray-200 flex items-center gap-2">
                                                    {candidate.name}
                                                    {isLeader && <TrophyIcon className="w-3 h-3 text-yellow-500" />}
                                                </span>
                                                <span className="font-mono text-gray-500">{candidate.votes} votes ({percentage}%)</span>
                                            </div>
                                            <div className="w-full h-3 bg-gray-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full rounded-full transition-all duration-1000 ${isLeader ? 'bg-reva-orange' : 'bg-blue-500/50'}`}
                                                    style={{width: `${percentage}%`}}
                                                ></div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        )}

        {activeTab === 'register' && (
          <div className="max-w-2xl mx-auto bg-white dark:bg-zinc-900 rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-zinc-800 shadow-xl">
             <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <UserPlusIcon className="w-6 h-6 text-reva-orange" />
                    Candidate Registration
                </h3>
                <p className="text-sm text-gray-500">Nominate yourself for the upcoming student council elections.</p>
             </div>

             <form onSubmit={handleRegister} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Position</label>
                    <select
                        value={regForm.position}
                        onChange={(e) => setRegForm({...regForm, position: e.target.value})}
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange outline-none dark:text-white"
                    >
                        {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Campaign Promises (Key Points)
                    </label>
                    <textarea
                        value={regForm.keyPoints}
                        onChange={(e) => setRegForm({...regForm, keyPoints: e.target.value})}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-reva-orange outline-none dark:text-white placeholder-gray-400"
                        placeholder="E.g., Better wifi, more cultural events, clean campus..."
                    />
                    <div className="flex justify-end mt-2">
                         <button
                            type="button"
                            onClick={handleGenerateManifesto}
                            disabled={isGenerating || !regForm.keyPoints}
                            className="flex items-center gap-2 text-xs font-medium text-reva-blue hover:text-blue-600 disabled:opacity-50 transition-colors"
                         >
                            <SparklesIcon className="w-4 h-4" />
                            {isGenerating ? 'AI is writing...' : 'Generate Professional Manifesto with AI'}
                         </button>
                    </div>
                </div>

                <div className={`transition-all duration-500 overflow-hidden ${regForm.generatedManifesto ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Final Manifesto
                    </label>
                    <textarea
                        value={regForm.generatedManifesto}
                        onChange={(e) => setRegForm({...regForm, generatedManifesto: e.target.value})}
                        rows={5}
                        className="w-full px-4 py-3 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-lg focus:ring-2 focus:ring-reva-blue outline-none dark:text-white"
                    />
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full py-3 bg-reva-orange hover:bg-orange-600 text-white font-bold rounded-lg shadow-lg shadow-orange-500/20 transition-all transform hover:scale-[1.01]"
                    >
                        Submit Nomination
                    </button>
                </div>
             </form>
          </div>
        )}
      </div>
    </div>
  );
};
