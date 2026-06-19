import React from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Flag, Target } from 'lucide-react';

export function PlacementRoadmap() {
  const { planData } = usePlacementContext();
  if (!planData) return null;

  return (
    <div className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
      <h3 className="font-black uppercase text-xl mb-6 flex items-center gap-2">
        <Target className="w-6 h-6" /> Complete Roadmap
      </h3>
      
      <div className="relative border-l-[3px] border-black ml-4 sm:ml-8 pl-6 sm:pl-8 space-y-8 pb-4">
        {planData.roadmap.map((day, index) => {
          const isCompleted = day.tasks.every(t => t.completed) && day.tasks.length > 0;
          const isToday = index === 0; // Simple approximation for UI
          
          return (
            <div key={day.dayNumber} className="relative">
              {/* Timeline Dot */}
              <div className={cn(
                "absolute -left-[35px] sm:-left-[43px] w-6 h-6 sm:w-8 sm:h-8 border-[3px] border-black rounded-full flex items-center justify-center bg-white shadow-[2px_2px_0px_0px_#000]",
                isCompleted && "bg-[#00E5BC]",
                day.isMockTestDay && "bg-[#FF89BB]"
              )}>
                {isCompleted ? <CheckCircle2 className="w-4 h-4 text-black" /> : <div className="w-2 h-2 bg-black rounded-full" />}
              </div>

              {/* Card */}
              <div className={cn(
                "border-[3px] border-black p-4 transition-all",
                isCompleted ? "bg-gray-50 opacity-80" : "bg-white shadow-[4px_4px_0px_0px_#000]",
                day.isMockTestDay && "border-[#FF89BB]"
              )}>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-black text-xs uppercase bg-black text-white px-2 py-0.5">
                      Day {day.dayNumber}
                    </span>
                    <h4 className="font-black uppercase text-sm sm:text-base">{day.title}</h4>
                  </div>
                  {day.isMockTestDay && (
                    <span className="font-black text-[10px] uppercase bg-[#FF89BB] border-[2px] border-black px-2 py-0.5 flex items-center gap-1">
                      <Flag className="w-3 h-3" /> Mock Test
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {day.tasks.map(task => (
                    <div key={task.id} className="flex items-start gap-2 text-xs sm:text-sm font-bold">
                      {task.completed ? (
                        <CheckCircle2 className="w-4 h-4 text-[#00E5BC] mt-0.5 shrink-0" />
                      ) : (
                        <Circle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      )}
                      <span className={cn(task.completed && "line-through text-gray-500")}>
                        {task.title} <span className="text-[10px] text-gray-400 uppercase ml-1">({task.category})</span>
                      </span>
                    </div>
                  ))}
                  {day.tasks.length === 0 && (
                    <p className="text-xs font-bold text-gray-500 uppercase">Rest Day</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
