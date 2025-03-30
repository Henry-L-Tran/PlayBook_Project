import React from "react";

const promotions = [
  {
    title: "Refer a Friend",
    image: "https://via.placeholder.com/300",
    description:
      "Get up to $25 in promo funds instantly. Copy the code below to send to others.",
    code: "PR-810H1UV",
  },
  {
    title: "Special Bonus",
    image: "https://via.placeholder.com/300",
    description:
      "Enjoy an exclusive special bonus. Redeem using the promo code provided.",
    code: "PR-SPCLBN1",
  },
  {
    title: "Limited Time Offer",
    image: "https://via.placeholder.com/300",
    description:
      "Act fast! This limited-time offer won't last long. Use the code below.",
    code: "PR-LMTD2025",
  },
];

const Promos = () => {
  return (
    <div className="py-6 px-8 text-white">
      <h1 className="text-3xl font-bold text-left mb-6">Promotions</h1>

      <div className="flex flex-wrap gap-6">
        {promotions.map((promo, index) => (
          <div
            key={index}
            className="flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-lg w-64"
          >
            <img
              src={promo.image}
              alt={promo.title}
              className="w-full h-32 object-cover"
            />

            <div className="p-4 flex flex-col flex-grow">
              <h2 className="text-lg font-bold mb-2">{promo.title}</h2>
              <p className="text-gray-300 text-sm mb-4">{promo.description}</p>

              <div className="mt-auto">
                <div className="text-sm mb-1">Use Code</div>
                <div className="font-mono font-bold text-yellow-400">
                  {promo.code}
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex-grow">
                    Learn More
                  </button>
                  <button className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm flex-grow">
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Promos;
