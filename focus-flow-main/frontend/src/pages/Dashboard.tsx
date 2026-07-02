import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Target, Trophy, Flame, Users, Calendar, ArrowRight, Gamepad2, LogIn } from 'lucide-react';
import { useTaskContext } from '@/contexts/TaskContext';
import { useAuth } from '@/contexts/AuthContext';
import { AuthModal } from '@/components/auth/AuthModal';

const Dashboard = () => {
  const { userProfile } = useTaskContext();
  const { user } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in pb-8">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-[#FFDE00] border-[4px] border-black p-8 sm:p-12 shadow-[8px_8px_0px_0px_#000] lg:shadow-[12px_12px_0px_0px_#000] transition-transform hover:-translate-y-1 duration-300">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-30 transform rotate-12 scale-150 animate-pulse">
          <Sparkles className="w-40 h-40 text-black stroke-[1px]" />
        </div>
        <div className="absolute -bottom-10 -left-10 opacity-20 transform -rotate-12 scale-150">
          <Target className="w-48 h-48 text-black stroke-[1px]" />
        </div>
        
        <div className="relative z-10 max-w-2xl">
          <div className="inline-block bg-black text-white px-4 py-1.5 mb-6 font-black uppercase text-xs sm:text-sm tracking-[0.2em] transform -rotate-1 shadow-[4px_4px_0px_0px_#FF89BB]">
            Welcome to Bornfire
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-8xl font-black uppercase tracking-tighter text-black leading-[0.85] mb-6 drop-shadow-sm">
            Ignite Your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-500 stroke-text relative inline-block transform hover:scale-105 transition-transform">
              Productivity
              <Flame className="absolute -top-4 -right-8 w-10 h-10 text-orange-500 animate-bounce" />
            </span>
          </h1>
          <p className="text-black font-bold uppercase text-sm sm:text-lg max-w-xl mb-8 leading-relaxed border-l-[4px] border-black pl-4 bg-white/40 p-2">
            The ultimate productivity platform where focus meets fun. Build habits, conquer tasks, and compete with friends in the most engaging way possible.
          </p>
          
          <div className="flex flex-wrap gap-4 items-center">
            <Link 
              to="/today"
              className="inline-flex items-center gap-2 bg-[#00E5BC] text-black border-[3px] border-black px-6 py-3.5 font-black uppercase tracking-tight hover:bg-[#00c5a1] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_0px_#000] transition-all text-lg"
            >
              <Calendar className="w-6 h-6 stroke-[3px]" />
              Today's Schedule
              <ArrowRight className="w-6 h-6 stroke-[3px] ml-2" />
            </Link>
            
            {!user && (
              <button 
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center gap-2 bg-white text-black border-[3px] border-black px-6 py-3.5 font-black uppercase tracking-tight hover:bg-gray-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none shadow-[6px_6px_0px_0px_#000] transition-all text-lg"
              >
                <LogIn className="w-6 h-6 stroke-[3px]" />
                Join / Login
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-[#FF89BB] border-[3px] border-black flex items-center justify-center mb-3 shadow-[3px_3px_0px_0px_#000] transform -rotate-3">
            <Flame className="w-7 h-7 text-black stroke-[2.5px]" />
          </div>
          <span className="text-3xl sm:text-4xl font-black uppercase">{userProfile?.streak || 0}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase text-gray-600 tracking-[0.15em] mt-1">Day Streak</span>
        </div>
        
        <div className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-[#00E5BC] border-[3px] border-black flex items-center justify-center mb-3 shadow-[3px_3px_0px_0px_#000] transform rotate-3">
            <Target className="w-7 h-7 text-black stroke-[2.5px]" />
          </div>
          <span className="text-3xl sm:text-4xl font-black uppercase">LVL {userProfile?.level || 1}</span>
          <span className="text-[10px] sm:text-xs font-black uppercase text-gray-600 tracking-[0.15em] mt-1">Current Level</span>
        </div>
        
        <div className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000] flex flex-col items-center justify-center text-center col-span-2 md:col-span-2 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-r from-[#FFDE00]/20 to-[#FF89BB]/20 transform scale-0 group-hover:scale-100 transition-transform duration-500 rounded-full blur-3xl"></div>
          <h3 className="font-black uppercase text-xl sm:text-2xl tracking-tighter mb-3 relative z-10">Current League</h3>
          <div className="flex items-center gap-4 relative z-10 bg-white border-[3px] border-black px-6 py-2 shadow-[4px_4px_0px_0px_#000]">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={`/badges/${userProfile?.league || 'bronze'}.png`} alt={userProfile?.league} className="w-full h-full object-contain drop-shadow-md" />
            </div>
            <span className="font-black uppercase text-2xl sm:text-3xl text-[#00c8ff] tracking-widest drop-shadow-sm">
              {userProfile?.league || 'Bronze'}
            </span>
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <Link to="/week-goals" className="group block bg-[#FF89BB] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
          <div className="w-14 h-14 bg-white border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-5 transform group-hover:rotate-6 transition-transform">
            <Target className="w-7 h-7 text-black stroke-[3px]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Weekly Goals</h2>
          <p className="text-black font-bold uppercase text-xs leading-relaxed">
            Set your targets for the week and crush them one by one to earn massive XP.
          </p>
        </Link>
        
        <Link to="/group-games" className="group block bg-[#00E5BC] border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
          <div className="w-14 h-14 bg-white border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-5 transform group-hover:-rotate-6 transition-transform">
            <Gamepad2 className="w-7 h-7 text-black stroke-[3px]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Group Games</h2>
          <p className="text-black font-bold uppercase text-xs leading-relaxed">
            Join multiplayer focus sessions. Collaborate, compete, and stay accountable together.
          </p>
        </Link>
        
        <Link to="/leaderboard" className="group block bg-white border-[3px] border-black p-6 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-[#FFDE00] rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-500"></div>
          <div className="w-14 h-14 bg-[#FFDE00] border-[3px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] mb-5 transform group-hover:scale-110 transition-transform">
            <Trophy className="w-7 h-7 text-black stroke-[3px]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-tight mb-3">Leaderboard</h2>
          <p className="text-black font-bold uppercase text-xs leading-relaxed">
            See where you stand among your peers. Climb the ranks and reach the Diamond League!
          </p>
        </Link>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        canDismiss={true}
      />
    </div>
  );
};

export default Dashboard;
