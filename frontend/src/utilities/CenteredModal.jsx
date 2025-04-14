import PropTypes from "prop-types";
import { useEffect, useState } from "react";

const CenteredModal = ({ isOpen, message, autoClose = true, onClose }) => {
  const [visible, setVisible] = useState(isOpen);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    let fadeTimer;
    let closeTimer;

    if (isOpen) {
      setVisible(true);
      setOpacity(1); // reset opacity when reopened

      if (autoClose) {
        // Start fading out a bit before closing
        fadeTimer = setTimeout(() => setOpacity(0), 750);
        closeTimer = setTimeout(() => {
          setVisible(false);
          onClose();
        }, 1000);
      }
    }

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen, autoClose, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        pointerEvents: "auto",
      }}
    >
      <div
        className="bg-black p-6 rounded-md shadow-lg border border-gray-500"
        style={{
          opacity: opacity,
          transition: "opacity 0.35s ease-in-out",
        }}
      >
        <p className="text-white font-mono">{message}</p>
        {!autoClose && (
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={() => {
              setOpacity(0);
              setTimeout(() => {
                setVisible(false);
                onClose();
              }, 250); // match transition duration
            }}
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

CenteredModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.string.isRequired,
  autoClose: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
};

export default CenteredModal;
