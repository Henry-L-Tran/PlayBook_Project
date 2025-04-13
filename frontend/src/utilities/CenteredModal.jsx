// import React from "react";
import PropTypes from "prop-types";

const CenteredModal = ({
  isOpen,
  message,
  autoClose = false,
  onClose,
  opacity = 1,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div
        className="bg-black p-6 rounded-md shadow-lg"
        style={{
          opacity: opacity,
          transition: "opacity 0.5s",
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
