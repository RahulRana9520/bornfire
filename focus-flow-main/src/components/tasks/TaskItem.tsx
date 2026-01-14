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

  // Sync local time with task remaining time when task changes (but not during active countdown)
  useEffect(() => {
    if (!task.isTimerRunning) {
      setLocalTime(task.remainingTime ?? task.estimatedTime ?? 0);
    }
  }, [task.remainingTime, task.estimatedTime, task.isTimerRunning]);

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
          
          // Update context less frequently to avoid re-render issues
          updateTask(task.id, { 
            remainingTime: newTime,
            timeSpent: task.timeSpent + 1
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
        "group flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl",
        "bg-card border border-border/50 shadow-soft",
        "transition-all duration-200 hover:shadow-md-enhanced hover:border-border hover:-translate-y-0.5",
        task.completed && "opacity-70",
        task.isTimerRunning && "border-primary/50 shadow-glow-primary ring-2 ring-primary/10"
      )}
    >
      {/* Checkbox */}
      <button
        onClick={() => isEditable && toggleTaskComplete(task.id)}
        disabled={!isEditable}
        className={cn(
          "w-7 h-7 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          "transition-all duration-200 hover:scale-110",
          task.completed
            ? "bg-success border-success shadow-sm"
            : "border-border hover:border-primary hover:bg-primary/5",
          !isEditable && "cursor-not-allowed opacity-50"
        )}
      >
        {task.completed && <Check className="w-4 h-4 text-success-foreground" />}
      </button>

      {/* Task content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span
            className={cn(
              "font-medium text-sm sm:text-base transition-all",
              task.completed && "line-through text-muted-foreground"
            )}
          >
            {task.title}
          </span>
          <span className={cn(
            "px-2 py-0.5 rounded-full text-[10px] font-semibold border shadow-sm",
            priorityColors[task.priority]
          )}>
            {priorityLabels[task.priority]}
          </span>
        </div>
      </div>

      {/* Time display */}
      <div className="flex items-center gap-2 text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-lg">
        <Clock className="w-4 h-4" />
        <span className={cn(
          "font-mono text-sm tabular-nums min-w-[60px] font-medium",
          task.isTimerRunning && "text-primary",
          localTime === 0 && task.isTimerRunning && "text-success animate-pulse"
        )}>
          {formatTime(localTime, false)}
        </span>
      </div>

      {/* Actions */}
      {isEditable && !task.completed && (
        <div className="flex items-center gap-1.5">
          <Button
            variant={task.isTimerRunning ? "default" : "outline"}
            size="icon-sm"
            onClick={handleTimerToggle}
            className={cn(
              "transition-all hover:scale-105",
              task.isTimerRunning && "animate-pulse-soft shadow-lg"
            )}
          >
            {task.isTimerRunning ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </Button>
        </div>
      )}

      {/* Delete button (visible on hover) */}
      {isEditable && (
        <Button
          variant="ghost"
          size="icon-sm"
          onClick={() => deleteTask(task.id)}
          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
