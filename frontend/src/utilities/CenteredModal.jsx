import PropTypes from "prop-types";
import { useEffect } from "react";

const CenteredModal = ({
  isOpen,
  message,
  autoClose = false,
  onClose,
  opacity = 1,
}) => {
  useEffect(() => {
    let timer;
    if (isOpen && autoClose) {
      // Close after 1.75 seconds
      timer = setTimeout(() => {
        onClose();
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [isOpen, autoClose, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[1500]">
      <div
        className="bg-black p-6 rounded-md shadow-lg"
        style={{
          opacity: opacity,
          transition: "opacity 0.25s", // Slightly faster fade-in/out
        }}
      >
        <p className="text-white">{message}</p>
        {!autoClose && (
          <button
            className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-md"
            onClick={onClose}
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
  opacity: PropTypes.number,
};

export default CenteredModal;
