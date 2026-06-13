import React, { useState } from 'react';
import { Plus, Flag, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';

export function AddTaskForm() {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Task['priority']>('medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState<string>('30');
  const [isExpanded, setIsExpanded] = useState(false);
  const { addTask } = useTaskContext();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      const timeInSeconds = parseInt(estimatedMinutes) * 60 || 1800; // Default 30 min
      addTask(title.trim(), priority, timeInSeconds);
      setTitle('');
      setPriority('medium');
      setEstimatedMinutes('30');
      setIsExpanded(false);
      document.dispatchEvent(new CustomEvent('task-added'));
    }
  };

  const priorities: { value: Task['priority']; label: string; color: string }[] = [
    { value: 'low', label: 'Low', color: 'bg-muted text-muted-foreground' },
    { value: 'medium', label: 'Medium', color: 'bg-warning-light text-warning-foreground' },
    { value: 'high', label: 'High', color: 'bg-destructive/10 text-destructive' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
      <div className="flex gap-2 sm:gap-3">
        <Input
          value={title}
          onChange={(e) => {
            setTitle(e.target.value);
            if (e.target.value && !isExpanded) setIsExpanded(true);
          }}
          onFocus={() => setIsExpanded(true)}
          placeholder="Add a new task..."
          className="flex-1 h-11 sm:h-12 text-sm sm:text-base bg-card border-border/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all rounded-lg"
        />
        <Button type="submit" size="lg" disabled={!title.trim()} className="shadow-md hover:shadow-lg transition-all h-11 sm:h-12 px-4 sm:px-5">
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline ml-1.5">Add</span>
        </Button>
      </div>

      {/* Priority selector */}
      {isExpanded && (
        <div className="flex flex-col gap-3 sm:gap-4 animate-slide-up">
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Flag className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Priority:</span>
            </div>
            <div className="flex gap-2">
              {priorities.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className={cn(
                    "px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-bold transition-all hover:scale-105 active:scale-95",
                    priority === p.value
                      ? cn(p.color, "ring-2 ring-offset-2 ring-primary/30 shadow-md")
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time input */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">Estimated time:</span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="1"
                max="480"
                value={estimatedMinutes}
                onChange={(e) => setEstimatedMinutes(e.target.value)}
                className="w-20 h-9 text-sm text-center rounded-lg"
              />
              <span className="text-xs sm:text-sm text-muted-foreground font-semibold">minutes</span>
            </div>
          </div>
        </div>
      )}
    </form>
  );
}
