import React, { useEffect, useState, useCallback } from 'react';
import { useOnboarding } from '@/contexts/OnboardingContext';
import { Button } from '@/components/ui/button';
import { X, ChevronRight, ChevronLeft } from 'lucide-react';

export const OnboardingOverlay: React.FC = () => {
  const { isActive, currentStep, nextStep, prevStep, skipOnboarding, currentStepIndex, totalStepsInRoute } = useOnboarding();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);

  const updatePosition = useCallback(() => {
    if (!currentStep) return;

    const element = document.getElementById(currentStep.targetId);
    if (element) {
      setTargetRect(element.getBoundingClientRect());
      // Make sure the element is in view
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
      // Retry if element is not immediately available due to routing/rendering
      setTimeout(() => {
        const retryElement = document.getElementById(currentStep.targetId);
        if (retryElement) {
          setTargetRect(retryElement.getBoundingClientRect());
          retryElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 500);
    }
  }, [currentStep]);

  useEffect(() => {
    if (isActive) {
      updatePosition();
      window.addEventListener('resize', updatePosition);
      window.addEventListener('scroll', updatePosition);
    }
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [isActive, updatePosition]);

  useEffect(() => {
    if (!currentStep || !isActive) return;

    const element = document.getElementById(currentStep.targetId);

    // Handle interactive events
    const handleEvent = () => {
      nextStep();
    };

    if (currentStep.requireInteraction && currentStep.interactionEvent) {
      document.addEventListener(currentStep.interactionEvent, handleEvent);
    }

    let resizeObserver: ResizeObserver | null = null;
    if (element) {
      resizeObserver = new ResizeObserver(() => {
        updatePosition();
      });
      resizeObserver.observe(element);
      // Also observe the body for layout shifts
      resizeObserver.observe(document.body);
    }

    return () => {
      if (currentStep.requireInteraction && currentStep.interactionEvent) {
        document.removeEventListener(currentStep.interactionEvent, handleEvent);
      }
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
    };
  }, [currentStep, isActive, nextStep, updatePosition]);

  if (!isActive || !currentStep) return null;

  // Calculate positions
  let cloudTop = 0;
  let cloudLeft = 0;
  let cloudWidth = 300;
  
  if (targetRect) {
    // Dynamic width for mobile
    cloudWidth = window.innerWidth < 400 ? window.innerWidth - 40 : 300;
    
    // Position cloud slightly offset
    cloudTop = targetRect.bottom + 20;
    cloudLeft = targetRect.left + (targetRect.width / 2) - (cloudWidth / 2);
    
    // Clamp cloud Left/Right with 20px padding
    cloudLeft = Math.max(20, Math.min(cloudLeft, window.innerWidth - cloudWidth - 20));
    
    // Clamp cloud Top/Bottom (if it goes off the bottom of the screen, move it above)
    if (cloudTop + 250 > window.innerHeight) {
      cloudTop = Math.max(20, targetRect.top - 280); // Move above the target
    }
  }

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {targetRect ? (
        <>
          {/* Top mask */}
          <div className="fixed top-0 left-0 right-0 bg-black/60 pointer-events-auto" style={{ height: targetRect.top }} onClick={skipOnboarding} />
          {/* Bottom mask */}
          <div className="fixed left-0 right-0 bottom-0 bg-black/60 pointer-events-auto" style={{ top: targetRect.bottom }} onClick={skipOnboarding} />
          {/* Left mask */}
          <div className="fixed left-0 bg-black/60 pointer-events-auto" style={{ top: targetRect.top, height: targetRect.height, width: targetRect.left }} onClick={skipOnboarding} />
          {/* Right mask */}
          <div className="fixed right-0 bg-black/60 pointer-events-auto" style={{ top: targetRect.top, height: targetRect.height, left: targetRect.right }} onClick={skipOnboarding} />
          
          {/* Highlight ring for the target element */}
          <div 
            className="fixed pointer-events-none border-4 border-[#FFDE00] rounded-lg animate-pulse shadow-[0_0_15px_rgba(255,222,0,0.5)]"
            style={{ 
              top: targetRect.top - 4, 
              left: targetRect.left - 4, 
              width: targetRect.width + 8, 
              height: targetRect.height + 8 
            }}
          />
        </>
      ) : (
        <div className="absolute inset-0 bg-black/60 pointer-events-auto" onClick={skipOnboarding} />
      )}

      {targetRect && (
        <>
          {/* Transparent Cloud */}
          <div 
            className="absolute z-[110] pointer-events-auto transition-all duration-500 ease-in-out"
            style={{ top: `${cloudTop}px`, left: `${cloudLeft}px`, width: `${cloudWidth}px` }}
          >
            {/* Cloud Shape - Custom Neo-Brutalist transparent cloud */}
            <div className="relative bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-[4px] border-black dark:border-zinc-700 p-6 rounded-[2rem] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] dark:shadow-[8px_8px_0px_0px_rgba(255,255,255,0.1)] animate-in fade-in zoom-in duration-300">
              {/* Decorative cloud bumps */}
              <div className="absolute -top-6 left-10 w-12 h-12 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t-[4px] border-l-[4px] border-r-[4px] border-black dark:border-zinc-700 rounded-t-full border-b-0 -z-10"></div>
              <div className="absolute -top-10 left-20 w-20 h-20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm border-t-[4px] border-l-[4px] border-r-[4px] border-black dark:border-zinc-700 rounded-t-full border-b-0 -z-10"></div>
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-xl text-black dark:text-white uppercase">{currentStep.title}</h3>
                  <button onClick={skipOnboarding} className="text-black dark:text-white/70 hover:text-gray-600 dark:hover:text-white transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <p className="text-black dark:text-zinc-300 font-medium mb-6 leading-relaxed">
                  {currentStep.content}
                </p>
              
                <div className="flex justify-between items-center mt-4">
                  <span className="text-sm font-bold text-gray-500 dark:text-zinc-500">
                    {currentStepIndex + 1} / {totalStepsInRoute}
                  </span>
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={prevStep}
                      disabled={currentStepIndex === 0}
                      className="border-2 border-black dark:border-zinc-700 bg-transparent text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    {!currentStep.requireInteraction && (
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={nextStep}
                        className="bg-[#FFDE00] dark:bg-[#FFDE00] text-black border-2 border-black hover:bg-[#e6c800] dark:hover:bg-[#e6c800] font-bold shadow-[2px_2px_0px_0px_#000]"
                      >
                        {currentStepIndex === totalStepsInRoute - 1 ? 'Finish' : 'Next'} <ChevronRight size={16} className="ml-1" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </>
      )}
    </div>
  );
};
