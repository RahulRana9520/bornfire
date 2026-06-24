import React, { useState } from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { PlacementRoadmap } from '@/components/placement/PlacementRoadmap';
import { PlacementTodayView } from '@/components/placement/PlacementTodayView';
import { PlacementResources } from '@/components/placement/PlacementResources';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Target, BookOpen, RefreshCw } from 'lucide-react';

type Tab = 'today' | 'roadmap' | 'resources';

export function PlacementDashboard() {
  const { planData, getCompletionPercentage, generatePlan } = usePlacementContext();
  const [activeTab, setActiveTab] = useState<Tab>('today');
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!planData) return null;

  const { profile } = planData;
  const completion = getCompletionPercentage();

  const handleRegenerate = async () => {
    if (confirm("Are you sure you want to regenerate the remaining plan? This will overwrite your current incomplete tasks.")) {
      setIsRegenerating(true);
      try {
        await generatePlan(profile);
      } finally {
        setIsRegenerating(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
          <p className="text-[10px] font-black uppercase tracking-widest text-center">Regenerate Plan</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b-[4px] border-black pb-0 overflow-x-auto hide-scrollbar">
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
      <div className="min-h-[500px]">
        {activeTab === 'today' && <PlacementTodayView />}
        {activeTab === 'roadmap' && <PlacementRoadmap />}
        {activeTab === 'resources' && <PlacementResources />}
      </div>
    </div>
  );
}
