import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import { recoveryChart } from "../data/mockData";

function RecoveryChart() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mt-8">

      <h1 className="text-2xl font-bold">
        Recovered Profit
      </h1>

      <p className="text-gray-500 mt-1">
        30-day AI recovery performance
      </p>

      <div className="h-[350px] mt-8">

        <ResponsiveContainer width="100%" height="100%">

          <LineChart data={recoveryChart}>

            <XAxis dataKey="day" />

            <YAxis />

            <Tooltip />

            <Line
              type="monotone"
              dataKey="profit"
              stroke="#22c55e"
              strokeWidth={4}
            />

          </LineChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default RecoveryChart;