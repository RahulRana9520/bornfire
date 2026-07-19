import React, { useState } from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { PlacementProfile } from '@/types/placement';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Target, Loader2, Clock, Calendar, BrainCircuit, Rocket } from 'lucide-react';
import { cn } from '@/lib/utils';

export function PlacementSetupWizard() {
  const { generatePlan, isGenerating } = usePlacementContext();
  const [profile, setProfile] = useState<PlacementProfile>({
    targetCompany: '',
    roleType: 'product',
    daysAvailable: 30,
    dailyHours: 4,
    currentLevel: 'intermediate',
    focusAreas: [],
    weakAreas: [],
    startDate: new Date().toISOString(),
    isSetupComplete: true, // will be true after generation
  });

  const handleFocusAreaToggle = (area: string) => {
    setProfile(prev => ({
      ...prev,
      focusAreas: prev.focusAreas.includes(area)
        ? prev.focusAreas.filter(a => a !== area)
        : [...prev.focusAreas, area]
    }));
  };

  const handleWeakAreaToggle = (area: string) => {
    setProfile(prev => ({
      ...prev,
      weakAreas: prev.weakAreas.includes(area)
        ? prev.weakAreas.filter(a => a !== area)
        : [...prev.weakAreas, area]
    }));
  };

  const handleGenerate = async () => {
    if (!profile.targetCompany) {
      alert("Please enter a target company");
      return;
    }
    await generatePlan(profile);
  };

  const areas = ['DSA', 'Aptitude', 'CS Core', 'Projects', 'Resume', 'HR Interview', 'Mock Tests', 'Communication'];

  // We will handle the isGenerating overlay within the main return statement.

  return (
    <div className="relative bg-white border-[3px] sm:border-[4px] border-black p-4 sm:p-8 shadow-[6px_6px_0px_0px_#000] sm:shadow-[12px_12px_0px_0px_#000]">
      {isGenerating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 border-[3px] border-black m-[-3px] sm:m-[-4px]">
          <Loader2 className="w-16 h-16 animate-spin text-black mb-6" />
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-center">Generating Roadmap...</h2>
          <p className="text-black uppercase text-xs font-bold text-center">
            Our AI is building the perfect day-by-day plan for {profile.targetCompany || 'your target'}.<br/>
            This takes about 10-20 seconds.
          </p>
        </div>
      )}

      <div className={cn("flex items-center gap-3 mb-8 transition-opacity", isGenerating && "opacity-20 pointer-events-none")}>
        <div className="w-12 h-12 bg-[#FF89BB] border-[3px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
          <Rocket className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-black uppercase">Setup Your Target</h2>
          <p className="text-xs uppercase font-bold text-gray-500 tracking-wider">Customize your preparation</p>
        </div>
      </div>

      <div className={cn("space-y-8 transition-opacity", isGenerating && "opacity-20 pointer-events-none")}>
        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider">Target Company / Dream Job</label>
            <Input 
              value={profile.targetCompany}
              onChange={(e) => setProfile(prev => ({...prev, targetCompany: e.target.value}))}
              placeholder="e.g. Amazon, TCS, Google"
              className="border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_#000] h-12 font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-wider">Role Type</label>
            <div className="flex gap-2">
              {['service', 'product', 'startup'].map(r => (
                <button
                  key={r}
                  onClick={() => setProfile(prev => ({...prev, roleType: r}))}
                  className={cn(
                    "flex-1 border-[3px] border-black h-12 font-black uppercase text-xs sm:text-sm transition-all",
                    profile.roleType === r ? "bg-[#00E5BC] shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-gray-50"
                  )}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Time available */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-[#FFDE00]/20 border-[3px] border-black border-dashed">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <Calendar className="w-4 h-4" /> Days Until Placement
            </label>
            <Input 
              type="number"
              value={profile.daysAvailable}
              onChange={(e) => setProfile(prev => ({...prev, daysAvailable: parseInt(e.target.value) || 30}))}
              className="border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_#000] font-bold"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
              <Clock className="w-4 h-4" /> Daily Hours to Study
            </label>
            <Input 
              type="number"
              value={profile.dailyHours}
              onChange={(e) => setProfile(prev => ({...prev, dailyHours: parseInt(e.target.value) || 4}))}
              className="border-[3px] border-black rounded-none shadow-[2px_2px_0px_0px_#000] font-bold"
            />
          </div>
        </div>

        {/* Level */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
            <BrainCircuit className="w-4 h-4" /> Current Prep Level
          </label>
          <div className="flex gap-2">
            {['beginner', 'intermediate', 'advanced'].map(l => (
              <button
                key={l}
                onClick={() => setProfile(prev => ({...prev, currentLevel: l}))}
                className={cn(
                  "flex-1 border-[3px] border-black h-12 font-black uppercase text-xs sm:text-sm transition-all",
                  profile.currentLevel === l ? "bg-[#FF89BB] shadow-none translate-x-[2px] translate-y-[2px]" : "bg-white shadow-[2px_2px_0px_0px_#000] hover:bg-gray-50"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>

        {/* Focus Areas */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider block mb-2">Key Focus Areas</label>
          <div className="flex flex-wrap gap-2">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => handleFocusAreaToggle(area)}
                className={cn(
                  "px-4 py-2 border-[2px] border-black font-bold text-xs uppercase transition-all",
                  profile.focusAreas.includes(area) ? "bg-black text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100"
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        {/* Weak Areas */}
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-wider block mb-2">Your Weak Areas (Needs More Time)</label>
          <div className="flex flex-wrap gap-2">
            {areas.map(area => (
              <button
                key={area}
                onClick={() => handleWeakAreaToggle(area)}
                className={cn(
                  "px-4 py-2 border-[2px] border-black font-bold text-xs uppercase transition-all",
                  profile.weakAreas.includes(area) ? "bg-[#FF5555] text-white shadow-none" : "bg-white text-black shadow-[2px_2px_0px_0px_#000] hover:bg-gray-100"
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!profile.targetCompany || profile.daysAvailable < 1 || isGenerating}
          className="w-full h-16 bg-[#FFDE00] hover:bg-[#E5C700] text-black border-[4px] border-black rounded-none shadow-[4px_4px_0px_0px_#000] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all font-black uppercase text-xl mt-8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? (
            <span className="flex items-center gap-2">
              <Loader2 className="w-6 h-6 animate-spin" /> Generating...
            </span>
          ) : (
            'Generate My Plan'
          )}
        </Button>
      </div>
    </div>
  );
}
