import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { recoveryData } from "../data/mockData";

function AIAnalysis() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mt-8">

      <div className="mb-6">

        <h1 className="text-2xl font-bold text-black">
          AI Recovery Analysis
        </h1>

        <p className="text-gray-500 mt-1">
          AI compares recovery strategies
        </p>

      </div>

      <div className="h-[350px]">

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={recoveryData}>

            <XAxis dataKey="strategy" />

            <YAxis />

            <Tooltip />

            <Bar
              dataKey="recovery"
              fill="#22c55e"
              radius={[10, 10, 0, 0]}
            />

          </BarChart>

        </ResponsiveContainer>

      </div>
    </div>
  );
}

export default AIAnalysis;