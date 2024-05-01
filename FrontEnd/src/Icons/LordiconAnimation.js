import React from 'react';
import { useState } from 'react';

const LordiconAnimation = ({ src, colors, style }) => {

  const handleDeleteFrameClick = () =>{
    console.log("Eliminazione frame...");
  }

  return (
    <div
      style={{ width: '200px', height: '200px', ...style }}
      onClick={handleDeleteFrameClick}
    >
      <lord-icon
        src={src}
        trigger='hover'
        colors={colors}
        style={{ 
          width: '100%', 
          height: '100%',
          cursor: 'pointer'
        }}
      />
    </div>
  );
};

export default LordiconAnimation;