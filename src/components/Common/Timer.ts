// @ts-nocheck
/* eslint-disable */
import { useEffect, useRef, useState } from "react";

/**
 * Timer Hook
 * 
 * @param {Object} props
 * @param {number} props.duration - Time in seconds (default: 180)
 * @param {boolean} props.start - Trigger to start
 * @param {boolean} props.restart - Trigger to restart
 * @param {boolean} props.stop - Trigger to stop
 * @param {function} props.onStart - Callback when timer starts
 * @param {function} props.onEnd - Callback when timer ends
 * @param {function} props.onStop - Callback when timer is stopped
 * @returns {{ timeLeft: number, status: string }}
 */
function useTimer({
  duration = 180,
  start = false,
  restart = false,
  stop = false,
  onStart = () => {},
  onEnd = () => {},
  onStop = () => {},
}) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [status, setStatus] = useState("idle"); // idle | running | ended | stopped
  const timerRef = useRef(null);
  const prevStart = useRef(start);
  const prevRestart = useRef(restart);
  const prevStop = useRef(stop);

  useEffect(() => {
    if (start && !prevStart.current) {
      handleStart();
    }
    prevStart.current = start;
  }, [start]);

  useEffect(() => {
    if (restart && !prevRestart.current) {
      handleRestart();
    }
    prevRestart.current = restart;
  }, [restart]);

  useEffect(() => {
    if (stop && !prevStop.current) {
      handleStop();
    }
    prevStop.current = stop;
  }, [stop]);

  useEffect(() => {
    if (status === "running" && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (status === "running" && timeLeft === 0) {
      setStatus("ended");
      onEnd();
    }

    return () => clearTimeout(timerRef.current);
  }, [status, timeLeft]);

  const handleStart = () => {
    clearTimeout(timerRef.current);
    setTimeLeft(duration);
    setStatus("running");
    onStart();
  };

  const handleRestart = () => {
    clearTimeout(timerRef.current);
    setTimeLeft(duration);
    setStatus("running");
    onStart();
  };

  const handleStop = () => {
    clearTimeout(timerRef.current);
    setStatus("stopped");
    onStop();
  };

  return { timeLeft, status };
}

export default useTimer;