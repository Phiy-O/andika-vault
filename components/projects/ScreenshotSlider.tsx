"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { optimizeCloudinaryUrl } from "@/src/lib/cloudinary-url";

export function ScreenshotSlider({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [index, setIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  if (!images.length) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className="mb-16">
      {/* ponytail: simple touch delta swipe; upgrade to pointer capture/CSS scroll snap if dragging preview needed */}
      <div
        className="relative aspect-video overflow-hidden rounded-[18px] border border-line/50"
        onTouchStart={(e) => {
          touchStartX.current = e.touches[0].clientX;
        }}
        onTouchEnd={(e) => {
          if (touchStartX.current === null) return;
          const delta = touchStartX.current - e.changedTouches[0].clientX;
          if (delta > 40) next();
          if (delta < -40) prev();
          touchStartX.current = null;
        }}
      >
        <Image
          src={optimizeCloudinaryUrl(images[index], 1400)}
          alt={`${title} screenshot ${index + 1}`}
          fill
          sizes="(max-width: 640px) 100vw, 80vw"
          unoptimized
          className="object-cover"
        />
        <div className="sr-only" aria-live="polite" aria-atomic="true">
          Screenshot {index + 1} of {images.length}
        </div>
        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous screenshot"
              onClick={prev}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronLeft size={20} aria-hidden="true" />
            </button>
            <button
              type="button"
              aria-label="Next screenshot"
              onClick={next}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/60 p-3 text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <ChevronRight size={20} aria-hidden="true" />
            </button>
            <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
              {images.map((image, dotIndex) => (
                <button
                  key={`${image}-${dotIndex}`}
                  type="button"
                  aria-label={`Show screenshot ${dotIndex + 1}`}
                  aria-current={dotIndex === index}
                  onClick={() => setIndex(dotIndex)}
                  className="flex h-9 w-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black"
                >
                  <span
                    aria-hidden="true"
                    className={`h-2.5 w-2.5 rounded-full ${dotIndex === index ? "bg-white" : "bg-white/50"}`}
                  />
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
