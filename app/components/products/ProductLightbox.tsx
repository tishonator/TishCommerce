"use client";

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

interface ProductLightboxProps {
  images: string[];
}

export default function ProductLightbox({ images }: ProductLightboxProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!images || images.length === 0) return null;

  return (
    <div>
      {/* MAIN IMAGE (Click to Open Lightbox) */}
      <div
        className="relative w-full h-96 cursor-pointer"
        onClick={() => {
          setLightboxIndex(0);
          setLightboxOpen(true);
        }}
      >
        <Image
          src={images[0]}
          alt="Main Product Image"
          layout="fill"
          className="rounded-lg object-cover"
          priority
        />
      </div>

      {/* IMAGE GALLERY (Below Main Image) */}
      <div className="flex gap-2 mt-4">
        {images.slice(1).map((image, index) => (
          <div
            key={index}
            className="relative w-24 h-24 cursor-pointer border rounded-md overflow-hidden"
            onClick={() => {
              setLightboxIndex(index + 1);
              setLightboxOpen(true);
            }}
          >
            <Image
              src={image}
              alt={`Gallery image ${index + 1}`}
              layout="fill"
              className="object-cover"
            />
          </div>
        ))}
      </div>

      {/* LIGHTBOX MODAL */}
      {lightboxOpen && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={images.map((src) => ({ src }))}
        />
      )}
    </div>
  );
}
