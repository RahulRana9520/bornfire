import React from 'react';
import { TaskItem } from './TaskItem';
import { Task } from '@/types/task';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  isEditable: boolean;
  dateLabel?: string;
}

export function TaskList({ tasks, isEditable, dateLabel }: TaskListProps) {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  if (tasks.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Circle className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="text-sm">No tasks yet</p>
        {isEditable && <p className="text-xs mt-1">Add a task to get started</p>}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      {dateLabel && (
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{dateLabel}</h3>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {completedCount}/{tasks.length}
            </span>
            <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  progress === 100 ? "bg-success" : "bg-primary"
                )}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Task items */}
      <div className="space-y-2">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} isEditable={isEditable} />
        ))}
      </div>
    </div>
  );
}
