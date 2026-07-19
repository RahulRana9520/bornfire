import React, { useState } from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { PlacementRoadmap } from '@/components/placement/PlacementRoadmap';
import { PlacementTodayView } from '@/components/placement/PlacementTodayView';
import { PlacementResources } from '@/components/placement/PlacementResources';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Target, BookOpen, RefreshCw, Loader2, Trash2 } from 'lucide-react';

type Tab = 'today' | 'roadmap' | 'resources';

export function PlacementDashboard() {
  const { planData, getCompletionPercentage, generatePlan, clearPlan } = usePlacementContext();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!planData) return null;

  const { profile } = planData;
  const completion = getCompletionPercentage();

  const handleRegenerate = async () => {
    if (window.confirm("Are you sure you want to regenerate the remaining plan? This will overwrite your current incomplete tasks.")) {
      setIsRegenerating(true);
      try {
        await generatePlan(profile);
      } catch (err) {
        alert("Failed to regenerate plan. Please try again.");
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  const handleReset = () => {
    if (window.confirm("Are you sure you want to delete this plan? You will start over and lose all progress.")) {
      clearPlan();
    }
  };

  return (
    <div className="space-y-6 relative">
      {isRegenerating && (
        <div className="absolute inset-0 z-50 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center p-12 border-[3px] border-black m-[-3px] sm:m-[-4px]">
          <Loader2 className="w-16 h-16 animate-spin text-black mb-6" />
          <h2 className="text-2xl font-black uppercase tracking-tight mb-2 text-center">Regenerating Roadmap...</h2>
          <p className="text-black uppercase text-xs font-bold text-center">
            Our AI is rebuilding your day-by-day plan for {profile.targetCompany || 'your target'}.<br/>
            This takes about 10-20 seconds.
          </p>
        </div>
      )}

      <div className={cn("grid grid-cols-2 md:grid-cols-5 gap-4 transition-opacity", isRegenerating && "opacity-20 pointer-events-none")}>
        <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Target</p>
          <p className="font-black uppercase truncate text-sm sm:text-base">{profile.targetCompany}</p>
        </div>
        <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Time Left</p>
          <p className="font-black uppercase truncate text-sm sm:text-base">{profile.daysAvailable} Days</p>
        </div>
        <div className="bg-white border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000]">
          <p className="text-[10px] font-black uppercase text-gray-500 tracking-widest mb-1">Completion</p>
          <p className="font-black uppercase truncate text-sm sm:text-base">{completion}%</p>
          <div className="h-2 w-full border-[2px] border-black mt-2 bg-gray-100">
            <div className="h-full bg-[#00E5BC] border-r-[2px] border-black" style={{ width: `${completion}%` }} />
          </div>
        </div>
        <div className="bg-[#FF89BB] border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-center items-center cursor-pointer hover:bg-[#ff70a8] transition-colors" onClick={handleRegenerate}>
          <RefreshCw className={cn("w-6 h-6 mb-1", isRegenerating && "animate-spin")} />
          <p className="text-[10px] font-black uppercase tracking-widest text-center">Regenerate</p>
        </div>
        <div className="bg-[#FF5555] border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-center items-center cursor-pointer hover:bg-[#ff3333] transition-colors" onClick={handleReset}>
          <Trash2 className="w-6 h-6 mb-1 text-white" />
          <p className="text-[10px] font-black uppercase tracking-widest text-center text-white">Reset Plan</p>
        </div>
      </div>

      {/* Tabs */}
      <div className={cn("flex gap-2 border-b-[4px] border-black pb-0 overflow-x-auto hide-scrollbar transition-opacity", isRegenerating && "opacity-20 pointer-events-none")}>
        {[
          { id: 'today', label: "Today's Prep", icon: Target },
          { id: 'roadmap', label: 'Full Roadmap', icon: Calendar },
          { id: 'resources', label: 'Resources', icon: BookOpen }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id as Tab)}
            className={cn(
              "flex items-center gap-2 px-6 py-3 font-black uppercase text-xs sm:text-sm border-[3px] border-b-0 border-black transition-all whitespace-nowrap",
              activeTab === t.id 
                ? "bg-black text-white" 
                : "bg-white text-black hover:bg-gray-100"
            )}
          >
            <t.icon className="w-4 h-4" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className={cn("min-h-[500px] transition-opacity", isRegenerating && "opacity-20 pointer-events-none")}>
        {activeTab === 'today' && <PlacementTodayView />}
        {activeTab === 'roadmap' && <PlacementRoadmap />}
        {activeTab === 'resources' && <PlacementResources />}
      </div>
    </div>
  );
}
