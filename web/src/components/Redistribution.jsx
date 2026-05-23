import { motion } from "framer-motion";

import { redistributionData } from "../data/mockData";

function Redistribution() {
  return (
    <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-200 mt-8">

      <div className="mb-8">

        <h1 className="text-2xl font-bold text-black">
          Redistribution Intelligence
        </h1>

        <p className="text-gray-500 mt-1">
          AI branch transfer recommendations
        </p>

      </div>

      <div className="space-y-6">

        {redistributionData.map((item, index) => (

          <div
            key={index}
            className="
              bg-gray-50
              rounded-2xl
              p-6
              flex flex-col lg:flex-row
              lg:items-center
              lg:justify-between
              gap-5
            "
          >

            <div>

              <h2 className="text-xl font-bold text-black">
                {item.from}
              </h2>

              <p className="text-gray-500">
                Source Branch
              </p>

            </div>

            {/* MOVING ANIMATION */}
            <motion.div
              animate={{
                x: [0, 20, 0],
              }}
              transition={{
                repeat: Infinity,
                duration: 2,
              }}
              className="text-4xl"
            >
              →
            </motion.div>

            <div>

              <h2 className="text-xl font-bold text-black">
                {item.to}
              </h2>

              <p className="text-gray-500">
                Destination Branch
              </p>

            </div>

            <div className="bg-green-100 px-5 py-3 rounded-2xl">

              <p className="text-green-700 font-bold">
                {item.units} Units
              </p>

            </div>

          </div>

        ))}

      </div>
    </div>
  );
}

export default Redistribution;