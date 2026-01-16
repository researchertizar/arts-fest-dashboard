import React from 'react';

const MediaDisplay = ({ imageUrl, videoUrl, className = "" }) => {
  if (videoUrl) {
    return (
      <video 
        src={videoUrl} 
        autoPlay 
        loop 
        muted 
        playsInline
        className={`object-cover rounded-lg ${className}`}
      />
    );
  }
  if (imageUrl) {
    return (
      <img 
        src={imageUrl} 
        alt="Media content" 
        className={`object-cover rounded-lg ${className}`}
        loading="lazy"
      />
    );
  }
  return null;
};

export default MediaDisplay;
