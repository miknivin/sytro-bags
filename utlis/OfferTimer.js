import React, { useEffect, useState } from "react";
import { DateTime } from "luxon";

function OfferTimer({ offerEndTime }) {


  const [timeLeft, setTimeLeft] = useState({
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const calculateTimeLeft = (endTime) => {
    const now = DateTime.now().setZone("Asia/Kolkata");
    const endTimeInIST = DateTime.fromISO(endTime, { zone: "Asia/Kolkata" });
    const difference = endTimeInIST
      .diff(now, ["days", "hours", "minutes", "seconds"])
      .toObject();

    // Check if the end time is in the future
    if (endTimeInIST > now) {
      const totalHours = Math.floor(difference.days * 24 + difference.hours)
        .toString()
        .padStart(2, "0");
      const minutes = Math.floor(difference.minutes % 60)
        .toString()
        .padStart(2, "0");
      const seconds = Math.floor(difference.seconds % 60)
        .toString()
        .padStart(2, "0");
      return { hours: totalHours, minutes, seconds };
    }
    return { hours: "00", minutes: "00", seconds: "00" };
  };

  useEffect(() => {
    if (!offerEndTime) return;

    const endTimeInIST = DateTime.fromISO(offerEndTime, {
      zone: "Asia/Kolkata",
    });
    const nowInIST = DateTime.now().setZone("Asia/Kolkata");

    if (endTimeInIST <= nowInIST) return;

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(offerEndTime));
    }, 1000);

    setTimeLeft(calculateTimeLeft(offerEndTime));

    return () => clearInterval(timer);
  }, [offerEndTime]);

  if (
    !offerEndTime ||
    DateTime.fromISO(offerEndTime, { zone: "Asia/Kolkata" }) <=
      DateTime.now().setZone("Asia/Kolkata")
  ) {
    return null;
  }

  return (
    <span className="badge bg-danger text-white">
      Offer ends: {timeLeft.hours}:{timeLeft.minutes}:{timeLeft.seconds}
    </span>
  );
}

export default OfferTimer;
