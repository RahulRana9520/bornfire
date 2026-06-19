import React from 'react';
import { usePlacementContext } from '@/contexts/PlacementContext';
import { CheckCircle2, Circle, Clock, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PlacementTask } from '@/types/placement';

export function PlacementTodayView() {
  const { getCurrentDayPlan, toggleTaskComplete } = usePlacementContext();
  const currentPlan = getCurrentDayPlan();

  if (!currentPlan) {
    return (
      <div className="bg-white border-[3px] border-black p-8 text-center shadow-[6px_6px_0px_0px_#000]">
        <h3 className="font-black uppercase text-xl mb-2">No Plan Found</h3>
        <p className="text-sm font-bold text-gray-500 uppercase">You haven't generated a plan yet or it has expired.</p>
      </div>
    );
  }

  const completedCount = currentPlan.tasks.filter(t => t.completed).length;
  const totalTasks = currentPlan.tasks.length;
  const progress = totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0;
  const estimatedTimeTotal = currentPlan.tasks.reduce((acc, t) => acc + (t.estimatedMinutes || 0), 0);

  return (
    <div className="space-y-6">
      {/* Day Header */}
      <div className="bg-[#00E5BC] border-[3px] border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000] flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <p className="font-black uppercase text-xs tracking-widest bg-black text-white inline-block px-2 py-1 mb-2">
            Day {currentPlan.dayNumber}
          </p>
          <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight">{currentPlan.title}</h2>
          <div className="flex items-center gap-4 mt-2">
            <span className="flex items-center gap-1 text-xs font-black uppercase">
              <Clock className="w-4 h-4" /> {estimatedTimeTotal} Mins
            </span>
            <span className="flex items-center gap-1 text-xs font-black uppercase">
              <Flame className="w-4 h-4" /> {currentPlan.tasks.reduce((a,b)=>a+(b.xpReward||0),0)} XP Max
            </span>
          </div>
        </div>
        
        {/* Progress Circle */}
        <div className="flex items-center gap-4 bg-white border-[3px] border-black p-3 shadow-[2px_2px_0px_0px_#000]">
          <div className="text-right">
            <p className="font-black uppercase text-xs text-gray-500">Progress</p>
            <p className="font-black text-xl">{completedCount}/{totalTasks}</p>
          </div>
          <div className="w-12 h-12 rounded-full border-[3px] border-black flex items-center justify-center bg-gray-100 relative overflow-hidden">
            <div className="absolute bottom-0 w-full bg-[#FFDE00] transition-all" style={{ height: `${progress}%` }} />
            <span className="relative font-black text-xs z-10">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white border-[3px] border-black p-4 sm:p-6 shadow-[6px_6px_0px_0px_#000]">
        <h3 className="font-black uppercase text-lg mb-4 border-b-[3px] border-black pb-2">Your Focus Tasks</h3>
        
        <div className="space-y-3">
          {currentPlan.tasks.map((task) => (
            <div 
              key={task.id} 
              className={cn(
                "border-[3px] border-black p-3 sm:p-4 flex items-start gap-3 transition-all",
                task.completed ? "bg-gray-100 opacity-60" : "bg-white shadow-[3px_3px_0px_0px_#000]",
                task.isCarryForward && !task.completed && "border-[#FF5555] bg-[#FF5555]/10"
              )}
            >
              <button 
                onClick={() => toggleTaskComplete(currentPlan.dayNumber, task.id)}
                className="mt-0.5"
              >
                {task.completed ? (
                  <CheckCircle2 className="w-6 h-6 text-black fill-[#00E5BC]" />
                ) : (
                  <Circle className="w-6 h-6 text-black hover:text-gray-600" />
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                  <h4 className={cn("font-black text-sm sm:text-base uppercase", task.completed && "line-through")}>
                    {task.title}
                  </h4>
                  <span className="font-black text-[10px] uppercase bg-[#FFDE00] border-2 border-black px-2 py-0.5 inline-block w-max">
                    {task.category}
                  </span>
                </div>
                
                <div className="flex items-center gap-3 mt-2">
                  <span className="text-[10px] font-bold uppercase text-gray-600 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {task.estimatedMinutes}m
                  </span>
                  <span className="text-[10px] font-bold uppercase text-[#FF89BB] flex items-center gap-1">
                    <Flame className="w-3 h-3" /> +{task.xpReward} XP
                  </span>
                  {task.isCarryForward && (
                    <span className="text-[10px] font-bold uppercase text-white bg-[#FF5555] px-1">
                      Carry Forward
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}

          {currentPlan.tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="font-black uppercase text-gray-500">No tasks for today. You are free!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
