"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
} from "chart.js";
import { FlagIcon } from "@heroicons/react/24/solid";
import dayjs from "dayjs";

Chart.register(ArcElement, DoughnutController);

function ClientStatus({ project }) {
  const {
    startDate,
    status,
    deadline,
    createdAt,
    endDate,
  } = project;

  const start = dayjs(startDate);
  const end = dayjs(deadline || endDate);
  const today = dayjs();

  if (!start.isValid() || !end.isValid()) {
    return (
      <div className="flex justify-center items-center text-red-500">
        Invalid Dates
      </div>
    );
  }

  const totalDays = end.diff(start, "day");
  const elapsedDays = Math.max(today.diff(start, "day"), 0);
  const remainingDays = Math.max(end.diff(today, "day"), 0);

  if (totalDays <= 0) {
    return (
      <div className="flex justify-center items-center text-red-500">
        Invalid Project Timeline
      </div>
    );
  }

  const pendingDays = Math.min(elapsedDays, totalDays);
  const remainingPendingDays = totalDays - pendingDays;
  const inProgressDays = Math.max(remainingDays, 1);

  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FFCE56"],
        hoverBackgroundColor: [
          "#36A2EB",
          "#4BC0C0",
          "#FFCE56",
        ],
      },
    ],
  };

  if (status === "completed") {
    data.datasets[0].data = [0, 0, 1];
  } else if (status === "pending") {
    data.datasets[0].data = [
      pendingDays,
      remainingPendingDays,
      0,
    ];
  } else if (status === "in-progress") {
    data.datasets[0].data = [
      pendingDays,
      inProgressDays,
      0,
    ];
  }

  return (
    <div className="grid grid-cols-5 grid-rows-5 border-primary-800 border bg-blue-100">
      <h3 className="col-span-5 flex justify-center items-center text-accent-500 bg-primary-50">
        Status
      </h3>
      <div className="col-span-3 row-span-3 col-start-2 row-start-2 flex justify-center items-center">
        <Doughnut data={data} />
      </div>
      <div className="row-start-5 flex items-center justify-center">
        <FlagIcon className="w-6 h-6 text-primary-purple-light" />
      </div>
      <div className="col-start-5 row-start-5 flex items-center justify-center text-xl font-semibold">
        {remainingDays}
      </div>
    </div>
  );
}

export default ClientStatus;
