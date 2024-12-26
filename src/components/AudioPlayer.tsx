import React, { useRef, useState } from 'react';

interface Props {
  src: string;
}

export default function AudioPlayer({ src }: Props) {
  return (
    <div className="overflow-x-scroll py-2">
      <iframe width="711" height="144"
        src={src}
        className="border-none"
      ></iframe>  
    </div>
    
  );
}
