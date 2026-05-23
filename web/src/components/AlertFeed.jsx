import { alerts } from "../data/mockData";

function AlertFeed() {
  return (
    <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm mt-8">

      <h1 className="text-2xl font-bold">
        Live AI Alert Feed
      </h1>

      <div className="mt-6 space-y-4">

        {alerts.map((alert, index) => (

          <div
            key={index}
            className="bg-red-50 border border-red-200 p-4 rounded-2xl"
          >

            <p className="text-red-600 font-medium">
              🔴 {alert}
            </p>

          </div>

        ))}

      </div>
    </div>
  );
}

export default AlertFeed;