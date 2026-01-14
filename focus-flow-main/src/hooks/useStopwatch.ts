import { useState, useEffect, useRef, useCallback } from 'react';

interface UseStopwatchProps {
  initialTime?: number;
  onTick?: (time: number) => void;
}

export function useStopwatch({ initialTime = 0, onTick }: UseStopwatchProps = {}) {
  const [time, setTime] = useState(initialTime);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);
  const accumulatedTimeRef = useRef<number>(initialTime);

  const start = useCallback(() => {
    if (!isRunning) {
      startTimeRef.current = Date.now();
      accumulatedTimeRef.current = time;
      setIsRunning(true);
    }
  }, [isRunning, time]);

  const stop = useCallback(() => {
    if (isRunning) {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
      const newTime = accumulatedTimeRef.current + elapsed;
      setTime(newTime);
      accumulatedTimeRef.current = newTime;
      setIsRunning(false);
    }
  }, [isRunning]);

  const reset = useCallback(() => {
    setTime(0);
    accumulatedTimeRef.current = 0;
    setIsRunning(false);
  }, []);

  const setInitialTime = useCallback((newTime: number) => {
    setTime(newTime);
    accumulatedTimeRef.current = newTime;
  }, []);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000);
        const currentTime = accumulatedTimeRef.current + elapsed;
        setTime(currentTime);
        onTick?.(currentTime);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, onTick]);

  // Handle page visibility change (stop timer when user leaves)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && isRunning) {
        stop();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, stop]);

  // Handle beforeunload (stop timer when closing tab)
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (isRunning) {
        stop();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isRunning, stop]);

  return {
    time,
    isRunning,
    start,
    stop,
    reset,
    setInitialTime,
  };
}
