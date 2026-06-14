import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Check, Play, Pause, Trash2, Clock, Flag } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';
import { formatTime } from '@/lib/taskUtils';
import { useTaskContext } from '@/contexts/TaskContext';

interface TaskItemProps {
  task: Task;
  isEditable: boolean;
}

export function TaskItem({ task, isEditable }: TaskItemProps) {
  const { toggleTaskComplete, startTimer, stopTimer, updateTaskTime, deleteTask, updateTask } = useTaskContext();
  const [localTime, setLocalTime] = useState(task.remainingTime ?? task.estimatedTime ?? 0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Use a ref to track the latest timeSpent to avoid stale closures in the interval
  const timeSpentRef = useRef(task.timeSpent || 0);

  // Sync local time and timeSpent with task changes (but not during active countdown)
  useEffect(() => {
    if (!task.isTimerRunning) {
      setLocalTime(task.remainingTime ?? task.estimatedTime ?? 0);
      timeSpentRef.current = task.timeSpent || 0;
    }
  }, [task.remainingTime, task.estimatedTime, task.timeSpent, task.isTimerRunning]);

  useEffect(() => {
    // Clear any existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (task.isTimerRunning) {
      intervalRef.current = setInterval(() => {
        setLocalTime(prevTime => {
          const newTime = Math.max(0, prevTime - 1);
          timeSpentRef.current += 1;
          
          // Update context
          updateTask(task.id, { 
            remainingTime: newTime,
            timeSpent: timeSpentRef.current
          });
          
          // Auto-complete task when timer reaches 0
          if (newTime === 0) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            stopTimer(task.id);
            setTimeout(() => {
              toggleTaskComplete(task.id);
            }, 100);
          }
          
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [task.isTimerRunning, task.id]);

  const handleTimerToggle = useCallback(() => {
    if (task.isTimerRunning) {
      stopTimer(task.id);
    } else {
      startTimer(task.id);
    }
  }, [task.isTimerRunning, task.id, startTimer, stopTimer]);

  const priorityColors = {
    high: 'bg-destructive/10 text-destructive border-destructive/30',
    medium: 'bg-warning-light text-warning-foreground border-warning/30',
    low: 'bg-muted text-muted-foreground border-muted-foreground/20',
  };

  const priorityLabels = {
    high: 'High',
    medium: 'Med',
    low: 'Low',
  };

  return (
    <div
      className={cn(
        /* Mobile: wrap layout, tighter padding, thinner borders */
        "group flex flex-wrap sm:flex-nowrap items-center gap-2 sm:gap-4 p-3 sm:p-5 border-[2px] sm:border-[3px] border-black transition-none",
        task.isTimerRunning 
          ? "bg-[#FFDE00] shadow-[4px_4px_0px_0px_#000] sm:shadow-[8px_8px_0px_0px_#000] translate-x-[-1px] sm:translate-x-[-2px] translate-y-[-1px] sm:translate-y-[-2px]" 
          : "bg-white shadow-[3px_3px_0px_0px_#000] sm:shadow-[4px_4px_0px_0px_#000]",
        task.completed && "opacity-60 grayscale bg-gray-50 shadow-none border-gray-300"
      )}
    >
      {/* Checkbox — 44px touch target */}
      <button
        onClick={() => isEditable && toggleTaskComplete(task.id)}
        disabled={!isEditable}
        className={cn(
          "w-8 h-8 sm:w-8 sm:h-8 min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0 border-[2px] sm:border-[3px] border-black flex items-center justify-center flex-shrink-0 transition-none",
          task.completed
            ? "bg-[#00E5BC] shadow-none"
            : "bg-white shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none",
          !isEditable && "cursor-not-allowed opacity-50"
        )}
      >
        {task.completed && <Check className="w-5 h-5 text-black stroke-[3px]" />}
      </button>

      {/* Task content — takes remaining width */}
      <div className="flex-1 min-w-0">
        <div className="space-y-1">
          <p
            className={cn(
              "font-black text-sm sm:text-lg uppercase tracking-tighter transition-none leading-tight",
              task.completed && "line-through"
            )}
          >
            {task.title}
          </p>
          <div className="flex gap-2">
            <span className={cn(
              "px-2 py-0.5 border-[1.5px] sm:border-2 border-black text-[8px] sm:text-[9px] font-black uppercase tracking-widest bg-white shadow-[1px_1px_0px_0px_#000]",
              task.priority === 'high' ? 'bg-[#FF89BB]' : task.priority === 'medium' ? 'bg-[#FFDE00]' : 'bg-[#00E5BC]'
            )}>
              {task.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Time display + Actions row — wraps below on very small screens */}
      <div className="flex items-center gap-2 ml-auto">
        {/* Time display */}
        <div className="flex items-center gap-1.5 sm:gap-2 border-[2px] sm:border-[3px] border-black bg-white px-2 sm:px-3 py-1.5 sm:py-2 shadow-[2px_2px_0px_0px_#000]">
          <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-black" />
          <span className={cn(
            "font-mono text-xs sm:text-sm tabular-nums font-black",
            task.isTimerRunning && "text-black",
            localTime === 0 && task.isTimerRunning && "animate-pulse"
          )}>
            {formatTime(localTime, false)}
          </span>
        </div>

        {/* Actions */}
        {isEditable && !task.completed && (
          <Button
            variant="default"
            size="icon"
            onClick={handleTimerToggle}
            className={cn(
              "w-10 h-10 min-w-[44px] min-h-[44px] border-[2px] sm:border-[3px] border-black transition-none",
              task.isTimerRunning 
                ? "bg-black text-white shadow-none translate-x-[2px] translate-y-[2px]" 
                : "bg-[#00E5BC] text-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
            )}
          >
            {task.isTimerRunning ? (
              <Pause className="w-5 h-5 stroke-[3px]" />
            ) : (
              <Play className="w-5 h-5 stroke-[3px]" />
            )}
          </Button>
        )}

        {/* Delete button */}
        {isEditable && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="min-w-[44px] min-h-[44px] border-[2px] sm:border-[3px] border-transparent hover:border-black hover:bg-white hover:shadow-[2px_2px_0px_0px_#000] transition-none"
          >
            <Trash2 className="w-4 h-4 text-black" />
          </Button>
        )}
      </div>
    </div>
  );
}
