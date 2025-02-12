import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [mode, setMode] = useState('stopwatch'); // 'stopwatch' or 'timer'
  const [time, setTime] = useState(0); // time in seconds
  const [milliseconds, setMilliseconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [inputMinutes, setInputMinutes] = useState('');

  useEffect(() => {
    let intervalId;
    if (isRunning) {
      const startTime = Date.now();
      
      intervalId = setInterval(() => {
        if (mode === 'stopwatch') {
          const elapsedTime = Date.now() - startTime;
          const newSeconds = Math.floor(elapsedTime / 1000);
          const newMilliseconds = Math.floor((elapsedTime % 1000) / 10);
          
          setTime(prevTime => {
            if (newSeconds > prevTime) {
              return newSeconds;
            }
            return prevTime;
          });
          setMilliseconds(newMilliseconds);
        } else {
          setMilliseconds(prev => {
            if (prev === 0) {
              setTime(prevTime => {
                if (prevTime <= 0) {
                  setIsRunning(false);
                  return 0;
                }
                return prevTime - 1;
              });
              return 99;
            }
            return prev - 1;
          });
        }
      }, 10);
    }
    return () => clearInterval(intervalId);
  }, [isRunning, mode]);

  const formatTime = (timeInSeconds, ms) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTime(mode === 'timer' && inputMinutes ? parseInt(inputMinutes) * 60 : 0);
    setMilliseconds(0);
  };

  const handleModeToggle = () => {
    setIsRunning(false);
    setTime(0);
    setMilliseconds(0);
    setMode(prev => prev === 'stopwatch' ? 'timer' : 'stopwatch');
  };

  const handleTimerInput = (e) => {
    const value = e.target.value;
    setInputMinutes(value);
    if (value && !isRunning) {
      setTime(parseInt(value) * 60);
      setMilliseconds(0);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
      <div className="bg-gray-800/50 p-6 rounded-3xl shadow-xl backdrop-blur-sm w-[400px]">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white text-2xl font-light">{mode === 'stopwatch' ? 'Stopwatch' : 'Timer'}</h2>
          <button
            onClick={handleModeToggle}
            className="px-4 py-1.5 rounded-full bg-gray-700/50 text-white text-sm transition-all hover:bg-gray-600"
          >
            Switch to {mode === 'stopwatch' ? 'Timer' : 'Stopwatch'}
          </button>
        </div>

        {mode === 'timer' && !isRunning && (
          <input
            type="number"
            value={inputMinutes}
            onChange={handleTimerInput}
            placeholder="Enter minutes"
            className="w-full mb-4 bg-gray-700/50 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}

        <div className="text-[3.75rem] font-mono text-white text-center my-6 font-light tracking-wider whitespace-nowrap overflow-hidden">
          {formatTime(time, milliseconds)}
        </div>

        <div className="flex gap-2 mt-6">
          {!isRunning ? (
            <button
              onClick={handleStart}
              className="flex-1 bg-blue-500/90 hover:bg-blue-600 text-white py-2.5 rounded-xl transition-all text-lg font-light"
            >
              Start
            </button>
          ) : (
            <button
              onClick={handlePause}
              className="flex-1 bg-yellow-500/90 hover:bg-yellow-600 text-white py-2.5 rounded-xl transition-all text-lg font-light"
            >
              Pause
            </button>
          )}
          <button
            onClick={handleReset}
            className="flex-1 bg-red-500/90 hover:bg-red-600 text-white py-2.5 rounded-xl transition-all text-lg font-light"
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
