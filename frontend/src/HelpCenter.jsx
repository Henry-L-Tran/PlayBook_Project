import { Box } from "@mui/material";
import React from "react";

const HelpCenterModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Box
      sx={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      className="fixed inset-0 flex items-center justify-center z-50"
    >
      <Box
        sx={{
          backgroundImage:
            "linear-gradient(rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0.75)), url('/images/playbook_background2.png')",
          backgroundSize: "cover",
        }}
        className="bg-gray-900 border-2 border-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 md:p-10 relative text-white font-mono"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white hover:text-white text-xl"
        >
          Close
        </button>

        <h1 className="text-4xl font-bold text-center text-white mb-8 font-mono">
          Help Center
        </h1>

        <section className="mb-10">
          <h2 className=" font-mono text-2xl font-semibold text-gray-300 mb-4">
            Getting Started
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 space-y-2 font-mono">
            <p>
              <strong>1.</strong> Sign up or log in to your Playbook account.
            </p>
            <p>
              <strong>2.</strong> Add funds to your wallet from the dashboard.
            </p>
            <p>
              <strong>3.</strong> Browse available games and place your bets.
            </p>
            <p>
              <strong>4.</strong> Track your bets in the My Bets section.
            </p>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="font-mono text-2xl font-semibold text-gray-300 mb-4">
            Frequently Asked Questions
          </h2>
          <div className="font-mono bg-gray-800 rounded-lg p-6 space-y-4">
            <div>
              <h3 className="font-semibold font-mono text-gray-200">
                How do I withdraw my winnings?
              </h3>
              <p className="text-gray-300 font-mono">
                Go to your Wallet, click "Withdraw" and select your payout
                method.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-200 font-mono">
                What sports can I bet on?
              </h3>
              <p className="text-gray-300 font-mono">
                Playbook currently supports NFL, NBA, VAL, and LOL with more
                coming soon.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-mono font-semibold text-gray-300 mb-4">
            Contact Support
          </h2>
          <div className="bg-gray-800 rounded-lg p-6 space-y-2 font-mono">
            <p className="text-gray-300">
              If you didn't find what you're looking for, we're here to help.
            </p>
            <p className="text-gray-300 font-mono">
              Email us at{" "}
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    "mailto:support@playbook.com",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
                className="text-blue-600 hover:underline"
              >
                support@playbook.com
              </a>
            </p>
          </div>
        </section>
      </Box>
    </Box>
  );
};

export default HelpCenterModal;
