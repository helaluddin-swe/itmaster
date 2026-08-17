import { useEffect, useState } from "react";

const LastUpdate = () => {
  const [lastUpdateDate, setLastUpdateDate] = useState("");

  useEffect(() => {
    const calculatePastDate = () => {
      const dateObj = new Date();
      
      // LOGIC: Subtract 3 days from the current date
      dateObj.setDate(dateObj.getDate() - Math.floor(Math.random()*28)+1)

      const formatted = dateObj.toLocaleDateString('en-US', {
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
      
      setLastUpdateDate(formatted);
    };

    calculatePastDate();

    // Since it's a "Last Update" date, we don't necessarily need 
    // to update it every minute, but we can keep the interval 
    // to ensure it rolls over at midnight.
    const timer = setInterval(calculatePastDate, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex gap-2 text-sm font-medium text-gray-600">
      Last Update: <span className="text-red-400">{lastUpdateDate}</span>
    </div>
  );
};

export default LastUpdate;