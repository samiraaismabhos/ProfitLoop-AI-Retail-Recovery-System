import { branches } from "../data/mockData";

function BranchGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-5 mt-8">

      {branches.map((branch, index) => (

        <div
          key={index}
          className="bg-white rounded-3xl p-5 border border-gray-200 shadow-sm"
        >

          <div className="flex justify-between items-center">

            <h1 className="text-lg font-bold">
              {branch.name}
            </h1>

            <div
              className={`
                w-4 h-4 rounded-full
                ${
                  branch.status === "critical"
                    ? "bg-red-500"
                    : branch.status === "warning"
                    ? "bg-yellow-400"
                    : "bg-green-500"
                }
              `}
            />

          </div>

          <div className="mt-6">

            <p className="text-gray-500 text-sm">
              Top Risk Product
            </p>

            <h2 className="font-bold mt-1">
              {branch.topRisk}
            </h2>

          </div>

          <div className="mt-5">

            <p className="text-gray-500 text-sm">
              Projected Loss
            </p>

            <h2 className="text-red-500 text-2xl font-bold mt-1">
              ₼{branch.loss}
            </h2>

          </div>

        </div>

      ))}
    </div>
  );
}

export default BranchGrid;