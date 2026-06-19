import React from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { PlacementSetupWizard } from '@/components/placement/PlacementSetupWizard';
import { PlacementDashboard } from '@/components/placement/PlacementDashboard';

export default function PlacementPrep() {
  const { planData } = usePlacementContext();

  return (
    <div className="animate-fade-in pb-4">
      <div className="mb-6 border-[3px] border-black bg-[#FFDE00] p-4 sm:p-6 shadow-[4px_4px_0px_0px_#000]">
        <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-tighter text-black">
          Placement Prep
        </h1>
        <p className="text-black font-black uppercase text-xs sm:text-sm tracking-widest mt-1 sm:mt-2">
          Your Smart Roadmap to Success
        </p>
      </div>

      {!planData?.profile?.isSetupComplete ? (
        <PlacementSetupWizard />
      ) : (
        <PlacementDashboard />
      )}
    </div>
  );
}
