import "./Promos.css";
import { useState } from "react";
import { useEffect } from "react";
import CenteredModal from "./utilities/CenteredModal";
// Promotions Data Array
const promotions = [
  {
    title: "Refer a Friend",
    image:
      "https://cdn.pixabay.com/photo/2020/07/31/16/07/communication-5453421_1280.png",
    description:
      "Get up to $25 in promo funds instantly! Copy the code below to send to others.",
    code: "PR-810H1UV",
    learnMoreMessage:
      "Learn how referring a friend can earn you up to $25 in promo funds instantly!",
  },
  {
    title: "Free Play",
    image:
      "https://cdn.pixabay.com/photo/2021/10/07/05/06/money-6687387_1280.png",
    description:
      "Enjoy an exclusive free play on us! Click the button below to claim.",
    code: "PR-SPCLBN1",
    learnMoreMessage:
      "Discover how you can enjoy an exclusive free play and boost your gaming experience.",
  },
  {
    title: "25% Payout Boost",
    image:
      "https://cdn.pixabay.com/photo/2020/05/31/20/06/cyber-5244032_1280.png",
    description:
      "Act fast! This limited-time offer won't last long. Click the button below to claim.",
    code: "PR-LMTD2025",
    learnMoreMessage:
      "Find out how to maximize your earnings with a 25% payout boost on your bets!",
  },
];

// Main Promotions Component
const Promos = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [autoCloseModal, setAutoCloseModal] = useState(false);
  const [modalOpacity, setModalOpacity] = useState(1);

  // Opens the modal with a message.
  // If autoClose is true, the modal will fade out and close automatically.
  const handleOpenModal = (message, autoClose = false) => {
    setModalMessage(message);
    setIsModalOpen(true);
    setAutoCloseModal(autoClose);
    setModalOpacity(1);
  };

  // Copies the promo code to clipboard and opens an auto-closing modal.
  const handleCopyCode = (code) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        handleOpenModal(`Promo code copied: ${code}`, true);
      })
      .catch(() => {
        handleOpenModal("Failed to copy promo code.", false);
      });
  };

  const handleClaimCode = (code, index) => {
    navigator.clipboard
      .writeText(code)
      .then(() => {
        const message =
          index === 1 || index === 2
            ? `Promo code redeemed: ${code}`
            : `Promo code copied: ${code}`;
        handleOpenModal(message, true);
      })
      .catch(() => {
        handleOpenModal("Failed to copy promo code.", false);
      });
  };

  // When autoCloseModal is true, start a timer to fade and close the modal.
  useEffect(() => {
    let fadeTimeout, closeTimeout;
    if (isModalOpen && autoCloseModal) {
      // Start fade out (change opacity) after 1 second
      fadeTimeout = setTimeout(() => {
        setModalOpacity(0);
      }, 1000);
      // Remove modal after 1.5 seconds
      closeTimeout = setTimeout(() => {
        setIsModalOpen(false);
        setAutoCloseModal(false);
      }, 1500);
    }
    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(closeTimeout);
    };
  }, [isModalOpen, autoCloseModal]);

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
                <h2 className="font-mono text-xl font-bold mb-2">
                  {promo.title}
                </h2>

                {/* Promo Box Description */}
                <p className="font-mono text-gray-300 text-l mb-4">
                  {promo.description}
                </p>

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
                    <button
                      className="font-mono bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-md text-sm flex-grow"
                      onClick={() =>
                        handleOpenModal(promo.learnMoreMessage, false)
                      }
                    >
                      Learn More
                    </button>
                    <button
                      className="font-mono bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-md text-sm flex-grow"
                      onClick={() =>
                        index === 1 || index === 2
                          ? handleClaimCode(promo.code, index)
                          : handleCopyCode(promo.code)
                      }
                    >
                      {index === 1 || index === 2 ? "Claim Offer" : "Copy Link"}
                    </button>

                    {/* Modal */}

                    <CenteredModal
                      isOpen={isModalOpen}
                      message={modalMessage}
                      autoClose={autoCloseModal}
                      onClose={() => setIsModalOpen(false)}
                      opacity={modalOpacity}
                    />
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
