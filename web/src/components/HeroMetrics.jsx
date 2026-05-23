import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";

const data = [
  { value: 20 },
  { value: 35 },
  { value: 28 },
  { value: 45 },
  { value: 40 },
  { value: 68 },
];

function HeroMetrics() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">

      {/* CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

        <p className="text-gray-500">
          Recovered Profit
        </p>

        <h1 className="text-4xl font-bold mt-3 text-green-500">
          ₼214K
        </h1>

        <div className="h-20 mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#22c55e"
                fill="#bbf7d0"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

        <p className="text-gray-500">
          Waste Prevented
        </p>

        <h1 className="text-4xl font-bold mt-3 text-cyan-500">
          18.4 Tons
        </h1>

        <div className="h-20 mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#06b6d4"
                fill="#cffafe"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

        <p className="text-gray-500">
          Risk Products
        </p>

        <h1 className="text-4xl font-bold mt-3 text-red-500">
          128
        </h1>

        <div className="h-20 mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#ef4444"
                fill="#fecaca"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200">

        <p className="text-gray-500">
          AI Actions
        </p>

        <h1 className="text-4xl font-bold mt-3 text-purple-500">
          47
        </h1>

        <div className="h-20 mt-5">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a855f7"
                fill="#e9d5ff"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}

export default HeroMetrics;