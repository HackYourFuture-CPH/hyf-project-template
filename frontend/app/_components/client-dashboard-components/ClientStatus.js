"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
} from "chart.js";
import { FlagIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";

import { useEffect, useState } from "react";
import EventRepeatOutlinedIcon from "@mui/icons-material/EventRepeatOutlined";

Chart.register(ArcElement, DoughnutController);

function ClientStatus({ project }) {
  const {
    startDate,
    status,
    deadline,
    createdAt,
    endDate,
  } = project;
  console.log(status);

  // );
  const [animatedProgress, setAnimatedProgress] =
    useState(0);

  function calculateProgress(startDate, deadline, status) {
    // if (status.toLowerCase() === "completed") {
    //   return 100;
    // }

    const start = new Date(startDate);
    const end = new Date(deadline);
    const current = new Date();

    if (current >= start && current <= end) {
      const totalDuration = end - start;
      const elapsed = current - start;
      return (elapsed / totalDuration) * 100;
    } else if (current > end) {
      return 100;
    } else {
      return 0;
    }
  }

  const progress = Math.min(
    calculateProgress(startDate, deadline, status),
    100
  );

  useEffect(() => {
    const start = animatedProgress;
    const difference = Math.abs(progress - start);
    const duration = Math.max(difference * 10, 200);
    const interval = 10;
    const totalSteps = duration / interval;
    const step = (progress - start) / totalSteps;

    const intervalId = setInterval(() => {
      setAnimatedProgress((prev) => {
        const nextValue = prev + step;
        if (
          (step > 0 && nextValue >= progress) ||
          (step < 0 && nextValue <= progress)
        ) {
          clearInterval(intervalId);
          return progress;
        }
        return nextValue;
      });
    }, interval);

    return () => clearInterval(intervalId);
  }, [progress]);
  //

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <EventRepeatOutlinedIcon className="text-primary-blue-dark text-lg" />
        <p className="text-sm sm:text-base font-semibold">
          Progress:
        </p>
      </div>
      <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
        <div className="relative w-full h-6 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`flex absolute h-6 ${
              animatedProgress < 10
                ? "bg-amber-500"
                : animatedProgress > 10 &&
                  animatedProgress < 90
                ? "bg-primary-500"
                : "bg-green-500"
            }
            } rounded-full`}
            style={{ width: `${animatedProgress}%` }}
          >
            <div className="absolute inset-0 flex justify-evenly items-center text-sm font-semibold text-white">
              {Math.round(animatedProgress)}%completed
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-1 md:text-base text-sm">
          <p className="flex md:flex-row flex-col text-gray-600 mt-1 items-center">
            Start:
            <span className="md:ml-1.5  md:inline">
              {startDate}
            </span>
          </p>

          <p className="flex md:flex-row flex-col text-gray-600 mt-1 items-center">
            Deadline:
            <span className="md:ml-1.5  md:inline">
              {deadline}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default ClientStatus;
