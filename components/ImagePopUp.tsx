import React from 'react';

interface ImagePopupProps {
  imageUrl: string;
  onClose: () => void;
}

const ImagePopup: React.FC<ImagePopupProps> = ({ imageUrl, onClose }) => {
  const handleBackgroundClick = (e: React.MouseEvent) => {
    // Prevent closing if clicking on the image itself
    if ((e.target as HTMLElement).tagName !== 'IMG') {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-75"
      onClick={handleBackgroundClick}
    >
      <div className="relative">
        <img src={imageUrl} alt="Popup" className="max-w-full max-h-full scale-35" />
        <button
          className="absolute top-0 right-0 p-2 text-white bg-gray-800 rounded-full"
          onClick={(e) => {
            e.stopPropagation(); // Prevent the background click handler
            onClose();
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default ImagePopup;
