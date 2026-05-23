import { riskProducts } from "../data/mockData";

function RiskTable() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mt-8 overflow-x-auto">

      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold text-black">
            Risk Monitor
          </h1>

          <p className="text-gray-500 mt-1">
            AI-detected high risk inventory
          </p>
        </div>

      </div>

      <table className="w-full">

        <thead>
          <tr className="text-left border-b border-gray-200 text-gray-500">

            <th className="pb-4">Product</th>
            <th className="pb-4">Branch</th>
            <th className="pb-4">Risk Score</th>
            <th className="pb-4">Projected Loss</th>
            <th className="pb-4">Stock</th>

          </tr>
        </thead>

        <tbody>
          {riskProducts.map((item) => (
            <tr
              key={item.id}
              className="
                border-b border-gray-100
                hover:bg-gray-50
                transition
              "
            >

              <td className="py-5 font-semibold">
                {item.product}
              </td>

              <td className="py-5">
                {item.branch}
              </td>

              <td className="py-5">

                <div className="flex items-center gap-3">

                  <div className="w-[120px] bg-gray-200 rounded-full h-3">

                    <div
                      className="bg-red-500 h-3 rounded-full"
                      style={{
                        width: `${item.risk}%`,
                      }}
                    />

                  </div>

                  <span className="font-semibold">
                    {item.risk}%
                  </span>

                </div>

              </td>

              <td className="py-5 text-red-500 font-semibold">
                ₼{item.loss}
              </td>

              <td className="py-5">
                {item.stock}
              </td>

            </tr>
          ))}
        </tbody>

      </table>
    </div>
  );
}

export default RiskTable;