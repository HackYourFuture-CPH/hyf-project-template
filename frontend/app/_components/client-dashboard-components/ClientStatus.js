"use client";
import { Doughnut } from "react-chartjs-2";
import {
  Chart,
  ArcElement,
  DoughnutController,
} from "chart.js";
import { FlagIcon } from "@heroicons/react/24/solid";

Chart.register(ArcElement, DoughnutController);

function ClientStatus({ statusCounts }) {
  const { completed, inProgress, pending } = statusCounts;

  const data = {
    labels: ["Completed", "In Progress", "Pending"],
    datasets: [
      {
        data: [completed, inProgress, pending],
        backgroundColor: ["#36A2EB", "#4BC0C0", "#FFCE56"],
        hoverBackgroundColor: [
          "#36A2EB",
          "#4BC0C0",
          "#FFCE56",
        ],
      },
    ],
  };

  const totalProjects = completed + inProgress + pending;

  return (
    <div className="grid grid-cols-5 grid-rows-5 gap-1 w-64 border-primary-800 border bg-blue-100">
      <h3 className="col-span-5 row-start-1 flex justify-center items-center text-accent-500 font-semibold text-2xl bg-primary-50">
        Project Status
      </h3>
      <div className="col-span-3 row-span-3 col-start-2 flex justify-center items-center">
        <Doughnut data={data} />
      </div>
      <div className="col-start-1 row-start-5 flex items-center justify-center">
        <FlagIcon className="w-6 h-6 text-red-500" />
      </div>
      <div className="col-end-6 row-start-5 flex items-center justify-center text-2xl font-semibold">
        {totalProjects}
      </div>
    </div>
  );
}

export default ClientStatus;
