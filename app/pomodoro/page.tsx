"use client";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import Countdown from "react-countdown";

interface RendererProps {
  minutes: number;
  seconds: number;
  completed: boolean;
}

function Renderer({ minutes, seconds }: RendererProps) {
  function formatTwoDigits(num: number) {
    return num.toString().padStart(2, "0");
  }

  return (
    <span className="flex flex-row text-5xl font-semibold">
      {formatTwoDigits(minutes)}:{formatTwoDigits(seconds)}
    </span>
  );
}

export default function Pomodoro() {
  const [date, setDate] = useState<Date>(new Date());
  const [isCounting, setIsCounting] = useState<boolean>(false);

  const startTimer = () => {
    const now = new Date();
    const future = new Date(now.getTime() + 5 * 1000);
    setDate(future);
    setIsCounting(true);
  };

  const onTimeComplete = () => {
    setIsCounting(false);
  };

  return (
    <main className="h-full w-full py-8">
      <h2 className="text-xl font-semibold">Pomodoro Timer</h2>
      <div className="w-full h-full flex justify-center items-center">
        {isCounting ? (
          <Countdown
            onComplete={onTimeComplete}
            renderer={Renderer}
            date={date}
          />
        ) : (
          <Button className="py-6 px-4 text-xl" onClick={startTimer}>
            New 25 minutes
          </Button>
        )}
      </div>
    </main>
  );
}
