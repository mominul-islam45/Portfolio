'use client';

import Image from 'next/image';

type AutoScrollSliderProps = {
  images: string[];
  limit?: 4; // স্লাইডারে কয়টি ছবি দেখাবে তা ঠিক করার জন্য ঐচ্ছিক প্রপ
};

export default function AutoScrollSlider({ images, limit }: AutoScrollSliderProps) {
  // limit দেওয়া থাকলে অ্যারে থেকে শুধু ততগুলো ইমেজই নিবে, না হলে সবগুলো নিবে
  const displayImages = limit ? images.slice(0, limit) : images;
  
  // লুপের জন্য ইমেজগুলো ডাবল করা হয়েছে
  const slides = [...displayImages, ...displayImages];

  return (
    <div
      aria-label="Thumbnail design gallery"
      className="group relative w-full overflow-hidden rounded-2xl border border-zinc-200 bg-zinc-100 py-3 dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-zinc-100 to-transparent dark:from-zinc-900" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-zinc-100 to-transparent dark:from-zinc-900" />
      <div className="flex w-max animate-[thumbnail-scroll_28s_linear_infinite] gap-3 group-hover:[animation-play-state:paused] group-focus-within:[animation-play-state:paused]">
        {slides.map((image, index) => (
          <div
            key={`${image}-${index}`}
            className="relative w-64 sm:w-80 aspect-video shrink-0 overflow-hidden rounded-xl bg-zinc-200 dark:bg-zinc-800"
          >
            <Image
              src={image}
              alt={`Video thumbnail ${(index % displayImages.length) + 1}`}
              fill
              sizes="(min-width: 640px) 320px, 256px"
              className="object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
}