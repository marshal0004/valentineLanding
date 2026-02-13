import React, { useState, useEffect } from 'react';

export default function CountdownTimer({ startDate, className = '' }) {
  const [elapsed, setElapsed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!startDate) return;

    const calculate = () => {
      const start = new Date(startDate);
      const now = new Date();
      let diff = Math.floor((now - start) / 1000);
      if (diff < 0) diff = 0;

      const years = Math.floor(diff / (365.25 * 24 * 3600));
      diff -= years * Math.floor(365.25 * 24 * 3600);
      const days = Math.floor(diff / (24 * 3600));
      diff -= days * 24 * 3600;
      const hours = Math.floor(diff / 3600);
      diff -= hours * 3600;
      const minutes = Math.floor(diff / 60);
      const seconds = diff - minutes * 60;

      setElapsed({ years, days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [startDate]);

  const units = [
    { value: elapsed.years, label: 'Years' },
    { value: elapsed.days, label: 'Days' },
    { value: elapsed.hours, label: 'Hours' },
    { value: elapsed.minutes, label: 'Minutes' },
    { value: elapsed.seconds, label: 'Seconds' },
  ];

  return (
    <div className={`flex flex-wrap justify-center gap-3 md:gap-4 ${className}`}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className="glass-card px-4 py-3 md:px-6 md:py-4 text-center min-w-[70px] md:min-w-[90px]"
        >
          <div className="font-great-vibes text-2xl md:text-4xl text-[#ff2d55]">
            {String(unit.value).padStart(2, '0')}
          </div>
          <div className="font-dancing text-xs md:text-sm text-[#c9a0a0] mt-1">
            {unit.label}
          </div>
        </div>
      ))}
    </div>
  );
}
