import React from "react";
import "./Promos.css";


// Promotions Data Array
const promotions = [
  {
    // Promotion Title with Image, Description, and Code
    title: "Refer a Friend",
    image:
      "https://cdn.pixabay.com/photo/2020/07/31/16/07/communication-5453421_1280.png",
    description:
      "Get up to $25 in promo funds instantly! Copy the code below to send to others.",
    code: "PR-810H1UV",
  },
  {
    // Promotion Title with Image, Description, and Code
    title: "Free Play",
    image:
      "https://cdn.pixabay.com/photo/2021/10/07/05/06/money-6687387_1280.png",
    description:
      "Enjoy an exclusive free play on us! Redeem using the promo code provided.",
    code: "PR-SPCLBN1",
  },
  {
    // Promotion Title with Image, Description, and Code
    title: "25% Payout Boost",
    image:
      "https://cdn.pixabay.com/photo/2020/05/31/20/06/cyber-5244032_1280.png",
    description:
      "Act fast! This limited-time offer won't last long. Use the code below.",
    code: "PR-LMTD2025",
  },
];

// Main Promotions Component
const Promos = () => {
  return (

    // Outer Container for the Promotions Page
    <div className="py-2 px-8 text-white">

      {/* Promotions Header */}
      <h1 className="text-3xl mb-12 font-mono text-center">Promotions</h1>

      {/* Container for All Promo Cards/Boxes */}
      <div className="flex flex-wrap gap-6">
        {promotions.map((promo, index) => (

          // Individual Promo Box/Card
          <div
            key={index}
            className="promo_box relative border-2 border-white font-mono flex flex-col bg-gray-900 rounded-lg overflow-hidden shadow-lg w-100 h-110"
          >

            {/* Promo Box Background Image */}
            <div className="promo_content absolute inset-[5px] rounded-[15px] bg-gray-900 overflow-hidden p-4 flex flex-col flex-grow">
              
              {/* Promo Box Image Background */}
              <img
                src={promo.image}
                alt={promo.title}
                className="w-full h-32 object-cover bg-white"
              />

              {/* Promo Box Title and Description Container */}
              <div className="font-mono p-4 flex flex-col flex-grow">

                {/* Promo Box Title */}
                <h2 className="font-mono text-xl font-bold mb-2">{promo.title}</h2>
                
                {/* Promo Box Description */}
                <p className="font-mono text-gray-300 text-l mb-4">{promo.description}</p>
          
                {/* Promo Code and Buttons Container */}
                <div className="font-mono mt-auto">

                  {/* Promo "Use Code" Label */}
                  <div className="font-mono text-sm mb-1">Use Code</div>
                  
                  {/* Promo Code Display */}
                  <div className="font-mono font-bold text-yellow-400">
                    {promo.code}
                  </div>

                  {/* Container For "Learn More" and "Copy Link" Buttons*/}
                  <div className="font-mono flex gap-3 mt-4">

                    {/* Learn More Button */}
                    <button className="font-mono bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex-grow">
                      Learn More
                    </button>

                    {/* Copy Link Button */}
                    <button className="font-mono bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm flex-grow">
                      Copy Link
                    </button>
                  </div>
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
