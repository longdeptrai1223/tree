import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetTime) - new Date();
      
      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);

        setTimeLeft({ hours, minutes, seconds });
      } else {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    // Tính toán thời gian còn lại ngay lập tức
    calculateTimeLeft();

    // Cập nhật mỗi giây
    const timer = setInterval(calculateTimeLeft, 1000);

    // Cleanup interval khi component unmount
    return () => clearInterval(timer);
  }, [targetTime]);

  return (
    <div className="countdown-timer">
      <div className="timer-display">
        <div className="time-block">
          <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
          <span className="time-label">Hours</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
          <span className="time-label">Minutes</span>
        </div>
        <div className="time-separator">:</div>
        <div className="time-block">
          <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
          <span className="time-label">Seconds</span>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer; 